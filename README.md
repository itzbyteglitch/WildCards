# WildCards — UNO Online

> A production-quality, browser-based multiplayer UNO game built with React, TypeScript, and Cloudflare Workers. Play with friends or bots in real time — no downloads, no accounts required.

<p align="center">
  <a href="https://wildcards.itzbyteglitch.qzz.io"><img src="https://img.shields.io/badge/Play_WildCards-FF6B4A?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Play WildCards"></a>
  <a href="https://github.com/ItzByteGlitch/WildCards"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
</p>

## Features

- **Real-time Multiplayer** — WebSocket-powered rooms with Cloudflare Durable Objects
- **Cross-device Sync** — Play across desktop and mobile browsers
- **Smart Bots** — AI opponents with strategic play
- **Guest Login** — Jump in instantly with a username and avatar
- **Room System** — Create private/public rooms and invite by 6-letter code
- **Complete UNO Rules** — Draw, Skip, Reverse, Draw Two, Wild, Wild Draw Four
- **Turn Timer** — Configurable turn limits with visual indicator
- **Score Tracking** — Persistent stats, wins, and leaderboard
- **Dark/Light Mode** — System-aware theming
- **Responsive Design** — Desktop, tablet, and mobile support
- **Accessibility** — Keyboard navigation and screen reader support
- **Free Hosting** — Designed to run on Cloudflare's free tier

## AI-Assisted Development

AI was integrated throughout our development process — from **planning and architecture to coding, debugging, UI refinement, and testing**.

### 01 — Custom AI Agent

Our own AI coding agent, **inspired by Claude Code™**, customized around our development workflow. Currently in **beta and not publicly released**.

### 02 — Multi-Model Engineering

We worked with multiple AI models for different workloads, including **NVIDIA Nemotron 3 Ultra, NVIDIA Nemotron Nano 12B v2 VL, Cohere North Mini Code, Kimi K2.7 Code, MiniMax M3, and ChatGPT**.

### 03 — Automated Review Workflow

We implemented a workflow that **visually inspects the UI and analyzes application logs** to identify errors, inconsistencies, and design imperfections. This helped us continuously refine both **functionality and user experience**.

### AI With Human Oversight

We did not use AI blindly. We **reviewed, tested, verified, and understood its outputs** before integrating them into the project.

> **The skill is not just using AI — it is knowing how to use it correctly, efficiently, and ethically.**

**AI accelerated our development. Human judgment remained responsible for the final decisions.**

## Technologies

### Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF6B4A?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/router)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF6B4A?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge)](https://www.radix-ui.com/)

