// Recreation of the Prema Group mark (wordmark + orange dot-arc) built as an
// inline SVG since no vector/raster source file was available to drop into
// assets/. Swap for the real logo file (e.g. assets/logo.svg, <img src={logo} />)
// as soon as one is provided — this is a stand-in, not the brand's actual artwork.
// A "C" shaped arc of dots open to the left, clear of the wordmark — sized
// small at the tips, largest at the middle-right, mirroring the reference mark.
const DOTS = [
  { r: 3, cx: 247, cy: 12, o: 0.4 },
  { r: 4, cx: 268, cy: 8, o: 0.5 },
  { r: 5, cx: 289, cy: 10, o: 0.6 },
  { r: 6, cx: 309, cy: 18, o: 0.75 },
  { r: 7, cx: 326, cy: 32, o: 0.85 },
  { r: 7.5, cx: 337, cy: 50, o: 0.95 },
  { r: 8, cx: 343, cy: 70, o: 1 },
  { r: 8, cx: 343, cy: 91, o: 1 },
  { r: 7.5, cx: 337, cy: 112, o: 0.95 },
  { r: 7, cx: 325, cy: 129, o: 0.85 },
  { r: 6, cx: 308, cy: 142, o: 0.75 },
  { r: 5, cx: 288, cy: 150, o: 0.6 },
  { r: 4, cx: 267, cy: 152, o: 0.5 },
  { r: 3, cx: 246, cy: 147, o: 0.4 },
];

const Logo = ({ size = 32, withWordmark = true, className = "" }) => (
  <svg
    className={className}
    width={withWordmark ? size * 2.24 : size}
    height={size}
    viewBox="0 0 380 170"
    role="img"
    aria-label="Prema Group"
  >
    <defs>
      <linearGradient id="prema-dot-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--color-brand-strong)" />
        <stop offset="100%" stopColor="var(--color-brand)" />
      </linearGradient>
    </defs>

    {DOTS.map((dot, i) => (
      <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="url(#prema-dot-gradient)" opacity={dot.o} />
    ))}

    {withWordmark && (
      <text
        x="0"
        y="70"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontWeight="800"
        fontSize="72"
        fill="var(--color-text-primary)"
        letterSpacing="-1"
      >
        PREMA
      </text>
    )}
    {withWordmark && (
      <text
        x="4"
        y="118"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontWeight="700"
        fontSize="26"
        fill="var(--color-brand)"
        letterSpacing="6"
      >
        GROUP
      </text>
    )}
  </svg>
);

export default Logo;
