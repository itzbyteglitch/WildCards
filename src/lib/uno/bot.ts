import type { Action, Color, GameState } from "./types";
import { currentPlayer, legalCards } from "./engine";

const COLORS: Color[] = ["red", "yellow", "green", "blue"];

export function botAction(s: GameState): Action | null {
  if (s.phase === "choose_color") {
    const bot = s.players[s.currentPlayerIndex];
    if (!bot.isBot) return null;
    const counts: Record<Color, number> = {
      red: 0,
      yellow: 0,
      green: 0,
      blue: 0,
    };
    for (const c of bot.hand)
      if (c.color !== "wild") counts[c.color as Color]++;
    const color = COLORS.sort((a, b) => counts[b] - counts[a])[0];
    return { type: "choose_color", playerId: bot.id, color };
  }
  if (s.phase !== "playing") return null;
  const bot = currentPlayer(s);
  if (!bot.isBot) return null;
  const legal = legalCards(bot, s);
  if (legal.length === 0) return { type: "draw", playerId: bot.id };
  // Prefer to burn action cards, save wilds
  const scored = legal
    .map((c) => {
      let w = 0;
      if (c.value === "wild4") w = 1;
      else if (c.value === "wild") w = 2;
      else if (["skip", "reverse", "draw2"].includes(c.value)) w = 5;
      else w = 10 - (parseInt(c.value, 10) || 0);
      return { c, w };
    })
    .sort((a, b) => b.w - a.w);
  const pick = scored[0].c;
  let chosenColor: Color | undefined;
  if (pick.color === "wild") {
    const counts: Record<Color, number> = {
      red: 0,
      yellow: 0,
      green: 0,
      blue: 0,
    };
    for (const c of bot.hand)
      if (c.color !== "wild") counts[c.color as Color]++;
    chosenColor = COLORS.sort((a, b) => counts[b] - counts[a])[0];
  }
  return { type: "play", playerId: bot.id, cardId: pick.id, chosenColor };
}
