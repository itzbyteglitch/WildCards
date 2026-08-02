/**
 * Server-authoritative room store.
 *
 * The database row is the ONLY source of truth for a multiplayer game. Clients
 * send *intents* (play this card / draw / say uno / pick a color); the server
 * re-runs the UNO rules engine against its own copy of the state and rejects
 * anything illegal. Clients never send state, and never receive cards they are
 * not entitled to see.
 */
import { createGame, applyAction } from "@/lib/uno/engine";
import { redactState } from "@/lib/uno/redact";
import type { Action, GameState, Player } from "@/lib/uno/types";

export const CODE_RE = /^[A-Z0-9]{4,8}$/;
export const MAX_PLAYERS = 8;

export interface RoomMember {
  id: string;
  name: string;
  avatar: string;
}

export interface RoomView {
  code: string;
  hostId: string;
  seq: number;
  players: RoomMember[];
  state: GameState | null;
}

interface RoomRow {
  code: string;
  host_id: string;
  state: GameState | null;
  seq: number;
}

export function normalizeCode(code: string): string {
  const c = String(code ?? "")
    .trim()
    .toUpperCase();
  if (!CODE_RE.test(c)) throw new Error("Invalid room code");
  return c;
}

function sanitize(text: string, max: number): string {
  return String(text ?? "")
    .replace(/[\u0000-\u001f<>]/g, "")
    .trim()
    .slice(0, max);
}

