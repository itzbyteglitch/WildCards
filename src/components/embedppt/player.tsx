import * as React from "react";
import { Maximize2 } from "lucide-react";
import type { EmbedPptDeck } from "@/lib/embedppt/types";
import { Button } from "@/components/ui/button";

export function PresentationPlayer({
  deck,
  embed = false,
}: {
  deck: EmbedPptDeck;
  embed?: boolean;
}) {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const controls = params.get("controls") !== "false";
  const loop = params.get("loop") === "true";
  const start = Math.min(
    deck.slides.length - 1,
    Math.max(0, Number(params.get("slide") || 1) - 1),
  );
  const [idx, setIdx] = React.useState(start);
  const box = React.useRef<HTMLDivElement>(null);
  const touch = React.useRef<number | null>(null);
  const go = React.useCallback(
    (n: number) =>
      setIdx((i) =>
        loop
          ? (n + deck.slides.length) % deck.slides.length
          : Math.min(deck.slides.length - 1, Math.max(0, n)),
      ),
    [deck.slides.length, loop],
  );
  React.useEffect(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("slide", String(idx + 1));
    history.replaceState(null, "", u);
  }, [idx]);
  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        go(idx - 1);
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(idx + 1);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx, go]);
  const slide = deck.slides[idx];
  return (
    <div
      className={
        embed
          ? "min-h-screen bg-black flex items-center justify-center"
          : "w-full"
      }
    >
      <div
        ref={box}
        className="group relative mx-auto w-full overflow-hidden rounded-xl bg-black shadow-2xl outline-none"
        style={{
          aspectRatio: `${deck.width}/${deck.height}`,
          maxHeight: embed ? "100vh" : undefined,
        }}
        tabIndex={0}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          if ((e.clientX - r.left) / r.width <= 0.3) {
            go(idx - 1);
          } else {
            go(idx + 1);
          }
        }}
        onTouchStart={(e) => {
          touch.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) {
            if (dx < 0) {
              go(idx + 1);
            } else {
              go(idx - 1);
            }
          }
          touch.current = null;
        }}
      >
        <div
          className="relative origin-top-left bg-white"
          style={{
            width: deck.width,
            height: deck.height,
            transform: `scale(${(box.current?.clientWidth || deck.width) / deck.width})`,
            transformOrigin: "top left",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: slide.html }} />
        </div>
        {controls && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <span>
              {idx + 1} / {deck.slides.length}
            </span>
            <div className="pointer-events-auto flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  go(idx - 1);
                }}
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  go(idx + 1);
                }}
              >
                Next
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  box.current?.requestFullscreen();
                }}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
