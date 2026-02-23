import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Discover from './components/Discover';
import Workspace from './components/Workspace';

export type Stem = {
  id: string;
  type: 'drum' | 'bass' | 'synth' | 'vocal' | 'fx';
  name: string;
  active: boolean;
  texture: number;
};

export type Loop = {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  color: string;
  img: string;
  stems: Stem[];
};

export default function App() {
  const [view, setView] = useState<'discover' | 'workspace'>('discover');
  const [savedLoops, setSavedLoops] = useState<Loop[]>([]);
  const [currentLoop, setCurrentLoop] = useState<Loop | null>(null);

  const handleSaveLoop = (loop: Loop) => {
    setSavedLoops(prev => [...prev, loop]);
    setCurrentLoop(loop);
    setView('workspace');
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative bg-[#0b0f19] text-white shadow-2xl overflow-hidden font-display">
      <AnimatePresence mode="wait">
        {view === 'discover' && (
          <Discover 
            key="discover" 
            onSave={handleSaveLoop} 
            onGoToWorkspace={() => setView('workspace')} 
            savedCount={savedLoops.length}
          />
        )}
        {view === 'workspace' && (
          <Workspace 
            key="workspace" 
            loop={currentLoop} 
            onBack={() => setView('discover')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