### Backend & Infrastructure

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Durable Objects](https://img.shields.io/badge/Durable_Objects-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/durable-objects/)
[![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)

### Database & Services

[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

### Tooling

[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-FF6B4A?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/start)

### Project Status

[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![CI](https://img.shields.io/github/actions/workflow/status/itzbyteglitch/WildCards/ci.yml?style=for-the-badge)](https://github.com/itzByteGlitch/WildCards/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-wildcards.itzbyteglitch.qzz.io-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://wildcards.itzbyteglitch.qzz.io)

## Architecture

```mermaid
flowchart LR
    subgraph Frontend["Frontend (React + TypeScript)"]
        direction TB
        Routes["Pages / Routes<br/>(TanStack Router)"]
        UIKit["UI Components<br/>(Radix UI + Tailwind CSS)"]
        State["Client State<br/>(Zustand + TanStack Query)"]
        Engine["Game Engine<br/>(Pure TypeScript, Zero Dependencies)"]
    end

    subgraph Transport["Transport Layer (Auto-Selection)"]
        direction TB
        Factory["Transport Factory<br/>(createTransport)"]
        WS["WebSocket Transport<br/>(Cloudflare Workers + Durable Objects)"]
        SupabaseTransport["Supabase Transport<br/>(Realtime Broadcast)"]
        Broadcast["BroadcastChannel<br/>(Same-Browser Fallback)"]
    end

    subgraph Backend["Backend (Cloudflare)"]
        direction TB
        Workers["Cloudflare Workers<br/>(Hono + Edge Runtime)"]
        DO["Durable Objects<br/>(WebSocket Room Server)"]
        D1["Cloudflare D1<br/>(SQLite Database)"]
    end

    subgraph External["External Services"]
        Supabase["Supabase<br/>(Auth + Realtime + Postgres)"]
    end

    Routes --> Factory
    UIKit --> Factory
    State --> Factory
    Engine --> Factory
    Factory --> WS
    Factory --> SupabaseTransport
    Factory --> Broadcast
    WS --> Workers
    WS --> DO
    Workers --> D1
    SupabaseTransport --> Supabase
```

## Game Engine

The UNO engine (`src/lib/uno/`) is completely decoupled from the UI:

- **Pure TypeScript** — No React, DOM, or side effects
- **Server-authoritative** — Clients send intents; the server validates them
- **Deterministic** — Same seed produces the same shuffle
- **Testable** — Unit-testable without a browser

```typescript
import { createGame, applyAction } from "@/lib/uno/engine";

const seats = [
  { id: "p1", name: "Alice", avatar: "🐱", isBot: false },
  { id: "p2", name: "Bob", avatar: "🤖", isBot: true },
];

const game = createGame(seats);

const { state, error } = applyAction(game, {
  type: "play",
  playerId: "p1",
  cardId: "card_123",
});
```

## Realtime Transport

The transport layer automatically selects the best available backend:

1. **WebSocket + Durable Objects** — If `VITE_REALTIME_WS_URL` is configured
2. **Supabase Broadcast** — If Supabase credentials are present
3. **BroadcastChannel** — Same-browser cross-tab fallback

All transports implement the same `Transport` interface for seamless switching.

## Project Structure

```text
WildCards/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Radix-based design system
│   │   ├── uno-card.tsx     # UNO card component
│   │   ├── game-board.tsx   # Game board layout
│   │   └── site-nav.tsx     # Navigation
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client & auth
│   ├── lib/
│   │   ├── net/             # Transport abstractions
│   │   ├── uno/             # Game engine
│   │   ├── rooms.server.ts
│   │   ├── rooms.functions.ts
│   │   ├── profile.ts
│   │   └── store/           # Client state (Zustand)
│   ├── routes/              # Application routes
│   ├── styles.css
│   └── server.ts
├── worker/
│   └── src/index.ts
├── supabase/
└── public/
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+ (or npm/yarn)
- Cloudflare account for deployment

### Installation

```bash
git clone https://github.com/ItzByteGlitch/WildCards.git
cd WildCards
pnpm install
pnpm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_REALTIME_WS_URL=wss://your-worker.your-subdomain.workers.dev
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## Deployment

### Frontend — Cloudflare Pages

```bash
pnpm run build
npx wrangler pages deploy .output/public --project-name=wildcards
```

### Backend — Cloudflare Workers + Durable Objects

```bash
cd worker
pnpm install
npx wrangler deploy
```

Set `VITE_REALTIME_WS_URL` in your Pages environment variables to the Worker URL.

### Database — Cloudflare D1

```bash
npx wrangler d1 create wildcards
npx wrangler d1 execute wildcards --file=./supabase/migrations/*.sql
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes
4. Push the branch
5. Open a Pull Request

Before submitting, ensure `pnpm lint` and `pnpm typecheck` pass and follow the existing code style.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TanStack](https://tanstack.com/) for the router, query, and start frameworks
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Cloudflare](https://cloudflare.com/) for its infrastructure and free tier
- [Supabase](https://supabase.com/) for realtime infrastructure
- UNO® is a registered trademark of Mattel. This is an unofficial fan project.

---

<p align="center">
  Made by <a href="https://github.com/ItzByteGlitch">ItzByteGlitch (Divyansh Singh Patel)</a>
</p>
