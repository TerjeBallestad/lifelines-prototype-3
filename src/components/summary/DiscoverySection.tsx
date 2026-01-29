import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { observer } from 'mobx-react-lite';
import type { Discovery } from '../../models/types';

// Mock discoveries for Phase 4 - Phase 5 will make dynamic based on activity completion
const mockDiscoveries: Discovery[] = [
  {
    id: 'd1',
    patientId: 'patient-1',
    text: 'Elling finds therapy sessions draining',
  },
  {
    id: 'd2',
    patientId: 'patient-3',
    text: 'Nora seems to enjoy social activities',
  },
];

interface DiscoveryCardProps {
  discovery: Discovery;
  isRevealed: boolean;
}

// Wrap with observer to prevent babel plugin from adding duplicate import
const DiscoveryCard = observer(function DiscoveryCard({ discovery, isRevealed }: DiscoveryCardProps) {
  return (
    <div className="relative h-28 w-44" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative h-full w-full"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front - mystery card */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border border-base-300 bg-base-200"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-3xl opacity-50">?</span>
        </div>

        {/* Back - revealed content */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent p-3 text-accent-content"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-center text-sm">{discovery.text}</p>
        </div>
      </motion.div>
    </div>
  );
});

export const DiscoverySection = observer(function DiscoverySection() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-reveal cards one by one with staggered timing
  useEffect(() => {
    if (currentIndex < mockDiscoveries.length) {
      const timer = setTimeout(() => {
        setRevealedIds((prev) => new Set(prev).add(mockDiscoveries[currentIndex].id));
        setCurrentIndex((prev) => prev + 1);
      }, 800); // Stagger reveals

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Handle empty state
  if (mockDiscoveries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">Discoveries</h3>
        <p className="text-base-content/60">No new discoveries today</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Discoveries</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {mockDiscoveries.map((discovery) => (
          <DiscoveryCard
            key={discovery.id}
            discovery={discovery}
            isRevealed={revealedIds.has(discovery.id)}
          />
        ))}
      </div>
    </div>
  );
});
