import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation — WildCards" },
      {
        name: "description",
        content:
          "Technical presentation of WildCards — browser-based multiplayer UNO game architecture, features, and implementation.",
      },
      { property: "og:title", content: "WildCards — Technical Presentation" },
      {
        property: "og:description",
        content: "WildCards technical project presentation",
      },
    ],
  }),
  component: PresentationPage,
});

function PresentationPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
      <section className="mx-auto w-full max-w-[960px] space-y-4">
        <h1 className="text-3xl font-display font-bold tracking-tight md:text-4xl">
          WildCards Technical Presentation
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          View the full hosted HTML5 deck with native transitions, controls, and
          fullscreen support.
        </p>
        <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
          <div className="w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              src="https://storage.googleapis.com/ppt-html-converter-ppt-hosted/53e4390a-2a02-4dea-96b9-93ae55c9b3b4/index.html"
              title="WildCards Technical Presentation"
              className="h-full w-full border-0"
              allow="fullscreen; autoplay; clipboard-read; clipboard-write"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
