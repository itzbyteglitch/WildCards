import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { GameBoard } from "@/components/game-board";
import { useLocalGame, newLocalGame } from "@/lib/store/local-game";
import { ensureProfile, recordResult } from "@/lib/profile";
import { useHydrated } from "@/lib/hydrated";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play UNO vs Bots — WildCards" },
      {
        name: "description",
        content:
          "Play a full UNO match against smart bots directly in your browser.",
      },
      { property: "og:title", content: "Play UNO vs Bots" },
      {
        property: "og:description",
        content: "Play a full UNO match against smart bots.",
      },
    ],
  }),
  component: PlayVsBots,
});

function PlayVsBots() {
  const hydrated = useHydrated();
  const { state, meId, init, dispatch, tickTimeout } = useLocalGame();
  const recordedRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (state) return;
    const p = ensureProfile();
    const { state: s, meId } = newLocalGame(p.name, p.avatar, 3);
    init(s, meId);
  }, [hydrated, state, init]);

  useEffect(() => {
    const id = setInterval(tickTimeout, 500);
    return () => clearInterval(id);
  }, [tickTimeout]);

  useEffect(() => {
    if (!state || !meId) return;
    if (state.phase === "round_over" && !recordedRef.current) {
      recordedRef.current = true;
      const won = state.winnerId === meId;
      recordResult(won, state.scores[meId] ?? 0);
    }
  }, [state, meId]);

  if (!hydrated || !state || !meId) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Dealing cards…
      </div>
    );
  }

  return (
    <GameBoard
      state={state}
      meId={meId}
      onPlay={(cardId, chosenColor) =>
        dispatch({ type: "play", playerId: meId, cardId, chosenColor })
      }
      onDraw={() => dispatch({ type: "draw", playerId: meId })}
      onSayUno={() => dispatch({ type: "say_uno", playerId: meId })}
      onChooseColor={(c) =>
        dispatch({ type: "choose_color", playerId: meId, color: c })
      }
      onNewRound={() => {
        recordedRef.current = false;
        const p = ensureProfile();
        const { state: s, meId } = newLocalGame(p.name, p.avatar, 3);
        init(s, meId);
      }}
    />
  );
}
