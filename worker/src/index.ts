/**
 * UNO room server — Cloudflare Worker + Durable Object.
 *
 * One Durable Object instance per room code = one authoritative, globally
 * addressable relay that every device connects to over WebSocket. It fans out
 * messages, keeps the latest game state snapshot for late joiners/reconnects,
 * and tracks the roster.
 *
 * Deploy:  cd worker && npm install && npx wrangler deploy
 * Then set VITE_REALTIME_WS_URL in your app env to the deployed wss:// origin.
 */

export interface Env {
  UNO_ROOM: DurableObjectNamespace;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: CORS });

    const match = url.pathname.match(/^\/room\/([A-Za-z0-9_-]{1,32})$/);
    if (!match)
      return new Response("Not found", { status: 404, headers: CORS });

    const code = match[1]!.toUpperCase();
    const id = env.UNO_ROOM.idFromName(code);
    return env.UNO_ROOM.get(id).fetch(request);
  },
};

interface Presence {
  playerId: string;
  player?: { id: string; name: string; avatar: string };
}

export class UnoRoom implements DurableObject {
  private sessions = new Map<WebSocket, Presence>();
  private lastState: unknown = null;
  private roster = new Map<
    string,
    { id: string; name: string; avatar: string }
  >();

  constructor(private state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response(
        JSON.stringify({ players: [...this.roster.values()] }),
        {
          headers: { "content-type": "application/json", ...CORS },
        },
      );
    }

    const playerId = url.searchParams.get("playerId") ?? crypto.randomUUID();
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    server.accept();
    this.sessions.set(server, { playerId });

    // Catch the newcomer up: current roster + latest known game state.
    for (const player of this.roster.values()) {
      if (player.id === playerId) continue;
      server.send(JSON.stringify({ type: "join", player }));
    }
    if (this.lastState)
      server.send(JSON.stringify({ type: "state", state: this.lastState }));

    server.addEventListener("message", (event: MessageEvent) => {
      let msg: { type?: string; [k: string]: unknown };
      try {
        msg = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (msg.type === "ping") {
        server.send(JSON.stringify({ type: "pong" }));
        return;
      }
      // Identity is bound to the socket, so a client can never act as someone
      // else. Authoritative rule checking lives in the app's server functions
      // (src/lib/rooms.server.ts); this relay only enforces identity.
      const self = this.sessions.get(server)!;
      if (msg.type === "join" && msg["player"]) {
        const player = msg["player"] as {
          id: string;
          name: string;
          avatar: string;
        };
        if (player.id !== self.playerId) return;
        this.roster.set(player.id, player);
        self.player = player;
      }
      if (msg.type === "action") {
        const action = msg["action"] as { playerId?: string } | undefined;
        if (!action || action.playerId !== self.playerId) return;
      }
      if (msg.type === "leave") {
        if (msg["playerId"] !== self.playerId) return;
        this.roster.delete(self.playerId);
      }
      if (msg.type === "state") this.lastState = msg["state"];

      this.broadcast(event.data as string, server);
    });

    const drop = () => {
      const presence = this.sessions.get(server);
      this.sessions.delete(server);
      if (!presence) return;
      const stillHere = [...this.sessions.values()].some(
        (s) => s.playerId === presence.playerId,
      );
      if (stillHere) return;
      this.roster.delete(presence.playerId);
      this.broadcast(
        JSON.stringify({ type: "leave", playerId: presence.playerId }),
        server,
      );
      if (this.sessions.size === 0) this.lastState = null;
    };

    server.addEventListener("close", drop);
    server.addEventListener("error", drop);

    return new Response(null, { status: 101, webSocket: client });
  }

  private broadcast(data: string, except?: WebSocket) {
    for (const ws of [...this.sessions.keys()]) {
      if (ws === except) continue;
      try {
        ws.send(data);
      } catch {
        this.sessions.delete(ws);
      }
    }
  }
}
