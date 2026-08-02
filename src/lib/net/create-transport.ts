import { BroadcastTransport, type Transport } from "./transport";
import { SupabaseTransport } from "./supabase-transport";
import { WebSocketTransport } from "./websocket-transport";

/**
 * Picks the best realtime backend available:
 *  1. VITE_REALTIME_WS_URL set  → Cloudflare Worker + Durable Object (see /worker)
 *  2. VITE_SUPABASE_URL set     → Supabase realtime broadcast (cross-device, no deploy)
 *  3. otherwise                 → BroadcastChannel (same browser, other tabs)
 */
export function createTransport(room: string, playerId: string): Transport {
  const wsUrl = import.meta.env["VITE_REALTIME_WS_URL"] as string | undefined;
  if (wsUrl) return new WebSocketTransport(wsUrl, room, playerId);

  if (import.meta.env["VITE_SUPABASE_URL"])
    return new SupabaseTransport(room, playerId);

  return new BroadcastTransport(room);
}
