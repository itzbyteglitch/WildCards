import type { Card, Color, CardValue } from "./types";

const COLORS: Color[] = ["red", "yellow", "green", "blue"];

let _id = 0;
const nid = () => `c${++_id}`;

export function buildDeck(): Card[] {
  _id = 0;
  const deck: Card[] = [];
  for (const color of COLORS) {
    deck.push({ id: nid(), color, value: "0" });
    for (let n = 1; n <= 9; n++) {
      const v = String(n) as CardValue;
      deck.push({ id: nid(), color, value: v });
      deck.push({ id: nid(), color, value: v });
    }
    for (const v of ["skip", "reverse", "draw2"] as CardValue[]) {
      deck.push({ id: nid(), color, value: v });
      deck.push({ id: nid(), color, value: v });
    }
  }
  for (let i = 0; i < 4; i++) {
    deck.push({ id: nid(), color: "wild", value: "wild" });
    deck.push({ id: nid(), color: "wild", value: "wild4" });
  }
  return deck;
}

// Seeded shuffle for deterministic games (Mulberry32)
export function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = arr.slice();
  let s = seed >>> 0;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
