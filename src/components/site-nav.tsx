import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

const links = [
  { to: "/", label: "Converter" },
  { to: "/docs", label: "Docs" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <img
              src="/logo.png"
              alt="EmbedPPT"
              className="h-8 w-8 object-cover"
            />
          </span>
          EmbedPPT
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              activeProps={{
                className: "px-3 py-1.5 rounded-md text-foreground bg-accent",
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/itzbyteglitch/EmbedPPT"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Source</span>
            <span className="sm:hidden">Source</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