async function admin() {
  const { supabaseAdmin } =
    await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function hashToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(`uno.v1.${token}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function getRoom(code: string): Promise<RoomRow | null> {
  const db = await admin();
  const { data, error } = await db
    .from("uno_rooms")
    .select("code, host_id, state, seq")
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as RoomRow | null) ?? null;
}

async function getMembers(code: string): Promise<RoomMember[]> {
  const db = await admin();
  const { data, error } = await db
    .from("uno_room_members")
    .select("player_id, name, avatar, joined_at")
    .eq("room_code", code)
    .order("joined_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((m) => ({
    id: m["player_id"] as string,
    name: m["name"] as string,
    avatar: m["avatar"] as string,
  }));
}

/** Verifies the caller really is who they claim to be in this room. */
async function authorize(
  code: string,
  playerId: string,
  token: string,
): Promise<void> {
  const db = await admin();
  const { data, error } = await db
    .from("uno_room_members")
    .select("token_hash")
    .eq("room_code", code)
    .eq("player_id", playerId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("You are not in this room");
  if (!timingSafeEqual(await hashToken(token), data["token_hash"] as string)) {
    throw new Error("Invalid session for this player");
  }
  await db
    .from("uno_room_members")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("room_code", code)
    .eq("player_id", playerId);
}

async function view(code: string, viewerId: string): Promise<RoomView> {
  const room = await getRoom(code);
  if (!room) throw new Error("Room not found");
  const players = await getMembers(code);
  return {
    code,
    hostId: room.host_id,
    seq: room.seq,
    players,
    state: room.state ? redactState(room.state, viewerId) : null,
  };
}

/** Persist a new state, rejecting the write if another action landed first. */
async function commit(
  code: string,
  expectedSeq: number,
  state: GameState,
): Promise<void> {
  const db = await admin();
  const { data, error } = await db
    .from("uno_rooms")
    .update({
      state: state as unknown as never,
      seq: expectedSeq + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("code", code)
    .eq("seq", expectedSeq)
    .select("code");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0)
    throw new Error("Room state changed — try again");
}

export async function joinRoomImpl(input: {
  code: string;
  playerId: string;
  name: string;
  avatar: string;
  token?: string;
}): Promise<{ token: string; view: RoomView }> {
  const code = normalizeCode(input.code);
  const playerId = sanitize(input.playerId, 64);
  if (!playerId) throw new Error("Missing player id");
  const name = sanitize(input.name, 24) || "Player";
  const avatar = sanitize(input.avatar, 8) || "🙂";
  const db = await admin();

  let room = await getRoom(code);
  if (!room) {
    const { error } = await db
      .from("uno_rooms")
      .insert({ code, host_id: playerId })
      .select("code")
      .maybeSingle();
    // Ignore unique-violation races: another player created the room first.
    if (error && !String(error.message).includes("duplicate"))
      throw new Error(error.message);
    room = (await getRoom(code))!;
  }

  const { data: existing, error: memberErr } = await db
    .from("uno_room_members")
    .select("token_hash")
    .eq("room_code", code)
    .eq("player_id", playerId)
    .maybeSingle();
  if (memberErr) throw new Error(memberErr.message);

  let token = input.token ?? "";
  if (existing) {
    // Rejoin/reconnect: only the holder of the original token may resume the seat.
    if (
      !token ||
      !timingSafeEqual(await hashToken(token), existing["token_hash"] as string)
    ) {
      throw new Error("That player is already seated in this room");
    }
    await db
      .from("uno_room_members")
      .update({ name, avatar, last_seen_at: new Date().toISOString() })
      .eq("room_code", code)
      .eq("player_id", playerId);
  } else {
    if (room.state) throw new Error("Game already in progress");
    const members = await getMembers(code);
    if (members.length >= MAX_PLAYERS) throw new Error("Room is full");
    token = crypto.randomUUID();
    const { error } = await db.from("uno_room_members").insert({
      room_code: code,
      player_id: playerId,
      token_hash: await hashToken(token),
      name,
      avatar,
    });
    if (error) throw new Error(error.message);
  }

  return { token, view: await view(code, playerId) };
}

export async function getRoomImpl(input: {
  code: string;
  playerId: string;
  token: string;
}): Promise<RoomView> {
  const code = normalizeCode(input.code);
  await authorize(code, input.playerId, input.token);
  return view(code, input.playerId);
}

export async function startRoundImpl(input: {
  code: string;
  playerId: string;
  token: string;
}): Promise<RoomView> {
  const code = normalizeCode(input.code);
  await authorize(code, input.playerId, input.token);
  const room = await getRoom(code);
  if (!room) throw new Error("Room not found");
  if (room.host_id !== input.playerId)
    throw new Error("Only the host can start the game");
  if (
    room.state &&
    room.state.phase !== "round_over" &&
    room.state.phase !== "game_over"
  ) {
    throw new Error("Game already in progress");
  }
  const members = await getMembers(code);
  if (members.length < 2) throw new Error("Need at least 2 players");

  const seats: Omit<Player, "hand" | "said_uno" | "connected">[] = members.map(
    (m) => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      isBot: false,
    }),
  );
  // Deck + shuffle happen on the server: clients cannot influence or peek at it.
  const next = createGame(seats);
  if (room.state) {
    next.round = room.state.round + 1;
    next.scores = { ...next.scores, ...room.state.scores };
  }
  await commit(code, room.seq, next);
  return view(code, input.playerId);
}

export async function submitActionImpl(input: {
  code: string;
  playerId: string;
  token: string;
  action: Action;
}): Promise<RoomView> {
  const code = normalizeCode(input.code);
  await authorize(code, input.playerId, input.token);
  const room = await getRoom(code);
  if (!room) throw new Error("Room not found");
  if (!room.state) throw new Error("Game has not started");

  // The claimed playerId in the payload is ignored — identity comes from the
  // verified session token, so a client can only ever act as itself.
  const action = { ...input.action, playerId: input.playerId } as Action;
  if (!room.state.players.some((p) => p.id === input.playerId)) {
    throw new Error("You are not seated in this game");
  }

  const { state: next, error } = applyAction(room.state, action);
  if (error) throw new Error(error);

  await commit(code, room.seq, next);
  return view(code, input.playerId);
}

export async function leaveRoomImpl(input: {
  code: string;
  playerId: string;
  token: string;
}): Promise<{ ok: true }> {
  const code = normalizeCode(input.code);
  await authorize(code, input.playerId, input.token);
  const db = await admin();
  await db
    .from("uno_room_members")
    .delete()
    .eq("room_code", code)
    .eq("player_id", input.playerId);
  return { ok: true };
}
