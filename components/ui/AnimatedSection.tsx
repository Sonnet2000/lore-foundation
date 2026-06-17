"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
};

const getVariants = (direction: AnimatedSectionProps["direction"]): Variants => {
  const offset = 28;
  const hidden: Record<string, number> = { opacity: 0 };

  if (direction === "up") hidden.y = offset;
  if (direction === "left") hidden.x = -offset;
  if (direction === "right") hidden.x = offset;

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
};

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={getVariants(direction)}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
