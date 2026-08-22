import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Globe2, Copy, ExternalLink, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { convertPptx } from "@/lib/embedppt/converter";
import { deploymentOrigin, storage } from "@/lib/embedppt/storage";
import type { EmbedPptDeck } from "@/lib/embedppt/types";
import { PresentationPlayer } from "@/components/embedppt/player";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EmbedPPT — PPTX to embeddable web presentations" },
      {
        name: "description",
        content:
          "Convert PowerPoint PPTX files in your browser into static embeddable web presentations.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [deck, setDeck] = React.useState<EmbedPptDeck | null>(null);
  const [status, setStatus] = React.useState("Drop a .pptx to begin");
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const origin = deploymentOrigin();
  const iframe = deck
    ? `<iframe\n  src="${origin}/embed/${deck.id}"\n  width="100%"\n  style="aspect-ratio:${Math.round(deck.width)}/${Math.round(deck.height)};border:0"\n  allowfullscreen\n  loading="lazy"\n  title="EmbedPPT presentation">\n</iframe>`
    : "";
  async function handle(file?: File) {
    if (!file) return;
    setBusy(true);
    setProgress(20);
    setStatus("Reading PPTX package…");
    try {
      const converted = await convertPptx(file);
      setProgress(75);
      setStatus("Sanitizing and preparing preview…");
      setDeck(converted);
      setStatus("Preview ready. Publish to create share links.");
      setProgress(100);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Conversion failed");
      setProgress(0);
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    if (!deck) return;
    await storage.save(deck);
    setStatus(
      "Published locally. URLs use this deployment domain and can be opened or embedded.",
    );
  }
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setStatus("Copied to clipboard.");
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-18">
      <section className="grid gap-10 md:grid-cols-[1.05fr_.95fr] md:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
            Open-source SlideKiln-style publishing
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
            EmbedPPT turns PowerPoint into{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
              web embeds.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Upload a PPTX, convert it locally in the browser to sanitized
            HTML/SVG-style slides, preview with the same responsive player used
            for publishing, then copy a public URL or iframe.
          </p>
          <div className="mt-7 flex gap-3">
            <Button asChild size="lg" className="btn-gradient">
              <a href="#upload">Convert a PPTX</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="/docs">Read docs</a>
            </Button>
          </div>
        </div>
        <div id="upload" className="card-elevated p-6">
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void handle(e.dataTransfer.files[0]);
            }}
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-8 text-center hover:bg-primary/10"
          >
            <FileUp className="mb-4 h-12 w-12 text-primary" />
            <span className="font-display text-2xl font-semibold">
              Drop your .pptx here
            </span>
            <span className="mt-2 text-sm text-muted-foreground">
              or click to choose a PowerPoint file
            </span>
            <input
              className="sr-only"
              type="file"
              accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={(e) => void handle(e.target.files?.[0])}
            />
          </label>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{status}</span>
              {busy && <Upload className="h-4 w-4 animate-pulse" />}
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </section>
      {deck && (
        <section className="mt-12 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold">
                Preview: {deck.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {deck.slides.length} slides · aspect ratio{" "}
                {Math.round(deck.width)}:{Math.round(deck.height)}
              </p>
            </div>
            <Button onClick={publish} className="btn-gradient">
              <Globe2 className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
          <PresentationPlayer deck={deck} />
          {deck.warnings.length > 0 && (
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-100">
              {deck.warnings.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <ShareCard
              title="Presentation URL"
              value={`${origin}/p/${deck.id}`}
              onCopy={copy}
            />
            <ShareCard
              title="Embed URL"
              value={`${origin}/embed/${deck.id}`}
              onCopy={copy}
            />
            <div className="card-elevated p-4 md:col-span-2">
              <div className="mb-2 font-semibold">Iframe embed code</div>
              <textarea
                readOnly
                className="min-h-36 w-full rounded-lg border border-input bg-background p-3 font-mono text-sm"
                value={iframe}
              />
              <div className="mt-3 flex gap-2">
                <Button onClick={() => copy(iframe)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Embed Code
                </Button>
                <Button asChild variant="secondary">
                  <a href={`/p/${deck.id}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Presentation
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a href={`/embed/${deck.id}`} target="_blank">
                    Open Embed
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
function ShareCard({
  title,
  value,
  onCopy,
}: {
  title: string;
  value: string;
  onCopy: (v: string) => void;
}) {
  return (
    <div className="card-elevated p-4">
      <div className="mb-2 font-semibold">{title}</div>
      <div className="break-all rounded-lg bg-background p-3 font-mono text-sm text-muted-foreground">
        {value}
      </div>
      <Button
        className="mt-3"
        variant="secondary"
        onClick={() => onCopy(value)}
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
    </div>
  );
}
