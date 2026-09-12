import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  Star,
  Sparkles,
  Trophy,
  Flame,
  Code2,
  Dumbbell,
  BookOpen,
  Crown,
  ChevronRight,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { GameButton, WoodCard, ParchmentCard, RibbonBanner, MascotAvatar } from './GameUI.jsx';
import { soundFx } from '../../services/soundFx.js';

// 12 Nodes across 4 Biomes
export const QUEST_NODES = [
  // Zone 1: Syntax Citadel (Coding)
  {
    id: 1,
    level: 1,
    title: 'Hello World Gateway',
    biome: 'syntax',
    status: 'completed',
    stars: 3,
    xp: 100,
    gold: 50,
    category: 'Coding',
    desc: 'Deploy your foundational development environment and clear the syntax fog.',
    subtasks: ['Configure Git repository', 'Initialize dev server', 'Write first test'],
    x: 50, // percentage in path
    y: 92,
  },
  {
    id: 2,
    level: 2,
    title: 'Loop of Recursion',
    biome: 'syntax',
    status: 'completed',
    stars: 3,
    xp: 150,
    gold: 60,
    category: 'Coding',
    desc: 'Traverse the ancient iterative catacombs without triggering an infinite loop.',
    subtasks: ['Refactor nested loops', 'Optimize time complexity', 'Pass test assertions'],
    x: 24,
    y: 84,
  },
  {
    id: 3,
    level: 3,
    title: 'Citadel Boss: Bug Slayer',
    biome: 'syntax',
    status: 'completed',
    stars: 3,
    xp: 220,
    gold: 100,
    isBoss: true,
    category: 'Coding',
    desc: 'Defeat the Memory Leak Wyrm by patching the asynchronous event listener leaks.',
    subtasks: ['Inspect DevTools heap profile', 'Clean up unmounted effects', 'Deploy hotfix patch'],
    x: 65,
    y: 77,
  },

  // Zone 2: Iron Bastion (Fitness & Vitality)
  {
    id: 4,
    level: 4,
    title: 'The Granite Warmup',
    biome: 'iron',
    status: 'completed',
    stars: 2,
    xp: 160,
    gold: 70,
    category: 'Fitness',
    desc: 'Ascend the rugged mountain crags with high cadence and steady breathing.',
    subtasks: ['15-minute dynamic stretch', '3 km brisk jog or incline march', 'Hydration quota: 1 Liter'],
    x: 78,
    y: 68,
  },
  {
    id: 5,
    level: 5,
    title: 'Anvil Strength Trial',
    biome: 'iron',
    status: 'completed',
    stars: 3,
    xp: 200,
    gold: 90,
    category: 'Fitness',
    desc: 'Forge your core discipline against the iron barbells of the titan smithy.',
    subtasks: ['4 sets heavy compound lifts', '100 pushups across the day', 'Clean post-workout meal'],
    x: 35,
    y: 61,
  },
  {
    id: 6,
    level: 6,
    title: 'Bastion Boss: Colossus March',
    biome: 'iron',
    status: 'completed',
    stars: 3,
    xp: 280,
    gold: 140,
    isBoss: true,
    category: 'Fitness',
    desc: 'Endure the 10,000 Step Gauntlet across the volcanic ridgeline to claim the Iron Crest.',
    subtasks: ['Hit 10k step milestone', 'Cold recovery plunge or stretch', 'Log 8 hours sleep cycle'],
    x: 20,
    y: 52,
  },

  // Zone 3: Scroll Sanctuary (Study & Wisdom)
  {
    id: 7,
    level: 7,
    title: 'Chamber of Deep Focus',
    biome: 'scroll',
    status: 'current', // CURRENT NODE
    stars: 0,
    xp: 250,
    gold: 120,
    category: 'Study',
    desc: 'Channel the mystic twilight runes to achieve 90 uninterrupted minutes of flow state.',
    subtasks: ['Set phone to do-not-disturb', 'Complete 2 Pomodoro focus blocks', 'Summarize key insights in notes'],
    x: 62,
    y: 43,
  },
  {
    id: 8,
    level: 8,
    title: 'Librarian Codex Decode',
    biome: 'scroll',
    status: 'locked',
    stars: 0,
    xp: 300,
    gold: 150,
    category: 'Study',
    desc: 'Unravel the sacred texts of system architecture and distribute the knowledge cache.',
    subtasks: ['Read 2 chapters tech publication', 'Draft architecture diagram', 'Share learnings with guild'],
    x: 75,
    y: 34,
  },
  {
    id: 9,
    level: 9,
    title: 'Sanctuary Boss: Arch-Scholar',
    biome: 'scroll',
    status: 'locked',
    stars: 0,
    xp: 380,
    gold: 200,
    isBoss: true,
    category: 'Study',
    desc: 'Synthesize your accumulated knowledge to craft a complete project specification document.',
    subtasks: ['Publish project blueprint', 'Score 90%+ on retention recall', 'Earn Wisdom Sigil'],
    x: 32,
    y: 26,
  },

  // Zone 4: Treasure Trove & Dragon's Spire (Rewards & Mastery)
  {
    id: 10,
    level: 10,
    title: 'The Gilded Steppes',
    biome: 'treasure',
    status: 'locked',
    stars: 0,
    xp: 400,
    gold: 250,
    category: 'Rewards',
    desc: 'Trek across dunes of shimmering coin hoard into the sacred valley of earned achievements.',
    subtasks: ['Review monthly productivity milestones', 'Redeem real-world reward break', 'Recharge spiritual mana'],
    x: 48,
    y: 18,
  },
  {
    id: 11,
    level: 11,
    title: 'Rainbow Crystal Cavern',
    biome: 'treasure',
    status: 'locked',
    stars: 0,
    xp: 450,
    gold: 300,
    category: 'Rewards',
    desc: 'Extract luminous life gems by maintaining a pristine unbroken habit streak.',
    subtasks: ['Sustain 7-day master streak', 'Clean task queue to 0', 'Mentor a peer in community'],
    x: 72,
    y: 11,
  },
  {
    id: 12,
    level: 12,
    title: 'Apex Sovereign: The Dragon Throne',
    biome: 'treasure',
    status: 'locked',
    stars: 0,
    xp: 600,
    gold: 500,
    isBoss: true,
    category: 'Rewards',
    desc: 'The pinnacle of the Life RPG. Crown yourself sovereign of self-mastery and supreme discipline.',
    subtasks: ['Conquer all quarterly epic goals', 'Unlock the Grandmaster Avatar skin', 'Enter the Hall of Immortals'],
    x: 50,
    y: 4,
  },
];

