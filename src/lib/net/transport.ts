/**
 * Transport abstraction for room realtime messaging.
 *
 * Three implementations exist:
 *  - WebSocketTransport   → Cloudflare Worker + Durable Object (see /worker)
 *  - SupabaseTransport    → Supabase realtime broadcast (no deploy needed)
 *  - BroadcastTransport   → same-browser cross-tab fallback
 *
 * `createTransport()` picks the best available one at runtime.
 */
import type { Action, GameState } from "../uno/types";

export type RoomMessage =
  | { type: "state"; state: GameState }
  | { type: "action"; action: Action }
  | { type: "join"; player: { id: string; name: string; avatar: string } }
  | { type: "leave"; playerId: string }
  | { type: "chat"; playerId: string; text: string }
  | { type: "start" }
  | { type: "hello"; playerId: string }
  /** "authoritative state changed, refetch it" — carries no trusted payload. */
  | { type: "sync"; seq: number };

export type TransportStatus = "connecting" | "open" | "closed";

export interface Transport {
  /** Human-readable name of the active backend, for UI/debug. */
  readonly kind: "websocket" | "supabase" | "broadcast";
  send(msg: RoomMessage): void;
  onMessage(cb: (msg: RoomMessage) => void): () => void;
  onStatus?(cb: (s: TransportStatus) => void): () => void;
  close(): void;
}

export class BroadcastTransport implements Transport {
  readonly kind = "broadcast" as const;
  private ch: BroadcastChannel;
  private listeners = new Set<(m: RoomMessage) => void>();
  constructor(room: string) {
    this.ch = new BroadcastChannel(`uno:${room}`);
    this.ch.onmessage = (e) => this.listeners.forEach((l) => l(e.data));
  }
  send(msg: RoomMessage) {
    this.ch.postMessage(msg);
  }
  onMessage(cb: (m: RoomMessage) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb) as unknown as void;
  }
  onStatus(cb: (s: TransportStatus) => void) {
    cb("open");
    return () => {};
  }
  close() {
    this.ch.close();
    this.listeners.clear();
  }
}
