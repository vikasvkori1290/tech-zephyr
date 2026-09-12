import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Brain,
  Briefcase,
  Zap,
  Palette,
  Shield,
  Trophy,
  Award,
  Flame,
  Coins,
  Gem,
  CheckCircle2,
  ChevronRight,
  Plus,
  Volume2,
  VolumeX,
  Scroll,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

// Built-in Web Audio synthesis for tactile feedback (consistent with Quest Board)
const playSound = (type, enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'levelup') {
      const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.connect(g);
        g.connect(ctx.destination);
        const startTime = now + idx * 0.08;
        o.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime(0.22, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        o.start(startTime);
        o.stop(startTime + 0.3);
      });
    } else if (type === 'boost') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    // AudioContext blocked or unsupported
  }
};

// Initial RPG attributes mapping 1:1 to real-life productivity categories
const INITIAL_ATTRIBUTES = [
  {
    id: 'strength',
    name: 'Strength',
    category: 'Physical',
    icon: Dumbbell,
    level: 18,
    currentXp: 380,
    xpToNextLevel: 500,
    totalQuestsCompleted: 24,
    colorScheme: {
      crestBg: 'bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900',
      crestBorder: 'border-rose-400',
      crestGlow: 'shadow-[0_3px_0_#5c0909]',
      crestIcon: 'text-rose-100',
      barGradient: 'from-rose-500 via-red-400 to-amber-300',
      barShadow: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]',
      accentText: 'text-rose-800',
      tagBg: 'bg-rose-900/15 border-rose-900/30 text-rose-950',
    },
    tagline: 'Fueled by workouts, runs, and physical endurance habits.',
  },
  {
    id: 'intellect',
    name: 'Intellect',
    category: 'Study',
    icon: Brain,
    level: 15,
    currentXp: 420,
    xpToNextLevel: 500,
    totalQuestsCompleted: 19,
    colorScheme: {
      crestBg: 'bg-gradient-to-b from-sky-600 via-blue-700 to-blue-900',
      crestBorder: 'border-sky-400',
      crestGlow: 'shadow-[0_3px_0_#0f2854]',
      crestIcon: 'text-sky-100',
      barGradient: 'from-sky-500 via-cyan-400 to-teal-300',
      barShadow: 'shadow-[0_0_12px_rgba(14,165,233,0.6)]',
      accentText: 'text-sky-800',
      tagBg: 'bg-sky-900/15 border-sky-900/30 text-sky-950',
    },
    tagline: 'Sharpened through reading, course study, and research.',
  },
  {
    id: 'discipline',
    name: 'Discipline',
    category: 'Work',
    icon: Briefcase,
    level: 22,
    currentXp: 210,
    xpToNextLevel: 500,
    totalQuestsCompleted: 35,
    colorScheme: {
      crestBg: 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900',
      crestBorder: 'border-amber-400',
      crestGlow: 'shadow-[0_3px_0_#542805]',
      crestIcon: 'text-amber-100',
      barGradient: 'from-amber-500 via-yellow-400 to-amber-200',
      barShadow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]',
      accentText: 'text-amber-900',
      tagBg: 'bg-amber-900/15 border-amber-900/30 text-amber-950',
    },
    tagline: 'Forged by deep work sessions, coding sprints, and project execution.',
  },
  {
    id: 'agility',
    name: 'Agility',
    category: 'Errands',
    icon: Zap,
    level: 11,
    currentXp: 160,
    xpToNextLevel: 350,
    totalQuestsCompleted: 14,
    colorScheme: {
      crestBg: 'bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900',
      crestBorder: 'border-emerald-400',
      crestGlow: 'shadow-[0_3px_0_#064e3b]',
      crestIcon: 'text-emerald-100',
      barGradient: 'from-emerald-500 via-teal-400 to-emerald-200',
      barShadow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]',
      accentText: 'text-emerald-800',
      tagBg: 'bg-emerald-900/15 border-emerald-900/30 text-emerald-950',
    },
    tagline: 'Elevated by quick daily errands, chores, and prompt task turnaround.',
  },
  {
    id: 'charisma',
    name: 'Charisma',
    category: 'Creative',
    icon: Palette,
    level: 14,
    currentXp: 310,
    xpToNextLevel: 450,
    totalQuestsCompleted: 16,
    colorScheme: {
      crestBg: 'bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900',
      crestBorder: 'border-purple-400',
      crestGlow: 'shadow-[0_3px_0_#4c1d95]',
      crestIcon: 'text-purple-100',
      barGradient: 'from-purple-500 via-fuchsia-400 to-pink-300',
      barShadow: 'shadow-[0_0_12px_rgba(168,85,247,0.6)]',
      accentText: 'text-purple-900',
      tagBg: 'bg-purple-900/15 border-purple-900/30 text-purple-950',
    },
    tagline: 'Cultivated through creative expression, writing, design, and side passions.',
  },
];

