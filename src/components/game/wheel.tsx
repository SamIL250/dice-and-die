"use client";

import { cn } from "cn";
import { isDarkColor, segmentColor, type Segment } from "@/lib/game";

interface WheelProps {
  segments: Segment[];
  /** Absolute rotation in degrees. */
  rotation: number;
  spinning: boolean;
  className?: string;
}

const CX = 50;
const CY = 50;
const R = 47;

/** Point on the circle for an angle measured clockwise from the top. */
function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.sin(rad), y: CY - radius * Math.cos(rad) };
}

function segmentPath(start: number, end: number) {
  const p0 = polar(start, R);
  const p1 = polar(end, R);
  const largeArc = end - start > 180 ? 1 : 0;
  return [
    `M ${CX} ${CY}`,
    `L ${p0.x.toFixed(3)} ${p0.y.toFixed(3)}`,
    `A ${R} ${R} 0 ${largeArc} 1 ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    "Z",
  ].join(" ");
}

export function Wheel({ segments, rotation, spinning, className }: WheelProps) {
  const n = segments.length;
  const segmentAngle = n > 0 ? 360 / n : 0;
  const nameSize = n > 6 ? 3.4 : n > 4 ? 4 : 4.7;
  const subSize = n > 6 ? 2.3 : 2.7;

  return (
    <div className={cn("relative mx-auto w-full max-w-[280px]", className)}>
      {/* Pointer */}
      <div
        aria-hidden
        className={cn(
          "absolute left-1/2 top-[-4px] z-20 -translate-x-1/2",
          spinning
            ? "animate-[pointer-bounce_0.35s_ease-in-out_infinite]"
            : "animate-[pointer-idle_2.4s_ease-in-out_infinite]",
        )}
      >
        <div className="h-0 w-0 border-l-[13px] border-r-[13px] border-t-[27px] border-l-transparent border-r-transparent border-t-[#3d434c]" />
      </div>

      {/* Wheel */}
      <div className="aspect-square rounded-full border border-[#e2e5e9] bg-white p-[6px]">
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label="Truth or dare spinner wheel"
          className="block size-full rounded-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4.4s cubic-bezier(0.12, 0.68, 0.12, 0.99)"
              : "none",
          }}
        >
          {segments.map((seg, i) => {
            const start = i * segmentAngle;
            const end = (i + 1) * segmentAngle;
            const mid = start + segmentAngle / 2;
            const flipped = mid > 90 && mid < 270;
            const text = isDarkColor(seg.color) ? "#ffffff" : "#2b2f36";
            const nameRadius = R * 0.63;
            const nameY = flipped ? CY + nameRadius : CY - nameRadius;
            const subY = flipped ? nameY - 8.5 : nameY + 8.5;

            return (
              <g key={`${seg.askerIndex}-${seg.type}-${i}`}>
                <path
                  d={segmentPath(start, end)}
                  fill={segmentColor(seg)}
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth="0.6"
                />
                <g transform={`rotate(${flipped ? mid + 180 : mid} ${CX} ${CY})`}>
                  <text
                    x={CX}
                    y={nameY}
                    textAnchor="middle"
                    fill={text}
                    fontSize={nameSize}
                    fontWeight={700}
                  >
                    {seg.label}
                  </text>
                  <text
                    x={CX}
                    y={subY}
                    textAnchor="middle"
                    fill={text}
                    fontSize={subSize}
                    fontWeight={600}
                    letterSpacing="0.15"
                    opacity={0.85}
                  >
                    {seg.sub}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Center hub */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#e2e5e9] bg-white"
      >
        <span className="size-2.5 rounded-full bg-[#3d434c]" />
      </div>
    </div>
  );
}
