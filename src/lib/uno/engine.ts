import type { Action, Card, Color, GameState, Player } from "./types";
import { buildDeck, shuffle } from "./deck";

export const TURN_MS = 30_000;

export function createGame(
  players: Omit<Player, "hand" | "said_uno" | "connected">[],
  seed?: number,
): GameState {
  const deck = shuffle(buildDeck(), seed);
  const fullPlayers: Player[] = players.map((p) => ({
    ...p,
    hand: deck.splice(0, 7),
    said_uno: false,
    connected: true,
  }));
  // Ensure first discard is a numeric card (standard rule simplification)
  let first = deck.pop()!;
  while (
    first.color === "wild" ||
    ["skip", "reverse", "draw2"].includes(first.value)
  ) {
    deck.unshift(first);
    first = deck.pop()!;
  }
  const scores: Record<string, number> = {};
  fullPlayers.forEach((p) => (scores[p.id] = 0));
  return {
    players: fullPlayers,
    currentPlayerIndex: 0,
    direction: 1,
    drawPile: deck,
    discardPile: [first],
    activeColor: first.color as Color,
    pendingDraw: 0,
    phase: "playing",
    scores,
    round: 1,
    turnStartedAt: Date.now(),
    turnDurationMs: TURN_MS,
    log: [logEntry(`Round 1 started`)],
  };
}

function logEntry(text: string) {
  return {
    id: `l${Math.random().toString(36).slice(2, 9)}`,
    ts: Date.now(),
    text,
  };
}

export function topCard(s: GameState): Card {
  return s.discardPile[s.discardPile.length - 1];
}

export function currentPlayer(s: GameState): Player {
  return s.players[s.currentPlayerIndex];
}

export function canPlay(
  card: Card,
  top: Card,
  activeColor: Color,
  pendingDraw: number,
): boolean {
  // While a +2/+4 chain is pending, only stackable cards are legal.
  if (pendingDraw > 0) {
    if (top.value === "draw2")
      return card.value === "draw2" || card.value === "wild4";
    if (top.value === "wild4") return card.value === "wild4";
  }
  if (card.color === "wild") return true;
  if (card.color === activeColor) return true;
  if (card.value === top.value) return true;
  return false;
}

export function legalCards(player: Player, s: GameState): Card[] {
  const top = topCard(s);
  return player.hand.filter((c) =>
    canPlay(c, top, s.activeColor, s.pendingDraw),
  );
}

function nextIndex(s: GameState, step = 1): number {
  const n = s.players.length;
  return (s.currentPlayerIndex + step * s.direction + n * 10) % n;
}

function drawFrom(s: GameState, count: number): Card[] {
  const out: Card[] = [];
  for (let i = 0; i < count; i++) {
    if (s.drawPile.length === 0) {
      // Reshuffle discard except top
      const top = s.discardPile.pop()!;
      s.drawPile = shuffle(s.discardPile);
      s.discardPile = [top];
    }
    if (s.drawPile.length === 0) break;
    out.push(s.drawPile.pop()!);
  }
  return out;
}

