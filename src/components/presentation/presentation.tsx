"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/lib/hydrated";
import { Github, ExternalLink } from "lucide-react";

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
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-2xl">
          <div className="w-24 h-24 mx-auto bg-uno-red rounded-2xl flex items-center justify-center">
            <ExternalLink className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            WildCards Technical Presentation
          </h2>
          <p className="text-muted-foreground">
            A 22-slide technical presentation covering the WildCards
            browser-based multiplayer UNO game architecture.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() =>
                window.open(
                  "https://itzbyteglitch.my.canva.site/dahr9oitr9i",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="View Presentation on Canva"
            >
              <ExternalLink className="h-4 w-4" />
              View Presentation
            </button>
            <button
              onClick={() =>
                window.open(GITHUB_REPO_URL, "_blank", "noopener,noreferrer")
              }
              className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors border border-border"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </button>
          </div>
        </div>
      </div>

      {!isFullscreen && (
        <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
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
