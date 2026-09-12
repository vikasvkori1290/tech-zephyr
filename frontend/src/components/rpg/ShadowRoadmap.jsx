import React, { useState } from 'react';
import {
  Skull,
  Shield,
  Zap,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Award,
  Crown,
  Play,
  RotateCcw,
  Swords,
} from 'lucide-react';
import { soundFx } from '../../services/soundFx.js';

export const SHADOW_SECTORS = [
  {
    id: 'dynasty',
    name: 'Chapter I: Dynasty Capital',
    realm: 'Code Foundations & Runic Logic',
    color: '#06b6d4',
  },
  {
    id: 'legion',
    name: 'Chapter II: Legion Bastion',
    realm: 'Iron Vitality & Heavy Reps',
    color: '#ef4444',
  },
  {
    id: 'heralds',
    name: 'Chapter III: Heralds Sanctum',
    realm: 'Deep Focus & Architecture Codex',
    color: '#a855f7',
  },
  {
    id: 'void',
    name: 'Chapter IV: The Shadow Void',
    realm: 'Apex Mastery & Sovereign Discipline',
    color: '#f59e0b',
  },
];

export const SHADOW_NODES = [
  // Sector 1: Dynasty
  {
    id: 1,
    chapterId: 'dynasty',
    title: 'Trial of the Clean Code',
    opponent: 'Syntax Phantom',
    level: 1,
    type: 'story',
    difficulty: 'Normal',
    diffColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50',
    status: 'completed',
    xp: 120,
    gold: 50,
    desc: 'Purge code smells and refactor async promises to pierce the shadow veil.',
    objectives: ['Implement clean component tree', 'Pass unit assertions', 'Clean memory leaks'],
    x: 12,
    y: 72,
  },
  {
    id: 2,
    chapterId: 'dynasty',
    title: 'Duel: Memory Leak Shade',
    opponent: 'Heap Spectre',
    level: 2,
    type: 'duel',
    difficulty: 'Normal',
    diffColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50',
    status: 'completed',
    xp: 160,
    gold: 70,
    desc: 'Defeat the garbage-collector shade in a high-speed optimization duel.',
    objectives: ['Profile React render passes', 'Memoize expensive computations'],
    x: 24,
    y: 48,
  },
  {
    id: 3,
    chapterId: 'dynasty',
    title: 'Dynasty Boss: Iron Sarge',
    opponent: 'General Marcus',
    level: 3,
    type: 'boss',
    difficulty: 'Hard',
    diffColor: 'text-amber-400 bg-amber-950/80 border-amber-500/50',
    status: 'completed',
    xp: 240,
    gold: 120,
    desc: 'The commander of Dynasty testing. Survive his 50-test automated assault.',
    objectives: ['100% test coverage run', 'Zero runtime crash errors', 'Earn Dynasty Seal'],
    x: 36,
    y: 76,
  },

  // Sector 2: Legion
  {
    id: 4,
    chapterId: 'legion',
    title: 'Trial of the Anvil',
    opponent: 'Granite Warden',
    level: 4,
    type: 'story',
    difficulty: 'Normal',
    diffColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50',
    status: 'completed',
    xp: 180,
    gold: 80,
    desc: 'Forge your stamina against the iron barbells of the Legion peaks.',
    objectives: ['30-minute core circuit', '3 km endurance march', 'Strict hydration quota'],
    x: 48,
    y: 38,
  },
  {
    id: 5,
    chapterId: 'legion',
    title: 'Legion Boss: Shadow Colossus',
    opponent: 'Warmaster Bolo',
    level: 5,
    type: 'boss',
    difficulty: 'Hard',
    diffColor: 'text-amber-400 bg-amber-950/80 border-amber-500/50',
    status: 'completed',
    xp: 280,
    gold: 150,
    desc: '10,000 steps without surrender across the craggy volcanic pass.',
    objectives: ['10,000 step milestone', 'Log 8h recovery sleep', 'Claim Legion Sigil'],
    x: 58,
    y: 68,
  },

  // Sector 3: Heralds
  {
    id: 6,
    chapterId: 'heralds',
    title: 'Chamber of Deep Astral Focus',
    opponent: 'Chronos Weaver',
    level: 6,
    type: 'story',
    difficulty: 'Hard',
    diffColor: 'text-amber-400 bg-amber-950/80 border-amber-500/50',
    status: 'completed',
    xp: 220,
    gold: 110,
    desc: 'Subdue distraction phantoms during 90 minutes of pure uninterrupted flow.',
    objectives: ['2x 45-min Pomodoro sprints', '0 phone pickups logged'],
    x: 70,
    y: 34,
  },
  {
    id: 7,
    chapterId: 'heralds',
    title: 'Heralds Boss: Shadow Mind',
    opponent: 'The Arch-Scholar',
    level: 7,
    type: 'boss',
    difficulty: 'Insane',
    diffColor: 'text-red-400 bg-red-950/80 border-red-500/50',
    status: 'current', // CURRENT NODE
    xp: 350,
    gold: 180,
    desc: 'A duel of sheer cognitive will. Synthesize complex architecture without hesitation.',
    objectives: ['Draft complete architecture document', 'Score 90%+ retention recall'],
    x: 80,
    y: 62,
  },

  // Sector 4: Void
  {
    id: 8,
    chapterId: 'void',
    title: 'Threshold of the Sovereign',
    opponent: 'Void Guardian',
    level: 8,
    type: 'story',
    difficulty: 'Insane',
    diffColor: 'text-red-400 bg-red-950/80 border-red-500/50',
    status: 'locked',
    xp: 420,
    gold: 240,
    desc: 'Enter the boundless void where only flawless discipline retains shape.',
    objectives: ['Sustain 7-day unbroken streak', 'Clean backlog queue to zero'],
    x: 90,
    y: 30,
  },
  {
    id: 9,
    chapterId: 'void',
    title: 'Ultimate Sovereign: Shadow Titan',
    opponent: 'The Shadow Mind Avatar',
    level: 9,
    type: 'boss',
    difficulty: 'Impossible',
    diffColor: 'text-purple-400 bg-purple-950/80 border-purple-500/50',
    status: 'locked',
    xp: 600,
    gold: 400,
    desc: 'The pinnacle martial test of life productivity. Claim immortality in the Hall of Sovereign Legends.',
    objectives: ['Complete all quarterly milestones', 'Unlock legendary Grandmaster skin'],
    x: 96,
    y: 55,
  },
];

