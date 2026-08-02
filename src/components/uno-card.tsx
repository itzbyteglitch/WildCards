import { motion } from "motion/react";
import type { Card } from "@/lib/uno/types";
import { cn } from "@/lib/utils";

const COLOR_BG: Record<string, string> = {
  red: "bg-uno-red",
  yellow: "bg-uno-yellow",
  green: "bg-uno-green",
  blue: "bg-uno-blue",
  wild: "bg-uno-wild",
};

function symbolFor(v: Card["value"]) {
  switch (v) {
    case "skip":
      return "⊘";
    case "reverse":
      return "⇄";
    case "draw2":
      return "+2";
    case "wild":
      return "★";
    case "wild4":
      return "+4";
    default:
      return v;
  }
}

interface Props {
  card?: Card;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg";
  playable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function UnoCard({
  card,
  faceDown,
  size = "md",
  playable,
  selected,
  onClick,
  className,
}: Props) {
  const sizes = {
    sm: "w-10 h-14 text-sm",
    md: "w-16 h-24 text-lg",
    lg: "w-24 h-36 text-2xl",
  }[size];

  if (faceDown || !card) {
    return (
      <div
        className={cn(
          "relative rounded-xl border-2 border-white/10 shadow-lg",
          "bg-gradient-to-br from-slate-800 to-slate-950",
          sizes,
          className,
        )}
      >
        <div className="absolute inset-1.5 rounded-lg border-2 border-white/10 flex items-center justify-center">
          <span
            className="font-display text-white/70 rotate-[-20deg]"
            style={{ fontSize: "1em" }}
          >
            UNO
          </span>
        </div>
      </div>
    );
  }

  const color = card.color as string;
  const isWild = color === "wild";
  const sym = symbolFor(card.value);

  const inner = (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden border-2 shadow-lg select-none",
        "border-white/60 text-white",
        COLOR_BG[color],
        sizes,
        selected && "ring-4 ring-primary ring-offset-2 ring-offset-background",
        playable && !selected && "ring-2 ring-white/50",
        className,
      )}
    >
      {isWild && (
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="bg-uno-red" />
          <div className="bg-uno-yellow" />
          <div className="bg-uno-blue" />
          <div className="bg-uno-green" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-2 rounded-[50%] bg-white/90 rotate-[-20deg]" />
        <span
          className={cn(
            "relative font-display font-bold",
            isWild ? "text-slate-900" : "text-slate-900",
          )}
        >
          {sym}
        </span>
      </div>
      <span
        className="absolute top-1 left-1.5 font-display font-bold leading-none"
        style={{ fontSize: "0.7em" }}
      >
        {sym}
      </span>
      <span
        className="absolute bottom-1 right-1.5 font-display font-bold leading-none rotate-180"
        style={{ fontSize: "0.7em" }}
      >
        {sym}
      </span>
    </div>
  );

  if (!onClick) return inner;
  return (
    <motion.button
      whileHover={playable ? { y: -10, scale: 1.05 } : { y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer disabled:cursor-not-allowed",
        !playable && "opacity-70",
      )}
      disabled={!playable}
    >
      {inner}
    </motion.button>
  );
}
