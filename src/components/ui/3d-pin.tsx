"use client";

import React, { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: ReactNode;
  title?: string | ReactNode;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const ContentWrapper = ({ children: inner }: { children: ReactNode }) => {
    if (href) {
      if (href.startsWith("/")) {
        return (
          <Link to={href} className="flex h-full w-full flex-col">
            {inner}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full w-full flex-col"
        >
          {inner}
        </a>
      );
    }
    return <div className="flex h-full w-full flex-col">{inner}</div>;
  };

  return (
    <div
      className={cn("group/pin relative z-30 cursor-pointer select-none", containerClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      {/* 3D Floating Pin Badge on Hover */}
      <div
        className={cn(
          "pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex items-center transition-all duration-500 ease-out",
          isHovered
            ? "opacity-100 -translate-y-2 scale-100"
            : "opacity-0 translate-y-2 scale-90"
        )}
      >
        <div className="relative flex items-center gap-2.5 rounded-full border border-slate-700/80 bg-slate-900/95 px-4 py-1.5 text-xs font-bold text-white shadow-2xl backdrop-blur-xl ring-1 ring-white/15">
          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-1.5">{title}</div>
          <span className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        </div>
      </div>

      {/* The 3D Tilted Card Body */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotateX(32deg) translateY(-14px) scale(0.95)"
            : "rotateX(0deg) translateY(0px) scale(1)",
          transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease",
          boxShadow: isHovered
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 0 30px rgba(var(--primary), 0.2)"
            : "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
        }}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xl backdrop-blur-2xl transition-all duration-300",
          isHovered ? "border-primary/60 shadow-2xl ring-1 ring-primary/20" : "hover:border-border",
          className
        )}
      >
        <ContentWrapper>{children}</ContentWrapper>

        {/* 3D Glass Corner Bevel */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl border-t border-l border-white/40" />
      </div>

      {/* 3D Pedestal: Vertical Laser Beam & Concentric Rings */}
      <div
        className={cn(
          "pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )}
      >
        {/* Laser Light Column */}
        <div className="h-16 w-1 bg-gradient-to-t from-primary via-primary/70 to-transparent blur-[1px] animate-pulse" />
        <div className="size-2.5 rounded-full bg-primary shadow-[0_0_12px_#ffffff]" />

        {/* Concentric Sonar Ripple Rings */}
        <div className="relative -mt-1 flex items-center justify-center">
          <div className="absolute size-28 animate-ping rounded-full border border-primary/50 bg-primary/10 duration-1000" />
          <div className="absolute size-20 rounded-full border border-accent/40 bg-accent/10" />
          <div className="size-12 rounded-full border border-primary/60 bg-primary/20" />
        </div>
      </div>
    </div>
  );
};
