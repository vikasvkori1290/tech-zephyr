import React, { useState, useRef } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Flame,
  Code2,
  Dumbbell,
  BookOpen,
  Sparkles,
  Zap,
  Clock,
  Trash2,
  CheckCircle2,
  Shield,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  Map,
  Volume2,
  VolumeX,
  Gift,
  Trophy,
  HardHat,
  Eye,
  EyeOff,
} from 'lucide-react';
import { GameButton, WoodCard, ParchmentCard, RibbonBanner } from './GameUI.jsx';
import { JourneyMap } from './JourneyMap.jsx';
import { WelcomeBackModal } from './WelcomeBackModal.jsx';
import { soundFx } from '../../services/soundFx.js';

const INITIAL_TASKS = [
  {
    id: 101,
    title: 'Code: Refactor Authentication Token Interceptor',
    category: 'coding',
    xp: 180,
    gold: 50,
    difficulty: 'Medium',
    completed: false,
    dueDate: '3:00 PM',
  },
  {
    id: 102,
    title: 'Vitality: 30-Minute Calisthenics & Core Circuit',
    category: 'fitness',
    xp: 150,
    gold: 40,
    difficulty: 'Hard',
    completed: false,
    dueDate: '6:00 PM',
  },
  {
    id: 103,
    title: 'Wisdom: Read 15 Pages of Distributed Systems',
    category: 'study',
    xp: 120,
    gold: 30,
    difficulty: 'Easy',
    completed: false,
    dueDate: '9:00 PM',
  },
  {
    id: 104,
    title: 'Focus Ritual: 45-min Deep Work Sprint',
    category: 'coding',
    xp: 140,
    gold: 35,
    difficulty: 'Medium',
    completed: true,
    dueDate: 'Completed',
  },
];

const CATEGORY_META = {
  coding: {
    label: 'Code Runic',
    icon: Code2,
    badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-500/50',
  },
  fitness: {
    label: 'Iron Vitality',
    icon: Dumbbell,
    badgeBg: 'bg-red-950 text-red-300 border-red-500/50',
  },
  study: {
    label: 'Scroll Wisdom',
    icon: BookOpen,
    badgeBg: 'bg-purple-950 text-purple-300 border-purple-500/50',
  },
};

