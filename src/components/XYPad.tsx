import { useState, useRef } from 'react';
import type { PointerEvent } from 'react';
import { motion } from 'motion/react';

export default function XYPad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handlePointerMove = (e: PointerEvent) => {
    if (!containerRef.current || e.buttons !== 1) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setPos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerMove}
      onPointerMove={handlePointerMove}
      className="w-full aspect-square rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden touch-none cursor-crosshair"
    >
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 pointer-events-none">
        <div className="w-full h-px bg-white"></div>
        <div className="w-full h-px bg-white"></div>
        <div className="w-full h-px bg-white"></div>
      </div>
      <div className="absolute inset-0 flex justify-between p-4 opacity-20 pointer-events-none">
        <div className="h-full w-px bg-white"></div>
        <div className="h-full w-px bg-white"></div>
        <div className="h-full w-px bg-white"></div>
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-white/40 uppercase tracking-widest pointer-events-none">Bright</span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-white/40 uppercase tracking-widest pointer-events-none">Dark</span>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-white/40 uppercase tracking-widest pointer-events-none origin-center">Smooth</span>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-xs font-bold text-white/40 uppercase tracking-widest pointer-events-none origin-center">Rough</span>

      {/* Puck */}
      <motion.div 
        className="absolute size-12 -ml-6 -mt-6 rounded-full bg-primary/80 backdrop-blur-md border-2 border-white shadow-[0_0_20px_rgba(13,89,242,0.8)] flex items-center justify-center pointer-events-none"
        animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="size-2 bg-white rounded-full"></div>
      </motion.div>
    </div>
  );
}
