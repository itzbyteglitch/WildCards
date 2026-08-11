"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  Minimize,
  Grid,
  Download,
  Github,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlBarProps {
  currentSlide: { h: number; v: number };
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  onOverview: () => void;
  onDownload: () => void;
  onGitHub: () => void;
  onExit: () => void;
}

export function ControlBar({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onFullscreen,
  isFullscreen,
  onOverview,
  onDownload,
  onGitHub,
  onExit,
  }: ControlBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetHideTimer = () => {
    setIsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setIsVisible(false), 3000);
  };

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [currentSlide]);

  const handleMouseMove = () => resetHideTimer();
  const handleMouseLeave = () => setIsVisible(false);
  const handleMouseEnter = () => setIsVisible(true);

  const slideNumber = currentSlide.h + 1;
  const progress = (slideNumber / totalSlides) * 100;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 pointer-events-auto",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      role="toolbar"
      aria-label="Presentation controls"
    >
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="glass rounded-2xl border border-border/60 p-3 flex items-center justify-between gap-4">
          {/* Left controls - Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={onFirst}
              className={cn(controlButton(), "p-2")}
              aria-label="First slide"
              title="First slide (Home)"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onPrev}
              className={cn(controlButton(), "p-2")}
              aria-label="Previous slide"
              title="Previous slide (←)"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Slide counter */}
            <div className="px-3 py-1.5 text-sm font-mono text-foreground/80">
              {slideNumber} / {totalSlides}
            </div>

            <button
              onClick={onNext}
              className={cn(controlButton(), "p-2")}
              aria-label="Next slide"
              title="Next slide (→ or Space)"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={onLast}
              className={cn(controlButton(), "p-2")}
              aria-label="Last slide"
              title="Last slide (End)"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>

          {/* Center - Progress bar */}
          <div className="flex-1 mx-6 flex items-center">
            <div
              className="w-full h-1.5 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Right controls - Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOverview}
              className={cn(controlButton(), "p-2")}
              aria-label="Overview mode"
              title="Overview mode (O)"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={onFullscreen}
              className={cn(controlButton(), "p-2")}
              aria-label="Enter fullscreen"
              title="Enter fullscreen (F)"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onDownload}
              className={cn(controlButton(), "p-2")}
              aria-label="Download PowerPoint"
              title="Download PowerPoint"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onGitHub}
              className={cn(controlButton(), "p-2")}
              aria-label="View source on GitHub"
              title="View source on GitHub"
            >
              <Github className="h-4 w-4" />
            </button>
            <button
              onClick={onExit}
              className={cn(
                controlButton(),
                "p-2",
                "text-destructive hover:bg-destructive/10 hover:text-destructive",
              )}
              aria-label="Exit presentation (Esc)"
              title="Exit presentation (Esc)"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function controlButton() {
  return "flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors min-w-[36px] h-[36px]";
}
