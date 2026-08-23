import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation — WildCards" },
      {
        name: "description",
        content:
          "Technical presentation of WildCards — browser-based multiplayer UNO game architecture, features, and implementation.",
      },
      {
        property: "og:title",
        content: "WildCards — Technical Presentation",
      },
      {
        property: "og:description",
        content: "WildCards technical project presentation",
      },
    ],
  }),
  component: PresentationPage,
});

function PresentationPage() {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === iframeRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === iframeRef.current) {
      await document.exitFullscreen();
      return;
    }

    await iframeRef.current?.requestFullscreen();
  };

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
        <div className="flex justify-end">
          <Button type="button" size="lg" onClick={toggleFullscreen}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>
        <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
          <div className="w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              ref={iframeRef}
              src="https://storage.googleapis.com/ppt-html-converter-ppt-hosted/0380f2b3-4463-40a8-9852-9a1c0713752e/index.html"
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
