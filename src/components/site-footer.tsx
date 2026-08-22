export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 glass">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm text-muted-foreground">
        <a
          href="https://github.com/itzbyteglitch/EmbedPPT"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground/90 underline decoration-primary/70 underline-offset-4 transition-colors hover:text-primary"
        >
          EmbedPPT © 2026
        </a>{" "}
        |{" "}
        <a
          href="https://github.com/itzbyteglitch"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground/90 underline decoration-primary/70 underline-offset-4 transition-colors hover:text-primary"
        >
          Made by ItzByteGlitch (Divyansh Singh Patel)
        </a>
      </div>
    </footer>
  );
}
