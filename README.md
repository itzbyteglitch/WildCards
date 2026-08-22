# EmbedPPT

EmbedPPT is an open-source SlideKiln-style alternative for converting PowerPoint `.pptx` files into responsive, embeddable web presentations.

The core workflow is fully connected:

```text
Upload PPTX → Convert PPTX to HTML/SVG-style slides → Preview → Publish → Public URL → iframe embed code
```

## Features

- Browser-side PPTX conversion with open-source libraries (`jszip`, DOM parsing, DOMPurify sanitization)
- No mandatory Microsoft/PowerPoint API, paid conversion service, paid VPS, paid database, or credit-card-required backend
- Drag-and-drop PPTX upload and conversion status
- Preview player reused by public and embed routes
- Publish flow that creates `/p/:id` and `/embed/:id` URLs
- Copyable iframe code using the actual deployment domain (`window.location.origin`)
- Responsive presentation player that preserves the original slide aspect ratio
- Mouse, keyboard, touch, and fullscreen navigation
- Optional parameters: `?slide=3`, `?controls=false`, `?loop=true`
- Storage abstraction so localStorage can be swapped for GitHub, R2, S3, KV, or another provider

## Player controls

- Click the leftmost ~30% of a slide to go to the previous slide
- Click the middle/right ~70% to go to the next slide
- `←` = previous
- `→` = next
- `Space` = next
- `Backspace` = previous
- Swipe left/right on mobile
- Direct slide URLs with `?slide=5`
- Fullscreen via the minimal hover controls

## PPTX support

Initially prioritized:

- Text boxes with basic font size/color
- Images embedded in the PPTX
- Basic shapes and simple lines
- Slide backgrounds
- Slide dimensions/aspect ratio
- Hyperlink-safe URL handling in the conversion layer

Unsupported or simplified:

- Animations, transitions, Morph
- SmartArt
- Complex charts
- Audio/video playback
- Highly complex grouped objects and tables may be simplified or warned about

EmbedPPT should warn about unsupported content instead of failing the entire presentation whenever practical.

## Security

PPTX, generated HTML/SVG, and links are treated as untrusted input. The converter sanitizes generated markup with DOMPurify and does not emit arbitrary scripts.

## Development

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:5173`.

## Build and checks

```bash
pnpm run typecheck
pnpm run build
pnpm run lint
```

## Deployment

Deploy the static app to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any CDN/static host. Generated URLs and iframe code use the current browser origin, so production embeds automatically use your deployed domain instead of a hardcoded development URL.

The included `LocalPresentationStorage` is ideal for no-backend demos and self-hosted static exports. For public multi-user publishing, implement the `PresentationStorage` interface in `src/lib/embedppt/storage.ts` using your preferred free or paid storage provider.

## Embedding

Published presentations expose:

```text
https://your-domain/p/abc123
https://your-domain/embed/abc123
```

Example iframe:

```html
<iframe
  src="https://your-domain/embed/abc123"
  width="100%"
  style="aspect-ratio:16/9;border:0"
  allowfullscreen
  loading="lazy"
  title="EmbedPPT presentation"
>
</iframe>
```

Optional parameters can be appended to the embed URL:

```text
?slide=3
?controls=false
?loop=true
```

## License

MIT
