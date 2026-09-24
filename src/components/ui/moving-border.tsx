"use client";

import React, { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MovingBorderButton({
  borderRadius = "1rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative h-12 w-auto overflow-hidden p-[1.5px] focus:outline-none",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "size-20 bg-[radial-gradient(var(--primary)_40%,transparent_60%)] opacity-80",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-border/40 bg-card/90 px-6 text-sm font-semibold text-foreground backdrop-blur-xl transition duration-200 hover:bg-card",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement>(null);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="absolute h-full w-full"
      width="100%"
      height="100%"
      {...otherProps}
    >
      <rect
        fill="none"
        width="100%"
        height="100%"
        rx={rx}
        ry={ry}
        ref={pathRef}
      />
      <foreignObject width="100%" height="100%">
        <div className="relative h-full w-full overflow-hidden">
          <div
            className="absolute -inset-[100%] animate-[spin_4s_linear_infinite]"
            style={{
              animationDuration: `${duration}ms`,
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--primary) 60deg, var(--ochre) 120deg, transparent 180deg)`,
            }}
          />
        </div>
      </foreignObject>
    </svg>
  );
};
