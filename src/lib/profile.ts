export interface Profile {
  id: string;
  name: string;
  avatar: string; // emoji
  createdAt: number;
  stats: { games: number; wins: number; losses: number; totalScore: number };
}

const KEY = "uno.profile.v1";
const LB_KEY = "uno.leaderboard.v1";

export const AVATARS = [
  "🦊",
  "🐼",
  "🐸",
  "🐙",
  "🦁",
  "🐧",
  "🐵",
  "🦄",
  "🐲",
  "🦖",
  "🐳",
  "🐝",
];

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function ensureProfile(): Profile {
  const existing = loadProfile();
  if (existing) return existing;
  const p: Profile = {
    id: `u_${Math.random().toString(36).slice(2, 10)}`,
    name: `Player${Math.floor(Math.random() * 9000 + 1000)}`,
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    createdAt: Date.now(),
    stats: { games: 0, wins: 0, losses: 0, totalScore: 0 },
  };
  saveProfile(p);
  return p;
}

export function recordResult(won: boolean, roundScore: number) {
  const p = ensureProfile();
  p.stats.games += 1;
  if (won) p.stats.wins += 1;
  else p.stats.losses += 1;
  p.stats.totalScore += roundScore;
  saveProfile(p);
  pushLeaderboard({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    score: p.stats.totalScore,
    wins: p.stats.wins,
  });
}

export interface LBEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  wins: number;
}
export function loadLeaderboard(): LBEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LB_KEY) ?? "[]");
  } catch {
    return [];
  }
}
export function pushLeaderboard(entry: LBEntry) {
  const all = loadLeaderboard().filter((e) => e.id !== entry.id);
  all.push(entry);
  all.sort((a, b) => b.score - a.score);
  localStorage.setItem(LB_KEY, JSON.stringify(all.slice(0, 50)));
}
