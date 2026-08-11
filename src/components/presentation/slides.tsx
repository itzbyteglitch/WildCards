"use client";

import type { ReactNode } from "react";

// ── Slide 1: Title ──────────────────────────────────────────────────────────
const Slide1 = (
  <section className="slide">
    <div className="flex flex-col items-start justify-center w-full max-w-4xl px-12">
      <p className="kicker mb-2" style={{ color: "var(--color-uno-yellow)" }}>
        Technical Project Presentation
      </p>
      <h1 className="mb-2">
        <span className="text-foreground">WILD </span>
        <span className="text-uno-red">CARDS</span>
      </h1>
      <p
        className="text-lg font-bold"
        style={{ color: "var(--color-uno-blue)" }}
      >
        Browser Multiplayer UNO — Reimagined for the Web
      </p>
      <p className="mt-2 text-muted">
        A production-quality, real-time card game playable instantly in any
        browser — no downloads, no accounts. Powered by a server-authoritative
        engine and a globally distributed realtime layer.
      </p>
      <div className="flex flex-wrap gap-2 mt-6">
        {[
          "React 19",
          "TypeScript",
          "TanStack Start",
          "Cloudflare Workers",
          "Durable Objects",
          "WebSockets",
          "D1 SQLite",
        ].map((t, i) => (
          <span
            key={t}
            className="tech-chip"
            style={{
              borderColor:
                i % 2 === 0
                  ? "var(--color-uno-blue)"
                  : "var(--color-uno-green)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <p
        className="mt-4 text-sm"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        2–8 players · private rooms · smart bots · cross-device realtime
      </p>
    </div>
  </section>
);

// ── Slide 2: Agenda ─────────────────────────────────────────────────────────
const Slide2 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Presentation outline
      </p>
      <h2 className="mb-6">Agenda</h2>
      <div className="grid grid-cols-2 gap-x-12 gap-y-4 w-full">
        {[
          [
            "01",
            "Overview",
            "What WildCards is and why it exists",
            "var(--color-uno-red)",
          ],
          [
            "02",
            "Problem & Objectives",
            "The gaps it addresses and the goals set",
            "var(--color-uno-yellow)",
          ],
          [
            "03",
            "Key Features",
            "What players actually get",
            "var(--color-uno-green)",
          ],
          [
            "04",
            "Technology Stack",
            "Every layer, framework and library",
            "var(--color-uno-blue)",
          ],
          [
            "05",
            "System Architecture",
            "How the pieces fit together",
            "var(--color-uno-red)",
          ],
          [
            "06",
            "Realtime Transport",
            "The auto-selecting delivery layer",
            "var(--color-uno-yellow)",
          ],
          [
            "07",
            "Game Engine",
            "Server-authoritative UNO rules",
            "var(--color-uno-green)",
          ],
          [
            "08",
            "Data, Auth & Multiplayer Flow",
            "Sessions, persistence, live play",
            "var(--color-uno-blue)",
          ],
          [
            "09",
            "Deployment & CI/CD",
            "Shipping to the edge",
            "var(--color-uno-red)",
          ],
          [
            "10",
            "Performance, Security & Challenges",
            "Hard problems, real answers",
            "var(--color-uno-yellow)",
          ],
          [
            "11",
            "Demo & Next Steps",
            "See it live, then what's next",
            "var(--color-uno-green)",
          ],
        ].map(([num, title, desc, color]) => (
          <div key={num} className="flex items-start gap-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0"
              style={{ background: color, color: "var(--color-background)" }}
            >
              {num}
            </span>
            <div>
              <p className="font-semibold text-foreground mb-0">{title}</p>
              <p className="text-sm text-muted mb-0">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 3: Project Overview ───────────────────────────────────────────────
const Slide3 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        What is WildCards
      </p>
      <h2 className="mb-4">Project Overview</h2>
      <p className="text-muted mb-6">
        <strong className="text-foreground">WildCards</strong> is a
        production-quality, browser-based multiplayer implementation of the
        classic card game UNO. A single invite link drops players straight into
        a live game — the room is created instantly, bots fill empty seats, and
        every move is validated by an authoritative server so the rules can
        never be cheated.
      </p>
      <div className="grid grid-cols-4 gap-4 w-full mb-6">
        {[
          ["2–8", "players per room", "var(--color-uno-red)"],
          ["≈30s", "turn timers keep games moving", "var(--color-uno-yellow)"],
          ["100%", "server-authoritative rules", "var(--color-uno-green)"],
          ["0", "accounts or downloads required", "var(--color-uno-blue)"],
        ].map(([num, label, color]) => (
          <div key={num} className="stat-card">
            <div className="stat-number" style={{ color }}>
              {num}
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
      <div
        className="feature-card w-full"
        style={{ borderColor: "var(--color-uno-yellow)" }}
      >
        <h3>One codebase, three environments</h3>
        <p>
          The frontend runs as a static site; TanStack Start powers SSR and
          type-safe server functions; a Cloudflare Worker + Durable Object hosts
          each room as a globally addressable relay. The same code deploys
          across tabs, browsers and devices.
        </p>
      </div>
    </div>
  </section>
);

// ── Slide 4: Problem Statement ──────────────────────────────────────────────
const Slide4 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Why rebuild a classic game
      </p>
      <h2 className="mb-6">Problem Statement</h2>
      <div className="grid grid-cols-2 gap-6 w-full">
        {[
          [
            "Physical UNO is slow",
            "Setup, shuffling, rule disputes and scorekeeping interrupt the fun. Games can't happen without everyone in the same room.",
            "var(--color-uno-red)",
          ],
          [
            "Real-time multiplayer is hard",
            "State sync, latency, reconnects and fairness are notoriously difficult to get right — most web games cheat by trusting the client.",
            "var(--color-uno-yellow)",
          ],
          [
            "Most web clones feel broken",
            "Dead lobbies, logins required, ads, slow servers, or single-device demos that fall apart under real concurrent play.",
            "var(--color-uno-green)",
          ],
          [
            "Trusting the client breaks the game",
            "A client-authoritative card game can be modified to draw cards, see hands, or win instantly — fair play demands the server make every decision.",
            "var(--color-uno-blue)",
          ],
        ].map(([title, desc, color], i) => (
          <div key={i} className="feature-card">
            <div className="accent-bar" style={{ background: color }} />
            <h3 className="pl-4">{title}</h3>
            <p className="pl-4">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 5: Objectives ────────────────────────────────────────────────────
const Slide5 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Goals that shaped every decision
      </p>
      <h2 className="mb-6">Project Objectives</h2>
      <div className="flex flex-col gap-4 w-full">
        {[
          [
            "01",
            "Instant, frictionless play",
            "One click to start against bots; one invite link to gather friends. No signup, no downloads, no installs.",
            "var(--color-uno-red)",
          ],
          [
            "02",
            "Server-authoritative fairness",
            "Cards are dealt, shuffled and validated on the server. Clients only ever receive their own hand.",
            "var(--color-uno-yellow)",
          ],
          [
            "03",
            "Rock-solid realtime",
            "WebSockets by default, graceful fallbacks, reconnection, and a live poller that keeps every client converged on the same state.",
            "var(--color-uno-green)",
          ],
          [
            "04",
            "A complete UNO ruleset",
            "Draw-2 / Wild+4 stacking chains, missed-UNO penalties, skips, reverses, wild color selection, and automatic turn timeouts.",
            "var(--color-uno-blue)",
          ],
          [
            "05",
            "Professional engineering",
            "Strict TypeScript, deterministic engine, CI pipeline with typecheck + build + lint, and a deployable edge architecture.",
            "var(--color-uno-red)",
          ],
        ].map(([num, title, desc, color]) => (
          <div
            key={num}
            className="feature-card w-full flex-row items-center gap-4"
            style={{ borderColor: color }}
          >
            <span className="text-2xl font-bold shrink-0" style={{ color }}>
              {num}
            </span>
            <div>
              <h3 className="mb-1">{title}</h3>
              <p className="text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 6: Key Features ──────────────────────────────────────────────────
const Slide6 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        What players get
      </p>
      <h2 className="mb-6">Key Features</h2>
      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          [
            "Instant play vs smart bots",
            "Start a match in one click; intelligent bots fill empty seats and follow the same rules as humans.",
            "var(--color-uno-red)",
          ],
          [
            "Private rooms & invite links",
            "A 6-letter code and a shareable URL — up to 8 players join from any device or network.",
            "var(--color-uno-yellow)",
          ],
          [
            "Cross-device realtime",
            "Auto-selecting transport keeps every player in sync with live turn timers and a move log.",
            "var(--color-uno-green)",
          ],
          [
            "Full UNO rule engine",
            "Stacking +2 / +4 chains, missed-UNO penalties, skips, reverses, wild color picker, turn timeouts.",
            "var(--color-uno-blue)",
          ],
          [
            "Stats & leaderboard",
            "Guest profiles track wins, score and history with a global leaderboard — no account required.",
            "var(--color-uno-red)",
          ],
          [
            "Polished, animated UI",
            "Framer-Motion card physics, glassmorphism, dark theme, and full responsive layouts.",
            "var(--color-uno-yellow)",
          ],
        ].map(([title, desc, color]) => (
          <div key={title} className="feature-card">
            <div className="accent-bar" style={{ background: color }} />
            <h3 className="pl-4">{title}</h3>
            <p className="pl-4">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 7: Technology Stack ──────────────────────────────────────────────
const Slide7 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Every layer, framework and library
      </p>
      <h2 className="mb-6">Technology Stack</h2>
      <div className="grid grid-cols-2 gap-8 w-full mb-6">
        <div>
          <h3 className="text-uno-red mb-3">Frontend</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "React 19",
              "TypeScript 5",
              "Vite 8",
              "TanStack Router",
              "TanStack Start",
              "TanStack Query",
              "Zustand",
              "Tailwind CSS 4",
              "Framer Motion",
              "Radix UI",
              "Zod",
              "Recharts",
            ].map((t) => (
              <span key={t} className="tech-chip">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-uno-green mb-3">Backend & Infrastructure</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Cloudflare Workers",
              "Durable Objects",
              "D1 (SQLite)",
              "Hono",
              "WebSockets",
              "Supabase Realtime",
              "BroadcastChannel",
              "JWT auth",
              "Wrangler CLI",
              "GitHub Actions",
            ].map((t) => (
              <span key={t} className="tech-chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="feature-card w-full"
        style={{ borderColor: "var(--color-uno-yellow)" }}
      >
        <h3>Game engine: pure, deterministic TypeScript</h3>
        <p>
          The core UNO logic (deck building, shuffling, turn order, stacking,
          scoring) lives in a zero-dependency TypeScript module. Being
          deterministic, it can run identically on the server for validation and
          in tests for verification.
        </p>
      </div>
    </div>
  </section>
);

// ── Slide 8: System Architecture ───────────────────────────────────────────
const Slide8 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        How the pieces fit together
      </p>
      <h2 className="mb-6">System Architecture</h2>
      <div className="grid grid-cols-3 gap-4 w-full mb-4">
        {[
          [
            "CLIENT",
            "Browser app\nReact 19 UI · TanStack Router\nreads server-authoritative state",
            "var(--color-uno-blue)",
          ],
          [
            "TANSTACK START SERVER",
            "SSR + type-safe Server Functions\nREST actions · guest auth\nwrites to room & DB",
            "var(--color-uno-green)",
          ],
          [
            "ROOM SERVER",
            "Cloudflare Worker + Durable Object\nWebSocket relay · roster\nauthoritative state snapshot",
            "var(--color-uno-red)",
          ],
        ].map(([title, desc, color]) => (
          <div key={title} className="feature-card text-center items-center">
            <h3 className="text-center" style={{ color }}>
              {title}
            </h3>
            <p className="text-sm text-center whitespace-pre-line">{desc}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        {[
          [
            "D1 · SQLITE",
            "profiles · game history · leaderboard · stats",
            "var(--color-uno-yellow)",
          ],
          [
            "AUTH",
            "guest sessions · JWT · localStorage persistence",
            "var(--color-uno-yellow)",
          ],
        ].map(([title, desc, color]) => (
          <div key={title} className="feature-card text-center items-center">
            <h3 className="text-center" style={{ color }}>
              {title}
            </h3>
            <p className="text-sm text-center">{desc}</p>
          </div>
        ))}
      </div>
      <div className="w-full">
        <p className="font-semibold text-foreground mb-2 text-sm">
          REALTIME TRANSPORT — auto-selecting, in priority order
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            [
              "1",
              "WebSocket → Durable Object",
              "Primary path — the Worker relays every event to all connected peers",
              "var(--color-uno-blue)",
            ],
            [
              "2",
              "Supabase Realtime Broadcast",
              "Fallback when the WS origin isn't configured or reachable",
              "var(--color-uno-green)",
            ],
            [
              "3",
              "BroadcastChannel",
              "Same-browser, cross-tab rooms with zero network",
              "var(--color-uno-yellow)",
            ],
          ].map(([num, title, desc, color]) => (
            <div
              key={num}
              className="flow-step flex items-start gap-3"
              style={{ borderColor: color }}
            >
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-1"
                style={{ background: color, color: "var(--color-background)" }}
              >
                {num}
              </span>
              <div>
                <p className="step-title mb-0">{title}</p>
                <p className="step-desc mb-0">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── Slide 9: Frontend Architecture ─────────────────────────────────────────
const Slide9 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        A modern TanStack application
      </p>
      <h2 className="mb-6">Frontend Architecture</h2>
      <div className="flex flex-col gap-3 w-full">
        {[
          [
            "File-based routing",
            "TanStack Router with typed routes — landing, play, lobby, room/:code, leaderboard, profile.",
            "var(--color-uno-red)",
          ],
          [
            "Server Functions",
            "getRoom / joinRoom / submitAction are type-safe RPCs the client calls like local functions.",
            "var(--color-uno-yellow)",
          ],
          [
            "Authored state, live UI",
            "Zustand + React Query cache server state; local mirrors for instant, optimistic interaction.",
            "var(--color-uno-green)",
          ],
          [
            "Component library",
            "Radix UI primitives, Tailwind design tokens, Framer Motion for card play animations.",
            "var(--color-uno-blue)",
          ],
          [
            "Realtime client",
            "A transport abstraction sends 'sync' nudges and reacts to peer messages by re-pulling authoritative state.",
            "var(--color-uno-red)",
          ],
        ].map(([title, desc, color]) => (
          <div
            key={title}
            className="feature-card w-full flex-row items-center gap-4"
            style={{ borderColor: color }}
          >
            <div className="accent-bar" style={{ background: color }} />
            <div className="pl-4">
              <h3 className="mb-1">{title}</h3>
              <p className="text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 10: Backend Architecture ─────────────────────────────────────────
const Slide10 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Cloudflare Workers at the edge
      </p>
      <h2 className="mb-6">Backend Architecture</h2>
      <div className="flex flex-col gap-3 w-full">
        {[
          [
            "One Durable Object per room",
            "Rooms are keyed by code and live as globally addressable, co-located objects — instant, region-aware relay with persistent state.",
            "var(--color-uno-red)",
          ],
          [
            "WebSocket relay",
            "The DO accepts sockets, binds identity to each connection, and fans every message out to the roster. Newcomers and reconnects get a full state snapshot.",
            "var(--color-uno-yellow)",
          ],
          [
            "Identity over the wire",
            "A player can never impersonate another — identity is bound to the socket, and every action must carry the same playerId.",
            "var(--color-uno-green)",
          ],
          [
            "Server functions as the API",
            "Join, start, act and leave are server functions that validate tokens, enforce rules, persist to D1, and return the authoritative state.",
            "var(--color-uno-blue)",
          ],
          [
            "CORS + upgrade handling",
            "The Worker handles OPTIONS and WebSocket upgrades with a single, shared CORS policy.",
            "var(--color-uno-red)",
          ],
        ].map(([title, desc, color]) => (
          <div
            key={title}
            className="feature-card w-full flex-row items-center gap-4"
            style={{ borderColor: color }}
          >
            <div className="accent-bar" style={{ background: color }} />
            <div className="pl-4">
              <h3 className="mb-1">{title}</h3>
              <p className="text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 11: Realtime Transport Layer ─────────────────────────────────────
const Slide11 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Reliability through graceful degradation
      </p>
      <h2 className="mb-4">Realtime Transport Layer</h2>
      <p className="text-muted mb-4">Every client sends two signals:</p>
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-sm">
          <span className="text-uno-green">→</span>{" "}
          <strong className="text-foreground">sync nudges</strong>{" "}
          <span className="text-muted">"something changed, re-pull"</span>
        </p>
        <p className="text-sm">
          <span className="text-uno-yellow">→</span>{" "}
          <strong className="text-foreground">join / leave / hello</strong>{" "}
          <span className="text-muted">roster events</span>
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {[
          [
            "LAYER 1",
            "WebSocket → Durable Object",
            "Primary path. The Worker fans out events to every peer over a persistent socket. Reconnect-safe: newcomers receive the full latest state.",
            "var(--color-uno-red)",
          ],
          [
            "LAYER 2",
            "Supabase Realtime Broadcast",
            "Fallback transport. Broadcasts channeled through Supabase when the WS origin is not deployed or reachable.",
            "var(--color-uno-yellow)",
          ],
          [
            "LAYER 3",
            "BroadcastChannel (same browser)",
            "Local fallback. Cross-tab rooms on the same machine need zero network — perfect for demos and quick multiplayer.",
            "var(--color-uno-green)",
          ],
        ].map(([layer, title, desc, color]) => (
          <div
            key={layer}
            className="feature-card w-full"
            style={{ borderColor: color }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className="tech-chip"
                style={{
                  background: color,
                  color: "var(--color-background)",
                  borderColor: color,
                }}
              >
                {layer}
              </span>
              <h3 className="mb-0">{title}</h3>
            </div>
            <p className="text-sm">{desc}</p>
          </div>
        ))}
      </div>
      <p
        className="mt-4 text-sm"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        A 3-second poller re-pulls authoritative state regardless of transport,
        so clients always converge even if a push is missed.
      </p>
    </div>
  </section>
);

// ── Slide 12: Game Engine ──────────────────────────────────────────────────
const Slide12 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Pure, deterministic TypeScript — zero dependencies
      </p>
      <h2 className="mb-6">Server-Authoritative Game Engine</h2>
      <div className="flex flex-col gap-3 w-full mb-4">
        {[
          [
            "Deterministic core",
            "The same pure functions create games, apply actions and score rounds — the server is the single source of truth.",
            "var(--color-uno-red)",
          ],
          [
            "Strict move validation",
            "Every play is checked: is it this player's turn, is the card legal, is a color chosen for wilds, is the +2/+4 stack respected?",
            "var(--color-uno-yellow)",
          ],
          [
            "Full UNO ruleset",
            "Skip, reverse (acts as skip with 2 players), draw-2 and wild+4 stacking chains, wild color selection, missed-UNO penalty (+2).",
            "var(--color-uno-green)",
          ],
          [
            "Automatic turn timeouts",
            "A 30s timer auto-draws for idle players so games never stall.",
            "var(--color-uno-blue)",
          ],
          [
            "Scoring",
            "Winners bank the face value of every card left in opponents' hands — numbers, 20 for action cards, 50 for wilds.",
            "var(--color-uno-red)",
          ],
        ].map(([title, desc, color]) => (
          <div
            key={title}
            className="feature-card w-full flex-row items-center gap-4"
            style={{ borderColor: color }}
          >
            <div className="accent-bar" style={{ background: color }} />
            <div className="pl-4">
              <h3 className="mb-1">{title}</h3>
              <p className="text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flow-step w-full"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-sm font-mono mb-0">
          <span className="text-uno-green">engine.ts</span>{" "}
          <span className="text-muted">
            createGame() · applyAction() · canPlay() · legalCards() ·
            handleTimeout()
          </span>
        </p>
      </div>
    </div>
  </section>
);

// ── Slide 13: Data, Auth & Multiplayer Flow ────────────────────────────────
const Slide13 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Sessions, persistence and live play
      </p>
      <h2 className="mb-4">Data, Auth & Multiplayer Flow</h2>
      <div className="grid grid-cols-2 gap-8 w-full">
        <div>
          <h3 className="text-foreground mb-3">Guest-first identity</h3>
          <div className="flex flex-col gap-3">
            {[
              [
                "Guest sessions",
                "No signup — a local profile (id, name, avatar) is created on first visit.",
              ],
              [
                "JWT per room",
                "Joining a room returns a token stored in localStorage; every action carries it.",
              ],
              [
                "D1 persistence",
                "Profiles, game history, wins and leaderboard stats are persisted in SQLite.",
              ],
              [
                "Privacy by design",
                "Clients only ever receive their own hand — opponents' cards never leave the server.",
              ],
            ].map(([title, desc]) => (
              <div key={title} className="feature-card">
                <h3 className="mb-1">{title}</h3>
                <p className="text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-foreground mb-3">Live multiplayer loop</h3>
          <div className="flex flex-col gap-2">
            {[
              [
                "1",
                "Create / Join",
                "room code + token",
                "var(--color-uno-blue)",
              ],
              [
                "2",
                "Connect transport",
                "WS / Supabase / BC",
                "var(--color-uno-green)",
              ],
              [
                "3",
                "Dispatch action",
                "play · draw · uno · color",
                "var(--color-uno-yellow)",
              ],
              [
                "4",
                "Engine validates",
                "turn + legality + rules",
                "var(--color-uno-red)",
              ],
              [
                "5",
                "Authoritative state",
                "fan-out to all peers",
                "var(--color-uno-red)",
              ],
            ].map(([num, title, desc, color]) => (
              <div
                key={num}
                className="flow-step flex items-center gap-3"
                style={{ borderColor: color }}
              >
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0"
                  style={{
                    background: color,
                    color: "var(--color-background)",
                  }}
                >
                  {num}
                </span>
                <div>
                  <p className="step-title mb-0">{title}</p>
                  <p className="step-desc mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Slide 14: Deployment & CI/CD ───────────────────────────────────────────
const Slide14 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Ship to the edge, verify every commit
      </p>
      <h2 className="mb-4">Deployment & Continuous Integration</h2>
      <div className="grid grid-cols-2 gap-8 w-full mb-6">
        <div>
          <h3 className="text-foreground mb-3">Deployment targets</h3>
          <div className="flex flex-col gap-3">
            {[
              [
                "Frontend",
                "Cloudflare Pages — static build of the React app, edge-cached, globally distributed.",
                "var(--color-uno-red)",
              ],
              [
                "Backend",
                "Cloudflare Workers — Durable Object room server deployed via wrangler.",
                "var(--color-uno-yellow)",
              ],
              [
                "Realtime",
                "WebSocket origin on the Worker; Supabase channels as fallback.",
                "var(--color-uno-green)",
              ],
              [
                "Database",
                "Cloudflare D1 (SQLite) for profiles, history and leaderboard.",
                "var(--color-uno-blue)",
              ],
            ].map(([title, desc, color]) => (
              <div key={title} className="flex items-start gap-3">
                <span
                  className="tech-chip shrink-0"
                  style={{
                    background: color,
                    color: "var(--color-background)",
                    borderColor: color,
                  }}
                >
                  {title.toUpperCase()}
                </span>
                <p className="text-sm text-muted mb-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-foreground mb-3">CI pipeline — GitHub Actions</h3>
          <div className="flex flex-col gap-3">
            {[
              [
                "Typecheck",
                "tsc --noEmit",
                "strict, no silent type drift",
                "var(--color-uno-blue)",
              ],
              [
                "Build",
                "vite build",
                "production bundle compiles",
                "var(--color-uno-green)",
              ],
              [
                "Lint",
                "eslint .",
                "code quality gates",
                "var(--color-uno-yellow)",
              ],
            ].map(([title, cmd, desc, color]) => (
              <div
                key={title}
                className="feature-card flex-row items-center gap-4"
                style={{ borderColor: color }}
              >
                <div className="accent-bar" style={{ background: color }} />
                <div className="pl-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="mb-0">{title}</h3>
                    <code className="text-xs" style={{ color }}>
                      {cmd}
                    </code>
                  </div>
                  <p className="text-sm mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="feature-card w-full"
        style={{ borderColor: "var(--color-uno-green)" }}
      >
        <h3>One command to deploy</h3>
        <p className="text-sm font-mono">
          cd worker && wrangler deploy — then point VITE_REALTIME_WS_URL at the
          new wss:// origin. The frontend builds and ships independently.
        </p>
      </div>
    </div>
  </section>
);

// ── Slide 15: Gameplay Experience ──────────────────────────────────────────
const Slide15 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        From match setup to the winning card
      </p>
      <h2 className="mb-4">Gameplay Experience</h2>
      <div className="grid grid-cols-2 gap-6 w-full">
        <div className="flex flex-col items-center">
          <img
            src="https://wildcards.itzbyteglitch.qzz.io/play"
            alt="Play page"
            className="slide-image rounded-lg"
            style={{ maxHeight: "40vh" }}
          />
          <p className="text-sm text-muted mt-2 text-center">
            Choose your challenge — bots or a private room
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://wildcards.itzbyteglitch.qzz.io/room/test"
            alt="Game board"
            className="slide-image rounded-lg"
            style={{ maxHeight: "40vh" }}
          />
          <p className="text-sm text-muted mt-2 text-center">
            Live board — opponents, deck, discard pile, turn timer and move log
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ── Slide 16: Rooms & Lobby ────────────────────────────────────────────────
const Slide16 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Gather the crew in seconds
      </p>
      <h2 className="mb-4">Private Rooms & Lobby</h2>
      <div className="grid grid-cols-2 gap-6 w-full mb-4">
        <div className="flex flex-col items-center">
          <img
            src="https://wildcards.itzbyteglitch.qzz.io/lobby"
            alt="Lobby page"
            className="slide-image rounded-lg"
            style={{ maxHeight: "38vh" }}
          />
          <p className="text-sm text-muted mt-2 text-center">
            Create or join a room by 6-letter code
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://wildcards.itzbyteglitch.qzz.io/room/test"
            alt="Room lobby"
            className="slide-image rounded-lg"
            style={{ maxHeight: "38vh" }}
          />
          <p className="text-sm text-muted mt-2 text-center">
            Room lobby — copy invite link, host starts when ready
          </p>
        </div>
      </div>
      <p className="text-sm text-muted">
        <strong className="text-foreground">How it works:</strong> Host opens a
        room → gets a code + link → shares it → players join from any device →
        the host deals the first round.
      </p>
    </div>
  </section>
);

// ── Slide 17: Stats & Progression ──────────────────────────────────────────
const Slide17 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Every game counts
      </p>
      <h2 className="mb-4">Stats & Progression</h2>
      <div className="grid grid-cols-2 gap-6 w-full mb-4">
        <div className="flex flex-col items-center">
          <img
            src="https://wildcards.itzbyteglitch.qzz.io/leaderboard"
            alt="Leaderboard"
            className="slide-image rounded-lg"
            style={{ maxHeight: "38vh" }}
          />
          <p className="text-sm text-muted mt-2 text-center">
            Global leaderboard — win streaks and totals
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://wildcards.itzbyteglitch.qzz.io/profile"
            alt="Profile page"
            className="slide-image rounded-lg"
            style={{ maxHeight: "38vh" }}
          />
          <p className="text-sm text-muted mt-2 text-center">
            Personal profile — games, wins and history
          </p>
        </div>
      </div>
      <p className="text-sm text-muted">
        <strong className="text-foreground">No accounts:</strong> a guest
        profile follows the player across sessions via local storage;
        leaderboard stats are server-persisted in D1.
      </p>
    </div>
  </section>
);

// ── Slide 18: Performance, Security & Reliability ──────────────────────────
const Slide18 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Engineering under pressure
      </p>
      <h2 className="mb-6">Performance, Security & Reliability</h2>
      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          [
            "Performance",
            [
              [
                "Edge-distributed rooms",
                "Durable Objects run close to players; static assets are served from the Cloudflare edge cache.",
              ],
              [
                "Slim realtime protocol",
                "Only 'sync' nudges and roster events travel the wire — state is pulled once, rendered locally.",
              ],
              [
                "Lazy hydration",
                "Client routes hydrate only when needed; animations are GPU-friendly.",
              ],
            ],
            "--color-uno-green",
          ],
          [
            "Security",
            [
              [
                "Server-authoritative",
                "No client trust: dealing, shuffling, legality and scoring all happen server-side.",
              ],
              [
                "Socket-bound identity",
                "Actions carry the same playerId as the socket — impersonation is structurally impossible.",
              ],
              [
                "JWT room tokens",
                "Every room action is authenticated; tokens persist per room in localStorage.",
              ],
              [
                "Hand privacy",
                "A player never receives opponents' cards — the server only broadcasts results.",
              ],
            ],
            "--color-uno-red",
          ],
          [
            "Reliability",
            [
              [
                "Graceful transport fallback",
                "WS → Supabase → BroadcastChannel with a 3s poller that guarantees convergence.",
              ],
              [
                "Reconnect snapshots",
                "Late joiners and reconnects receive the full authoritative state instantly.",
              ],
              [
                "CI enforcement",
                "Typecheck, build and lint gate every commit to prevent regressions.",
              ],
            ],
            "--color-uno-blue",
          ],
        ].map(([title, items, color]) => (
          <div key={title as string} className="flex flex-col gap-2">
            <h3 className="mb-2" style={{ color: color as string }}>
              {title as string}
            </h3>
            {(items as [string, string][]).map(([t, d]) => (
              <div key={t} className="feature-card">
                <div
                  className="accent-bar"
                  style={{ background: color as string }}
                />
                <h3 className="pl-4 text-sm mb-1">{t}</h3>
                <p className="pl-4 text-xs">{d}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 19: Challenges & Solutions ───────────────────────────────────────
const Slide19 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Real problems, engineered answers
      </p>
      <h2 className="mb-6">Challenges & Solutions</h2>
      <div className="flex flex-col gap-3 w-full">
        {[
          [
            "Realtime that survives anything",
            "Fragile single-channel WebSockets.",
            "Built an auto-selecting transport (WS → Supabase → BroadcastChannel) plus a 3s state poller, so clients always converge even when a push is lost.",
            "var(--color-uno-red)",
          ],
          [
            "Cheat-proof multiplayer",
            "Client-authoritative games are trivially hackable.",
            "Moved every decision into a deterministic server engine; clients receive only their own hand and can only nudge peers to re-pull state.",
            "var(--color-uno-yellow)",
          ],
          [
            "Concurrency in card games",
            "Double-plays, stale actions, race conditions.",
            "Room sequence numbers, socket-bound identity, and re-fetch-on-nudge semantics make every action idempotent and self-healing.",
            "var(--color-uno-green)",
          ],
          [
            "Type-safety across the wire",
            "Mismatched client/server contracts.",
            "Zod-validated search params and shared types between client and server functions keep the contract compile-time checked end to end.",
            "var(--color-uno-blue)",
          ],
          [
            "Keep the build green",
            "Every commit risks regressions.",
            "CI runs typecheck, build and lint; a strict ESLint config keeps the pipeline passing.",
            "var(--color-uno-red)",
          ],
        ].map(([title, issue, solution, color]) => (
          <div
            key={title}
            className="feature-card w-full flex-row items-start gap-4"
            style={{ borderColor: color }}
          >
            <div className="accent-bar" style={{ background: color }} />
            <div className="pl-4 flex-1">
              <h3 className="mb-1">{title}</h3>
              <p className="text-xs mb-1">
                <strong className="text-uno-red">Issue:</strong>{" "}
                <span className="text-muted">{issue}</span>
              </p>
              <p className="text-xs mb-0">
                <strong className="text-uno-green">Solution:</strong>{" "}
                <span className="text-muted">{solution}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 20: Future Scope ─────────────────────────────────────────────────
const Slide20 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        Where WildCards goes next
      </p>
      <h2 className="mb-6">Future Scope</h2>
      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          [
            "Accounts & OAuth",
            "Let players claim their guest profile with email or social login and sync stats across devices.",
            "var(--color-uno-red)",
          ],
          [
            "Matchmaking & ladder",
            "Ranked queues, ELO-style ratings and seasonal leaderboards for competitive play.",
            "var(--color-uno-yellow)",
          ],
          [
            "AI difficulty tiers",
            "Smarter bots with personality: aggressive, defensive and classic-strategy models.",
            "var(--color-uno-green)",
          ],
          [
            "Mobile-first & PWA",
            "Installable offline shell, touch-optimized controls, and push-friendly room invites.",
            "var(--color-uno-blue)",
          ],
          [
            "Tournaments",
            "Brackets, timed events and custom house rules for organized play.",
            "var(--color-uno-red)",
          ],
          [
            "Spectator mode",
            "Watch live rooms with a full move history and commentary.",
            "var(--color-uno-yellow)",
          ],
        ].map(([title, desc, color]) => (
          <div key={title} className="feature-card">
            <div className="accent-bar" style={{ background: color }} />
            <h3 className="pl-4">{title}</h3>
            <p className="pl-4">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 21: Demo ─────────────────────────────────────────────────────────
const Slide21 = (
  <section className="slide">
    <div className="flex flex-col items-start w-full max-w-5xl px-12">
      <p className="kicker" style={{ color: "var(--color-primary)" }}>
        See it in action
      </p>
      <h2 className="mb-4">Live Demo</h2>
      <p className="text-foreground font-semibold mb-4">
        What we'll run through:
      </p>
      <div className="flex flex-col gap-3 w-full mb-6">
        {[
          [
            "1",
            "Start a game vs bots",
            "One click — bots fill the table and the first hand is dealt.",
            "var(--color-uno-red)",
          ],
          [
            "2",
            "Open a private room",
            "Create a room, copy the invite link, join from a second tab/device.",
            "var(--color-uno-yellow)",
          ],
          [
            "3",
            "Play a full turn",
            "Legal plays, wild color choice, draw, and the live turn timer.",
            "var(--color-uno-green)",
          ],
          [
            "4",
            "Trigger an edge case",
            "Say UNO late, start a +2 / +4 chain, and watch the server enforce it.",
            "var(--color-uno-blue)",
          ],
          [
            "5",
            "Check the scoreboard",
            "Finish a round and see the profile + leaderboard update.",
            "var(--color-uno-red)",
          ],
        ].map(([num, title, desc, color]) => (
          <div
            key={num}
            className="flow-step flex items-center gap-3"
            style={{ borderColor: color }}
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0"
              style={{ background: color, color: "var(--color-background)" }}
            >
              {num}
            </span>
            <div>
              <p className="step-title mb-0">{title}</p>
              <p className="step-desc mb-0">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="feature-card w-full"
        style={{ borderColor: "var(--color-uno-blue)" }}
      >
        <h3>Run locally</h3>
        <p className="text-sm font-mono mb-0">
          pnpm dev — then open http://localhost:3000 and pick Play vs Bots or
          Create a Room.
        </p>
      </div>
    </div>
  </section>
);

// ── Slide 22: Thank You ────────────────────────────────────────────────────
const Slide22 = (
  <section className="slide">
    <div className="flex flex-col items-center justify-center w-full text-center">
      <h1 className="mb-4">THANK YOU</h1>
      <p className="text-xl mb-4" style={{ color: "var(--color-uno-yellow)" }}>
        Questions welcome
      </p>
      <p className="text-muted mb-6">
        WildCards — browser multiplayer UNO, reimagined for the web.
      </p>
      <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        React 19 · TypeScript · TanStack Start · Cloudflare Workers · Durable
        Objects · D1 · WebSockets
      </p>
    </div>
  </section>
);

// ── Export ──────────────────────────────────────────────────────────────────
export const slides: ReactNode[] = [
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
  Slide14,
  Slide15,
  Slide16,
  Slide17,
  Slide18,
  Slide19,
  Slide20,
  Slide21,
  Slide22,
];
