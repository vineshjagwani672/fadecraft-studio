import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function TextHoverEffect({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  const gradId = React.useId().replace(/:/g, "");
  const maskId = `m-${gradId}`;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("cursor-pointer select-none uppercase", className)}
    >
      <defs>
        <linearGradient
          id={`tg-${gradId}`}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#c9a962" />
              <stop offset="35%" stopColor="#f4e6c5" />
              <stop offset="70%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#c9a962" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id={`rm-${gradId}`}
          gradientUnits="userSpaceOnUse"
          r="22%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#rm-${gradId})`} />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.35"
        className="fill-transparent stroke-zinc-600 font-[Syne] text-7xl font-bold"
        style={{ opacity: hovered ? 0.65 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.35"
        className="fill-transparent stroke-primary/80 font-[Syne] text-7xl font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#tg-${gradId})`}
        strokeWidth="0.35"
        mask={`url(#${maskId})`}
        className="fill-transparent font-[Syne] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
}

export function FooterBackgroundGradient() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, rgba(201,169,98,0.12) 0%, rgba(7,7,8,0.92) 55%, #070708 100%)",
      }}
    />
  );
}
