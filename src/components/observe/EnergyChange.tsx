import { motion } from 'motion/react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface EnergyChangeProps {
  id: string;
  value: number;
  onComplete: () => void;
}

export function EnergyChange({ id, value, onComplete }: EnergyChangeProps) {
  const isPositive = value > 0;

  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, -30, -50],
        scale: [1, 1.1, 0.9],
      }}
      transition={{
        duration: 1.5,
        times: [0, 0.6, 1],
        ease: 'easeOut',
      }}
      onAnimationComplete={onComplete}
      className={`pointer-events-none absolute top-0 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 text-lg font-bold ${isPositive ? 'text-success' : 'text-error'}`}
    >
      {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      {isPositive ? '+' : ''}
      {value}
    </motion.div>
  );
}
