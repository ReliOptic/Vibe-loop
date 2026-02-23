import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Music, Sparkles, ArrowRight, ArrowUp, Library } from 'lucide-react';
import { Loop } from '../App';

const MOCK_LOOPS: Loop[] = [
  { 
    id: '1', name: 'Neon Nights', genre: 'Cyberpunk', bpm: 124, color: 'from-fuchsia-500 to-cyan-500', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop',
    stems: [
      { id: 'd1', type: 'drum', name: 'Punchy Kit', active: true, texture: 0 },
      { id: 'b1', type: 'bass', name: 'Reese Bass', active: true, texture: 0 },
      { id: 's1', type: 'synth', name: 'Arp Pluck', active: true, texture: 0 }
    ]
  },
  { 
    id: '2', name: 'Midnight Drive', genre: 'Synthwave', bpm: 110, color: 'from-purple-500 to-indigo-500', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    stems: [
      { id: 'd2', type: 'drum', name: 'Retro 808', active: true, texture: 0 },
      { id: 'b2', type: 'bass', name: 'Moog Bass', active: true, texture: 0 },
      { id: 's2', type: 'synth', name: 'Brass Pad', active: true, texture: 0 }
    ]
  },
  { 
    id: '3', name: 'Rainy Cafe', genre: 'Lo-Fi', bpm: 85, color: 'from-blue-400 to-emerald-400', img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop',
    stems: [
      { id: 'd3', type: 'drum', name: 'Dusty Break', active: true, texture: 0 },
      { id: 'b3', type: 'bass', name: 'Sub Bass', active: true, texture: 0 },
      { id: 's3', type: 'synth', name: 'Rhodes', active: true, texture: 0 }
    ]
  },
];

export default function Discover({ onSave, onGoToWorkspace, savedCount }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const scale = useTransform(y, [-200, 0, 200], [0.8, 1, 0.8]);

  const handleDragEnd = (e: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      // Swipe Right -> Save
      onSave(MOCK_LOOPS[currentIndex]);
      nextLoop();
    } else if (info.offset.y < -threshold) {
      // Swipe Up -> Next
      nextLoop();
    } else if (info.offset.y > threshold) {
      // Swipe Down -> Prev
      prevLoop();
    } else {
      // Reset
      x.set(0);
      y.set(0);
    }
  };

  const nextLoop = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_LOOPS.length);
    x.set(0); y.set(0);
  };

  const prevLoop = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_LOOPS.length) % MOCK_LOOPS.length);
    x.set(0); y.set(0);
  };

  const currentLoop = MOCK_LOOPS[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex-1 flex flex-col relative h-full"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6 z-10">
        <h1 className="text-2xl font-bold tracking-tighter">Vibe<span className="text-primary">Loop</span></h1>
        <button onClick={onGoToWorkspace} className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <Library size={24} />
          {savedCount > 0 && (
            <span className="absolute top-0 right-0 size-4 bg-primary rounded-full text-[10px] flex items-center justify-center font-bold">
              {savedCount}
            </span>
          )}
        </button>
      </header>

      {/* Main Swipe Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden perspective-1000">
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
          <div className="flex flex-col items-center gap-2 mb-32">
            <ArrowUp size={32} className="animate-bounce" />
            <span className="text-sm font-bold tracking-widest uppercase">Next Vibe</span>
          </div>
          <div className="flex items-center gap-32">
            <div className="flex flex-col items-center gap-2">
            </div>
            <div className="flex flex-col items-center gap-2">
              <ArrowRight size={32} className="animate-pulse text-primary" />
              <span className="text-sm font-bold tracking-widest uppercase text-primary">Save to Box</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentLoop.id}
            style={{ x, y, rotate, scale }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
            className="absolute w-[85%] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing z-20"
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentLoop.img})` }}></div>
            <div className={`absolute inset-0 bg-gradient-to-b ${currentLoop.color} mix-blend-overlay opacity-50`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent"></div>
            
            {/* Visualizer Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-48 rounded-full border border-white/20 animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute size-32 rounded-full border border-white/30 animate-[spin_7s_linear_infinite_reverse]"></div>
              <div className="absolute size-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Music size={24} className="text-white/80 animate-pulse" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">{currentLoop.genre}</span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">{currentLoop.bpm} BPM</span>
              </div>
              <h2 className="text-4xl font-bold leading-none tracking-tight">{currentLoop.name}</h2>
              <p className="text-white/60 text-sm mt-2 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> AI Curated Loop
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Hints */}
      <div className="p-6 text-center text-white/40 text-sm font-medium">
        Swipe <span className="text-primary font-bold">Right</span> to mix this vibe
      </div>
    </motion.div>
  );
}
