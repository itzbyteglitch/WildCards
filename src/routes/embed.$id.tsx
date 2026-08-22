import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PresentationPlayer } from "@/components/embedppt/player";
import { storage } from "@/lib/embedppt/storage";
import type { EmbedPptDeck } from "@/lib/embedppt/types";
export const Route = createFileRoute("/embed/$id")({ component: Page });
function Page() {
  const { id } = Route.useParams();
  const [deck, setDeck] = React.useState<EmbedPptDeck | null>();
  React.useEffect(() => {
    void storage.get(id).then(setDeck);
  }, [id]);
  if (!deck)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        {deck === undefined ? "Loading…" : "Presentation not found"}
      </div>
    );
  return <PresentationPlayer deck={deck} embed />;
}
