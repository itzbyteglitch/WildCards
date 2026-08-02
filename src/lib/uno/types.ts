export type Color = "red" | "yellow" | "green" | "blue";
export type WildColor = Color | "wild";

export type CardValue =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "skip"
  | "reverse"
  | "draw2"
  | "wild"
  | "wild4";

export interface Card {
  id: string;
  color: WildColor; // "wild" only for wild cards before chosen
  value: CardValue;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isBot: boolean;
  hand: Card[];
  said_uno: boolean;
  connected: boolean;
}

export type GamePhase =
  "lobby" | "playing" | "choose_color" | "round_over" | "game_over";

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  drawPile: Card[];
  discardPile: Card[];
  activeColor: Color; // The color currently in effect (wild resolves to this)
  pendingDraw: number; // Stacked +2 / +4 counter
  phase: GamePhase;
  winnerId?: string;
  scores: Record<string, number>; // cumulative across rounds
  round: number;
  turnStartedAt: number; // ms epoch
  turnDurationMs: number;
  log: LogEntry[];
  lastAction?: LastAction;
}

export interface LogEntry {
  id: string;
  ts: number;
  text: string;
}

export type LastAction =
  | { type: "play"; playerId: string; card: Card }
  | { type: "draw"; playerId: string; count: number }
  | { type: "pass"; playerId: string }
  | { type: "uno"; playerId: string }
  | { type: "color"; playerId: string; color: Color };

export type Action =
  | { type: "play"; playerId: string; cardId: string; chosenColor?: Color }
  | { type: "draw"; playerId: string }
  | { type: "pass"; playerId: string }
  | { type: "say_uno"; playerId: string }
  | { type: "choose_color"; playerId: string; color: Color };
