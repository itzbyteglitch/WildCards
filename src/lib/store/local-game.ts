import { create } from "zustand";
import type { Action, GameState } from "@/lib/uno/types";
import { applyAction, createGame, handleTimeout } from "@/lib/uno/engine";
import { botAction } from "@/lib/uno/bot";

interface Store {
  state: GameState | null;
  meId: string | null;
  init: (state: GameState, meId: string) => void;
  dispatch: (a: Action) => void;
  reset: () => void;
  tickTimeout: () => void;
  runBots: () => void;
}

export const useLocalGame = create<Store>((set, get) => ({
  state: null,
  meId: null,
  init: (state, meId) => set({ state, meId }),
  dispatch: (a) => {
    const cur = get().state;
    if (!cur) return;
    const { state, error } = applyAction(cur, a);
    if (error) console.warn("[uno]", error);
    set({ state });
    // schedule bot follow-up
    setTimeout(() => get().runBots(), 500);
  },
  runBots: () => {
    let cur = get().state;
    if (!cur) return;
    let guard = 0;
    while (cur && guard++ < 20) {
      const a = botAction(cur);
      if (!a) break;
      const { state } = applyAction(cur, a);
      cur = state;
      set({ state: cur });
    }
  },
  tickTimeout: () => {
    const cur = get().state;
    if (!cur) return;
    if (cur.phase !== "playing") return;
    const elapsed = Date.now() - cur.turnStartedAt;
    if (elapsed > cur.turnDurationMs) {
      set({ state: handleTimeout(cur) });
      setTimeout(() => get().runBots(), 400);
    }
  },
  reset: () => set({ state: null, meId: null }),
}));

export function newLocalGame(playerName: string, avatar: string, botCount = 3) {
  const meId = "me";
  const players = [
    { id: meId, name: playerName, avatar, isBot: false },
    ...Array.from({ length: botCount }, (_, i) => ({
      id: `bot_${i}`,
      name: `Bot ${i + 1}`,
      avatar: ["🤖", "👾", "🐙", "🦾", "🐉", "🎃", "👻"][i % 7],
      isBot: true,
    })),
  ];
  return { state: createGame(players), meId };
}
