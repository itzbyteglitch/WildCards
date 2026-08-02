import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameBoard } from "@/components/game-board";
import type {
  RoomMessage,
  Transport,
  TransportStatus,
} from "@/lib/net/transport";
import { createTransport } from "@/lib/net/create-transport";
import {
  getRoom,
  joinRoom,
  leaveRoom,
  startRound,
  submitAction,
} from "@/lib/rooms.functions";
import type { Action, Color, GameState } from "@/lib/uno/types";
import { ensureProfile } from "@/lib/profile";
import { useHydrated } from "@/lib/hydrated";
import { toast } from "sonner";

const search = z.object({
  host: z.union([z.literal(0), z.literal(1)]).optional(),
});

export const Route = createFileRoute("/room/$code")({
  validateSearch: (s) => search.parse(s),
  head: ({ params }) => ({
    meta: [
      { title: `Room ${params.code} — UNO Online` },
      { name: "description", content: `Private UNO room ${params.code}.` },
      { property: "og:title", content: `UNO Room ${params.code}` },
      { property: "og:description", content: "Private UNO room." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Room,
});

interface Lobbyist {
  id: string;
  name: string;
  avatar: string;
}
interface RoomView {
  code: string;
  hostId: string;
  seq: number;
  players: Lobbyist[];
  state: GameState | null;
}

const tokenKey = (code: string) => `uno.room.token.${code.toUpperCase()}`;

function errMessage(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  return raw.replace(/^Error:\s*/, "").slice(0, 140) || "Something went wrong";
}

function Room() {
  const { code } = Route.useParams();
  const hydrated = useHydrated();
  const [me, setMe] = useState<Lobbyist | null>(null);
  const [view, setView] = useState<RoomView | null>(null);
  const [status, setStatus] = useState<TransportStatus>("connecting");
  const [fatal, setFatal] = useState<string | null>(null);
  const transportRef = useRef<Transport | null>(null);
  const tokenRef = useRef<string>("");
  const meRef = useRef<Lobbyist | null>(null);

  const join = useServerFn(joinRoom);
  const fetchRoom = useServerFn(getRoom);
  const start = useServerFn(startRound);
  const act = useServerFn(submitAction);
  const leave = useServerFn(leaveRoom);

  /** Always re-read authoritative state from the server; peers can only nudge. */
  const refresh = useCallback(async () => {
    const m = meRef.current;
    if (!m || !tokenRef.current) return;
    try {
      const next = await fetchRoom({
        data: { code, playerId: m.id, token: tokenRef.current },
      });
      setView(next as RoomView);
    } catch {
      /* transient — the poller will retry */
    }
  }, [code, fetchRoom]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const profile = ensureProfile();
    const m = { id: profile.id, name: profile.name, avatar: profile.avatar };
    setMe(m);
    meRef.current = m;

    const t = createTransport(code, m.id);
    transportRef.current = t;
    const offStatus = t.onStatus?.((s) => setStatus(s));
    // Peer messages are treated purely as "something changed" signals.
    const off = t.onMessage((msg: RoomMessage) => {
      if (
        msg.type === "sync" ||
        msg.type === "join" ||
        msg.type === "leave" ||
        msg.type === "hello"
      ) {
        void refresh();
      }
    });

    (async () => {
      try {
        const stored = localStorage.getItem(tokenKey(code)) ?? undefined;
        const res = await join({
          data: {
            code: code.toUpperCase(),
            playerId: m.id,
            name: m.name,
            avatar: m.avatar,
            token: stored,
          },
        });
        if (cancelled) return;
        tokenRef.current = res.token;
        localStorage.setItem(tokenKey(code), res.token);
        setView(res.view as RoomView);
        t.send({ type: "sync", seq: res.view.seq });
      } catch (e) {
        if (!cancelled) setFatal(errMessage(e));
      }
    })();

    const poll = setInterval(() => void refresh(), 3000);
    return () => {
      cancelled = true;
      clearInterval(poll);
      off();
      offStatus?.();
      t.close();
    };
  }, [hydrated, code, join, refresh]);

  const nudge = (seq: number) =>
    transportRef.current?.send({ type: "sync", seq });

  const dispatch = async (action: Action) => {
    const m = meRef.current;
    if (!m || !tokenRef.current) return;
    try {
      const next = await act({
        data: { code, playerId: m.id, token: tokenRef.current, action },
      });
      setView(next as RoomView);
      nudge(next.seq);
    } catch (e) {
      toast.error(errMessage(e));
      void refresh();
    }
  };

  const onStart = async () => {
    const m = meRef.current;
    if (!m || !tokenRef.current) return;
    try {
      const next = await start({
        data: { code, playerId: m.id, token: tokenRef.current },
      });
      setView(next as RoomView);
      nudge(next.seq);
    } catch (e) {
      toast.error(errMessage(e));
    }
  };

  const onLeave = () => {
    const m = meRef.current;
    if (m && tokenRef.current) {
      void leave({
        data: { code, playerId: m.id, token: tokenRef.current },
      }).catch(() => {});
      localStorage.removeItem(tokenKey(code));
      transportRef.current?.send({ type: "leave", playerId: m.id });
    }
  };

  const inviteUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/room/${code}`
        : "",
    [code],
  );

  if (fatal) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">
          Can't join room {code}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{fatal}</p>
        <Button asChild className="mt-6">
          <Link to="/lobby">Back to lobby</Link>
        </Button>
      </div>
    );
  }

  if (!hydrated || !me || !view) {
    return (
      <div className="p-10 text-center text-muted-foreground">Connecting…</div>
    );
  }

  const isHost = view.hostId === me.id;
  const state = view.state;

  if (!state) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Room code</div>
            <h1 className="font-display text-4xl font-bold tracking-wider">
              {code}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={`inline-block h-2 w-2 rounded-full ${status === "open" ? "bg-uno-green" : status === "connecting" ? "bg-uno-yellow" : "bg-uno-red"}`}
              />
              {status === "open"
                ? "Connected — play from any device"
                : status === "connecting"
                  ? "Connecting…"
                  : "Reconnecting…"}
            </div>
          </div>
          <Button asChild variant="secondary" onClick={onLeave}>
            <Link to="/lobby">Leave</Link>
          </Button>
        </div>

        <Card className="mt-6 p-6 card-elevated">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Players ({view.players.length}/8)
            </h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(inviteUrl);
                toast.success("Invite link copied");
              }}
            >
              Copy invite link
            </Button>
          </div>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2">
            {view.players.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg bg-accent/40 px-3 py-2"
              >
                <span className="text-xl">{p.avatar}</span>
                <span className="font-medium">{p.name}</span>
                {p.id === view.hostId && (
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    host
                  </span>
                )}
                {p.id === me.id && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    you
                  </span>
                )}
              </li>
            ))}
          </ul>
          {isHost ? (
            <Button
              className="mt-6 btn-gradient w-full"
              onClick={() => void onStart()}
              disabled={view.players.length < 2}
            >
              Start game
            </Button>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Waiting for host to start…
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Share the invite link — players can join from any device or network.
            Every move is validated by the server: cards are dealt, shuffled and
            checked server-side, and you only ever receive your own hand.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <GameBoard
      state={state}
      meId={me.id}
      onPlay={(cardId, chosenColor) =>
        void dispatch({ type: "play", playerId: me.id, cardId, chosenColor })
      }
      onDraw={() => void dispatch({ type: "draw", playerId: me.id })}
      onSayUno={() => void dispatch({ type: "say_uno", playerId: me.id })}
      onChooseColor={(c: Color) =>
        void dispatch({ type: "choose_color", playerId: me.id, color: c })
      }
      onNewRound={isHost ? () => void onStart() : undefined}
    />
  );
}
