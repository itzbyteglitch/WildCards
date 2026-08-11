"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/lib/hydrated";

const CANVA_DESIGN_ID = "DAHRy7Fmzy4";
const CANVA_VIEW_URL = `https://www.canva.com/design/${CANVA_DESIGN_ID}/view`;

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
        allow="clipboard-write; clipboard-copy; encrypted-media; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
