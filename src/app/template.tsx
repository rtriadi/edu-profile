"use client";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse min-h-[100px]" />
  }
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
