// High-resolution SVG catalog preview generator for client-side execution (Netlify / Static hosting)
export function generateClientStudioPreviewSVG(prompt: string, title?: string): string {
  const isLifestyle =
    prompt.toLowerCase().includes("lifestyle") ||
    prompt.toLowerCase().includes("flat-lay") ||
    prompt.toLowerCase().includes("props");
  const isMacro =
    prompt.toLowerCase().includes("macro") ||
    prompt.toLowerCase().includes("close-up") ||
    prompt.toLowerCase().includes("texture");
  const isModel =
    prompt.toLowerCase().includes("model") ||
    prompt.toLowerCase().includes("full-body") ||
    prompt.toLowerCase().includes("draped");

  const shotTitle = title || (isMacro ? "100mm Macro Texture" : isModel ? "Editorial Model Shot" : isLifestyle ? "Festive Flat-Lay" : "Studio Hero (3:4)");

  const svgContent = `
<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFAF9" />
      <stop offset="50%" stop-color="#F5F5F4" />
      <stop offset="100%" stop-color="#E7E5E4" />
    </linearGradient>
    <linearGradient id="silkShine" x1="0%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#E0115F" />
      <stop offset="30%" stop-color="#FF2A7A" />
      <stop offset="70%" stop-color="#C7004C" />
      <stop offset="100%" stop-color="#8B0032" />
    </linearGradient>
    <linearGradient id="goldZari" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE57F" />
      <stop offset="40%" stop-color="#FFD54F" />
      <stop offset="70%" stop-color="#FFA000" />
      <stop offset="100%" stop-color="#D4AF37" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#1C1917" flood-opacity="0.18" />
    </filter>
  </defs>

  <rect width="600" height="800" fill="url(#bgGrad)" />

  <g opacity="0.04" stroke="#000000" stroke-width="1">
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" />
    </pattern>
    <rect width="600" height="800" fill="url(#grid)" />
  </g>

  ${
    isMacro
      ? `
    <g transform="translate(100, 150)">
      <rect x="0" y="0" width="400" height="460" rx="16" fill="url(#silkShine)" filter="url(#shadow)" />
      <g stroke="url(#goldZari)" stroke-width="3" fill="none" opacity="0.95">
        <path d="M 20 60 Q 200 10 380 60" />
        <path d="M 20 140 Q 200 90 380 140" />
        <path d="M 20 220 Q 200 170 380 220" />
        <path d="M 20 300 Q 200 250 380 300" />
        <path d="M 20 380 Q 200 330 380 380" />
        <circle cx="200" cy="140" r="45" fill="url(#goldZari)" opacity="0.8" />
        <circle cx="90" cy="220" r="30" fill="url(#goldZari)" opacity="0.8" />
        <circle cx="310" cy="220" r="30" fill="url(#goldZari)" opacity="0.8" />
        <circle cx="200" cy="300" r="45" fill="url(#goldZari)" opacity="0.8" />
      </g>
      <circle cx="200" cy="220" r="12" fill="#FFFFFF" />
      <circle cx="90" cy="140" r="8" fill="#FFFFFF" />
      <circle cx="310" cy="140" r="8" fill="#FFFFFF" />
    </g>
  `
      : isModel
      ? `
    <g transform="translate(150, 120)" filter="url(#shadow)">
      <ellipse cx="150" cy="70" rx="36" ry="44" fill="#FBCFE8" />
      <path d="M 120 75 Q 150 115 180 75 Z" fill="#831843" />
      <circle cx="150" cy="40" r="18" fill="#18181B" />
      <path d="M 100 114 C 70 140, 60 260, 60 380 L 240 380 C 240 260, 230 140, 200 114 Z" fill="url(#silkShine)" />
      <path d="M 90 120 Q 150 180 210 120 L 190 280 L 110 280 Z" fill="none" stroke="url(#goldZari)" stroke-width="6" />
      <path d="M 70 200 C 40 260, 30 380, 20 540 L 280 540 C 270 380, 260 260, 230 200 Z" fill="url(#silkShine)" />
      <path d="M 50 220 Q 150 180 250 220 L 270 540 L 30 540 Z" fill="#FFE4E6" opacity="0.8" stroke="url(#goldZari)" stroke-width="4" stroke-dasharray="6 4" />
      <circle cx="150" cy="485" r="6" fill="#FFFFFF" />
      <circle cx="210" cy="450" r="6" fill="#FFFFFF" />
      <g transform="translate(150, 95)">
        <circle cx="0" cy="0" r="10" fill="url(#goldZari)" />
        <path d="M -14 10 Q 0 4 14 10 L 18 28 L -18 28 Z" fill="url(#goldZari)" />
      </g>
    </g>
  `
      : isLifestyle
      ? `
    <g transform="translate(60, 110)">
      <rect x="40" y="40" width="400" height="500" rx="20" fill="url(#silkShine)" filter="url(#shadow)" transform="rotate(-3 240 290)" />
      <path d="M 60 120 Q 240 60 420 120 L 400 480 L 80 480 Z" fill="#FFF1F2" opacity="0.85" stroke="url(#goldZari)" stroke-width="4" stroke-dasharray="8 4" transform="rotate(3 240 290)" />
      <circle cx="120" cy="180" r="30" fill="url(#goldZari)" opacity="0.9" />
      <circle cx="360" cy="180" r="30" fill="url(#goldZari)" opacity="0.9" />
      <circle cx="240" cy="320" r="45" fill="url(#goldZari)" opacity="0.9" />
      <g transform="translate(100, 480)">
        <circle cx="30" cy="30" r="16" fill="#D4AF37" />
        <circle cx="90" cy="30" r="16" fill="#D4AF37" />
        <circle cx="150" cy="30" r="16" fill="#D4AF37" />
      </g>
    </g>
  `
      : `
    <g transform="translate(80, 90)">
      <rect x="50" y="80" width="340" height="420" rx="14" fill="url(#silkShine)" filter="url(#shadow)" />
      <path d="M 140 80 Q 220 150 300 80 L 280 260 L 160 260 Z" fill="none" stroke="url(#goldZari)" stroke-width="8" />
      <g stroke="url(#goldZari)" stroke-width="2" fill="none" opacity="0.9">
        <circle cx="220" cy="180" r="28" />
        <circle cx="220" cy="180" r="14" fill="url(#goldZari)" />
        <circle cx="120" cy="340" r="18" fill="url(#goldZari)" />
        <circle cx="220" cy="340" r="18" fill="url(#goldZari)" />
        <circle cx="320" cy="340" r="18" fill="url(#goldZari)" />
        <circle cx="170" cy="420" r="18" fill="url(#goldZari)" />
        <circle cx="270" cy="420" r="18" fill="url(#goldZari)" />
      </g>
      <path d="M 20 200 Q 140 160 260 220 L 400 180 L 420 300 L 20 340 Z" fill="#FFE5EC" opacity="0.85" stroke="url(#goldZari)" stroke-width="5" stroke-dasharray="8 4" />
      <rect x="50" y="470" width="340" height="30" fill="url(#goldZari)" />
      <line x1="50" y1="485" x2="390" y2="485" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4" />
    </g>
  `
  }

  <rect x="20" y="20" width="560" height="42" rx="8" fill="#18181B" opacity="0.95" />
  <text x="35" y="46" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#F4F4F5" letter-spacing="1">E-COMMERCE CATALOG SPEC • 3:4 RATIO</text>
  <text x="560" y="46" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#F59E0B" text-anchor="end">${shotTitle.toUpperCase()}</text>

  <rect x="20" y="738" width="560" height="44" rx="8" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="1.5" />
  <circle cx="45" cy="760" r="7" fill="#10B981" />
  <text x="62" y="764" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#27272A">Meesho &amp; Amazon India Pure White #FFFFFF Background Verified</text>
</svg>
`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
