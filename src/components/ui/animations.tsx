"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

// Fade In Animation
interface FadeInProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ className, delay = 0, duration = 500, direction = "up", children, style, ...props }, ref) => {
    const directionStyles = {
      up: "animate-fade-in-up",
      down: "animate-fade-in-down",
      left: "animate-fade-in-left",
      right: "animate-fade-in-right",
      none: "animate-fade-in",
    };

    return (
      <div
        ref={ref}
        className={cn(directionStyles[direction], className)}
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FadeIn.displayName = "FadeIn";

// Stagger Children Animation
interface StaggerProps extends HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number;
  initialDelay?: number;
}

export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(
  ({ className, staggerDelay = 100, initialDelay = 0, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("contents", className)} {...props}>
        {Array.isArray(children)
          ? children.map((child, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${initialDelay + index * staggerDelay}ms`,
                }}
              >
                {child}
              </div>
            ))
          : children}
      </div>
    );
  }
);
Stagger.displayName = "Stagger";

// Scale Animation
interface ScaleProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleProps>(
  ({ className, delay = 0, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-scale-in", className)}
        style={{
          animationDelay: `${delay}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScaleIn.displayName = "ScaleIn";

// Slide Animation
interface SlideProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}

export const SlideIn = forwardRef<HTMLDivElement, SlideProps>(
  ({ className, direction = "left", delay = 0, children, style, ...props }, ref) => {
    const slideStyles = {
      left: "animate-slide-in-left",
      right: "animate-slide-in-right",
      up: "animate-slide-in-up",
      down: "animate-slide-in-down",
    };

    return (
      <div
        ref={ref}
        className={cn(slideStyles[direction], className)}
        style={{
          animationDelay: `${delay}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SlideIn.displayName = "SlideIn";

// Pulse Animation (for loading states)
export const Pulse = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("animate-pulse", className)} {...props}>
        {children}
      </div>
    );
  }
);
Pulse.displayName = "Pulse";

// Bounce Animation
export const Bounce = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("animate-bounce", className)} {...props}>
        {children}
      </div>
    );
  }
);
Bounce.displayName = "Bounce";

// Spin Animation
export const Spin = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("animate-spin", className)} {...props}>
        {children}
      </div>
    );
  }
);
Spin.displayName = "Spin";
