"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState, type ReactNode, type MouseEvent } from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-6 md:auto-rows-[25.5rem] md:grid-cols-3",
        className
      )}
      style={{ perspective: "1400px" }}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
  action,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  badge?: string | ReactNode;
  action?: ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const rotX = -((mouseY - height / 2) / (height / 2)) * 8;
    const rotY = ((mouseX - width / 2) / (width / 2)) * 8;

    setRotate({ x: rotX, y: rotY });
    setGlare({ x: (mouseX / width) * 100, y: (mouseY / height) * 100, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg)`,
        transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease",
      }}
      className={cn(
        "group/bento relative row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-card/90 via-card/75 to-card/50 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* 3D Specular Glare */}
      <div
        className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.35), transparent 80%)`,
          mixBlendMode: "overlay",
        }}
      />

      {/* 3D Glass Corner Bevel */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border-t border-l border-white/30" />

      <div
        className="relative overflow-hidden rounded-2xl transition-transform duration-300 group-hover/bento:translate-z-6"
        style={{ transform: "translateZ(20px)" }}
      >
        {header}
      </div>

      <div
        className="transition-transform duration-300 group-hover/bento:translate-z-8"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {icon}
            {badge && (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                {badge}
              </span>
            )}
          </div>
          {action}
        </div>
        <div className="mt-3 font-display text-lg font-bold text-foreground">
          {title}
        </div>
        <div className="mt-1 text-xs font-normal text-muted-foreground leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
