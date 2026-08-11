"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { RevealApi } from "reveal.js";
import "reveal.js/reveal.css";
import "reveal.js/theme/black.css";
import "./presentation.css";
import { slides } from "./slides";
import { ControlBar } from "./control-bar";
import { cn } from "@/lib/utils";

export function Presentation() {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<RevealApi | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentSlide, setCurrentSlide] = useState({ h: 0, v: 0 });
  const [totalSlides, setTotalSlides] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  useEffect(() => {
    if (revealRef.current) return;

    let cancelled = false;
    let deck: RevealApi | null = null;

    (async () => {
      const [{ default: Reveal }, Markdown, Highlight, Zoom, Notes] =
        await Promise.all([
          import("reveal.js"),
          import("reveal.js/plugin/markdown"),
          import("reveal.js/plugin/highlight"),
          import("reveal.js/plugin/zoom"),
          import("reveal.js/plugin/notes"),
        ]);

      if (cancelled) return;

      const deckEl = deckRef.current;
      if (!deckEl) return;

      deck = new Reveal(deckEl, {
        hash: true,
        history: true,
        center: true,
        touch: true,
        loop: false,
        rtl: false,
        navigationMode: "linear",
        fragments: true,
        embedded: false,
        help: true,
        showNotes: false,
        autoPlayMedia: false,
        defaultTiming: null,
        autoSlide: 0,
        autoSlideStoppable: true,
        autoSlideMethod: null,
        mouseWheel: false,
        previewLinks: false,
        transition: "slide",
        transitionSpeed: "default",
        backgroundTransition: "fade",
        viewDistance: 3,
        mobileViewDistance: 2,
        display: "block",
        hideInactiveCursor: true,
        hideCursorTime: 5000,
        pdfSeparateFragments: true,
        pdfPageHeightOffset: 0,
        slideNumber: "h.v",
        plugins: [Markdown, Highlight, Zoom, Notes],
      });

      revealRef.current = deck;

      await deck.initialize();

      if (cancelled) return;

      setTotalSlides(deck.getSlides().length);
      setIsReady(true);

      const d = revealRef.current;
      if (d) {
        const indices = d.getIndices();
        setCurrentSlide({ h: indices.h, v: indices.v });
      }

      const onHashChange = () => {
        if (revealRef.current) {
          const indices = revealRef.current.getIndices();
          setCurrentSlide({ h: indices.h, v: indices.v });
        }
      };
      window.addEventListener("hashchange", onHashChange);

      return () => {
        window.removeEventListener("hashchange", onHashChange);
      };
    })().catch((err) => console.error("Failed to initialize Reveal.js:", err));

    return () => {
      cancelled = true;
      if (deck) {
        deck.destroy();
      }
      revealRef.current = null;
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!revealRef.current) return;
      const deck = revealRef.current;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          if (!e.shiftKey) deck.next();
          break;
        case "ArrowLeft":
          if (e.shiftKey) deck.prev();
          break;
        case "ArrowUp":
          deck.prev();
          break;
        case "ArrowDown":
          deck.next();
          break;
        case "Home":
          deck.slide(0);
          break;
        case "End":
          deck.slide(deck.getSlides().length - 1);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "o":
        case "O":
          deck.toggleOverview();
          break;
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            deck.toggleOverview();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isReady) {
    return (
      <div
        className={cn(
          "presentation-container",
          isFullscreen && "fullscreen-presentation",
        )}
        data-presentation
      >
        <div
          className="presentation-loading"
          role="status"
          aria-label="Loading presentation"
        >
          <div className="loading-spinner" />
          <span>Loading presentation...</span>
        </div>
        <div ref={deckRef} className="reveal" style={{ display: "none" }}>
          <div className="slides">
            {slides.map((slide, index) => (
              <Fragment key={index}>{slide}</Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "presentation-container",
        isFullscreen && "fullscreen-presentation",
      )}
      data-presentation
    >
      <div
        ref={deckRef}
        className="reveal"
        role="application"
        aria-label="WildCards Technical Presentation"
      >
        <div className="slides">
          {slides.map((slide, index) => (
            <Fragment key={index}>{slide}</Fragment>
          ))}
        </div>
      </div>

      <ControlBar
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrev={() => revealRef.current?.prev()}
        onNext={() => revealRef.current?.next()}
        onFirst={() => revealRef.current?.slide(0)}
        onLast={() => revealRef.current?.slide(totalSlides - 1)}
        onFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onOverview={() => revealRef.current?.toggleOverview()}
        onDownload={() => {
          const link = document.createElement("a");
          link.href = "/docs/presentation/Project_Presentation.pptx";
          link.download = "WildCards_Technical_Presentation.pptx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        onGitHub={() =>
          window.open(
            "https://github.com/itzbyteglitch/WildCards",
            "_blank",
            "noopener,noreferrer",
          )
        }
        onExit={() => (window.location.href = "/")}
      />
    </div>
  );
}
