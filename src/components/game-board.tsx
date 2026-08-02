import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UnoCard } from "@/components/uno-card";
import { Button } from "@/components/ui/button";
import type { Color, GameState, Player } from "@/lib/uno/types";
import { currentPlayer, legalCards, prettyCard } from "@/lib/uno/engine";
import { cn } from "@/lib/utils";

interface Props {
  state: GameState;
  meId: string;
  onPlay: (cardId: string, chosenColor?: Color) => void;
  onDraw: () => void;
  onSayUno: () => void;
  onChooseColor: (c: Color) => void;
  onNewRound?: () => void;
}

const COLOR_BG: Record<Color, string> = {
  red: "bg-uno-red",
  yellow: "bg-uno-yellow",
  green: "bg-uno-green",
  blue: "bg-uno-blue",
};

export function GameBoard({
  state,
  meId,
  onPlay,
  onDraw,
  onSayUno,
  onChooseColor,
  onNewRound,
}: Props) {
  const me = state.players.find((p) => p.id === meId)!;
  const others = state.players.filter((p) => p.id !== meId);
  const cur = currentPlayer(state);
  const isMyTurn = cur.id === meId && state.phase === "playing";
  const myLegal = useMemo(
    () => new Set(legalCards(me, state).map((c) => c.id)),
    [me, state],
  );
  const top = state.discardPile[state.discardPile.length - 1];
  const [pickWildFor, setPickWildFor] = useState<string | null>(null);

  // Live turn timer
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  const remaining = Math.max(
    0,
    state.turnDurationMs - (now - state.turnStartedAt),
  );

  const handlePlay = (cardId: string) => {
    const card = me.hand.find((c) => c.id === cardId)!;
    if (card.color === "wild") {
      setPickWildFor(cardId);
      return;
    }
    onPlay(cardId);
  };

  return (
    <div className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Opponents */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-3 px-4 flex-wrap">
        {others.map((p) => (
          <OpponentTile
            key={p.id}
            p={p}
            active={cur.id === p.id && state.phase === "playing"}
          />
        ))}
      </div>

      {/* Center: piles + timer + color */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
          <button
            onClick={() => isMyTurn && onDraw()}
            className={cn(
              "transition-transform",
              isMyTurn && "hover:-translate-y-1 cursor-pointer",
            )}
            aria-label="Draw a card"
          >
            <div className="relative">
              <UnoCard faceDown size="lg" />
              <div className="absolute -bottom-2 -right-2 h-6 min-w-6 rounded-full bg-accent text-xs px-1.5 flex items-center justify-center font-semibold">
                {state.drawPile.length}
              </div>
            </div>
          </button>
          <div className="flex flex-col items-center gap-2">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={top.id}
                initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UnoCard card={top} size="lg" />
              </motion.div>
            </AnimatePresence>
            <div
              className={cn(
                "h-2 w-16 rounded-full",
                COLOR_BG[state.activeColor],
              )}
            />
            {state.pendingDraw > 0 && (
              <div className="text-xs font-semibold text-destructive">
                Draw {state.pendingDraw} pending
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Turn status bar */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-1.5 text-sm flex items-center gap-3">
        <span className="font-semibold">{cur.name}'s turn</span>
        <span className="text-muted-foreground">·</span>
        <span className="font-mono tabular-nums">
          {Math.ceil(remaining / 1000)}s
        </span>
        <span className="text-muted-foreground">·</span>
        <span>Dir {state.direction === 1 ? "→" : "←"}</span>
      </div>

      {/* Round over */}
      {state.phase === "round_over" && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur flex items-center justify-center z-30">
          <div className="card-elevated p-8 max-w-md text-center">
            <h2 className="font-display text-3xl font-bold">
              {state.players.find((p) => p.id === state.winnerId)?.name} wins!
            </h2>
            <div className="mt-4 space-y-1 text-sm">
              {state.players.map((p) => (
                <div key={p.id} className="flex justify-between">
                  <span>
                    {p.avatar} {p.name}
                  </span>
                  <span className="tabular-nums font-mono">
                    {state.scores[p.id] ?? 0}
                  </span>
                </div>
              ))}
            </div>
            {onNewRound && (
              <Button className="mt-6 btn-gradient" onClick={onNewRound}>
                Play again
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Wild color picker (bot-triggered or me) */}
      {(state.phase === "choose_color" && cur.id === meId) || pickWildFor ? (
        <ColorPicker
          onPick={(c) => {
            if (pickWildFor) {
              onPlay(pickWildFor, c);
              setPickWildFor(null);
            } else onChooseColor(c);
          }}
        />
      ) : null}

      {/* My hand */}
      <div className="absolute bottom-0 left-0 right-0 pb-4 pt-8">
        <div className="flex items-end justify-center gap-1 min-h-[9rem]">
          {me.hand.map((c, i) => {
            const total = me.hand.length;
            const spread = Math.min(18, 260 / Math.max(1, total));
            const offset = (i - (total - 1) / 2) * spread;
            const rot = (i - (total - 1) / 2) * 3;
            const playable = isMyTurn && myLegal.has(c.id);
            return (
              <div
                key={c.id}
                style={{
                  transform: `translateX(${offset}px) rotate(${rot}deg)`,
                  zIndex: i,
                }}
                className="relative"
              >
                <UnoCard
                  card={c}
                  playable={playable}
                  onClick={playable ? () => handlePlay(c.id) : undefined}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">
            {me.avatar} {me.name} · {me.hand.length} cards
          </span>
          {me.hand.length === 2 && !me.said_uno && (
            <Button size="sm" variant="destructive" onClick={onSayUno}>
              Say UNO!
            </Button>
          )}
          {me.hand.length === 1 && me.said_uno && (
            <span className="text-xs font-bold text-uno-yellow">UNO!</span>
          )}
        </div>
      </div>

      {/* Log */}
      <div className="absolute right-4 bottom-40 hidden md:block w-56 max-h-64 overflow-y-auto text-xs text-muted-foreground space-y-1 glass rounded-lg p-3">
        {state.log
          .slice(-10)
          .reverse()
          .map((l) => (
            <div key={l.id}>{l.text}</div>
          ))}
      </div>
    </div>
  );
}

function OpponentTile({ p, active }: { p: Player; active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all",
        active ? "bg-primary/20 ring-2 ring-primary" : "glass",
      )}
    >
      <div className="flex -space-x-3">
        {Array.from({ length: Math.min(p.hand.length, 7) }).map((_, i) => (
          <UnoCard key={i} faceDown size="sm" />
        ))}
      </div>
      <div className="text-xs font-medium mt-1">
        <span className="mr-1">{p.avatar}</span>
        {p.name}
        <span className="ml-2 text-muted-foreground">{p.hand.length}</span>
      </div>
    </div>
  );
}

function ColorPicker({ onPick }: { onPick: (c: Color) => void }) {
  const colors: Color[] = ["red", "yellow", "green", "blue"];
  return (
    <div className="absolute inset-0 bg-background/70 backdrop-blur flex items-center justify-center z-40">
      <div className="card-elevated p-6">
        <h3 className="font-display text-lg font-semibold text-center">
          Choose a color
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => onPick(c)}
              className={cn(
                "h-20 w-24 rounded-xl border-2 border-white/40 hover:scale-105 transition-transform",
                COLOR_BG[c],
              )}
              aria-label={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
