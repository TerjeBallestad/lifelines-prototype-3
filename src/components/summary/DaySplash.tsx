import { motion } from 'motion/react';

interface DaySplashProps {
  day: number;
  onComplete: () => void;
}

export function DaySplash({ day, onComplete }: DaySplashProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-100"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <motion.h1
        className="text-6xl font-bold"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Day {day}
      </motion.h1>
    </motion.div>
  );
}
