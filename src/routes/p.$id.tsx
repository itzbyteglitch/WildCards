import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PresentationPlayer } from "@/components/embedppt/player";
import { storage } from "@/lib/embedppt/storage";
import type { EmbedPptDeck } from "@/lib/embedppt/types";
export const Route = createFileRoute("/p/$id")({ component: Page });
function Page() {
  const { id } = Route.useParams();
  const [deck, setDeck] = React.useState<EmbedPptDeck | null>();
  React.useEffect(() => {
    void storage.get(id).then(setDeck);
  }, [id]);
  if (deck === undefined) return <div className="p-10">Loading…</div>;
  if (!deck)
    return (
      <div className="mx-auto max-w-xl p-10">
        <h1 className="font-display text-3xl font-bold">
          Presentation not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This demo stores published decks in browser localStorage. Export the
          generated deck JSON/static files to host it globally.
        </p>
      </div>
    );
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 font-display text-2xl font-bold">{deck.title}</h1>
      <PresentationPlayer deck={deck} />
    </main>
  );
}
