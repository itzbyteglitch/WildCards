import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/docs")({ component: Docs });
function Docs() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 prose prose-invert">
      <h1>EmbedPPT documentation</h1>
      <p>
        EmbedPPT converts PPTX files in the browser using open-source JavaScript
        libraries. No Microsoft API, paid conversion API, backend database, or
        credit card is required for the core workflow.
      </p>
      <h2>Supported today</h2>
      <ul>
        <li>Slide size/aspect ratio and backgrounds</li>
        <li>Text boxes with basic sizing/color</li>
        <li>Images embedded in the PPTX</li>
        <li>Basic filled shapes and simple lines</li>
        <li>
          Direct links: <code>/p/:id?slide=3</code> and{" "}
          <code>/embed/:id?controls=false&amp;loop=true</code>
        </li>
      </ul>
      <h2>Unsupported or simplified</h2>
      <ul>
        <li>
          Animations, Morph, transitions, media playback, SmartArt, and complex
          charts are not claimed as supported.
        </li>
        <li>
          Tables/groups are detected where practical but may be simplified.
        </li>
      </ul>
      <h2>Deployment</h2>
      <p>
        Deploy the static app to GitHub Pages, Cloudflare Pages, Netlify, or any
        CDN. The generated iframe uses <code>window.location.origin</code>, so
        links automatically use your deployed domain.
      </p>
      <h2>Storage abstraction</h2>
      <p>
        The current implementation ships a localStorage provider for free static
        hosting. Replace <code>PresentationStorage</code> in{" "}
        <code>src/lib/embedppt/storage.ts</code> with GitHub-backed, R2, S3, KV,
        or filesystem storage when you need multi-user public persistence.
      </p>
      <h2>Security</h2>
      <p>
        PPTX-derived HTML is sanitized before rendering. JavaScript URLs are
        blocked and arbitrary scripts are not emitted.
      </p>
    </div>
  );
}
