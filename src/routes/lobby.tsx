import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

export const Route = createFileRoute("/lobby")({
  head: () => ({
    meta: [
      { title: "Lobby — WildCards" },
      {
        name: "description",
        content: "Create a private UNO room or join one with an invite code.",
      },
      { property: "og:title", content: "WildCards — Lobby" },
      {
        property: "og:description",
        content: "Create or join a private UNO room.",
      },
    ],
  }),
  component: Lobby,
});

function Lobby() {
  const nav = useNavigate();
  const [code, setCode] = useState("");

  const create = () => {
    const c = genCode();
    nav({ to: "/room/$code", params: { code: c }, search: { host: 1 } });
  };
  const join = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) return;
    nav({ to: "/room/$code", params: { code: c }, search: { host: 0 } });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-display font-bold">Lobby</h1>
      <p className="mt-2 text-muted-foreground">
        Cross-tab rooms via BroadcastChannel work today. Wire a Cloudflare
        Worker + Durable Object to the{" "}
        <code className="text-xs">Transport</code> interface in{" "}
        <code>src/lib/net/transport.ts</code> for global multiplayer.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card className="p-6 card-elevated">
          <h2 className="font-display text-xl font-semibold">Create room</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Spin up a fresh room and share the code with friends.
          </p>
          <Button className="mt-4 btn-gradient w-full" onClick={create}>
            Create private room
          </Button>
        </Card>
        <Card className="p-6 card-elevated">
          <h2 className="font-display text-xl font-semibold">Join room</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-letter code you were sent.
          </p>
          <div className="mt-4 flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={8}
              className="uppercase font-mono tracking-widest text-center"
            />
            <Button onClick={join}>Join</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
