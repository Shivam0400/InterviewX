import * as React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  glow?: boolean;
}

export function InterviewXLogo({ size = "md", className = "", glow = true }: LogoProps) {
  const pixelSize =
    typeof size === "number"
      ? size
      : size === "xs"
      ? 20
      : size === "sm"
      ? 28
      : size === "md"
      ? 36
      : size === "lg"
      ? 48
      : 64;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {/* Outer ambient glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 opacity-40 blur-md -z-10 group-hover:opacity-75 transition-opacity duration-300"
          style={{ transform: "scale(1.15)" }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="ivx-base-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>

          <linearGradient id="ivx-border-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          <linearGradient id="ivx-bracket-left" x1="15" y1="25" x2="45" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="ivx-bracket-right" x1="85" y1="25" x2="55" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          <linearGradient id="ivx-x-cross-1" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          <linearGradient id="ivx-x-cross-2" x1="70" y1="30" x2="30" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Core pulse glow filter */}
          <filter id="ivx-core-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle Background Shield */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="url(#ivx-base-grad)"
          stroke="url(#ivx-border-grad)"
          strokeWidth="2.5"
          strokeOpacity="0.85"
        />

        {/* Subtle interior code grid line */}
        <line x1="20" y1="50" x2="80" y2="50" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />

        {/* Left Stylized Code Bracket "<" */}
        <path
          d="M 36 28 L 22 50 L 36 72"
          stroke="url(#ivx-bracket-left)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Stylized Code Bracket ">" */}
        <path
          d="M 64 28 L 78 50 L 64 72"
          stroke="url(#ivx-bracket-right)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The Central Energetic "X" Nexus */}
        {/* Diagonal stroke 1: Top-Left to Bottom-Right */}
        <path
          d="M 37 37 L 63 63"
          stroke="url(#ivx-x-cross-1)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Diagonal stroke 2: Top-Right to Bottom-Left */}
        <path
          d="M 63 37 L 37 63"
          stroke="url(#ivx-x-cross-2)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Central Luminous Core Spark / Node */}
        <circle
          cx="50"
          cy="50"
          r="4.5"
          fill="#FFFFFF"
          filter="url(#ivx-core-glow)"
        />
        <circle
          cx="50"
          cy="50"
          r="2.5"
          fill="#06B6D4"
        />
      </svg>
    </div>
  );
}

interface BrandProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  href?: string;
}

export function InterviewXBrand({
  size = "md",
  showTagline = true,
  className = "",
  href = "/",
}: BrandProps) {
  const logoSize = size === "sm" ? 28 : size === "lg" ? 42 : 34;
  const textClasses =
    size === "sm"
      ? "text-base tracking-tight"
      : size === "lg"
      ? "text-2xl tracking-tight"
      : "text-lg tracking-tight";

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <InterviewXLogo size={logoSize} glow={true} className="group-hover:scale-105 transition-transform duration-200" />
      <div className="flex flex-col">
        <div className={`font-bold ${textClasses} leading-none text-foreground flex items-center`}>
          <span>Interview</span>
          <span className="relative ml-0.5 font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all">
            X
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase mt-1 leading-none">
            Evidence-Based
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
