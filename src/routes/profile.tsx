import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  AVATARS,
  ensureProfile,
  saveProfile,
  type Profile,
} from "@/lib/profile";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/hydrated";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — WildCards" },
      {
        name: "description",
        content: "Manage your WildCards name, avatar and view your stats.",
      },
      { property: "og:title", content: "WildCards — Profile" },
      {
        property: "og:description",
        content: "Manage your UNO player profile.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const hydrated = useHydrated();
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    if (hydrated) setP(ensureProfile());
  }, [hydrated]);

  if (!hydrated || !p)
    return (
      <div className="p-10 text-center text-muted-foreground">Loading…</div>
    );

  const update = (patch: Partial<Profile>) => {
    const next = { ...p, ...patch };
    setP(next);
    saveProfile(next);
  };
  const wr = p.stats.games
    ? Math.round((p.stats.wins / p.stats.games) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-display font-bold">Profile</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <Card className="p-6 card-elevated">
          <label className="text-sm text-muted-foreground">Display name</label>
          <Input
            value={p.name}
            maxLength={20}
            onChange={(e) =>
              update({
                name: e.target.value.replace(/[^\w\s.-]/g, "").slice(0, 20),
              })
            }
          />
          <Button
            size="sm"
            className="mt-3"
            onClick={() => toast.success("Saved")}
          >
            Save
          </Button>

          <label className="text-sm text-muted-foreground mt-6 block">
            Avatar
          </label>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => update({ avatar: a })}
                className={cn(
                  "h-11 rounded-lg text-2xl bg-accent hover:bg-accent/70",
                  p.avatar === a && "ring-2 ring-primary",
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 card-elevated">
          <h2 className="font-display text-lg font-semibold">Stats</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat label="Games" v={p.stats.games} />
            <Stat label="Wins" v={p.stats.wins} />
            <Stat label="Losses" v={p.stats.losses} />
            <Stat label="Win rate" v={`${wr}%`} />
            <Stat label="Total score" v={p.stats.totalScore} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string | number }) {
  return (
    <div className="rounded-lg bg-accent/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-bold">{v}</div>
    </div>
  );
}
