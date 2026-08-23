import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useAnimationControls } from "motion/react";
import { UnoCard } from "@/components/uno-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Bot, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WildCards — Play the classic card game" },
      {
        name: "description",
        content:
          "Play UNO in your browser with friends or bots. Free, fast, and beautifully polished.",
      },
      {
        property: "og:title",
        content: "WildCards — Play the classic card game",
      },
      {
        property: "og:description",
        content:
          "Play UNO in your browser with friends or bots. Free, fast, and beautifully polished.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const headingControls = useAnimationControls();
  const cardsControls = useAnimationControls();

  React.useEffect(() => {
    // Start the homepage hero animations explicitly on the client.
    // This makes them run on a fresh load/refresh as well as route navigation.
    void headingControls.start({ opacity: 1, y: 0 });
    void cardsControls.start({ opacity: 1, scale: 1 });
  }, [headingControls, cardsControls]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={headingControls}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-display font-bold leading-[1.05]"
          >
            The classic card game,
            <br />
            <span className="bg-gradient-to-r from-primary to-uno-blue bg-clip-text text-transparent">
              reimagined for the web.
            </span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Jump into a match against smart bots, or spin up a private room and
            invite friends with a single link. No downloads. No accounts
            required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="btn-gradient">
              <Link to="/play">
                Play vs Bots <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/lobby">Create a Room</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <Feature icon={<Bot className="h-4 w-4" />} label="Smart bots" />
            <Feature icon={<Users className="h-4 w-4" />} label="2–8 players" />
            <Feature icon={<Zap className="h-4 w-4" />} label="Instant rooms" />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={cardsControls}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative h-[380px]"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-uno-blue/10 blur-3xl" />
          <div className="relative flex items-center justify-center h-full">
            {[
              {
                c: { id: "1", color: "red" as const, value: "7" as const },
                r: -18,
                x: -110,
              },
              {
                c: {
                  id: "2",
                  color: "yellow" as const,
                  value: "skip" as const,
                },
                r: -6,
                x: -55,
              },
              {
                c: { id: "3", color: "blue" as const, value: "draw2" as const },
                r: 6,
                x: 0,
              },
              {
                c: { id: "4", color: "wild" as const, value: "wild4" as const },
                r: 18,
                x: 55,
              },
              {
                c: { id: "5", color: "green" as const, value: "3" as const },
                r: 30,
                x: 110,
              },
            ].map((it, i) => (
              <motion.div
                key={it.c.id}
                initial={{ y: 80, opacity: 0, x: it.x, rotate: it.r }}
                animate={{ y: 0, opacity: 1, x: it.x, rotate: it.r }}
                transition={{
                  delay: 0.25 + i * 0.1,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute"
              >
                <UnoCard card={it.c} size="lg" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mt-24 grid md:grid-cols-3 gap-6">
        {[
          {
            t: "Play instantly",
            d: "One click to start a match. Bots fill empty seats.",
          },
          {
            t: "Invite friends",
            d: "Share a 6-letter code. Cross-tab rooms work today; wire a Worker + DO for global rooms.",
          },
          {
            t: "Track your stats",
            d: "Local profile, wins, score, and leaderboard — no signup required.",
          },
        ].map((f) => (
          <div key={f.t} className="card-elevated p-6">
            <h3 className="font-display text-lg font-semibold">{f.t}</h3>
            <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent">
        {icon}
      </span>
      {label}
    </div>
  );
}
