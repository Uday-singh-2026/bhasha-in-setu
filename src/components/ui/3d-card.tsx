"use client";

import { cn } from "@/lib/utils";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";

interface MouseEnterContextType {
  isMouseEntered: boolean;
  setIsMouseEntered: React.Dispatch<React.SetStateAction<boolean>>;
  glare: { x: number; y: number; opacity: number };
}

const MouseEnterContext = createContext<MouseEnterContextType | undefined>(
  undefined
);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Calculate rotation (-16deg to +16deg for punchy 3D feel)
    const rotX = -((mouseY - height / 2) / (height / 2)) * 16;
    const rotY = ((mouseX - width / 2) / (width / 2)) * 16;

    // Dynamic specular glare coordinates (%)
    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;

    setGlare({ x: glareX, y: glareY, opacity: 0.35 });

    containerRef.current.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(
      2
    )}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    // Dynamic 3D directional cast shadow
    const shadowX = -rotY * 2.5;
    const shadowY = rotX * 2.5 + 25;
    containerRef.current.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 35px rgba(0, 0, 0, 0.22))`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    containerRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    containerRef.current.style.filter = `drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.12))`;
  };

  return (
    <MouseEnterContext.Provider
      value={{ isMouseEntered, setIsMouseEntered, glare }}
    >
      <div
        className={cn(
          "flex items-center justify-center p-3 select-none",
          containerClassName
        )}
        style={{ perspective: "1200px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}

          {/* Aceternity 3D Glare Reflection Light */}
          <div
            className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.4), transparent 80%)`,
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-auto w-auto [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useMouseEnter();
  const isMouseEntered = context?.isMouseEntered ?? false;

  useEffect(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
      ref.current.style.filter = Number(translateZ) > 30 ? "drop-shadow(0 15px 25px rgba(0,0,0,0.25))" : "none";
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
      ref.current.style.filter = "none";
    }
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag
      ref={ref}
      className={cn(
        "w-fit transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export const useMouseEnter = () => {
  return useContext(MouseEnterContext);
};
