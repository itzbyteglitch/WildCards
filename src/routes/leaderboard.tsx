import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadLeaderboard, type LBEntry } from "@/lib/profile";
import { Card } from "@/components/ui/card";
import { useHydrated } from "@/lib/hydrated";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — UNO Online" },
      {
        name: "description",
        content: "Top UNO Online players ranked by total score.",
      },
      { property: "og:title", content: "UNO Online — Leaderboard" },
      { property: "og:description", content: "Top UNO Online players." },
    ],
  }),
  component: LB,
});

function LB() {
  const hydrated = useHydrated();
  const [rows, setRows] = useState<LBEntry[]>([]);
  useEffect(() => {
    if (hydrated) setRows(loadLeaderboard());
  }, [hydrated]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-uno-yellow" />
        <h1 className="text-4xl font-display font-bold">Leaderboard</h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        Stored locally in your browser. Wire the game to a backend (D1 works
        great) for a global board.
      </p>

      <Card className="mt-6 card-elevated overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            Play a round to get on the board.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left">
              <tr>
                <th className="p-3 w-10">#</th>
                <th className="p-3">Player</th>
                <th className="p-3 text-right">Wins</th>
                <th className="p-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-t border-border/60">
                  <td className="p-3 font-mono text-muted-foreground">
                    {i + 1}
                  </td>
                  <td className="p-3">
                    <span className="mr-2">{r.avatar}</span>
                    {r.name}
                  </td>
                  <td className="p-3 text-right tabular-nums">{r.wins}</td>
                  <td className="p-3 text-right tabular-nums font-semibold">
                    {r.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