export const ClashVillageHome = () => {
  // Game Player Stats matching Clash of Clans HUD
  const [playerStats, setPlayerStats] = useState({
    level: 7,
    currentXp: 1450,
    maxXp: 2000,
    gold: 3450,
    maxGold: 5000,
    elixir: 1450,
    maxElixir: 2000,
    gems: 120,
    trophies: 450,
    builders: '2/2',
    shieldTime: '2d 23h',
    streak: 5,
  });

  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('tasks'); // 'tasks' | 'map'
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showWelcomeChest, setShowWelcomeChest] = useState(false);
  const [speechBubbleDismissed, setSpeechBubbleDismissed] = useState(false);
  const [speechTipIndex, setSpeechTipIndex] = useState(0);

  // Flying XP Particle & celebration states
  const [flyingOrbs, setFlyingOrbs] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [isXpAnimating, setIsXpAnimating] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState(null);

  // New task inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('coding');
  const [newTaskXp, setNewTaskXp] = useState(150);

  const tips = [
    "Chief, you obviously know what you're doing. The whole village is counting on you!",
    "Chief! We have pending bounties on the right board. Complete them to earn gold & elixir!",
    "Every habit streak powers our village shield! Keep the fire burning, Chief!",
    "Great kingdoms are forged one task at a time. The builder huts are at your command!",
  ];

  const handleCycleTip = () => {
    soundFx.playClick();
    setSpeechTipIndex((prev) => (prev + 1) % tips.length);
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.playClick();
  };

  // Task checkoff flow with flying XP animation
  const handleToggleTask = (task, event) => {
    if (task.completed) {
      soundFx.playClick();
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: false } : t))
      );
      return;
    }

    // Trigger celebration
    soundFx.playTaskComplete();

    // Calculate orb starting point
    let startX = window.innerWidth - 180;
    let startY = window.innerHeight / 2;
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    // Target top right Elixir / XP meter
    const targetX = window.innerWidth - 220;
    const targetY = 32;

    const newOrbs = Array.from({ length: 8 }).map((_, idx) => ({
      id: `${Date.now()}-${idx}`,
      startX,
      startY,
      targetX,
      targetY,
      delay: idx * 55,
    }));

    setFlyingOrbs(newOrbs);

    // Floating text label
    setFloatingTexts((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `+${task.xp} XP`,
        subtext: `+${task.gold} Gold`,
        x: startX - 30,
        y: startY - 20,
      },
    ]);

    // Mark completed
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
    );

    // Update global resource gauges
    setIsXpAnimating(true);
    setPlayerStats((prev) => {
      let nextXp = prev.currentXp + task.xp;
      let nextLevel = prev.level;
      let nextMaxXp = prev.maxXp;
      let didLevelUp = false;

      if (nextXp >= prev.maxXp) {
        didLevelUp = true;
        nextLevel += 1;
        nextXp = nextXp - prev.maxXp;
        nextMaxXp = Math.round(prev.maxXp * 1.35);
      }

      if (didLevelUp) {
        setTimeout(() => {
          soundFx.playChestFanfare();
          setLevelUpMessage(`LEVEL UP! Chief reached Town Hall Level ${nextLevel}!`);
          setTimeout(() => setLevelUpMessage(null), 3500);
        }, 600);
      }

      return {
        ...prev,
        level: nextLevel,
        currentXp: nextXp,
        maxXp: nextMaxXp,
        gold: Math.min(prev.maxGold, prev.gold + task.gold),
        elixir: Math.min(prev.maxElixir, prev.elixir + task.xp),
      };
    });

    setTimeout(() => {
      setFlyingOrbs([]);
      setIsXpAnimating(false);
    }, 950);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.slice(1));
    }, 1400);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    soundFx.playCoin();
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      xp: Number(newTaskXp),
      gold: Math.round(Number(newTaskXp) * 0.3),
      difficulty: Number(newTaskXp) > 200 ? 'Hard' : Number(newTaskXp) > 120 ? 'Medium' : 'Easy',
      completed: false,
      dueDate: 'Today',
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddDrawer(false);
    // Auto-open sidebar so user sees their new quest!
    setSidebarOpen(true);
    setSidebarTab('tasks');
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const xpPercent = Math.min(100, Math.round((playerStats.currentXp / playerStats.maxXp) * 100));
  const goldPercent = Math.min(100, Math.round((playerStats.gold / playerStats.maxGold) * 100));
  const elixirPercent = Math.min(100, Math.round((playerStats.elixir / playerStats.maxElixir) * 100));

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-slate-950 font-sans">
      {/* LEVEL UP NOTIFICATION BANNER */}
      {levelUpMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-4 border-white shadow-[0_0_30px_rgba(251,191,36,0.9)] flex items-center gap-3 text-amber-950 font-black text-sm uppercase tracking-wider">
            <Trophy className="w-5 h-5 text-amber-950 fill-amber-950" />
            <span>{levelUpMessage}</span>
            <Sparkles className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>
      )}

      {/* FLYING XP ORBS ENGINE */}
      {flyingOrbs.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {flyingOrbs.map((orb) => (
            <div
              key={orb.id}
              className="absolute w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-200 border-2 border-white shadow-[0_0_16px_rgba(216,180,254,1)] animate-ping"
              style={{
                left: `${orb.startX}px`,
                top: `${orb.startY}px`,
                transform: `translate(${orb.targetX - orb.startX}px, ${orb.targetY - orb.startY}px) scale(0.6)`,
                transition: `all 650ms cubic-bezier(0.25, 1, 0.5, 1) ${orb.delay}ms`,
                opacity: 0.95,
              }}
            />
          ))}
        </div>
      )}

      {/* FLOATING +XP TEXT */}
      {floatingTexts.map((item) => (
        <div
          key={item.id}
          style={{ left: `${item.x}px`, top: `${item.y}px` }}
          className="fixed pointer-events-none z-50 flex flex-col items-center animate-float-subtle transition-all duration-1000 -translate-y-12 opacity-95"
        >
          <span className="text-xl font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wider">
            {item.text}
          </span>
          <span className="text-xs font-black text-yellow-200 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            🪙 {item.subtext}
          </span>
        </div>
      ))}

      {/* FULL VILLAGE BACKGROUND MATCHING THE USER IMAGE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/coc_village.png"
          alt="Clash of Clans Village"
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.03]"
        />

        {/* Ambient atmospheric lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 pointer-events-none" />

        {/* Ambient Chimney Smoke Particles */}
        <div className="absolute top-[52%] right-[18%] pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-white/40 blur-xs animate-float-slow" />
          <div className="w-4 h-4 rounded-full bg-white/20 blur-xs animate-float-slow -mt-2 -ml-1 delay-300" />
        </div>
      </div>

      {/* CLASH OF CLANS AUTHENTIC TOP HUD BAR */}
      <header className="relative z-30 w-full px-2 sm:px-4 py-2 flex items-start justify-between gap-2 pointer-events-auto">
        {/* Top Left: Level Shield, Trophies, Streak Shield */}
        <div className="flex items-center gap-2">
          {/* Level Shield */}
          <div className="relative flex items-center">
            <div className="w-10 h-11 sm:w-12 sm:h-13 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-950 rounded-lg border-2 border-white shadow-xl flex flex-col items-center justify-center text-white">
              <span className="text-base sm:text-lg font-black leading-none drop-shadow">
                {playerStats.level}
              </span>
              <div className="flex gap-0.5 mt-0.5">
                <span className="text-[8px] text-yellow-300">★</span>
                <span className="text-[8px] text-yellow-300">★</span>
              </div>
            </div>

            {/* XP Mini Bar under level badge */}
            <div className="hidden sm:flex flex-col ml-1.5 w-24">
              <div className="text-[9px] font-black text-sky-200 uppercase leading-none mb-0.5 drop-shadow">
                EXP: {playerStats.currentXp}
              </div>
              <div className="h-2 rounded-full bg-slate-950/80 border border-sky-400/60 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Trophy Badge (0 / 450) */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/80 border-2 border-amber-500/80 text-amber-200 font-black text-xs shadow-md">
            <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{playerStats.trophies}</span>
          </div>

          {/* Streak Flame Shield */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-950/80 border-2 border-orange-500/80 text-orange-300 font-black text-xs shadow-md">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-flame-flicker" />
            <span className="hidden sm:inline">{playerStats.streak}d Streak</span>
            <span className="sm:hidden">{playerStats.streak}d</span>
          </div>
        </div>

        {/* Top Center: Builders (2/2) & Village Shield (2d 23h) */}
        <div className="flex items-center gap-2">
          {/* Builders Indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 border-2 border-amber-600/70 text-amber-200 font-black text-xs shadow-md">
            <HardHat className="w-3.5 h-3.5 text-amber-400" />
            <span>{playerStats.builders}</span>
          </div>

          {/* Shield Timer */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 border-2 border-sky-500/70 text-sky-200 font-black text-xs shadow-md">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>{playerStats.shieldTime}</span>
          </div>
        </div>

        {/* Top Right: Gold, Elixir, Gems, Audio & Chest */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Gold Storage Meter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/90 border-2 border-amber-500/80 shadow-md">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-[10px] flex items-center justify-center text-amber-950 font-black shadow">
              🪙
            </div>
            <div className="hidden sm:flex flex-col text-right leading-none w-20">
              <span className="text-[8px] font-black text-amber-400 uppercase">Gold</span>
              <span className="text-xs font-black text-amber-100 font-mono">
                {playerStats.gold.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Elixir / XP Storage Meter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/90 border-2 border-purple-500/80 shadow-md transition-all ${
              isXpAnimating ? 'ring-2 ring-purple-300 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.8)]' : ''
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-fuchsia-300 text-[10px] flex items-center justify-center text-purple-950 font-black shadow">
              🧪
            </div>
            <div className="hidden sm:flex flex-col text-right leading-none w-20">
              <span className="text-[8px] font-black text-purple-400 uppercase">Elixir</span>
              <span className="text-xs font-black text-purple-100 font-mono">
                {playerStats.elixir.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Gems Pill */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-950/90 border-2 border-emerald-500/80 text-emerald-200 font-black text-xs shadow-md">
            <span>💎</span>
            <span className="font-mono">{playerStats.gems}</span>
          </div>

          {/* Daily Chest Trigger Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowWelcomeChest(true);
            }}
            title="Open Welcome Back Daily Chest"
            className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-400 to-amber-700 border-2 border-yellow-200 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <Gift className="w-4 h-4 text-amber-950 animate-bounce" />
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 rounded-xl bg-slate-900/90 border-2 border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* CLASH VILLAGER MAIDEN & SPEECH BUBBLE (BOTTOM LEFT EXACT REPLICA) */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-6 z-20 flex items-end gap-2 max-w-[85vw] sm:max-w-md pointer-events-auto">
        {/* Maiden Character Graphic / Clickable for tips */}
        <div
          onClick={handleCycleTip}
          className="relative flex-shrink-0 cursor-pointer group"
          title="Click to hear Chief advice!"
        >
          {/* Rendered Maiden Figure */}
          <div className="w-24 h-32 sm:w-32 sm:h-44 transition-transform group-hover:scale-105 active:scale-95">
            <svg viewBox="0 0 120 160" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
              {/* Hair Back */}
              <path d="M 25 35 Q 60 5 95 35 L 98 100 Q 60 115 22 100 Z" fill="#b9401f" />
              {/* Green Village Maiden Dress */}
              <path d="M 35 90 L 85 90 L 92 155 L 28 155 Z" fill="#2d6a4f" />
              {/* Yellow Corset Trim */}
              <polygon points="60,92 78,110 60,128 42,110" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              {/* Leather Belt & Buckle */}
              <path d="M 30 118 L 90 118 L 88 126 L 32 126 Z" fill="#78350f" />
              <rect x="54" y="115" width="12" height="14" rx="2" fill="#eab308" stroke="#713f12" strokeWidth="1.5" />
              {/* Leather Satchel on Hip */}
              <rect x="22" y="122" width="20" height="24" rx="4" fill="#854d0e" stroke="#451a03" strokeWidth="1.5" />
              <circle cx="28" cy="138" r="2" fill="#facc15" />
              <circle cx="36" cy="138" r="2" fill="#facc15" />
              {/* Arms & Hands (Gesturing Hand) */}
              <path d="M 30 85 Q 22 105 32 118" stroke="#fcd34d" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 85 85 Q 98 100 96 112" stroke="#fcd34d" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="98" cy="115" r="5" fill="#fcd34d" />
              {/* Face & Head */}
              <circle cx="60" cy="50" r="24" fill="#fde68a" />
              {/* Eyes */}
              <ellipse cx="50" cy="48" rx="4.5" ry="6" fill="#0284c7" />
              <circle cx="51" cy="46" r="1.5" fill="#ffffff" />
              <ellipse cx="70" cy="48" rx="4.5" ry="6" fill="#0284c7" />
              <circle cx="71" cy="46" r="1.5" fill="#ffffff" />
              {/* Cheeks & Smile */}
              <circle cx="44" cy="56" r="3" fill="#f87171" opacity="0.6" />
              <circle cx="76" cy="56" r="3" fill="#f87171" opacity="0.6" />
              <path d="M 54 58 Q 60 63 66 58" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Front Hair Bangs */}
              <path d="M 30 38 Q 60 20 90 38 Q 80 65 65 48 Q 50 68 30 38 Z" fill="#dc2626" />
            </svg>
          </div>
        </div>

        {/* Authentic Clash of Clans Speech Bubble */}
        {!speechBubbleDismissed && (
          <div
            onClick={handleCycleTip}
            className="coc-speech-bubble p-3 sm:p-4 mb-8 sm:mb-12 cursor-pointer max-w-[240px] sm:max-w-xs transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                Village Maiden
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSpeechBubbleDismissed(true);
                }}
                className="text-slate-400 hover:text-slate-700 text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug tracking-tight">
              {tips[speechTipIndex]}
            </p>
            <span className="block text-[9px] font-bold text-amber-800/70 mt-1">
              (Tap maiden to cycle advice)
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR TRIGGER BUTTONS (FLOATING DOCK) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Button 1: Quests & Todo Drawer Trigger */}
        <button
          onClick={() => {
            soundFx.playClick();
            setSidebarOpen(true);
            setSidebarTab('tasks');
          }}
          className="group flex items-center gap-2 pl-3 pr-2.5 py-2.5 rounded-l-2xl game-btn-gold border-r-0 shadow-2xl transition-transform hover:-translate-x-1 cursor-pointer"
        >
          <div className="flex flex-col items-end leading-none">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950">
              Quests & Todo
            </span>
            <span className="text-[10px] font-bold text-amber-900 mt-0.5">
              {pendingCount} Pending
            </span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-amber-950 text-amber-100 flex items-center justify-center font-black text-xs shadow">
            📜
          </div>
        </button>

        {/* Button 2: Journey Map Trigger */}
        <button
          onClick={() => {
            soundFx.playClick();
            setSidebarOpen(true);
            setSidebarTab('map');
          }}
          className="group flex items-center gap-2 pl-3 pr-2.5 py-2.5 rounded-l-2xl bg-gradient-to-b from-indigo-600 to-indigo-900 border-t border-indigo-300 border-b-4 border-indigo-950 text-white shadow-2xl transition-transform hover:-translate-x-1 cursor-pointer"
        >
          <div className="flex flex-col items-end leading-none">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-100">
              Journey Map
            </span>
            <span className="text-[10px] font-bold text-indigo-300 mt-0.5">
              Level {playerStats.level}
            </span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-200 flex items-center justify-center font-black text-xs shadow">
            🗺️
          </div>
        </button>
      </div>

      {/* RIGHT SIDEBAR POP-UP DRAWER (FOR TASKS, TODO, AND JOURNEY MAP) */}
      {sidebarOpen && (
        <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-slate-950/95 backdrop-blur-md border-l-4 border-amber-900 shadow-2xl animate-drawer-slide flex flex-col pointer-events-auto">
          {/* Drawer Header with Wood Plaque Styling */}
          <div className="wood-card rounded-none border-t-0 border-x-0 border-b-4 border-amber-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              <div>
                <h3 className="text-base font-black text-amber-200 uppercase tracking-tight leading-none">
                  Chief's War Board
                </h3>
                <span className="text-[10px] font-bold text-amber-400/80">
                  {pendingCount} active bounties • Earn XP & Gold
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tabs Switcher */}
              <div className="flex rounded-lg bg-slate-950/80 p-0.5 border border-amber-800/60">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSidebarTab('tasks');
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-black transition-all cursor-pointer ${
                    sidebarTab === 'tasks'
                      ? 'bg-amber-500 text-amber-950 shadow'
                      : 'text-amber-300 hover:text-white'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSidebarTab('map');
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-black transition-all cursor-pointer ${
                    sidebarTab === 'map'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  Map
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSidebarOpen(false);
                }}
                className="w-7 h-7 rounded-lg bg-red-800 hover:bg-red-700 text-white font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sidebarTab === 'tasks' ? (
              <>
                {/* Task Checklist Items */}
                {tasks.map((task) => {
                  const cat = CATEGORY_META[task.category] || CATEGORY_META.coding;
                  const CatIcon = cat.icon;

                  return (
                    <div
                      key={task.id}
                      className={`relative rounded-xl p-3 border-2 transition-all flex items-center gap-3 ${
                        task.completed
                          ? 'bg-slate-900/60 border-emerald-900/40 opacity-75'
                          : 'parchment-card hover:translate-x-1'
                      }`}
                    >
                      {/* Checkbox Trigger with Flying XP Orbs Animation */}
                      <button
                        onClick={(e) => handleToggleTask(task, e)}
                        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shadow transition-all ${
                          task.completed
                            ? 'bg-emerald-600 text-white border-2 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-2 border-amber-700 hover:scale-110 active:scale-95'
                        }`}
                      >
                        {task.completed ? (
                          <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <Square className="w-4 h-4 opacity-40 hover:opacity-100" />
                        )}
                      </button>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${cat.badgeBg}`}>
                            {cat.label}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500">
                            {task.dueDate}
                          </span>
                        </div>
                        <h4
                          className={`text-xs font-black leading-snug truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-amber-950'
                          }`}
                        >
                          {task.title}
                        </h4>
                      </div>

                      {/* Reward Badge */}
                      <div className="flex-shrink-0 flex flex-col items-end leading-none">
                        <span className="text-xs font-black text-purple-700">
                          +{task.xp} XP
                        </span>
                        <span className="text-[10px] font-bold text-amber-900 mt-0.5">
                          🪙 +{task.gold}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add trigger inside drawer */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setShowAddDrawer(true);
                  }}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-amber-600/70 bg-amber-950/20 text-amber-300 hover:bg-amber-900/30 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Post Another Bounty</span>
                </button>
              </>
            ) : (
              /* Embedded Journey Map in the Sidebar */
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200">
                  <span className="font-black text-indigo-100">Candy Crush Journey:</span> Tap nodes to preview milestone trials!
                </div>
                <JourneyMap
                  currentAvatarNode={playerStats.level}
                  onSelectQuest={(quest) => {
                    setSidebarTab('tasks');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* CENTER BOTTOM "ADDING THING" (ACTION DOCK WITH GREAT SPRING ANIMATION) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto">
        {!showAddDrawer ? (
          /* Idle Action Button: 3D Clash of Clans Style Center Button */
          <div className="relative group">
            {/* Glowing Aura Ring */}
            <div className="absolute -inset-2 rounded-2xl bg-amber-400/30 blur-md animate-pulse pointer-events-none" />

            <button
              onClick={() => {
                soundFx.playClick();
                setShowAddDrawer(true);
              }}
              className="relative px-6 py-3 rounded-2xl game-btn-gold font-black text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-950 text-amber-200 flex items-center justify-center text-xs font-black shadow">
                ⚔️
              </div>
              <span>POST NEW BOUNTY</span>
              <Plus className="w-4 h-4 stroke-[3] text-amber-950" />
            </button>
          </div>
        ) : (
          /* Expanded Parchment Adding Drawer with Nice Spring Animation */
          <div className="w-[92vw] sm:w-[460px] animate-spring-up">
            <ParchmentCard className="border-4 border-amber-800 shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setShowAddDrawer(false)}
                className="absolute top-2 right-2 w-6 h-6 rounded-md bg-amber-900/30 hover:bg-amber-900/60 text-amber-950 font-black text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📜</span>
                <h3 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-tight">
                  Nail New Quest to War Board
                </h3>
              </div>

              <form onSubmit={handleAddTask} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter quest objective (e.g., Deploy API, 50 Pushups)..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-amber-50 border-2 border-amber-800/60 text-amber-950 placeholder-amber-800/50 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-amber-950 mb-0.5">
                      Guild Realm
                    </label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-800/60 text-amber-950 font-bold text-xs focus:outline-none"
                    >
                      <option value="coding">💻 Code Runic</option>
                      <option value="fitness">🏋️ Iron Vitality</option>
                      <option value="study">📚 Scroll Wisdom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-amber-950 mb-0.5">
                      XP Reward Bounty
                    </label>
                    <select
                      value={newTaskXp}
                      onChange={(e) => setNewTaskXp(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-800/60 text-amber-950 font-bold text-xs focus:outline-none"
                    >
                      <option value="100">100 XP (Quick Trial)</option>
                      <option value="150">150 XP (Standard Quest)</option>
                      <option value="250">250 XP (Heavy Epic)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <GameButton
                    type="button"
                    variant="stone"
                    size="sm"
                    onClick={() => setShowAddDrawer(false)}
                  >
                    Cancel
                  </GameButton>
                  <GameButton type="submit" variant="gold" size="sm">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Nail to Board</span>
                  </GameButton>
                </div>
              </form>
            </ParchmentCard>
          </div>
        )}
      </div>

      {/* WELCOME BACK DAILY CHEST POPUP */}
      <WelcomeBackModal
        isOpen={showWelcomeChest}
        onClose={() => setShowWelcomeChest(false)}
        onClaimBonus={({ xp, gold, gems }) => {
          setPlayerStats((prev) => ({
            ...prev,
            currentXp: prev.currentXp + xp,
            gold: prev.gold + gold,
            gems: prev.gems + gems,
          }));
        }}
      />
    </div>
  );
};
