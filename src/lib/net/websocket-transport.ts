import type { RoomMessage, Transport, TransportStatus } from "./transport";

/**
 * Talks to the Cloudflare Worker + Durable Object room server in /worker.
 * Configure the deployed worker origin with VITE_REALTIME_WS_URL, e.g.
 *   VITE_REALTIME_WS_URL=wss://uno-rooms.<your-subdomain>.workers.dev
 * Auto-reconnects with backoff and queues sends while offline.
 */
export class WebSocketTransport implements Transport {
  readonly kind = "websocket" as const;
  private ws: WebSocket | null = null;
  private listeners = new Set<(m: RoomMessage) => void>();
  private statusListeners = new Set<(s: TransportStatus) => void>();
  private queue: RoomMessage[] = [];
  private closed = false;
  private attempt = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private heartbeat: ReturnType<typeof setInterval> | null = null;

  constructor(
    private baseUrl: string,
    private room: string,
    private playerId: string,
  ) {
    this.connect();
  }

  private url() {
    const base = this.baseUrl.replace(/^http/, "ws").replace(/\/$/, "");
    return `${base}/room/${encodeURIComponent(this.room)}?playerId=${encodeURIComponent(this.playerId)}`;
  }

  private setStatus(s: TransportStatus) {
    this.statusListeners.forEach((l) => l(s));
  }

  private connect() {
    if (this.closed) return;
    this.setStatus("connecting");
    const ws = new WebSocket(this.url());
    this.ws = ws;

    ws.onopen = () => {
      this.attempt = 0;
      this.setStatus("open");
      const pending = this.queue;
      this.queue = [];
      pending.forEach((m) => ws.send(JSON.stringify(m)));
      this.heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN)
          ws.send(JSON.stringify({ type: "ping" }));
      }, 25_000);
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(String(e.data)) as { type: string };
        if (msg.type === "pong" || msg.type === "ping") return;
        this.listeners.forEach((l) => l(msg as RoomMessage));
      } catch {
        /* ignore malformed frames */
      }
    };

    ws.onclose = () => {
      if (this.heartbeat) {
        clearInterval(this.heartbeat);
        this.heartbeat = null;
      }
      if (this.closed) return;
      this.setStatus("closed");
      const delay = Math.min(10_000, 500 * 2 ** this.attempt++);
      this.timer = setTimeout(() => this.connect(), delay);
    };

    ws.onerror = () => ws.close();
  }

  send(msg: RoomMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(msg));
    else this.queue.push(msg);
  }

  onMessage(cb: (m: RoomMessage) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  onStatus(cb: (s: TransportStatus) => void) {
    this.statusListeners.add(cb);
    return () => {
      this.statusListeners.delete(cb);
    };
  }

  close() {
    this.closed = true;
    if (this.timer) clearTimeout(this.timer);
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.listeners.clear();
    this.statusListeners.clear();
    this.ws?.close();
  }
}