export function applyAction(
  prev: GameState,
  action: Action,
): { state: GameState; error?: string } {
  const s: GameState = structuredClone(prev);
  const player = s.players.find((p) => p.id === action.playerId);
  if (!player) return { state: prev, error: "unknown player" };

  if (s.phase === "choose_color") {
    if (action.type !== "choose_color")
      return { state: prev, error: "must choose color" };
    if (s.players[s.currentPlayerIndex].id !== action.playerId)
      return { state: prev, error: "not your turn" };
    s.activeColor = action.color;
    s.phase = "playing";
    s.lastAction = { type: "color", playerId: player.id, color: action.color };
    s.log.push(logEntry(`${player.name} chose ${action.color}`));
    // Resolve wild4 pending draw for next player before advancing
    advanceAfterPlay(s, topCard(s));
    return { state: s };
  }

  if (s.phase !== "playing") return { state: prev, error: "not playing" };
  if (currentPlayer(s).id !== player.id && action.type !== "say_uno") {
    return { state: prev, error: "not your turn" };
  }

  switch (action.type) {
    case "say_uno": {
      if (player.hand.length === 2) {
        player.said_uno = true;
        s.lastAction = { type: "uno", playerId: player.id };
        s.log.push(logEntry(`${player.name} said UNO!`));
      }
      return { state: s };
    }
    case "draw": {
      const count = s.pendingDraw > 0 ? s.pendingDraw : 1;
      const drawn = drawFrom(s, count);
      player.hand.push(...drawn);
      s.pendingDraw = 0;
      s.lastAction = { type: "draw", playerId: player.id, count };
      s.log.push(logEntry(`${player.name} drew ${count}`));
      // On single draw, player may then pass (we auto-pass for simplicity)
      s.currentPlayerIndex = nextIndex(s);
      s.turnStartedAt = Date.now();
      return { state: s };
    }
    case "pass": {
      s.currentPlayerIndex = nextIndex(s);
      s.turnStartedAt = Date.now();
      s.lastAction = { type: "pass", playerId: player.id };
      return { state: s };
    }
    case "play": {
      const idx = player.hand.findIndex((c) => c.id === action.cardId);
      if (idx < 0) return { state: prev, error: "card not in hand" };
      const card = player.hand[idx];
      const top = topCard(s);
      if (!canPlay(card, top, s.activeColor, s.pendingDraw))
        return { state: prev, error: "illegal play" };
      player.hand.splice(idx, 1);

      // Missed UNO penalty: if now 1 card and didn't say UNO -> draw 2
      if (player.hand.length === 1 && !player.said_uno) {
        player.hand.push(...drawFrom(s, 2));
        s.log.push(logEntry(`${player.name} forgot UNO! Draws 2.`));
      }
      if (player.hand.length !== 1) player.said_uno = false;

      // Place with chosen color for wilds
      const placed: Card = { ...card };
      if (placed.color === "wild") {
        if (action.chosenColor) {
          s.activeColor = action.chosenColor;
          s.discardPile.push(placed);
          s.lastAction = { type: "play", playerId: player.id, card: placed };
          s.log.push(
            logEntry(
              `${player.name} played ${prettyCard(placed)} -> ${action.chosenColor}`,
            ),
          );
        } else {
          // Human needs to choose color
          s.discardPile.push(placed);
          s.lastAction = { type: "play", playerId: player.id, card: placed };
          s.log.push(logEntry(`${player.name} played ${prettyCard(placed)}`));
          if (placed.value === "wild4") s.pendingDraw += 4;
          s.phase = "choose_color";
          checkWin(s, player);
          return { state: s };
        }
      } else {
        s.activeColor = placed.color as Color;
        s.discardPile.push(placed);
        s.lastAction = { type: "play", playerId: player.id, card: placed };
        s.log.push(logEntry(`${player.name} played ${prettyCard(placed)}`));
      }

      if (placed.value === "draw2") s.pendingDraw += 2;
      if (placed.value === "wild4") s.pendingDraw += 4;

      if (checkWin(s, player)) return { state: s };
      advanceAfterPlay(s, placed);
      return { state: s };
    }
    default:
      return { state: prev, error: "unknown action" };
  }
}

function advanceAfterPlay(s: GameState, played: Card) {
  if (played.value === "skip") {
    s.currentPlayerIndex = nextIndex(s, 2);
    s.log.push(
      logEntry(`${s.players[s.currentPlayerIndex].name}'s turn (skip)`),
    );
  } else if (played.value === "reverse") {
    if (s.players.length === 2) {
      s.currentPlayerIndex = nextIndex(s, 2); // acts as skip
    } else {
      s.direction = (s.direction * -1) as 1 | -1;
      s.currentPlayerIndex = nextIndex(s);
    }
  } else {
    s.currentPlayerIndex = nextIndex(s);
  }
  s.turnStartedAt = Date.now();
}

function checkWin(s: GameState, player: Player): boolean {
  if (player.hand.length === 0) {
    // Score: sum of opponents' hand values
    let round = 0;
    for (const p of s.players) {
      if (p.id === player.id) continue;
      round += p.hand.reduce((sum, c) => sum + cardScore(c), 0);
    }
    s.scores[player.id] = (s.scores[player.id] ?? 0) + round;
    s.winnerId = player.id;
    s.phase = "round_over";
    s.log.push(logEntry(`${player.name} wins the round (+${round})`));
    return true;
  }
  return false;
}

export function cardScore(c: Card): number {
  if (c.value === "wild" || c.value === "wild4") return 50;
  if (c.value === "skip" || c.value === "reverse" || c.value === "draw2")
    return 20;
  return parseInt(c.value, 10) || 0;
}

export function prettyCard(c: Card): string {
  const v =
    c.value === "draw2"
      ? "+2"
      : c.value === "wild4"
        ? "Wild+4"
        : c.value === "wild"
          ? "Wild"
          : c.value === "skip"
            ? "Skip"
            : c.value === "reverse"
              ? "Rev"
              : c.value;
  return c.color === "wild" ? v : `${c.color[0].toUpperCase()}${v}`;
}

// Turn timeout: auto-draw for the current player
export function handleTimeout(s: GameState): GameState {
  if (s.phase !== "playing") return s;
  const p = currentPlayer(s);
  return applyAction(s, { type: "draw", playerId: p.id }).state;
}
