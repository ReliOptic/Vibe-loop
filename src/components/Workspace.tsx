import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, Disc3, Sliders, Wand2, Music2, Mic2, Drum } from 'lucide-react';
import { Loop, Stem } from '../App';
import XYPad from './XYPad';

export default function Workspace({ loop, onBack }: { key?: string, loop: Loop | null, onBack: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [bpm, setBpm] = useState(loop?.bpm || 120);
  const [stems, setStems] = useState<Stem[]>(loop?.stems || []);
  const [activeTab, setActiveTab] = useState<'mix' | 'fx'>('mix');
  const [vibeEffect, setVibeEffect] = useState<string | null>(null);

  const availableInstruments = [
    { id: 'new_drum', type: 'drum', name: 'House Beat', icon: Drum },
    { id: 'new_bass', type: 'bass', name: 'Slap Bass', icon: Music2 },
    { id: 'new_synth', type: 'synth', name: 'Neon Chords', icon: Sliders },
    { id: 'new_vocal', type: 'vocal', name: 'Chopped Vox', icon: Mic2 },
  ];

  const handleDrop = (instrument: any) => {
    // Add new stem
    setStems(prev => [...prev, { ...instrument, active: true, texture: 0 }]);
  };

  const toggleStem = (id: string) => {
    setStems(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const changeTexture = (id: string) => {
    setStems(prev => prev.map(s => s.id === id ? { ...s, texture: (s.texture + 1) % 3 } : s));
  };

  const applyVibeCheck = () => {
    const effects = ['Lo-fi', 'Stadium', 'Space', 'Club'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    setVibeEffect(randomEffect);
    // Simulate auto-leveling
    setTimeout(() => setVibeEffect(null), 3000);
  };

  if (!loop) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Disc3 size={64} className="text-white/20 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Workspace Empty</h2>
        <p className="text-white/60 mb-8">Swipe right on a vibe in Discover to start mixing.</p>
        <button onClick={onBack} className="px-8 py-4 rounded-full bg-primary text-white font-bold">Go Discover</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="flex-1 flex flex-col relative h-full bg-[#0b0f19]"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 z-10 bg-black/20 backdrop-blur-md border-b border-white/5">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold tracking-widest uppercase text-primary">Vibe Box</h2>
          <span className="text-xs text-white/50">{loop.name} • {bpm} BPM</span>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </header>

      {/* Main Mixing Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        
        {/* Central Stacking Circle */}
        <div className="relative w-full aspect-square flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          
          <div className="relative w-full h-full max-w-[300px] max-h-[300px] rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
            {/* Center Core */}
            <div className="absolute size-24 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(13,89,242,0.3)] z-10">
              <Disc3 size={40} className={`text-primary ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>

            {/* Stems Orbiting */}
            {stems.map((stem, i) => {
              const angle = (i / stems.length) * Math.PI * 2;
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={stem.id}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute z-20"
                  style={{ x, y }}
                >
                  <div className="relative group">
                    <button 
                      onClick={() => toggleStem(stem.id)}
                      onDoubleClick={() => changeTexture(stem.id)}
                      className={`size-14 rounded-full flex items-center justify-center shadow-lg transition-all ${stem.active ? 'bg-white text-black scale-110' : 'bg-white/10 text-white/40 backdrop-blur-md border border-white/20'}`}
                    >
                      {stem.type === 'drum' ? <Drum size={24} /> : stem.type === 'bass' ? <Music2 size={24} /> : stem.type === 'vocal' ? <Mic2 size={24} /> : <Sliders size={24} />}
                    </button>
                    {/* Texture Indicator */}
                    {stem.active && (
                      <div className="absolute -top-1 -right-1 size-4 rounded-full bg-primary border-2 border-[#0b0f19] flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">{stem.texture + 1}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Controls Tabs */}
        <div className="flex px-6 mb-4 gap-4">
          <button onClick={() => setActiveTab('mix')} className={`flex-1 pb-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'mix' ? 'border-primary text-primary' : 'border-transparent text-white/40'}`}>
            Stacking
          </button>
          <button onClick={() => setActiveTab('fx')} className={`flex-1 pb-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${activeTab === 'fx' ? 'border-primary text-primary' : 'border-transparent text-white/40'}`}>
            Gyro-FX
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 px-6 pb-6">
          {activeTab === 'mix' ? (
            <div className="flex flex-col gap-4">
              {/* BPM Slider */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white/60 uppercase tracking-wider">Tempo</span>
                  <span className="text-primary font-bold">{bpm} BPM</span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="180" 
                  value={bpm} 
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-white/40">Pitch-Preserving Shift Active</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Library</h3>
                <span className="text-xs text-white/40">Drag to center</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {availableInstruments.map(inst => (
                  <button 
                    key={inst.id}
                    onClick={() => handleDrop(inst)}
                    className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:border-primary/50 transition-all active:scale-95"
                  >
                    <inst.icon size={24} className="text-white/60" />
                    <span className="text-[10px] font-bold text-white/60">{inst.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 h-full">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">XY Pad Morphing</h3>
                <span className="text-xs text-white/40">Drag to morph</span>
              </div>
              <XYPad />
            </div>
          )}
        </div>
      </div>

      {/* One-Tap Master */}
      <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <button 
          onClick={applyVibeCheck}
          className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(13,89,242,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
        >
          <Wand2 size={24} className={vibeEffect ? 'animate-spin' : ''} />
          {vibeEffect ? `Applying ${vibeEffect} Master...` : 'Vibe Check (Auto-Mix)'}
          
          {vibeEffect && (
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/20 skew-x-12"
            />
          )}
        </button>
      </div>
    </motion.div>
  );
}
