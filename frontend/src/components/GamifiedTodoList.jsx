import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreateQuestModal } from './CreateQuestModal.jsx';
import { DailyMilestoneModal } from './DailyMilestoneModal.jsx';
import { LevelUpCelebrationModal } from './LevelUpCelebrationModal.jsx';
import { StreakWarningModal } from './StreakWarningModal.jsx';
import {
  Sword,
  Book,
  Hammer,
  Scroll,
  Sparkles,
  Check,
  Plus,
  Flame,
  Coins,
  Gem,
  Trophy,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ChevronDown,
  Shield,
  User
} from 'lucide-react';

// Web Audio sound synthesizer for responsive tactile audio feedback (no external assets)
const playSound = (type, enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'stamp') {
      // Deep thud followed by bright brass chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);

      // Gold shimmer overtone
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.frequency.setValueAtTime(587.33, now + 0.05); // D5
      chime.frequency.exponentialRampToValueAtTime(880, now + 0.2); // A5
      chimeGain.gain.setValueAtTime(0.2, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      chime.start(now + 0.05);
      chime.stop(now + 0.3);
    } else if (type === 'uncheck') {
      // Paper rustle thud
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'click') {
      // Wood-click tap
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'levelup') {
      // Heroic triumphant fanfare
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.connect(g);
        g.connect(ctx.destination);
        const startTime = now + idx * 0.09;
        o.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime(0.25, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        o.start(startTime);
        o.stop(startTime + 0.3);
      });
    }
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

// Categories configuration with icons, colors, and labels
export const QUEST_CATEGORIES = {
  physical: {
    id: 'physical',
    name: 'Physical',
    icon: Sword,
    badgeBg: 'bg-rose-900/80 text-rose-200 border-rose-700/60',
    sealColor: '#b91c1c',
  },
  study: {
    id: 'study',
    name: 'Study',
    icon: Book,
    badgeBg: 'bg-sky-900/80 text-sky-200 border-sky-700/60',
    sealColor: '#0369a1',
  },
  work: {
    id: 'work',
    name: 'Work',
    icon: Hammer,
    badgeBg: 'bg-amber-900/80 text-amber-200 border-amber-700/60',
    sealColor: '#b45309',
  },
  errands: {
    id: 'errands',
    name: 'Errands',
    icon: Scroll,
    badgeBg: 'bg-emerald-900/80 text-emerald-200 border-emerald-700/60',
    sealColor: '#047857',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    icon: Sparkles,
    badgeBg: 'bg-purple-900/80 text-purple-200 border-purple-700/60',
    sealColor: '#7e22ce',
  },
};

// Difficulty reward settings
export const QUEST_DIFFICULTIES = {
  easy: { id: 'easy', label: 'Easy', xp: 25, gold: 10, color: 'text-emerald-300 border-emerald-700/50 bg-emerald-950/40' },
  medium: { id: 'medium', label: 'Medium', xp: 50, gold: 25, color: 'text-amber-300 border-amber-700/50 bg-amber-950/40' },
  hard: { id: 'hard', label: 'Hard', xp: 100, gold: 50, color: 'text-rose-300 border-rose-700/50 bg-rose-950/40' },
  epic: { id: 'epic', label: 'Epic', xp: 200, gold: 100, color: 'text-purple-300 border-purple-700/50 bg-purple-950/40' },
};

// Initial sample quests (real to-do tasks)
const INITIAL_QUESTS = [
  {
    id: 'quest-1',
    title: 'Morning 5km Run & Mobility Stretch',
    category: 'physical',
    difficulty: 'medium',
    completed: false,
    dueDate: 'Today, 8:00 AM',
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'quest-2',
    title: 'Finish Frontend Architecture Refactor',
    category: 'work',
    difficulty: 'hard',
    completed: false,
    dueDate: 'Today, 4:30 PM',
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'quest-3',
    title: 'Read Chapter 4 of System Design Book',
    category: 'study',
    difficulty: 'easy',
    completed: true,
    dueDate: 'Yesterday',
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'quest-4',
    title: 'Weekly Grocery Run & Meal Prep',
    category: 'errands',
    difficulty: 'medium',
    completed: false,
    dueDate: 'Tomorrow',
    createdAt: Date.now() - 3600000 * 1,
  },
];

