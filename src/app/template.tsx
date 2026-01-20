"use client";

import dynamic from "next/dynamic";

// Dynamic import framer-motion to reduce initial bundle size (bundle-dynamic-imports)
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ ease: "easeInOut", duration: 0.4 }}
    >
      {children}
    </MotionDiv>
  );
}
