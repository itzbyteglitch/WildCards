# WildCards — UNO Online

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript--blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React--61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite--646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS--38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router--FF6B4A?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/router)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query--FF6B4A?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand--000000?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers--F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1--F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages--F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Supabase](https://img.shields.io/badge/Supabase--3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![WebSockets](https://img.shields.io/badge/WebSockets--010101?style=for-the-badge&logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![Durable Objects](https://img.shields.io/badge/Durable_Objects--F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/durable-objects/)
[![ESLint](https://img.shields.io/badge/ESLint--4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier--F7B93E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![Node.js](https://img.shields.io/badge/Node.js--339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm--F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![CI](https://img.shields.io/github/actions/workflow/status/itzbyteglitch/WildCards/ci.yml?style=for-the-badge)](https://github.com/itzbyteglitch/WildCards/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-wildcards.itzbyteglitch.qzz.io-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://wildcards.itzbyteglitch.qzz.io)

A production-quality, browser-based multiplayer UNO game built with React, TypeScript, and Cloudflare Workers. Play with friends or bots in real-time — no downloads, no accounts required.

## Features

- **Real-time Multiplayer** — WebSocket-powered rooms with Cloudflare Durable Objects
- **Cross-device Sync** — Play across desktop and mobile browsers
- **Smart Bots** — AI opponents with strategic play
- **Guest Login** — Jump in instantly with a username and avatar
- **Room System** — Create private/public rooms, invite by 6-letter code
- **Complete UNO Rules** — Draw, Skip, Reverse, Draw Two, Wild, Wild Draw Four
- **Turn Timer** — Configurable turn limits with visual indicator
- **Score Tracking** — Persistent stats, wins, leaderboard
- **Dark/Light Mode** — System-aware theming
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Accessibility** — Keyboard navigation, screen reader support
- **Free Hosting** — Runs entirely on Cloudflare's free tier

## Tech Stack

| Category       | Technologies                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Zustand, Tailwind CSS 4, Framer Motion, Radix UI |
| **Backend**    | Cloudflare Workers, Durable Objects, D1 (SQLite), Hono                                                        |
| **Database**   | Cloudflare D1 (primary), Supabase (realtime fallback)                                                         |
| **Realtime**   | WebSockets (Durable Objects), Supabase Broadcast, BroadcastChannel (fallback)                                 |
| **Auth**       | Guest sessions, JWT tokens, Supabase Auth ready                                                               |
| **Deployment** | Cloudflare Pages (frontend), Cloudflare Workers (backend)                                                     |
| **Tooling**    | ESLint, Prettier, TypeScript, TanStack Start                                                                  |

## Architecture

```mermaid
flowchart LR
    subgraph Frontend["🌐 Frontend (React + TypeScript)"]
        direction TB
        Routes["📄 Pages / Routes<br/>(TanStack Router)"]
        UIKit["🎨 UI Components<br/>(Radix UI + Tailwind CSS)"]
        State["📦 Client State<br/>(Zustand + TanStack Query)"]
        Engine["🎮 Game Engine<br/>(Pure TypeScript, Zero Dependencies)"]
    end

    subgraph Transport["🔌 Transport Layer (Auto-Selection)"]
        direction TB
        TransportFactory["⚙️ Transport Factory<br/>(createTransport)"]
        WS["🔌 WebSocket Transport<br/>(Cloudflare Workers + Durable Objects)"]
        SupabaseTransport["📡 Supabase Transport<br/>(Realtime Broadcast)"]
        BroadcastTransport["📻 BroadcastChannel Transport<br/>(Same-Browser Fallback)"]
    end

    subgraph Backend["☁️ Backend (Cloudflare)"]
        direction TB
        Workers["⚡ Cloudflare Workers<br/>(Hono + Edge Runtime)"]
        DurableObjects["🏗️ Durable Objects<br/>(WebSocket Room Server)"]
        D1["💾 Cloudflare D1<br/>(SQLite Database)"]
    end

    subgraph External["🔗 External Services"]
        direction TB
        Supabase["🗄️ Supabase<br/>(Auth + Realtime + Postgres)"]
    end

    Routes --> TransportFactory
    UIKit --> TransportFactory
    State --> TransportFactory
    Engine --> TransportFactory
    TransportFactory --> WS
    TransportFactory --> SupabaseTransport
    TransportFactory --> BroadcastTransport
    WS --> Workers
    WS --> DurableObjects
    Workers --> D1
    SupabaseTransport --> Supabase
    Supabase --> D1

    classDef frontend fill:#61DAFB,color:#000,stroke:#1E90FF,stroke-width:2px;
    classDef transport fill:#FF6B4A,color:#fff,stroke:#E55A3A,stroke-width:2px;
    classDef backend fill:#F38020,color:#fff,stroke:#D97706,stroke-width:2px;
    classDef external fill:#3ECF8E,color:#000,stroke:#2AA86E,stroke-width:2px;
    classDef factory fill:#A855F7,color:#fff,stroke:#9333EA,stroke-width:2px;
    class Routes,UIKit,State,Engine frontend;
    class TransportFactory factory;
    class WS,SupabaseTransport,BroadcastTransport transport;
    class Workers,DurableObjects,D1 backend;
    class Supabase external;
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+ (or npm/yarn)
- Cloudflare account (for deployment)

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

## Project Structure

```
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
│   │   │   ├── transport.ts
│   │   │   ├── create-transport.ts
│   │   │   ├── websocket-transport.ts
│   │   │   ├── supabase-transport.ts
│   │   │   └── broadcast-transport.ts
│   │   ├── uno/             # Game engine (pure TypeScript)
│   │   │   ├── types.ts
│   │   │   ├── deck.ts
│   │   │   ├── engine.ts
│   │   │   ├── bot.ts
│   │   │   └── redact.ts
│   │   ├── rooms.server.ts
│   │   ├── rooms.functions.ts
│   │   ├── profile.ts
│   │   └── store/           # Client state (Zustand)
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── play.tsx
│   │   ├── lobby.tsx
│   │   ├── room.$code.tsx
│   │   ├── profile.tsx
│   │   ├── leaderboard.tsx
│   │   └── how-to-play.tsx
│   ├── styles.css
│   └── server.ts
├── worker/
│   └── src/index.ts
├── supabase/
└── public/
```

## Game Engine

The UNO engine (`src/lib/uno/`) is completely decoupled from the UI:

- **Pure TypeScript** — No React, no DOM, no side effects
- **Server-authoritative** — Clients send intents, server validates
- **Deterministic** — Same seed = same shuffle
- **Testable** — Unit testable without browser

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

1. **WebSocket (Durable Objects)** — If `VITE_REALTIME_WS_URL` configured
2. **Supabase Broadcast** — If Supabase credentials present
3. **BroadcastChannel** — Same-browser cross-tab fallback

All implement the same `Transport` interface for seamless switching.

## Deployment

### Frontend (Cloudflare Pages)

```bash
pnpm run build
npx wrangler pages deploy .output/public --project-name=wildcards
```

### Backend (Cloudflare Workers + Durable Objects)

```bash
cd worker
pnpm install
npx wrangler deploy
```

Set `VITE_REALTIME_WS_URL` in your Pages environment variables to the Worker URL.

### Database (Cloudflare D1)

```bash
npx wrangler d1 create wildcards
npx wrangler d1 execute wildcards --file=./supabase/migrations/*.sql
```

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start dev server         |
| `pnpm build`     | Production build         |
| `pnpm preview`   | Preview production build |
| `pnpm lint`      | Run ESLint               |
| `pnpm format`    | Format with Prettier     |
| `pnpm typecheck` | TypeScript type checking |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- Code passes `pnpm lint` and `pnpm typecheck`
- New features include tests where applicable
- Follow the existing code style (Prettier handles formatting)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TanStack](https://tanstack.com/) for the excellent router, query, and start frameworks
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Cloudflare](https://cloudflare.com/) for the generous free tier
- [Supabase](https://supabase.com/) for realtime infrastructure
- UNO® is a registered trademark of Mattel. This is an unofficial fan project.

---

<p align="center">
  Made by <a href="https://github.com/ItzByteGlitch">ItzByteGlitch (Divyansh Singh Patel)</a>
</p>
