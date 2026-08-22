import type { EmbedPptDeck } from "./types";

const PREFIX = "embedppt:deck:";
const INDEX = "embedppt:index";
export interface PresentationStorage {
  save(deck: EmbedPptDeck): Promise<void>;
  get(id: string): Promise<EmbedPptDeck | null>;
  list(): Promise<string[]>;
}

export class LocalPresentationStorage implements PresentationStorage {
  async save(deck: EmbedPptDeck) {
    localStorage.setItem(PREFIX + deck.id, JSON.stringify(deck));
    const ids = await this.list();
    localStorage.setItem(
      INDEX,
      JSON.stringify(
        [deck.id, ...ids.filter((id) => id !== deck.id)].slice(0, 25),
      ),
    );
  }
  async get(id: string) {
    const raw = localStorage.getItem(PREFIX + id);
    return raw ? (JSON.parse(raw) as EmbedPptDeck) : null;
  }
  async list() {
    try {
      return JSON.parse(localStorage.getItem(INDEX) || "[]") as string[];
    } catch {
      return [];
    }
  }
}
export const storage = new LocalPresentationStorage();
export function makeId() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 10);
}
export function deploymentOrigin() {
  return typeof window === "undefined" ? "" : window.location.origin;
}
