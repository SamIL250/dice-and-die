"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Dices, RotateCcw } from "lucide-react";
import { KeyButton } from "./key-button";
import { Wheel } from "./wheel";
import {
  MAX_NAME_LENGTH,
  PLAYER_COLORS,
  buildSegments,
  type Player,
  type SpinResult,
} from "@/lib/game";
import { pickPrompt } from "@/lib/prompts";
import { cn } from "cn";

type Step = "count" | "names" | "game";

const SPIN_DURATION = 4400;

const PLAYER_OPTIONS = [
  { count: 2, hint: "Classic duel" },
  { count: 3, hint: "Trio chaos" },
  { count: 4, hint: "Full party" },
] as const;

const TEXT = {
  primary: "#2b2f36",
  muted: "#868c96",
} as const;

export function Game() {
  const [step, setStep] = useState<Step>("count");
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);

  const timerRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const segments = useMemo(
    () => buildSegments(players, spinnerIndex),
    [players, spinnerIndex],
  );
  const spinner = players[spinnerIndex];

  function handleSpin() {
    if (isSpinning || result || segments.length === 0) return;

    // Pick a segment at random, then rotate the wheel so it sits under the pointer.
    const index = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    const targetMod = (360 - (index * segmentAngle + segmentAngle / 2)) % 360;
    const delta = (((targetMod - rotation) % 360) + 360) % 360;
    const extraSpins = 5 + Math.floor(Math.random() * 3);

    setIsSpinning(true);
    setRotation(rotation + extraSpins * 360 + delta);

    timerRef.current = window.setTimeout(() => {
      const seg = segments[index];
      setResult({
        askerIndex: seg.askerIndex,
        type: seg.type,
        prompt: pickPrompt(seg.type),
      });
      setIsSpinning(false);
    }, SPIN_DURATION);
  }

  function handleNextTurn() {
    if (!result) return;
    // The person who just asked becomes the next spinner (victim).
    setSpinnerIndex(result.askerIndex);
    setResult(null);
  }

  function handleRestart() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStep("count");
    setPlayerCount(0);
    setPlayers([]);
    setSpinnerIndex(0);
    setRotation(0);
    setIsSpinning(false);
    setResult(null);
  }

  function handleStart(names: string[]) {
    const finalPlayers = names.map((name, i) => ({
      name: name.trim() || `Player ${i + 1}`,
      color: PLAYER_COLORS[i],
    }));

    // Silently notify the game owner — fire and forget, no UI feedback.
    void fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names: finalPlayers.map((p) => p.name) }),
    }).catch(() => {});

    setPlayers(finalPlayers);
    setSpinnerIndex(0);
    setRotation(0);
    setResult(null);
    setStep("game");
  }

  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: TEXT.primary }}
        >
          Dice and Die
        </h1>
        <p className="mt-1 text-sm" style={{ color: TEXT.muted }}>
          Truth or Dare Spinner
        </p>
      </header>

      <div key={step} className="animate-in fade-in-0 duration-300">
        {step === "count" && (
          <CountScreen
            playerCount={playerCount}
            onSelect={setPlayerCount}
            onContinue={() => setStep("names")}
          />
        )}

        {step === "names" && (
          <NamesScreen
            playerCount={playerCount}
            onBack={() => setStep("count")}
            onStart={handleStart}
          />
        )}

        {step === "game" && spinner && (
          <GameScreen
            players={players}
            spinnerIndex={spinnerIndex}
            segments={segments}
            rotation={rotation}
            isSpinning={isSpinning}
            result={result}
            onSpin={handleSpin}
            onNextTurn={handleNextTurn}
            onRestart={handleRestart}
          />
        )}
      </div>

      <footer
        className="mt-8 text-center text-[0.7rem]"
        style={{ color: TEXT.muted }}
      >
        Dice and Die • Spin • Ask • Play fair
      </footer>
    </div>
  );
}

/* ------------------------------ Screen 1 ------------------------------ */

function CountScreen({
  playerCount,
  onSelect,
  onContinue,
}: {
  playerCount: number;
  onSelect: (count: number) => void;
  onContinue: () => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <p
        className="text-center text-sm font-medium"
        style={{ color: TEXT.primary }}
      >
        How many players?
      </p>

      <div className="grid grid-cols-3 gap-3">
        {PLAYER_OPTIONS.map(({ count, hint }) => {
          const selected = playerCount === count;
          return (
            <KeyButton
              key={count}
              selected={selected}
              onClick={() => onSelect(count)}
              aria-pressed={selected}
              className="h-20 flex-col gap-1 text-base"
            >
              <span className="text-xl font-extrabold">{count}</span>
              <span className="text-[0.65rem] font-semibold opacity-60">
                {hint}
              </span>
            </KeyButton>
          );
        })}
      </div>

      <KeyButton
        variant="dark"
        disabled={playerCount === 0}
        onClick={onContinue}
        className="h-14 w-full text-base"
      >
        Continue
      </KeyButton>
    </section>
  );
}

