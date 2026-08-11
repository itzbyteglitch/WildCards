"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/lib/hydrated";
import { Github } from "lucide-react";

const CANVA_VIEW_URL = "https://itzbyteglitch.my.canva.site/dahr9oitr9i";
const GITHUB_REPO_URL = "https://github.com/itzbyteglitch/WildCards";
const GITHUB_PROFILE_URL = "https://github.com/itzbyteglitch";

export function Presentation() {
  const hydrated = useHydrated();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "f":
        case "F":
          e.preventDefault();
          e.stopPropagation();
          setIsFullscreen((prev) => !prev);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div
        className="presentation-loading"
        role="status"
        aria-label="Loading presentation"
      >
        <div className="loading-spinner" />
        <span>Loading presentation...</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[80vh] ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-full" : ""
      }`}
      data-presentation
    >
      <iframe
        src={`${CANVA_VIEW_URL}?embed`}
        title="WildCards Technical Presentation"
        className="w-full h-full border-0"
        allowFullScreen
        allow="clipboard-write; encrypted-media; picture-in-picture"
        loading="lazy"
      />

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() =>
            window.open(GITHUB_REPO_URL, "_blank", "noopener,noreferrer")
          }
          className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors border border-border"
          aria-label="View on GitHub"
        >
          <Github className="h-4 w-4" />
          View on GitHub
        </button>
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="inline-flex items-center justify-center rounded-lg bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors border border-border"
            aria-label="Exit fullscreen"
          >
            ✕
          </button>
        )}
      </div>

      {!isFullscreen && (
        <footer className="mt-4 text-center text-sm text-muted-foreground">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            WildCards © 2026
          </a>
          {" | "}
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Made by ItzByteGlitch (Divyansh Singh Patel)
          </a>
        </footer>
      )}
    </div>
  );
}
