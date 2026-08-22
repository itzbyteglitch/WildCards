export type EmbedPptSlide = {
  id: string;
  index: number;
  width: number;
  height: number;
  html: string;
  warnings: string[];
};
export type EmbedPptDeck = {
  id: string;
  title: string;
  createdAt: string;
  width: number;
  height: number;
  slides: EmbedPptSlide[];
  warnings: string[];
  sourceName?: string;
};
