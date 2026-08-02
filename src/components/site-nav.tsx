import { Link } from "@tanstack/react-router";

const links = [
  { to: "/play", label: "Play" },
  { to: "/lobby", label: "Lobby" },
  { to: "/how-to-play", label: "How to Play" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "Profile" },
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
              alt="WildCards"
              className="h-8 w-8 object-cover"
            />
          </span>
          WildCards
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
        </nav>
      </div>
    </header>
  );
}