export const CharacterSheet = () => {
  const [attributes, setAttributes] = useState(INITIAL_ATTRIBUTES);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Overall player stats
  const playerOverallLevel = 14;
  const streakDays = 5;
  const totalGold = 1450;
  const totalGems = 85;

  // Calculate total completed quests across all attributes
  const totalQuestsCompleted = attributes.reduce(
    (sum, attr) => sum + attr.totalQuestsCompleted,
    0
  );

  // Interactive helper: simulate earning XP from finishing a real category quest
  const handleBoostAttribute = (id) => {
    playSound('boost', soundEnabled);
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id !== id) return attr;

        const xpGain = 50; // Standard medium quest reward
        let newXp = attr.currentXp + xpGain;
        let newLvl = attr.level;
        let newQuests = attr.totalQuestsCompleted + 1;

        if (newXp >= attr.xpToNextLevel) {
          newLvl += 1;
          newXp = newXp - attr.xpToNextLevel;
          playSound('levelup', soundEnabled);
          setToastMessage(`${attr.name} increased to Level ${newLvl}!`);
          setTimeout(() => setToastMessage(null), 3500);
        }

        return {
          ...attr,
          level: newLvl,
          currentXp: newXp,
          totalQuestsCompleted: newQuests,
        };
      })
    );
  };

  return (
    <div className="relative min-h-screen bg-[#132010] text-stone-100 font-sans antialiased pb-20 selection:bg-amber-500 selection:text-stone-950">
      {/* Background Atmosphere (matching Quest Board) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#2d5a27_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#1b3417]/80 via-transparent to-[#0a1109]"
        aria-hidden="true"
      />

      {/* TOP RESOURCE & NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-[#24170d]/95 backdrop-blur border-b-4 border-[#3e2716] shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Overall Level Badge & Title */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 p-0.5 shadow-[0_4px_0_#1e3a8a,0_6px_10px_rgba(0,0,0,0.5)] border-2 border-sky-300 flex items-center justify-center shrink-0"
                title={`Account Level ${playerOverallLevel}`}
              >
                <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-blue-600 to-blue-900 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 font-clash leading-none">
                    LVL
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-clash text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none mt-0.5">
                    {playerOverallLevel}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-clash text-base sm:text-lg text-amber-200 font-bold tracking-wide">
                    Character Sheet
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300">
                    RPG Stats
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-medium">
                  Real productivity converted to hero attributes
                </p>
              </div>
            </div>

            {/* Right: Quick Links & Resources */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
              {/* Return to Quest Board Link */}
              <Link
                to="/quests"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 border-2 border-amber-300 text-amber-950 font-clash text-xs font-extrabold shadow-[0_2px_0_#78350f] active:translate-y-0.5 transition-all"
              >
                <Scroll className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Quest Board</span>
              </Link>

              {/* Streak Badge (Links to Streak Trail) */}
              <Link
                to="/streak"
                className="flex items-center bg-gradient-to-b from-[#3d1a08] to-[#200d04] hover:from-[#52230a] hover:to-[#2b1206] border-2 border-[#824419] rounded-full px-2.5 sm:px-3 py-1 shadow-[0_3px_0_#150802] active:translate-y-0.5 transition-all cursor-pointer"
                title={`${streakDays} Day Task Streak - Click to view 14-Day Streak Trail`}
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

              {/* Gold Pill */}
              <div
                className="hidden sm:flex items-center bg-gradient-to-b from-[#2a1b0d] to-[#160d05] border-2 border-[#6c4822] rounded-full pl-3 pr-1 py-0.5 shadow-[0_3px_0_#120803]"
                title="Gold Points"
              >
                <div className="flex flex-col text-right mr-2">
                  <span className="text-[9px] uppercase font-bold text-yellow-500 leading-tight">Gold</span>
                  <span className="font-clash text-xs text-yellow-300 font-extrabold leading-tight">
                    {totalGold.toLocaleString()}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-200 flex items-center justify-center shadow-md">
                  <Coins className="w-3.5 h-3.5 text-yellow-950" />
                </div>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 sm:p-2 rounded-xl bg-[#362111] hover:bg-[#482d18] border-2 border-[#5c371d] shadow-[0_2px_0_#1a0f07] text-amber-200 active:translate-y-0.5 transition-all cursor-pointer"
                title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* LEVEL UP NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 border-4 border-yellow-200 text-amber-950 px-6 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_4px_0_#78350f] flex items-center gap-3">
            <Trophy className="w-7 h-7 text-yellow-900 fill-yellow-300" />
            <div>
              <div className="font-clash text-lg font-extrabold uppercase leading-tight">
                Attribute Level Up!
              </div>
              <div className="text-xs font-bold text-amber-900">{toastMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8">
        {/* SUMMARY HEADER: Avatar placeholder, Player Level, Total Quests Completed */}
        <section className="mb-8">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#312013] to-[#1c120a] border-4 border-[#50341e] p-5 sm:p-7 shadow-[0_8px_25px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Corner metallic rivets */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Player Avatar & Identity */}
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Avatar Placeholder Badge */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-[#4a2e1b] via-[#352011] to-[#1f1208] border-4 border-amber-400 shadow-[0_6px_0_#6c4015,0_10px_20px_rgba(0,0,0,0.6)] flex items-center justify-center relative overflow-hidden group">
                    {/* Crest backdrop shimmer */}
                    <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent pointer-events-none" />
                    <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 stroke-[1.8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    {/* Gloss sheen */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 rounded-t-xl pointer-events-none" />
                  </div>
                  {/* Mini Star Ribbon */}
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-yellow-200 shadow-sm flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-amber-950 fill-amber-300" />
                    <span className="text-[10px] font-clash font-extrabold text-amber-950">PRO</span>
                  </div>
                </div>

                {/* Name & Player Rank */}
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-[11px] font-bold mb-1.5">
                    <Award className="w-3 h-3" />
                    <span>Rank: Focus Vanguard</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-clash text-amber-100 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    Commander Alex
                  </h1>
                  <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-md">
                    Attributes reflect actual completed to-do tasks. Complete categorized quests to
                    level up each specific discipline.
                  </p>
                </div>
              </div>

              {/* Summary Stats Badges (Player Level & Total Quests) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
                {/* Player Level Card */}
                <div className="bg-[#180e07]/85 rounded-2xl p-3 sm:p-4 text-center border-2 border-[#50341e] shadow-inner min-w-[120px] sm:min-w-[135px]">
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Player Level
                  </div>
                  <div className="font-clash text-2xl sm:text-3xl text-white font-extrabold mt-0.5">
                    {playerOverallLevel}
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 mt-0.5">Overall Rank</div>
                </div>

                {/* Total Quests Completed Card */}
                <div className="bg-[#180e07]/85 rounded-2xl p-3 sm:p-4 text-center border-2 border-[#50341e] shadow-inner min-w-[120px] sm:min-w-[135px]">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Conquered
                  </div>
                  <div className="font-clash text-2xl sm:text-3xl text-emerald-300 font-extrabold mt-0.5">
                    {totalQuestsCompleted}
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 mt-0.5">Total Quests</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION TITLE & CONTEXT */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="font-clash text-xl sm:text-2xl text-amber-200 font-bold tracking-wide">
              Hero Attributes
            </h2>
            <p className="text-stone-400 text-xs mt-0.5">
              5 core traits powered directly by your to-do categories
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500 hidden sm:inline">
            5 Attributes Tracked
          </span>
        </div>

        {/* GRID OF 5 ATTRIBUTE CARDS (Responsive: Stack on mobile, Grid on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {attributes.map((attr) => {
            const Icon = attr.icon;
            const xpPct = Math.min(100, Math.round((attr.currentXp / attr.xpToNextLevel) * 100));

            return (
              <div
                key={attr.id}
                className="group relative rounded-2xl bg-gradient-to-b from-[#fbf4db] to-[#ecdcba] text-stone-900 border-2 border-[#947449] shadow-[0_5px_0_#4a3420,0_8px_16px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_0_#4a3420,0_14px_22px_rgba(0,0,0,0.35)] transition-all flex flex-col justify-between p-5 overflow-hidden select-none"
              >
                {/* Parchment corner studs */}
                <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-inner opacity-70" />

                {/* CARD HEADER: Icon, Attribute Name & Level Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Wax Crest Icon */}
                      <div
                        className={`w-12 h-12 rounded-2xl ${attr.colorScheme.crestBg} border-2 ${attr.colorScheme.crestBorder} ${attr.colorScheme.crestGlow} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <Icon className={`w-6 h-6 ${attr.colorScheme.crestIcon}`} />
                      </div>

                      <div>
                        <h3 className="font-clash text-xl font-black text-stone-900 tracking-wide leading-tight">
                          {attr.name}
                        </h3>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                          <span>{attr.category} Category</span>
                        </span>
                      </div>
                    </div>

                    {/* Attribute Level Badge (Clash Hex/Shield style) */}
                    <div className="flex flex-col items-end">
                      <div className="px-2.5 py-1 rounded-xl bg-gradient-to-b from-[#2a170a] to-[#150a04] border-2 border-amber-600 text-amber-200 shadow-[0_2px_0_#0d0502] flex items-center gap-1">
                        <span className="text-[9px] font-extrabold uppercase font-clash text-amber-400">
                          LVL
                        </span>
                        <span className="font-clash text-base font-black text-white leading-none">
                          {attr.level}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 mt-1 font-semibold">
                        {attr.totalQuestsCompleted} quests
                      </span>
                    </div>
                  </div>

                  {/* Attribute Description Tagline */}
                  <p className="text-xs text-stone-700 leading-relaxed mb-4 line-clamp-2">
                    {attr.tagline}
                  </p>
                </div>

                {/* CARD PROGRESS SECTION */}
                <div>
                  {/* Progress Header & Counter */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-stone-700 uppercase text-[10px] tracking-wider">
                      Attribute Progress
                    </span>
                    <span className="font-mono text-xs font-bold text-stone-900">
                      {attr.currentXp} / {attr.xpToNextLevel} XP{' '}
                      <span className="text-stone-500 font-normal">({xpPct}%)</span>
                    </span>
                  </div>

                  {/* Beveled XP Progress Bar Container */}
                  <div className="h-4 bg-[#1e1208] rounded-full p-0.5 border-2 border-[#54361d] shadow-inner relative overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${attr.colorScheme.barGradient} transition-all duration-500 ${attr.colorScheme.barShadow} relative`}
                      style={{ width: `${xpPct}%` }}
                    >
                      {/* Top gloss reflection */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
                    </div>
                  </div>

                  {/* EXPLICIT CONNECTION NOTE: Explicitly shows how real quests increase this attribute */}
                  <div
                    className={`rounded-xl px-3 py-2 border ${attr.colorScheme.tagBg} mb-3 flex items-start gap-2`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
                    <div className="text-[11px] font-medium leading-snug">
                      <span className="font-bold">+50 XP</span> per completed{' '}
                      <span className="font-bold uppercase tracking-wide">{attr.category}</span>{' '}
                      quest
                      <div className="text-[10px] opacity-75 font-normal mt-0.5">
                        Scales with difficulty (Easy +25, Hard +100, Epic +200)
                      </div>
                    </div>
                  </div>

                  {/* Quick Test / Interactive Action */}
                  <button
                    type="button"
                    onClick={() => handleBoostAttribute(attr.id)}
                    className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 border border-amber-200 text-amber-950 font-clash text-xs font-extrabold uppercase tracking-wide shadow-[0_2px_0_#92400e] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title={`Simulate completing a ${attr.category} quest`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Complete {attr.category} (+50 XP)</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* 6TH CARD: SYNERGY & MILESTONES (Rounds out 3-column desktop layout nicely) */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#2b1b10] to-[#180f08] text-amber-100 border-2 border-[#543820] shadow-[0_5px_0_#130a04,0_8px_16px_rgba(0,0,0,0.5)] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-500 to-yellow-600 border-2 border-yellow-300 shadow-[0_3px_0_#78350f] flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-amber-950 fill-amber-200" />
                </div>
                <div>
                  <h3 className="font-clash text-xl font-bold text-amber-200 leading-tight">
                    Hero Synergy
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Balanced Growth
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Maintain balanced progress across all 5 attributes to unlock special titles and
                productivity multipliers.
              </p>

              {/* Milestone list */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#140b05] border border-[#3b2413]">
                  <span className="text-stone-300">All Attributes Lvl 10+</span>
                  <span className="font-bold text-emerald-400 font-clash">ACHIEVED ✓</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#140b05] border border-[#3b2413]">
                  <span className="text-stone-300">All Attributes Lvl 20+</span>
                  <span className="font-bold text-amber-400 font-clash">IN PROGRESS (3/5)</span>
                </div>
              </div>
            </div>

            {/* Jump to Quest Board Button */}
            <Link
              to="/quests"
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 border-2 border-emerald-300 text-white font-clash font-extrabold text-xs uppercase tracking-wide shadow-[0_3px_0_#064e3b] active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Go Conquering Quests</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* BOTTOM MOTIVATIONAL NOTE */}
        <section className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#24170d]/80 border border-[#472c17] text-stone-400 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Every checkbox ticked in your Quest Board continuously powers these attributes.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CharacterSheet;

