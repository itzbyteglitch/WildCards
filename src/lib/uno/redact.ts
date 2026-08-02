import type { Card, GameState } from "./types";

/**
 * Hidden information control.
 *
 * The authoritative server holds every hand and the whole draw pile. Clients
 * must never receive cards they are not allowed to see, otherwise "validation"
 * is pointless — a cheater could simply read opponents' hands off the wire.
 *
 * Opponent hands and the draw pile are replaced with opaque face-down
 * placeholders of the same length so the UI keeps rendering counts correctly.
 */
function faceDown(prefix: string, n: number): Card[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${prefix}:${i}`,
    color: "wild" as const,
    value: "0" as const,
  }));
}

export function redactState(state: GameState, viewerId: string): GameState {
  return {
    ...state,
    players: state.players.map((p) =>
      p.id === viewerId
        ? p
        : { ...p, hand: faceDown(`h_${p.id}`, p.hand.length) },
    ),
    drawPile: faceDown("d", state.drawPile.length),
  };
}
