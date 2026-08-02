import { createFileRoute, Link } from "@tanstack/react-router";
import { UnoCard } from "@/components/uno-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-to-play")({
  head: () => ({
    meta: [
      { title: "How to Play — UNO Online" },
      {
        name: "description",
        content:
          "Learn UNO in 60 seconds: match colors or numbers, use action cards, be the first to empty your hand.",
      },
      { property: "og:title", content: "How to Play UNO" },
      { property: "og:description", content: "Learn UNO in 60 seconds." },
    ],
  }),
  component: HowToPlay,
});

function HowToPlay() {
  const cards = [
    {
      c: { id: "s", color: "red" as const, value: "skip" as const },
      t: "Skip",
      d: "Next player loses their turn.",
    },
    {
      c: { id: "r", color: "blue" as const, value: "reverse" as const },
      t: "Reverse",
      d: "Flip the direction of play.",
    },
    {
      c: { id: "d2", color: "green" as const, value: "draw2" as const },
      t: "Draw Two",
      d: "Next player draws 2 and skips. Stackable with other +2s.",
    },
    {
      c: { id: "w", color: "wild" as const, value: "wild" as const },
      t: "Wild",
      d: "Play anytime; pick the next color.",
    },
    {
      c: { id: "w4", color: "wild" as const, value: "wild4" as const },
      t: "Wild +4",
      d: "Pick a color and next player draws 4.",
    },
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-display font-bold">
        How to Play
      </h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Match the top card by <b>color</b> or <b>number/symbol</b>. First player
        to empty their hand wins the round. Say <b>UNO</b> when you have one
        card left — or draw a 2-card penalty when you play your next card.
      </p>

      <ol className="mt-8 grid md:grid-cols-3 gap-4">
        {[
          "Everyone starts with 7 cards.",
          "On your turn, play a matching card or draw one.",
          "Action cards trigger their effect immediately.",
        ].map((s, i) => (
          <li key={s} className="card-elevated p-4">
            <div className="text-xs font-mono text-primary">STEP {i + 1}</div>
            <div className="mt-1 text-sm">{s}</div>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-2xl font-display font-semibold">
        Action cards
      </h2>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((x) => (
          <div key={x.t} className="card-elevated p-4 flex items-start gap-4">
            <UnoCard card={x.c} size="md" />
            <div>
              <div className="font-semibold">{x.t}</div>
              <div className="text-sm text-muted-foreground">{x.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <Button asChild className="btn-gradient">
          <Link to="/play">Play now</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/lobby">Create a room</Link>
        </Button>
      </div>
    </div>
  );
}
