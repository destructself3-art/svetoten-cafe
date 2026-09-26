// Drawn stand-ins for the hero photos: a porcelain cup on a saucer by day, a wine glass by night.
// Units: the liquid radius is 100; the SVG is 460 wide, so it renders at 2.3x the liquid diameter.

export function CupArt() {
  return (
    <svg viewBox="-230 -230 460 460" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="porcelain" cx="-0.25" cy="-0.3" r="1.25">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f1f0ec" />
          <stop offset="1" stopColor="#d4d2cc" />
        </radialGradient>
        <radialGradient id="saucerWell" cx="0.1" cy="0.1" r="0.7">
          <stop offset="0.6" stopColor="#e9e7e2" stopOpacity="0" />
          <stop offset="1" stopColor="#bdbab3" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="innerWall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9c6bf" />
          <stop offset="0.5" stopColor="#f3f2ee" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d9a1" />
          <stop offset="0.45" stopColor="#c89b4f" />
          <stop offset="1" stopColor="#7d5a26" />
        </linearGradient>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Shadow falls to the lower right: the window is at the upper left */}
      <circle cx="26" cy="30" r="206" fill="rgb(40 52 68)" opacity="0.28" filter="url(#softShadow)" />
      <circle r="206" fill="url(#porcelain)" />
      <circle r="206" fill="none" stroke="#2b2a28" strokeOpacity="0.85" strokeWidth="2.2" />
      <circle r="150" fill="url(#saucerWell)" />
      <circle r="150" fill="none" stroke="#bbb8b1" strokeOpacity="0.45" strokeWidth="1.2" />

      {/* Teaspoon on the saucer */}
      <g transform="rotate(38) translate(0 172)">
        <rect x="-5" y="-6" width="10" height="72" rx="5" fill="url(#brass)" transform="translate(0 -40)" />
        <ellipse cx="0" cy="-54" rx="15" ry="22" fill="url(#brass)" />
        <ellipse cx="-4" cy="-60" rx="5" ry="9" fill="#fff5dc" opacity="0.55" />
      </g>

      {/* Handle to the right */}
      <circle cx="18" cy="22" r="138" fill="rgb(40 52 68)" opacity="0.3" filter="url(#softShadow)" />
      <rect x="118" y="-26" width="64" height="52" rx="26" fill="url(#porcelain)" stroke="#2b2a28" strokeOpacity="0.2" />
      <rect x="138" y="-12" width="30" height="24" rx="12" fill="#d8d6d0" />

      {/* Cup body, charcoal rim, inner wall */}
      <circle r="130" fill="url(#porcelain)" />
      <circle r="129" fill="none" stroke="#2b2a28" strokeWidth="3" />
      <circle r="116" fill="url(#innerWall)" />
      <circle r="102" fill="#3a2414" />
    </svg>
  );
}

export function GlassArt() {
  return (
    <svg viewBox="-230 -230 460 460" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="glassFoot" r="1">
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.96" stopColor="#ffd9a0" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="candleSpill" cx="1.6" cy="-0.6" r="1.6">
          <stop offset="0" stopColor="#f0a84a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#f0a84a" stopOpacity="0" />
        </radialGradient>
        <filter id="glassBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      {/* Wine casts a red glow on the table, opposite the candle */}
      <circle cx="-30" cy="34" r="150" fill="#6d1020" opacity="0.35" filter="url(#glassBlur)" />
      <circle r="170" fill="url(#glassFoot)" />
      <circle r="170" fill="none" stroke="#ffe3b8" strokeOpacity="0.12" strokeWidth="1.5" />
      <circle r="136" fill="url(#candleSpill)" />
      <circle r="136" fill="none" stroke="#ffe6c2" strokeOpacity="0.5" strokeWidth="2.2" />
      <path d="M 96 -94 A 136 136 0 0 0 -12 -135" fill="none" stroke="#fff3dd" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
      <circle r="104" fill="#200409" />
    </svg>
  );
}

/** Static latte used when WebGL is unavailable. */
export function StaticLatte({ night }: { night: boolean }) {
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="crema" r="1">
          <stop offset="0" stopColor={night ? "#3a0712" : "#a86a36"} />
          <stop offset="1" stopColor={night ? "#6e1420" : "#4a2a14"} />
        </radialGradient>
      </defs>
      <circle r="100" fill="url(#crema)" />
      {!night && (
        <path
          d="M0 52 C -30 28 -58 6 -58 -22 C -58 -44 -40 -58 -22 -58 C -8 -58 0 -48 0 -36 C 0 -48 8 -58 22 -58 C 40 -58 58 -44 58 -22 C 58 6 30 28 0 52 Z"
          fill="#f7f1e6"
        />
      )}
    </svg>
  );
}