export const JourneyMap = ({ onSelectQuest, currentAvatarNode = 7 }) => {
  const [selectedNode, setSelectedNode] = useState(QUEST_NODES.find((n) => n.id === currentAvatarNode) || QUEST_NODES[6]);
  const [avatarNodeId, setAvatarNodeId] = useState(currentAvatarNode);
  const [isEmbarking, setIsEmbarking] = useState(false);

  const activeAvatarNode = QUEST_NODES.find((n) => n.id === avatarNodeId) || QUEST_NODES[6];

  const handleNodeClick = (node) => {
    soundFx.playClick();
    setSelectedNode(node);
    if (node.status !== 'locked') {
      setAvatarNodeId(node.id);
    }
  };

  const handleEmbark = () => {
    soundFx.playTaskComplete();
    setIsEmbarking(true);
    setTimeout(() => {
      setIsEmbarking(false);
      if (onSelectQuest) {
        onSelectQuest(selectedNode);
      }
    }, 600);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4 py-6">
      {/* World Map Header Banner */}
      <div className="text-center mb-6">
        <RibbonBanner
          title="World Progression Map"
          subtitle="Walk the path of trials • Unlock realms & claim your sovereignty"
          variant="gold"
          className="mx-auto"
        />
        <div className="mt-3 flex items-center justify-center gap-2 sm:gap-6 text-xs font-bold text-amber-200">
          <span className="flex items-center gap-1 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-600/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 6 Claimed
          </span>
          <span className="flex items-center gap-1 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/60 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Current: Level 7
          </span>
          <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-400" /> 5 Locked
          </span>
        </div>
      </div>

      {/* Main Map Canvas Board */}
      <div className="relative rounded-3xl overflow-hidden wood-card shadow-2xl border-4 border-amber-900/90 p-3 sm:p-6 min-h-[960px] select-none">
        {/* The 4 Themed Biome Backdrop Zones (Stacked vertically) */}
        <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
          {/* Biome 4: Treasure Trove (Top) */}
          <div className="relative flex-1 bg-gradient-to-b from-amber-600/30 via-yellow-700/20 to-indigo-950/30 overflow-hidden border-b border-yellow-500/30">
            <div className="absolute top-4 left-6 flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-xl border border-yellow-400/40 text-yellow-300 text-xs font-black">
              <Crown className="w-4 h-4 text-yellow-400" />
              ZONE IV: TREASURE TROVE & DRAGON'S SPIRE
            </div>
            {/* Scenery graphics */}
            <div className="absolute top-10 right-12 opacity-40 text-6xl">🏰</div>
            <div className="absolute top-24 left-16 opacity-30 text-4xl">👑</div>
            <div className="absolute bottom-8 right-24 opacity-30 text-5xl">💎</div>
            {/* Shimmering motes */}
            <div className="absolute top-6 left-1/3 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
          </div>

          {/* Biome 3: Scroll Sanctuary (Upper-Middle) */}
          <div className="relative flex-1 bg-gradient-to-b from-indigo-950/40 via-purple-900/30 to-slate-900/40 overflow-hidden border-b border-purple-500/30">
            <div className="absolute top-4 left-6 flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-xl border border-purple-400/40 text-purple-300 text-xs font-black">
              <BookOpen className="w-4 h-4 text-purple-400" />
              ZONE III: SCROLL SANCTUARY & MYSTIC ASTRAL CODEX
            </div>
            <div className="absolute top-14 left-10 opacity-35 text-5xl">📖</div>
            <div className="absolute top-8 right-16 opacity-30 text-5xl">✨</div>
            <div className="absolute bottom-6 left-28 opacity-30 text-4xl">🕯️</div>
            <div className="absolute top-10 right-1/4 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl" />
          </div>

          {/* Biome 2: Iron Bastion (Lower-Middle) */}
          <div className="relative flex-1 bg-gradient-to-b from-slate-900/40 via-red-950/30 to-amber-950/40 overflow-hidden border-b border-red-500/30">
            <div className="absolute top-4 left-6 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-1 rounded-xl border border-red-400/40 text-red-300 text-xs font-black">
              <Dumbbell className="w-4 h-4 text-red-400" />
              ZONE II: IRON BASTION & VOLCANIC CRAGS
            </div>
            <div className="absolute top-12 right-12 opacity-35 text-5xl">🌋</div>
            <div className="absolute bottom-8 left-16 opacity-30 text-5xl">⚔️</div>
            <div className="absolute top-24 left-12 opacity-30 text-4xl">🔥</div>
            <div className="absolute bottom-6 right-1/3 w-32 h-32 bg-red-500/15 rounded-full blur-2xl" />
          </div>

          {/* Biome 1: Syntax Citadel (Bottom) */}
          <div className="relative flex-1 bg-gradient-to-b from-cyan-950/30 via-slate-950/60 to-slate-950 overflow-hidden">
            <div className="absolute top-4 left-6 flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm px-3 py-1 rounded-xl border border-cyan-400/40 text-cyan-300 text-xs font-black">
              <Code2 className="w-4 h-4 text-cyan-400" />
              ZONE I: SYNTAX CITADEL & RUNIC TERMINALS
            </div>
            <div className="absolute top-12 left-14 opacity-35 text-5xl">⚡</div>
            <div className="absolute bottom-10 right-16 opacity-35 text-5xl">💻</div>
            <div className="absolute top-20 right-28 opacity-30 text-4xl">🔮</div>
            <div className="absolute bottom-6 left-1/4 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Winding Serpentine Path SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            {/* Golden Cobblestone Path Gradient */}
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="30%" stopColor="#ef4444" />
              <stop offset="65%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <filter id="pathShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Dirt / Stone Bed Layer (wider) */}
          <path
            d="M 50 92 C 10 88 15 80 24 84 C 35 88 80 82 65 77 C 50 72 90 73 78 68 C 65 63 25 66 35 61 C 45 56 10 57 20 52 C 30 47 75 48 62 43 C 50 38 85 39 75 34 C 65 29 20 31 32 26 C 44 21 35 23 48 18 C 60 13 85 16 72 11 C 60 6 55 9 50 4"
            fill="none"
            stroke="#271a0c"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#pathShadow)"
          />

          {/* Cobblestone Border Trim */}
          <path
            d="M 50 92 C 10 88 15 80 24 84 C 35 88 80 82 65 77 C 50 72 90 73 78 68 C 65 63 25 66 35 61 C 45 56 10 57 20 52 C 30 47 75 48 62 43 C 50 38 85 39 75 34 C 65 29 20 31 32 26 C 44 21 35 23 48 18 C 60 13 85 16 72 11 C 60 6 55 9 50 4"
            fill="none"
            stroke="#78350f"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Luminous Inner Path with Dash Animation */}
          <path
            d="M 50 92 C 10 88 15 80 24 84 C 35 88 80 82 65 77 C 50 72 90 73 78 68 C 65 63 25 66 35 61 C 45 56 10 57 20 52 C 30 47 75 48 62 43 C 50 38 85 39 75 34 C 65 29 20 31 32 26 C 44 21 35 23 48 18 C 60 13 85 16 72 11 C 60 6 55 9 50 4"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="1.8"
            strokeDasharray="2, 2"
            strokeLinecap="round"
          />
        </svg>

        {/* Numbered Path Nodes */}
        <div className="relative z-20 w-full h-full">
          {QUEST_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isCurrent = node.status === 'current';
            const isCompleted = node.status === 'completed';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                onClick={() => handleNodeClick(node)}
              >
                {/* Node Pill Halo on Hover or Selected */}
                {isSelected && (
                  <div className="absolute -inset-3 rounded-full bg-amber-400/30 blur-md animate-ping pointer-events-none" />
                )}

                {/* CURRENT NODE PULSING HALO */}
                {isCurrent && (
                  <div className="absolute -inset-4 rounded-full bg-purple-500/40 blur-lg animate-pulse-ring pointer-events-none" />
                )}

                {/* The Node Disc */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-lg transition-transform transform group-hover:scale-110 active:scale-95 shadow-2xl select-none ${
                    isCompleted
                      ? 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 text-amber-950 border-4 border-yellow-200 shadow-amber-500/40'
                      : isCurrent
                      ? 'bg-gradient-to-b from-purple-400 via-fuchsia-600 to-indigo-900 text-white border-4 border-purple-200 ring-4 ring-purple-400/60 shadow-purple-500/50 animate-bounce'
                      : 'bg-gradient-to-b from-slate-600 to-slate-800 text-slate-400 border-4 border-slate-700 shadow-black/60'
                  } ${node.isBoss ? 'w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-yellow-400' : ''}`}
                >
                  {/* Inner Node Content */}
                  {isCompleted ? (
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-sm font-black">{node.level}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-950 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-sm font-black">{node.level}</span>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center leading-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 mt-0.5">{node.level}</span>
                    </div>
                  )}

                  {/* Boss Crown Indicator */}
                  {node.isBoss && (
                    <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-400 border border-amber-800 flex items-center justify-center shadow-md">
                      <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                    </div>
                  )}
                </div>

                {/* Stars below completed node */}
                {isCompleted && (
                  <div className="flex gap-0.5 mt-1 bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-amber-500/40">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-2.5 h-2.5 ${
                          starIdx <= node.stars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Current node banner */}
                {isCurrent && (
                  <div className="mt-1 px-2 py-0.5 rounded-md bg-purple-600 border border-purple-200 text-[9px] font-black text-white tracking-widest uppercase shadow-md animate-pulse">
                    CURRENT
                  </div>
                )}

                {/* Node Title Tooltip / Label */}
                <span className="mt-1 max-w-[100px] text-center text-[10px] font-extrabold text-amber-100 bg-slate-950/90 px-1.5 py-0.5 rounded border border-amber-900/60 shadow truncate hidden sm:block">
                  {node.title}
                </span>
              </div>
            );
          })}

          {/* USER AVATAR ON THE PATH */}
          {activeAvatarNode && (
            <div
              style={{
                left: `${activeAvatarNode.x}%`,
                top: `${activeAvatarNode.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-[120%] z-30 transition-all duration-700 ease-out pointer-events-none"
            >
              <MascotAvatar
                size="sm"
                level={7}
                speech="Onward to mastery!"
                title=""
                animated={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Slide-Up Quest Detail Modal / Card */}
      {selectedNode && (
        <div className="mt-6">
          <ParchmentCard
            stamp={
              selectedNode.status === 'completed'
                ? 'CLAIMED'
                : selectedNode.status === 'current'
                ? 'ACTIVE'
                : 'LOCKED'
            }
            className="border-4 border-amber-800 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Left Column: Quest Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-100 text-xs font-black uppercase">
                    Level {selectedNode.level} Milestone
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-800/20 text-amber-950 text-xs font-bold border border-amber-900/30">
                    {selectedNode.category} Biome
                  </span>
                  {selectedNode.isBoss && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-black flex items-center gap-1">
                      <Crown className="w-3 h-3" /> BOSS TRIAL
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight mb-2">
                  {selectedNode.title}
                </h3>
                <p className="text-sm text-amber-900/90 font-medium leading-relaxed mb-4">
                  {selectedNode.desc}
                </p>

                {/* Subtask / Requirements checklist */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
                    Quest Objectives:
                  </span>
                  {selectedNode.subtasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-amber-900 font-semibold">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          selectedNode.status === 'completed'
                            ? 'text-emerald-700'
                            : 'text-amber-600/70'
                        }`}
                      />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Rewards & Actions */}
              <div className="sm:w-64 bg-amber-900/10 p-4 rounded-xl border border-amber-900/20 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider block mb-2">
                    Bounty Rewards:
                  </span>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-950/10 text-amber-950 font-black text-xs">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      +{selectedNode.xp} XP
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-950/10 text-amber-950 font-black text-xs">
                      🪙 +{selectedNode.gold} Gold
                    </div>
                  </div>
                </div>

                {/* Action button based on state */}
                {selectedNode.status === 'completed' ? (
                  <GameButton
                    variant="emerald"
                    size="md"
                    onClick={handleEmbark}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Replay Trial
                  </GameButton>
                ) : selectedNode.status === 'current' ? (
                  <GameButton
                    variant="gold"
                    size="md"
                    onClick={handleEmbark}
                    disabled={isEmbarking}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 fill-amber-950" />
                    {isEmbarking ? 'Embarking...' : 'Embark on Quest'}
                  </GameButton>
                ) : (
                  <GameButton
                    variant="stone"
                    size="md"
                    disabled={true}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4" />
                    Unlocks at LVL {selectedNode.level}
                  </GameButton>
                )}
              </div>
            </div>
          </ParchmentCard>
        </div>
      )}
    </div>
  );
};
