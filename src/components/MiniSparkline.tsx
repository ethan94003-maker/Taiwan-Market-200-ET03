import React, { useState, useRef } from "react";

interface MiniSparklineProps {
  prices: number[];
  isUp: boolean;
  isDown: boolean;
  symbol: string;
}

export default function MiniSparkline({ prices, isUp, isDown, symbol }: MiniSparklineProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!prices || prices.length < 2) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  
  const width = 120;
  const height = 30;
  const paddingY = 3; // Keep curves from clipping at the very top or bottom edge

  const points = prices.map((price, idx) => {
    const x = (idx / (prices.length - 1)) * width;
    const y = paddingY + (height - paddingY * 2) - ((price - min) / range) * (height - paddingY * 2);
    return { x, y, price, idx };
  });

  // Calculate smooth Bezier path for the sparkline trend
  const getBezierPath = (pts: typeof points) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      // Control points for smooth curves
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathD = getBezierPath(points);
  
  // Closed shape path for gradient area under Bezier curve
  const areaD = `
    ${pathD}
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  // Color selection: Red for Taiwan stock UP, Green for DOWN, Slate for Neutral
  const color = isUp ? "#ef4444" : isDown ? "#10b981" : "#64748b";
  const gradientId = `sparkline-grad-${symbol}`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, mouseX / rect.width));
    const idx = Math.round(pct * (prices.length - 1));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const currentPoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div ref={containerRef} className="relative flex items-center justify-center group/spark font-sans">
      <svg
        width={width}
        height={height}
        className="overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Shaded area underneath */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Sparkline trend line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Indicator point: Pulsing dot at end when idle, tracking dot when hovering */}
        {hoverIndex === null ? (
          <g>
            {/* Glowing outer aura */}
            <circle
              cx={width}
              cy={points[points.length - 1].y}
              r="4.5"
              fill={color}
              className="animate-ping opacity-35"
              style={{ animationDuration: "1.8s" }}
            />
            {/* Solid center core */}
            <circle
              cx={width}
              cy={points[points.length - 1].y}
              r="2.2"
              fill={color}
            />
          </g>
        ) : (
          currentPoint && (
            <g>
              {/* Vertical guideline */}
              <line
                x1={currentPoint.x}
                y1={0}
                x2={currentPoint.x}
                y2={height}
                stroke="#475569"
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
              {/* Highlight point dot */}
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="3.5"
                fill="#ffffff"
                stroke={color}
                strokeWidth="1.8"
              />
            </g>
          )
        )}
      </svg>

      {/* Mini interactive tooltip displaying hovered price */}
      {hoverIndex !== null && currentPoint && (
        <div 
          className="absolute z-20 bg-slate-950/95 border border-slate-800 text-[10px] font-mono font-black text-slate-100 px-2 py-0.5 rounded shadow-xl pointer-events-none -top-6.5 whitespace-nowrap"
          style={{
            left: `${(currentPoint.x / width) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {currentPoint.price.toLocaleString("zh-TW", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
          })}
        </div>
      )}
    </div>
  );
}