export const ShadowRoadmap = ({ onSelectQuest }) => {
  const [selectedNode, setSelectedNode] = useState(SHADOW_NODES[6]); // Node 7 (Current)
  const [selectedSector, setSelectedSector] = useState('heralds');
  const [isEmbarking, setIsEmbarking] = useState(false);

  const handleNodeClick = (node) => {
    soundFx.playClick();
    setSelectedNode(node);
    setSelectedSector(node.chapterId);
  };

  const handleEmbark = () => {
    soundFx.playChestFanfare();
    setIsEmbarking(true);
    setTimeout(() => {
      setIsEmbarking(false);
      if (onSelectQuest) onSelectQuest(selectedNode);
    }, 600);
  };

  return (
    <div className="relative w-full h-full min-h-[560px] bg-[#070b14] overflow-hidden select-none flex flex-col justify-between">
      {/* ATMOSPHERIC DARK FANTASY BACKGROUND & TOPOGRAPHY */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hexagonal energy grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Ambient Shadow Energy Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        {/* Floating Shadow Embers */}
        <div className="absolute top-20 left-1/3 w-2 h-2 rounded-full bg-cyan-400 blur-xs animate-ping" />
        <div className="absolute bottom-24 right-1/3 w-2 h-2 rounded-full bg-purple-400 blur-xs animate-ping delay-700" />
      </div>

      {/* TOP SECTOR CHAPTER TABS */}
      <div className="relative z-20 px-3 sm:px-6 pt-3 flex items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {SHADOW_SECTORS.map((sector) => (
            <button
              key={sector.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedSector(sector.id);
                const firstNode = SHADOW_NODES.find((n) => n.chapterId === sector.id);
                if (firstNode) setSelectedNode(firstNode);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedSector === sector.id
                  ? 'bg-slate-800 text-white border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }} />
              <span>{sector.name}</span>
            </button>
          ))}
        </div>

        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider hidden sm:block">
          Shadow Fight 3 Chapter Conduits
        </span>
      </div>

      {/* MAIN ROADMAP CANVAS (HORIZONTAL SCROLLING PATHWAY) */}
      <div className="relative z-10 flex-1 overflow-x-auto overflow-y-hidden px-4 py-8 flex items-center min-w-full no-scrollbar">
        <div className="relative w-[1100px] h-[360px] mx-auto flex-shrink-0">
          {/* CONNECTING LUMINOUS SHADOW ENERGY VEINS (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="energyVein" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="75%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <filter id="neonGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#38bdf8" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Glowing Energy Conduit Path */}
            <path
              d="M 12 72 L 24 48 L 36 76 L 48 38 L 58 68 L 70 34 L 80 62 L 90 30 L 96 55"
              fill="none"
              stroke="#0f172a"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 12 72 L 24 48 L 36 76 L 48 38 L 58 68 L 70 34 L 80 62 L 90 30 L 96 55"
              fill="none"
              stroke="url(#energyVein)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#neonGlow)"
            />
          </svg>

          {/* ROADMAP CHAPTER NODES */}
          {SHADOW_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isCurrent = node.status === 'current';
            const isCompleted = node.status === 'completed';
            const isLocked = node.status === 'locked';
            const isBoss = node.type === 'boss';

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => handleNodeClick(node)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
              >
                {/* Active Selection Spotlight */}
                {isSelected && (
                  <div className="absolute -inset-4 rounded-full bg-cyan-400/30 blur-md animate-ping pointer-events-none" />
                )}

                {/* Current Node Pulsing Halo */}
                {isCurrent && (
                  <div className="absolute -inset-5 rounded-full bg-purple-500/40 blur-lg animate-pulse-ring pointer-events-none" />
                )}

                {/* Shadow Fight 3 Node Disc / Heraldic Frame */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black transition-all transform group-hover:scale-110 active:scale-95 shadow-2xl ${
                    isCompleted
                      ? 'bg-gradient-to-b from-cyan-900 via-slate-900 to-slate-950 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] text-cyan-300'
                      : isCurrent
                      ? 'bg-gradient-to-b from-purple-800 via-indigo-950 to-slate-950 border-3 border-purple-300 ring-4 ring-purple-500/50 shadow-[0_0_22px_rgba(168,85,247,0.9)] text-white animate-bounce'
                      : 'bg-slate-900/90 border-2 border-slate-700 text-slate-500 opacity-60'
                  } ${isBoss ? 'w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-red-500' : ''}`}
                >
                  {/* Inside Node Icon */}
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Swords className="w-5 h-5 text-purple-300 animate-spin" />
                  ) : isBoss ? (
                    <Skull className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}

                  {/* Level Number Tag */}
                  <span className="absolute -bottom-2 px-1.5 py-0.2 rounded bg-slate-950 border border-slate-700 text-[8px] font-mono font-bold text-slate-400">
                    Lv.{node.level}
                  </span>
                </div>

                {/* Node Opponent / Boss Name */}
                <span className="mt-2.5 px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-black text-slate-300 shadow max-w-[120px] truncate text-center">
                  {node.opponent}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SHADOW FIGHT 3 CINEMATIC DUEL BRIEFING CARD (BOTTOM DRAWER) */}
      {selectedNode && (
        <div className="relative z-30 p-3 sm:p-5 bg-gradient-to-b from-slate-950/95 to-slate-900 border-t-2 border-cyan-500/70 shadow-2xl backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Quest Lore & Opponent */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${selectedNode.diffColor}`}>
                  {selectedNode.difficulty} Difficulty
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Opponent: <strong className="text-white">{selectedNode.opponent}</strong>
                </span>
                {selectedNode.type === 'boss' && (
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-black border border-red-500/50 flex items-center gap-1">
                    <Skull className="w-3 h-3" /> CHAPTER BOSS
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {selectedNode.desc}
              </p>
            </div>

            {/* Right: Rewards & Action */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400">Energy</span>
                  <span className="font-black text-purple-400 font-mono">+{selectedNode.xp} XP</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400">Bounty</span>
                  <span className="font-black text-amber-300 font-mono">+{selectedNode.gold} 🪙</span>
                </div>
              </div>

              {/* Action Button */}
              {selectedNode.status === 'completed' ? (
                <button
                  onClick={handleEmbark}
                  className="game-btn-emerald px-4 py-2 text-xs font-black rounded-xl uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Trial</span>
                </button>
              ) : selectedNode.status === 'current' ? (
                <button
                  onClick={handleEmbark}
                  disabled={isEmbarking}
                  className="game-btn-shadow px-5 py-2.5 text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer animate-pulse"
                >
                  <Swords className="w-4 h-4" />
                  <span>{isEmbarking ? 'Entering...' : 'EMBARK DUEL'}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-600 border border-slate-800 text-xs font-bold uppercase flex items-center gap-1.5 cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlocks at Lv.{selectedNode.level}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
