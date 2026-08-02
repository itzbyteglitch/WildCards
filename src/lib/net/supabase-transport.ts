import { supabase } from "@/integrations/supabase/client";
import type { RoomMessage, Transport, TransportStatus } from "./transport";

/**
 * Cross-device realtime over Supabase broadcast channels.
 * Zero deploy steps — used whenever no custom WebSocket server is configured.
 */
export class SupabaseTransport implements Transport {
  readonly kind = "supabase" as const;
  private channel: ReturnType<typeof supabase.channel>;
  private listeners = new Set<(m: RoomMessage) => void>();
  private statusListeners = new Set<(s: TransportStatus) => void>();
  private ready = false;
  private queue: RoomMessage[] = [];

  constructor(
    room: string,
    private playerId: string,
  ) {
    this.channel = supabase.channel(`uno:${room}`, {
      config: { broadcast: { self: false, ack: false } },
    });

    this.channel.on("broadcast", { event: "msg" }, (payload) => {
      const data = payload["payload"] as
        { from: string; msg: RoomMessage } | undefined;
      if (!data || data.from === this.playerId) return;
      this.listeners.forEach((l) => l(data.msg));
    });

    this.channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        this.ready = true;
        this.statusListeners.forEach((l) => l("open"));
        const pending = this.queue;
        this.queue = [];
        pending.forEach((m) => this.push(m));
      } else if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT" ||
        status === "CLOSED"
      ) {
        this.ready = false;
        this.statusListeners.forEach((l) =>
          l(status === "CLOSED" ? "closed" : "connecting"),
        );
      }
    });
  }

  private push(msg: RoomMessage) {
    void this.channel.send({
      type: "broadcast",
      event: "msg",
      payload: { from: this.playerId, msg },
    });
  }

  send(msg: RoomMessage) {
    if (this.ready) this.push(msg);
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
    if (this.ready) cb("open");
    return () => {
      this.statusListeners.delete(cb);
    };
  }

  close() {
    this.listeners.clear();
    this.statusListeners.clear();
    void supabase.removeChannel(this.channel);
  }
}
