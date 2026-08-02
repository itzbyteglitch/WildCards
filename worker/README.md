# UNO room server (Cloudflare Worker + Durable Object)

Optional. The app includes a Supabase realtime fallback for cross-device sync. Deploy this if you want your own dedicated WebSocket room server (one Durable Object per room code, lower latency, authoritative snapshot).

## Deploy

```bash
cd worker
npm install
npx wrangler login
npx wrangler deploy
```

Wrangler prints a URL like `https://uno-rooms.<your-subdomain>.workers.dev`.

## Point the app at it

Add this env var to the app (Project Settings → environment, or `.env` locally):

```
VITE_REALTIME_WS_URL=wss://uno-rooms.<your-subdomain>.workers.dev
```

Rebuild/republish. `createTransport()` prefers the WebSocket transport whenever
that variable is set, and falls back to Supabase realtime otherwise.

## Protocol

Client connects to `wss://<host>/room/<CODE>?playerId=<id>` and exchanges the
JSON `RoomMessage` values defined in `src/lib/net/transport.ts`
(`join`, `leave`, `hello`, `state`, `action`, `chat`, `start`), plus
`{"type":"ping"}` / `{"type":"pong"}` heartbeats. The Durable Object relays each
message to the other sockets in the room, remembers the roster, and replays the
latest `state` snapshot to anyone who joins or reconnects.