export const GamifiedTodoList = () => {
  // Real to-do app state
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Gamification metrics
  const [level, setLevel] = useState(14);
  const [currentXp, setCurrentXp] = useState(650);
  const xpPerLevel = 1000;
  const [gold, setGold] = useState(1450);
  const [gems, setGems] = useState(85);
  const [streakDays, setStreakDays] = useState(5);
  const [showLevelUpToast, setShowLevelUpToast] = useState(false);

  // Snappy Completion Sequence State
  const [animatingCardId, setAnimatingCardId] = useState(null);
  const [stampedCardId, setStampedCardId] = useState(null);
  const [floatingRewards, setFloatingRewards] = useState([]); // { id, questId, xp, gold }
  const [levelUpModal, setLevelUpModal] = useState({ isOpen: false, oldLevel: 14, newLevel: 15 });
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(true);
  const [isStreakWarningOpen, setIsStreakWarningOpen] = useState(false);

  // Handle task completion toggle (marks complete, updates XP and Gold with snappy sequence)
  const handleToggleQuest = (questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const isCompleting = !quest.completed;
    const diff = QUEST_DIFFICULTIES[quest.difficulty] || QUEST_DIFFICULTIES.medium;

    if (isCompleting) {
      // 1. Tactile sound & stamp bounce trigger
      playSound('stamp', soundEnabled);
      setStampedCardId(questId);
      setAnimatingCardId(questId);

      // 2. Spawn floating "+XX XP" & "+XX Gold" numbers near the card
      const rewardId = `${questId}-${Date.now()}`;
      setFloatingRewards((prev) => [
        ...prev,
        { id: rewardId, questId, xp: diff.xp, gold: diff.gold },
      ]);

      // Remove floating reward after 850ms animation finishes
      setTimeout(() => {
        setFloatingRewards((prev) => prev.filter((r) => r.id !== rewardId));
      }, 850);

      // 3. Clear card flash animation after 550ms
      setTimeout(() => {
        setAnimatingCardId(null);
        setStampedCardId(null);
      }, 550);

      // 4. Calculate new XP and Level
      const newXpTotal = currentXp + diff.xp;
      let newLvl = level;
      const willLevelUp = newXpTotal >= xpPerLevel;

      if (willLevelUp) {
        newLvl += Math.floor(newXpTotal / xpPerLevel);
        const remainingXp = newXpTotal % xpPerLevel;

        // Animate XP bar full first, then trigger Level Up Modal
        setCurrentXp(newXpTotal);
        setGold((prev) => prev + diff.gold);

        setTimeout(() => {
          setLevel(newLvl);
          setCurrentXp(remainingXp);
          setLevelUpModal({
            isOpen: true,
            oldLevel: level,
            newLevel: newLvl,
            questTitle: quest.title,
          });
          playSound('levelup', soundEnabled);
        }, 500);
      } else {
        // Smooth 600ms animated XP meter progression
        setCurrentXp(newXpTotal);
        setGold((prev) => prev + diff.gold);
      }
    } else {
      playSound('uncheck', soundEnabled);
      let newXpTotal = currentXp - diff.xp;
      let newLvl = level;
      if (newXpTotal < 0) {
        if (newLvl > 1) {
          newLvl -= 1;
          newXpTotal = xpPerLevel + newXpTotal;
        } else {
          newXpTotal = 0;
        }
      }
      setLevel(newLvl);
      setCurrentXp(newXpTotal);
      setGold((prev) => Math.max(0, prev - diff.gold));
    }

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: !q.completed } : q))
    );
  };

  // Add new quest handler (inserts at top of quest list, structured for easy API transition)
  const handleCreateQuest = (newQuestData) => {
    setQuests((prev) => [newQuestData, ...prev]);
    playSound('click', soundEnabled);
  };

  // Delete quest
  const handleDeleteQuest = (questId, e) => {
    e.stopPropagation();
    playSound('click', soundEnabled);
    setQuests(quests.filter((q) => q.id !== questId));
  };

  // Filtered quests
  const filteredQuests = useMemo(() => {
    return quests.filter((quest) => {
      const statusMatch =
        filter === 'all' ? true : filter === 'completed' ? quest.completed : !quest.completed;
      const categoryMatch = categoryFilter === 'all' || quest.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [quests, filter, categoryFilter]);

  const completedCount = quests.filter((q) => q.completed).length;
  const activeCount = quests.length - completedCount;
  const xpPercent = Math.min(100, Math.round((currentXp / xpPerLevel) * 100));

  return (
    <div className="relative min-h-screen bg-[#132010] text-stone-100 font-sans-body antialiased pb-20 selection:bg-amber-500 selection:text-stone-950">
      {/* Tactical Clash-like Ambient Backdrop: Grass, wood tones, and subtle vignette */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#2d5a27_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#1b3417]/80 via-transparent to-[#0a1109]"
        aria-hidden="true"
      />

      {/* TOP RESOURCE & STATUS BAR (Clash-inspired tactile resource pills) */}
      <header className="sticky top-0 z-30 bg-[#24170d]/95 backdrop-blur border-b-4 border-[#3e2716] shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: User Profile Shield & XP Progress */}
            <div className="flex items-center gap-3">
              {/* Level Star/Shield Badge (Links to Character Sheet) */}
              <Link
                to="/character"
                className="relative group cursor-pointer block"
                title={`Level ${level} Taskmaster - Click to view Character Sheet`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 p-0.5 shadow-[0_4px_0_#1e3a8a,0_6px_10px_rgba(0,0,0,0.5)] border-2 border-sky-300 flex items-center justify-center transform hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-blue-600 to-blue-900 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 font-clash leading-none">
                      LVL
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-clash text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none mt-0.5">
                      {level}
                    </span>
                  </div>
                  {/* Gloss highlight */}
                  <div className="absolute top-1 left-2 right-2 h-2 rounded-t-lg bg-white/25 pointer-events-none" />
                </div>
              </Link>

              {/* Name & XP Meter */}
              <div className="flex flex-col min-w-[130px] sm:min-w-[190px]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-clash text-amber-200 font-bold tracking-wide flex items-center gap-1.5">
                    <span>Chief Quests</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/70 border border-amber-600/40 text-amber-300">
                      Active
                    </span>
                  </span>
                  <span className="text-[11px] font-mono text-amber-300 font-semibold">
                    {currentXp}/{xpPerLevel} XP
                  </span>
                </div>

                {/* Clash-style XP Bar Container */}
                <div className="h-4 sm:h-4.5 bg-[#120a05] rounded-full p-0.5 border-2 border-[#52351c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300 transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.7)] relative"
                    style={{ width: `${xpPercent}%` }}
                  >
                    {/* Inner sheen */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Gamified Resource Pills (Streak, Gold, Gems) */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
              {/* Streak Badge (Links to Streak Trail) */}
              <Link
                to="/streak"
                className="flex items-center bg-gradient-to-b from-[#3d1a08] to-[#200d04] hover:from-[#52230a] hover:to-[#2b1206] border-2 border-[#824419] rounded-full px-2.5 sm:px-3 py-1 shadow-[0_3px_0_#150802,0_4px_8px_rgba(0,0,0,0.4)] active:translate-y-0.5 transition-all cursor-pointer"
                title={`${streakDays} Day Task Completion Streak - Click to view 14-Day Streak Trail`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-orange-500 to-amber-600 flex items-center justify-center text-white mr-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-amber-200 stroke-amber-900" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] uppercase font-bold text-amber-400 leading-tight">Streak</span>
                  <span className="font-clash text-xs sm:text-sm text-white font-extrabold leading-tight">
                    {streakDays}d
                  </span>
                </div>
              </Link>

              {/* Gold Currency Pill */}
              <div
                className="flex items-center bg-gradient-to-b from-[#2a1b0d] to-[#160d05] border-2 border-[#6c4822] rounded-full pl-2 sm:pl-3 pr-1 py-0.5 shadow-[0_3px_0_#120803,0_4px_8px_rgba(0,0,0,0.4)]"
                title="Gold Points earned by completing tasks"
              >
                <div className="flex flex-col text-right mr-2">
                  <span className="text-[9px] uppercase font-bold text-yellow-500 leading-tight">Gold</span>
                  <span className="font-clash text-xs sm:text-sm text-yellow-300 font-extrabold leading-tight">
                    {gold.toLocaleString()}
                  </span>
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-200 flex items-center justify-center shadow-md">
                  <Coins className="w-3.5 h-3.5 text-yellow-950" />
                </div>
              </div>

              {/* Gems Currency Pill */}
              <div
                className="hidden sm:flex items-center bg-gradient-to-b from-[#0b2414] to-[#04130a] border-2 border-[#165a31] rounded-full pl-3 pr-1 py-0.5 shadow-[0_3px_0_#020b06,0_4px_8px_rgba(0,0,0,0.4)]"
                title="Gems earned from milestone streaks"
              >
                <div className="flex flex-col text-right mr-2">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 leading-tight">Gems</span>
                  <span className="font-clash text-xs sm:text-sm text-emerald-300 font-extrabold leading-tight">
                    {gems}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-700 border border-emerald-300 flex items-center justify-center shadow-md">
                  <Gem className="w-3.5 h-3.5 text-emerald-950 fill-emerald-200" />
                </div>
              </div>

              {/* Hero Stats Link */}
              <Link
                to="/character"
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#3a2211] to-[#221308] hover:from-[#4d2d17] hover:to-[#2e1a0b] border-2 border-[#633b1e] text-amber-200 text-xs font-clash shadow-[0_2px_0_#140a04] active:translate-y-0.5 transition-all"
                title="View Character Sheet & RPG Attributes"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Stats</span>
              </Link>

              {/* Level Up Celebration Preview Demo Button */}
              <button
                type="button"
                onClick={() => {
                  playSound('levelup', soundEnabled);
                  setLevelUpModal({
                    isOpen: true,
                    oldLevel: level,
                    newLevel: level + 1,
                    questTitle: 'Morning 5km Run & Mobility Stretch',
                  });
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-amber-600/30 to-yellow-900/40 hover:from-amber-600/50 hover:to-yellow-900/60 border-2 border-yellow-500/50 text-yellow-300 text-xs font-clash shadow-[0_2px_0_#140a04] active:translate-y-0.5 transition-all cursor-pointer"
                title="Preview Level-Up Celebratory Modal"
              >
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden xl:inline">Level Up</span>
              </button>

              {/* Streak Warning Alert Demo Button */}
              <button
                type="button"
                onClick={() => {
                  playSound('click', soundEnabled);
                  setIsStreakWarningOpen(true);
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-red-900/40 to-orange-950/60 hover:from-red-900/60 hover:to-orange-950/80 border-2 border-orange-500/50 text-orange-300 text-xs font-clash shadow-[0_2px_0_#140a04] active:translate-y-0.5 transition-all cursor-pointer"
                title="Preview Streak Warning Alert Modal"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
                <span className="hidden xl:inline">Streak Alert</span>
              </button>

              {/* Sound Toggle Button */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 sm:p-2 rounded-xl bg-[#362111] hover:bg-[#482d18] border-2 border-[#5c371d] shadow-[0_2px_0_#1a0f07] text-amber-200 active:translate-y-0.5 transition-all ml-1 cursor-pointer"
                title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* LEVEL UP CELEBRATION MODAL COMPONENT */}
      <LevelUpCelebrationModal
        isOpen={levelUpModal.isOpen}
        onClose={() => setLevelUpModal((prev) => ({ ...prev, isOpen: false }))}
        newLevel={levelUpModal.newLevel}
        oldLevel={levelUpModal.oldLevel}
        characterName="Sir Ethan the Champion"
        subheading={levelUpModal.questTitle ? `"${levelUpModal.questTitle}" Completed` : "Bravest Quest Completed"}
        statIncrease="Intellect +2"
        soundEnabled={soundEnabled}
        onPlaySound={(type) => playSound(type, soundEnabled)}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8">
        {/* DASHBOARD HEADER & QUICK STATS */}
        <section className="mb-6 sm:mb-8">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#312013] to-[#1c120a] border-4 border-[#50341e] p-4 sm:p-6 shadow-[0_8px_25px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Corner metallic brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Quest Log & Task Board
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-clash text-amber-100 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  Today's Directives
                </h1>
                <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-lg">
                  Complete real-life tasks to earn XP and amass rewards. Every completed quest
                  strengthens your daily streak.
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
                {/* Daily Milestone Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setIsMilestoneOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-b from-[#3a200f] to-[#1f1107] hover:from-[#4a2b15] hover:to-[#2b170a] border-2 border-amber-600/70 text-amber-200 text-xs font-clash font-extrabold tracking-wide uppercase shadow-[0_4px_0_#140a04,0_6px_12px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[0_1px_0_#140a04] transition-all cursor-pointer"
                  title="View Daily Focus Milestone with Sylph the Companion"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-300" />
                  <span>Milestone (3/5)</span>
                </button>

                {/* Add Quest Action Button (Iconic chunky Clash 3D Button) */}
                <button
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-200 text-amber-950 font-clash font-extrabold text-base tracking-wider uppercase shadow-[0_5px_0_#92400e,0_8px_15px_rgba(0,0,0,0.5)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>Add Quest</span>
                </button>
              </div>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#462d1a]/80">
              <div className="bg-[#180e07]/70 rounded-xl p-2.5 text-center border border-[#442b18]">
                <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Quests</div>
                <div className="font-clash text-lg sm:text-xl text-amber-200">{quests.length}</div>
              </div>
              <div className="bg-[#180e07]/70 rounded-xl p-2.5 text-center border border-[#442b18]">
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Conquered</div>
                <div className="font-clash text-lg sm:text-xl text-emerald-300">{completedCount}</div>
              </div>
              <div className="bg-[#180e07]/70 rounded-xl p-2.5 text-center border border-[#442b18]">
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Pending</div>
                <div className="font-clash text-lg sm:text-xl text-amber-400">{activeCount}</div>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS & CATEGORIES BAR */}
        <section className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-[#23150b] border-2 border-[#472c17] shadow-inner self-start">
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setFilter('all');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-clash tracking-wide transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-amber-950 font-extrabold shadow-[0_2px_0_#78350f]'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({quests.length})
            </button>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setFilter('active');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-clash tracking-wide transition-all cursor-pointer ${
                filter === 'active'
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-amber-950 font-extrabold shadow-[0_2px_0_#78350f]'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setFilter('completed');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-clash tracking-wide transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-amber-950 font-extrabold shadow-[0_2px_0_#78350f]'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Category Filter Pills (Mobile horizontal scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setCategoryFilter('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-amber-400 text-amber-950 font-extrabold'
                  : 'bg-[#26180c] text-stone-400 hover:text-stone-200 border border-[#472c17]'
              }`}
            >
              All Types
            </button>
            {Object.values(QUEST_CATEGORIES).map((cat) => {
              const Icon = cat.icon;
              const isSelected = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setCategoryFilter(isSelected ? 'all' : cat.id);
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 font-extrabold'
                      : 'bg-[#26180c] text-stone-400 hover:text-stone-200 border border-[#472c17]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* QUEST CARDS LIST */}
        <section className="space-y-3.5">
          {filteredQuests.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 px-4 rounded-3xl bg-[#24170d]/80 border-2 border-dashed border-[#472c17]">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#382111] border-2 border-[#5c371d] flex items-center justify-center text-amber-300">
                <Scroll className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-clash text-xl text-amber-200 font-bold mb-1">
                No Quests In This Scroll
              </h3>
              <p className="text-stone-400 text-sm max-w-sm mx-auto mb-5">
                {filter === 'completed'
                  ? 'No completed quests yet. Check off items from your active list to earn rewards!'
                  : 'Your quest scroll is currently empty. Click "Add Quest" above to chart your next objective!'}
              </p>
              {filter !== 'completed' && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 border border-amber-300 text-amber-950 font-clash font-extrabold text-sm shadow-[0_3px_0_#92400e] cursor-pointer"
                >
                  Enlist A New Quest
                </button>
              )}
            </div>
          ) : (
            filteredQuests.map((quest) => {
              const cat = QUEST_CATEGORIES[quest.category] || QUEST_CATEGORIES.work;
              const diff = QUEST_DIFFICULTIES[quest.difficulty] || QUEST_DIFFICULTIES.medium;
              const CatIcon = cat.icon;
              const isAnimating = animatingCardId === quest.id;
              const isStamped = stampedCardId === quest.id;
              const activeFloatingReward = floatingRewards.find((r) => r.questId === quest.id);

              return (
                <div
                  key={quest.id}
                  onClick={() => handleToggleQuest(quest.id)}
                  className={`group relative rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                    isAnimating
                      ? 'animate-card-flash ring-4 ring-amber-400/80 scale-[1.01]'
                      : ''
                  } ${
                    quest.completed
                      ? 'bg-[#1e130a]/80 border-[#382111] opacity-65 hover:opacity-85'
                      : 'bg-gradient-to-b from-[#fbf4db] to-[#ecdcba] text-stone-900 border-[#947449] shadow-[0_5px_0_#4a3420,0_8px_16px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#4a3420,0_12px_20px_rgba(0,0,0,0.35)]'
                  }`}
                >
                  {/* FLOATING "+XX XP" & "+XX Gold" POPUP REWARD */}
                  {activeFloatingReward && (
                    <div className="absolute top-1 left-12 z-30 pointer-events-none animate-float-reward flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-sky-950 font-black font-clash text-xs sm:text-sm shadow-[0_0_15px_rgba(56,189,248,0.9)] border-2 border-white flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-sky-200" />
                        <span>+{activeFloatingReward.xp} XP</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-amber-950 font-black font-clash text-xs sm:text-sm shadow-[0_0_15px_rgba(250,204,21,0.9)] border-2 border-white flex items-center gap-1">
                        <span>+{activeFloatingReward.gold} 🪙</span>
                      </div>
                    </div>
                  )}

                  {/* Parchment wood-bracket corner studs */}
                  {!quest.completed && (
                    <>
                      <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />
                      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />
                      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />
                    </>
                  )}

                  <div className="p-3.5 sm:p-4.5 flex items-center gap-3.5 sm:gap-4">
                    {/* WAX SEAL CHECKBOX STAMP */}
                    <div className="shrink-0">
                      <button
                        type="button"
                        aria-label={quest.completed ? 'Mark quest active' : 'Mark quest complete'}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isStamped
                            ? 'animate-stamp-bounce bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 border-2 border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.9),0_3px_0_#78350f]'
                            : quest.completed
                            ? 'bg-gradient-to-b from-red-600 via-red-700 to-red-900 border-2 border-red-400 shadow-[0_3px_0_#5c0909,inset_0_2px_4px_rgba(255,255,255,0.3)] scale-100'
                            : 'border-2 border-dashed border-amber-900/35 bg-amber-950/10 hover:border-amber-900 hover:bg-amber-950/20 group-hover:scale-105'
                        }`}
                      >
                        {quest.completed || isStamped ? (
                          <div className="relative flex items-center justify-center">
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200 stroke-[3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                          </div>
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-amber-900/20 group-hover:bg-amber-900/40" />
                        )}
                      </button>
                    </div>

                    {/* CATEGORY ICON BADGE */}
                    <div
                      className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                        quest.completed
                          ? 'bg-[#2b190c] border-[#462a15] text-stone-500'
                          : 'bg-[#3b2413] border-[#653f22] text-amber-300'
                      }`}
                    >
                      <CatIcon className="w-5 h-5" />
                    </div>

                    {/* QUEST DETAILS */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        {/* Title */}
                        <span
                          className={`text-sm sm:text-base font-bold leading-snug break-words transition-all duration-300 ${
                            quest.completed
                              ? 'line-through text-stone-500 italic'
                              : 'text-stone-900 font-sans-body'
                          }`}
                        >
                          {quest.title}
                        </span>
                      </div>

                      {/* Meta Tags: Category, Difficulty, Rewards, Due Date */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
                        {/* Category Name */}
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wider ${
                            quest.completed
                              ? 'bg-stone-900/40 text-stone-400 border-stone-800'
                              : cat.badgeBg
                          }`}
                        >
                          {cat.name}
                        </span>

                        {/* XP Badge */}
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            quest.completed
                              ? 'bg-stone-800/60 text-stone-400'
                              : 'bg-sky-950/80 text-sky-200 border border-sky-700/50'
                          }`}
                        >
                          +{diff.xp} XP
                        </span>

                        {/* Gold Badge */}
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                            quest.completed
                              ? 'bg-stone-800/60 text-stone-400'
                              : 'bg-amber-950/80 text-yellow-300 border border-amber-700/50'
                          }`}
                        >
                          +{diff.gold} <span className="text-[9px]">🪙</span>
                        </span>

                        {/* Due Date Indicator */}
                        {quest.dueDate && (
                          <span
                            className={`hidden sm:inline-flex items-center gap-1 text-[11px] ${
                              quest.completed ? 'text-stone-500' : 'text-stone-700 font-medium'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {quest.dueDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DELETE BUTTON */}
                    <div className="shrink-0 pl-1">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteQuest(quest.id, e)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          quest.completed
                            ? 'text-stone-600 hover:text-red-400 hover:bg-stone-800 border-transparent'
                            : 'text-stone-600 hover:text-red-600 hover:bg-amber-950/15 border-transparent hover:border-amber-900/30'
                        }`}
                        title="Delete Quest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* BOTTOM MOTIVATIONAL NOTE */}
        <section className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#24170d]/80 border border-[#472c17] text-stone-400 text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Consistent completion builds village prosperity. Level up by conquering today's list!
            </span>
          </div>
        </section>
      </main>

      {/* CREATE QUEST MODAL COMPONENT */}
      <CreateQuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateQuest}
        soundEnabled={soundEnabled}
        onPlaySound={(type) => playSound(type, soundEnabled)}
      />

      {/* DAILY MILESTONE COMPANION POPUP */}
      <DailyMilestoneModal
        isOpen={isMilestoneOpen}
        onClose={() => setIsMilestoneOpen(false)}
        onClaimBounty={(bountyAmount) => {
          setGold((prev) => prev + bountyAmount);
        }}
        soundEnabled={soundEnabled}
        onPlaySound={(type) => playSound(type, soundEnabled)}
      />

      {/* STREAK WARNING / FREEZE MODAL */}
      <StreakWarningModal
        isOpen={isStreakWarningOpen}
        onClose={() => setIsStreakWarningOpen(false)}
        streakDays={streakDays}
        hoursRemaining={3}
        minutesRemaining={42}
        characterName="Commander Valen"
        characterTitle="Watch Captain"
        recommendedQuest={{
          title: quests.find((q) => !q.completed)?.title || 'Weekly Directive Review',
          category: quests.find((q) => !q.completed)?.category || 'Errands',
          xp: 50,
        }}
        onCompleteQuest={() => {
          const firstIncomplete = quests.find((q) => !q.completed);
          if (firstIncomplete) {
            handleToggleQuest(firstIncomplete.id);
          }
        }}
        onActivateShield={() => {
          setGems((prev) => Math.max(0, prev - 25));
        }}
        soundEnabled={soundEnabled}
        onPlaySound={(type) => playSound(type, soundEnabled)}
      />
    </div>
  );
};

export default GamifiedTodoList;