/* ------------------------------ Screen 2 ------------------------------ */

function NamesScreen({
  playerCount,
  onBack,
  onStart,
}: {
  playerCount: number;
  onBack: () => void;
  onStart: (names: string[]) => void;
}) {
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: playerCount }, () => ""),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onStart(names);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p
        className="text-center text-sm font-medium"
        style={{ color: TEXT.primary }}
      >
        Enter player names
      </p>

      <div className="flex flex-col gap-4">
        {names.map((name, i) => (
          <div
            key={i}
            className="relative rounded-full bg-white transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-[#3d434c]/30"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[0.75rem] font-bold text-white"
              style={{ backgroundColor: PLAYER_COLORS[i] }}
            >
              {i + 1}
            </span>
            <input
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={(e) =>
                setNames((prev) =>
                  prev.map((v, idx) => (idx === i ? e.target.value : v)),
                )
              }
              placeholder={`Player ${i + 1} name`}
              autoFocus={i === 0}
              className="h-[52px] w-full rounded-full border-0 bg-transparent pl-14 pr-5 text-base font-semibold text-[#2b2f36] outline-none placeholder:font-normal placeholder:text-[#a2a7b0]"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <KeyButton
          type="submit"
          variant="dark"
          disabled={names.some((n) => !n.trim())}
          className="h-14 w-full text-base"
        >
          Start Game
        </KeyButton>
        <KeyButton onClick={onBack} className="h-14 w-full text-base">
          <ArrowLeft className="size-4" />
          Back
        </KeyButton>
      </div>
    </form>
  );
}

/* ------------------------------ Screen 3 ------------------------------ */

function GameScreen({
  players,
  spinnerIndex,
  segments,
  rotation,
  isSpinning,
  result,
  onSpin,
  onNextTurn,
  onRestart,
}: {
  players: Player[];
  spinnerIndex: number;
  segments: ReturnType<typeof buildSegments>;
  rotation: number;
  isSpinning: boolean;
  result: SpinResult | null;
  onSpin: () => void;
  onNextTurn: () => void;
  onRestart: () => void;
}) {
  const spinner = players[spinnerIndex];
  const asker = result ? players[result.askerIndex] : null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm" style={{ color: TEXT.muted }}>
          <span className="font-bold" style={{ color: spinner.color }}>
            {spinner.name}
          </span>{" "}
          is spinning
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          {players.map((p, i) => {
            const active = i === spinnerIndex;
            return (
              <span
                key={i}
                className={cn(
                  "rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-all duration-300",
                  active ? "scale-105" : "opacity-45",
                )}
                style={{
                  borderColor: p.color,
                  color: active ? p.color : TEXT.primary,
                }}
              >
                {p.name}
              </span>
            );
          })}
        </div>
      </div>

      {!result ? (
        <div className="flex flex-col gap-6 animate-in fade-in-0 duration-300">
          <Wheel segments={segments} rotation={rotation} spinning={isSpinning} />

          <div className="flex justify-center">
            <KeyButton
              variant="dark"
              onClick={onSpin}
              disabled={isSpinning}
              className="h-14 min-w-40 px-10 text-lg"
            >
              <Dices className="size-5" />
              {isSpinning ? "Spinning…" : "SPIN"}
            </KeyButton>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center gap-5 text-center animate-in fade-in-0 duration-300"
          aria-live="polite"
        >
          {/* Asker → Victim */}
          <div className="flex items-center justify-center gap-4">
            <span
              className="rounded-full border-[3px] px-6 py-2.5 text-lg font-extrabold"
              style={{ borderColor: asker?.color, color: asker?.color }}
            >
              {asker?.name}
            </span>
            <ArrowRight className="size-6 text-[#9aa0a8]" />
            <span
              className="rounded-full border-[3px] px-6 py-2.5 text-lg font-extrabold"
              style={{ borderColor: spinner.color, color: spinner.color }}
            >
              {spinner.name}
            </span>
          </div>

          {/* Truth / Dare */}
          <span
            className={cn(
              "rounded-full px-7 py-2 text-base font-extrabold tracking-[0.18em] uppercase",
              result.type === "truth"
                ? "bg-[#4fa8a1]/15 text-[#2f7d77]"
                : "bg-[#e0715f]/15 text-[#b8503f]",
            )}
          >
            {result.type}
          </span>

          {/* Prompt */}
          <div className="w-full rounded-3xl bg-white px-6 py-7">
            <p
              className="text-[1.05rem] font-semibold leading-relaxed"
              style={{ color: TEXT.primary }}
            >
              {result.prompt}
            </p>
          </div>

          <KeyButton
            variant="dark"
            onClick={onNextTurn}
            className="h-14 w-full text-base"
          >
            <Check className="size-4" />
            I did it — Next Turn
          </KeyButton>
        </div>
      )}

      <KeyButton onClick={onRestart} className="h-14 w-full text-base">
        <RotateCcw className="size-4" />
        Restart Game
      </KeyButton>
    </section>
  );
}
