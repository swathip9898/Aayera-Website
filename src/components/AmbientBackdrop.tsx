"use client";

import React from "react";

export function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 85% 60% at 50% -10%, var(--orb-2), transparent 68%), linear-gradient(180deg, var(--bg-canvas) 0%, var(--bg-canvas-2) 100%)",
      }}
    >
      {/* Animated Floating Translucent Sky-Blue Orbs */}
      <div
        className="animate-orb-1 absolute -top-24 -left-24 h-[34rem] w-[34rem] rounded-full blur-[110px]"
        style={{ background: "var(--orb-1)" }}
      />
      <div
        className="animate-orb-2 absolute top-1/3 -right-24 h-[36rem] w-[36rem] rounded-full blur-[120px]"
        style={{ background: "var(--orb-2)" }}
      />
      <div
        className="animate-orb-3 absolute -bottom-32 left-1/4 h-[32rem] w-[32rem] rounded-full blur-[115px]"
        style={{ background: "var(--orb-3)" }}
      />

      {/* Delicate Frost-Blue Grid Overlay */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 25%, black 35%, transparent 100%)",
        }}
      />
    </div>
  );
}
