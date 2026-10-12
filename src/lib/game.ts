export type GameType = "truth" | "dare";

export interface Player {
  name: string;
  color: string;
}

export interface Segment {
  /** The player who asks (gives the truth/dare). */
  label: string;
  sub: string;
  askerIndex: number;
  type: GameType;
  color: string;
}

export interface SpinResult {
  askerIndex: number;
  type: GameType;
  prompt: string;
}

/** Cohesive muted palette — one color per player. */
export const PLAYER_COLORS = ["#e0715f", "#4fa8a1", "#d9a441", "#9176d9"] as const;

export const MAX_NAME_LENGTH = 12;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

/**
 * Each player except the current spinner gets two segments: a TRUTH and a DARE.
 * So a 4 player game has 6 segments, a 2 player game has 2.
 */
export function buildSegments(players: Player[], spinnerIndex: number): Segment[] {
  const segments: Segment[] = [];
  players.forEach((player, i) => {
    if (i === spinnerIndex) return; // you cannot ask yourself
    segments.push({
      label: player.name,
      sub: "TRUTH",
      askerIndex: i,
      type: "truth",
      color: player.color,
    });
    segments.push({
      label: player.name,
      sub: "DARE",
      askerIndex: i,
      type: "dare",
      color: player.color,
    });
  });
  return segments;
}

/** Dare slices are a slightly darker shade of the player's color. */
export function segmentColor(segment: Segment): string {
  return segment.type === "truth" ? segment.color : adjustColor(segment.color, -28);
}

/** Simple hex lighten/darken. */
export function adjustColor(hex: string, amount: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(parseInt(hex.slice(1, 3), 16) + amount);
  const g = clamp(parseInt(hex.slice(3, 5), 16) + amount);
  const b = clamp(parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Whether text on top of this color should be light or dark. */
export function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 140;
}
