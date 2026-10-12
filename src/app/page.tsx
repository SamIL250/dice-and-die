import { Game } from "@/components/game/game";

export default function Home() {
  return (
    <main className="game-background relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <BackgroundPattern />

      <div className="relative z-10 w-full max-w-md animate-in fade-in-0 duration-500">
        <Game />
      </div>
    </main>
  );
}

/** Faint oversized spinner + dice motifs tiled across the whole page. */
function BackgroundPattern() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
    >
      <defs>
        <pattern
          id="game-bg-pattern"
          width="340"
          height="340"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="#2b2f36" strokeWidth="8" strokeLinecap="round">
            {/* Big spinner */}
            <g transform="translate(80 90)">
              <circle r="62" />
              <path d="M0 0 L0 -62 A62 62 0 0 1 62 0 Z" fill="#2b2f36" stroke="none" />
              <path d="M0 0 L0 62 A62 62 0 0 1 -62 0 Z" fill="#2b2f36" stroke="none" />
              <polygon points="-13,-82 13,-82 0,-58" fill="#2b2f36" stroke="none" />
            </g>

            {/* Small spinner */}
            <g transform="translate(262 252)">
              <circle r="42" />
              <path d="M0 0 L0 -42 A42 42 0 0 1 42 0 Z" fill="#2b2f36" stroke="none" />
            </g>

            {/* Big die */}
            <g transform="translate(255 95) rotate(12)">
              <rect x="-39" y="-39" width="78" height="78" rx="18" />
              <g fill="#2b2f36" stroke="none">
                <circle cx="-22" cy="-22" r="6" />
                <circle cx="0" cy="0" r="6" />
                <circle cx="22" cy="22" r="6" />
              </g>
            </g>

            {/* Second die */}
            <g transform="translate(90 262) rotate(-14)">
              <rect x="-30" y="-30" width="60" height="60" rx="14" strokeWidth="7" />
              <g fill="#2b2f36" stroke="none">
                <circle cx="-17" cy="-17" r="5" />
                <circle cx="17" cy="-17" r="5" />
                <circle cx="0" cy="0" r="5" />
                <circle cx="-17" cy="17" r="5" />
                <circle cx="17" cy="17" r="5" />
              </g>
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#game-bg-pattern)" />
    </svg>
  );
}
