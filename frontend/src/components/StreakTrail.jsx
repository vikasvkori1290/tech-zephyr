import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Trophy,
  Calendar,
  Sparkles,
  Lock,
  Check,
  X,
  Scroll,
  ChevronLeft,
  ChevronRight,
  Shield,
  Volume2,
  VolumeX,
  Coins,
  Gem,
  Award,
  Clock,
  Compass,
} from 'lucide-react';

// Web Audio sound synthesizer for tactile feedback (matching existing screens)
const playSound = (type, enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'fire') {
      // Warm campfire whoosh
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'stone') {
      // Dull stone thud
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    // AudioContext blocked
  }
};

// Generate realistic dummy data for 14-day history + 2 future forecast days
const generateStreakDays = () => {
  const days = [];
  const todayIndex = 13; // 14th item (0 to 13 = past 14 days, with 13 being today)
  const totalDays = 16; // 14 days up to today + 2 future preview days

  // Mix of completed and missed days leading to a 5-day active streak up to today
  // Days 0-4: mixed, Day 5-8: active, Day 8: missed, Days 9-13: active 5-day streak!
  const mockActivity = [
    { completed: true, quests: 2, xp: 75, gold: 35 },  // Day -13
    { completed: true, quests: 4, xp: 175, gold: 80 }, // Day -12
    { completed: false, quests: 0, xp: 0, gold: 0 },   // Day -11 (missed)
    { completed: true, quests: 1, xp: 50, gold: 25 },  // Day -10
    { completed: true, quests: 3, xp: 125, gold: 60 }, // Day -9
    { completed: true, quests: 2, xp: 75, gold: 35 },  // Day -8
    { completed: false, quests: 0, xp: 0, gold: 0 },   // Day -7 (missed)
    { completed: true, quests: 3, xp: 150, gold: 75 }, // Day -6
    { completed: false, quests: 0, xp: 0, gold: 0 },   // Day -5 (rest day)
    { completed: true, quests: 2, xp: 100, gold: 50 }, // Day -4 (Streak 1)
    { completed: true, quests: 3, xp: 150, gold: 75 }, // Day -3 (Streak 2)
    { completed: true, quests: 1, xp: 50, gold: 25 },  // Day -2 (Streak 3)
    { completed: true, quests: 4, xp: 200, gold: 100 },// Day -1 (Streak 4)
    { completed: true, quests: 3, xp: 125, gold: 60 }, // Today (Streak 5)
    { completed: false, isFuture: true },              // Tomorrow (Future)
    { completed: false, isFuture: true },              // Day after (Future)
  ];

  const now = new Date();

  for (let i = 0; i < totalDays; i++) {
    const diff = i - todayIndex;
    const d = new Date(now);
    d.setDate(now.getDate() + diff);

    const isToday = i === todayIndex;
    const isFuture = i > todayIndex;
    const activity = mockActivity[i];

    days.push({
      id: `day-${i}`,
      index: i,
      date: d,
      dateFormatted: d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      dayNumber: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday,
      isFuture,
      completed: activity.completed,
      questsCount: activity.quests || 0,
      xpEarned: activity.xp || 0,
      goldEarned: activity.gold || 0,
    });
  }

  return days;
};

export const StreakTrail = () => {
  const [days, setDays] = useState(generateStreakDays());
  const [selectedDay, setSelectedDay] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const scrollContainerRef = useRef(null);

  // Streak metrics
  const currentStreak = 5;
  const longestStreak = 12;
  const totalDaysLogged = 14;
  const completedDaysCount = days.filter((d) => !d.isFuture && d.completed).length;
  const adherenceRate = Math.round((completedDaysCount / totalDaysLogged) * 100);

  // Automatically select today's node on initial load
  useEffect(() => {
    const todayNode = days.find((d) => d.isToday);
    if (todayNode) {
      setSelectedDay(todayNode);
    }
  }, [days]);

  // Center scroll position on today's node upon mounting
  useEffect(() => {
    if (scrollContainerRef.current) {
      // scroll towards the right so today is in comfortable view
      scrollContainerRef.current.scrollLeft = 320;
    }
  }, []);

  // Compute node positions on the winding, snake-like trail
  // SVG Canvas dimensions: 1040px wide by 240px high
  const trailCoordinates = useMemo(() => {
    const total = days.length;
    const startX = 60;
    const stepX = 58;
    const baseY = 120;
    const amplitude = 48; // wave height

    return days.map((day, i) => {
      const x = startX + i * stepX;
      // Undulating sinusoidal wave simulating a winding mountain trail
      const y = baseY + Math.sin((i / (total - 1)) * Math.PI * 3.2) * amplitude;
      return { ...day, x, y };
    });
  }, [days]);

  // Build smooth SVG cubic Bezier curve path string
  const pathD = useMemo(() => {
    if (trailCoordinates.length === 0) return '';
    const points = trailCoordinates;
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [trailCoordinates]);

  // Handle clicking a trail waypoint
  const handleNodeClick = (node) => {
    if (node.completed) {
      playSound('fire', soundEnabled);
    } else if (node.isFuture) {
      playSound('click', soundEnabled);
    } else {
      playSound('stone', soundEnabled);
    }
    setSelectedDay(node);
  };

  return (
    <div className="relative min-h-screen bg-[#132010] text-stone-100 font-sans antialiased pb-20 selection:bg-amber-500 selection:text-stone-950">
      {/* Tactical Clash-like Ambient Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#2d5a27_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#1b3417]/80 via-transparent to-[#0a1109]"
        aria-hidden="true"
      />

      {/* TOP RESOURCE & STATUS BAR */}
      <header className="sticky top-0 z-30 bg-[#24170d]/95 backdrop-blur border-b-4 border-[#3e2716] shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-orange-500 via-amber-600 to-amber-800 p-0.5 shadow-[0_4px_0_#9a3412,0_6px_10px_rgba(0,0,0,0.5)] border-2 border-yellow-300 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-yellow-100 fill-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-clash text-base sm:text-lg text-amber-200 font-bold tracking-wide">
                    Streak Trail
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300">
                    14-Day Map
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-medium">
                  Consecutive days of conquered quests
                </p>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
              <Link
                to="/quests"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 border-2 border-amber-300 text-amber-950 font-clash text-xs font-extrabold shadow-[0_2px_0_#78350f] active:translate-y-0.5 transition-all"
              >
                <Scroll className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Quest Board</span>
              </Link>

              <Link
                to="/character"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#3a2211] to-[#221308] border-2 border-[#633b1e] text-amber-200 font-clash text-xs font-bold shadow-[0_2px_0_#140a04]"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Character Sheet</span>
              </Link>

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

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8">
        {/* HEADER: Large Bold Current Streak & Secondary Longest Streak */}
        <section className="mb-6 sm:mb-8">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#312013] to-[#1c120a] border-4 border-[#50341e] p-5 sm:p-7 shadow-[0_8px_25px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Corner metallic rivets */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Primary Streak Display */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Lit Campfire / Torch Emblem */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-orange-600 via-amber-700 to-amber-950 border-4 border-amber-400 shadow-[0_6px_0_#782806,0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-radial from-yellow-300/30 via-transparent to-transparent pointer-events-none animate-pulse" />
                    <Flame className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-200 fill-amber-300 stroke-amber-950 stroke-[1.8] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-bounce" />
                    <div className="absolute top-0 left-0 right-0 h-4 bg-white/25 rounded-t-xl pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-amber-400 font-clash mb-1 flex items-center gap-1.5">
                    <span>Active Productivity Streak</span>
                  </div>
                  {/* Current Streak Count (Large & Bold) */}
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-4xl sm:text-5xl font-black font-clash text-white tracking-wide drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                      {currentStreak} Days
                    </h1>
                    <span className="text-xl sm:text-2xl animate-pulse">🔥</span>
                  </div>
                  {/* Secondary Longest Streak */}
                  <div className="text-xs sm:text-sm text-stone-300 flex items-center gap-2 mt-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>
                      Longest Streak Achieved:{' '}
                      <strong className="text-amber-300 font-clash text-sm sm:text-base">
                        {longestStreak} Days
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 14-Day Adherence Stats Box */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-[#180e07]/85 rounded-2xl p-3 sm:p-4 text-center border-2 border-[#50341e] shadow-inner min-w-[115px]">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Days Active</div>
                  <div className="font-clash text-2xl sm:text-3xl text-amber-200 font-extrabold mt-0.5">
                    {completedDaysCount}/14
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 mt-0.5">{adherenceRate}% Active</div>
                </div>

                <div className="bg-[#180e07]/85 rounded-2xl p-3 sm:p-4 text-center border-2 border-[#50341e] shadow-inner min-w-[115px]">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Next Badge</div>
                  <div className="font-clash text-2xl sm:text-3xl text-emerald-300 font-extrabold mt-0.5">
                    7 Days
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 mt-0.5">Silver Flame</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRAIL SECTION: Snake-like Winding Path */}
        <section className="mb-6">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#2a1b10] to-[#170e08] border-4 border-[#52351e] shadow-[0_8px_30px_rgba(0,0,0,0.8)] overflow-hidden p-4 sm:p-6">
            {/* Trail Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#472d1a]">
              <div>
                <h2 className="font-clash text-xl text-amber-100 font-extrabold tracking-wide flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>The Expedition Trail</span>
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">
                  Tap or hover any day stone to inspect logged quests and rewards.
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-stone-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-b from-amber-400 to-yellow-600 border border-yellow-200 shadow-sm inline-block" />
                  Conquered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#35251c] border border-stone-600 inline-block" />
                  Rest / Missed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white ring-2 ring-amber-500 animate-pulse inline-block" />
                  Today
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border border-dashed border-stone-500 inline-block" />
                  Ahead
                </span>
              </div>
            </div>

            {/* Scrollable Trail Container (Mobile scrollable, Desktop full view) */}
            <div
              ref={scrollContainerRef}
              className="relative overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#4b2f18] scrollbar-track-[#170e08] select-none"
            >
              {/* SVG Canvas for the Winding Trail Track */}
              <div className="relative min-w-[1020px] h-[250px] my-2">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 1020 250"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer dirt trench / stone trail underlay */}
                  <path
                    d={pathD}
                    stroke="#2e190d"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Cobblestone path border */}
                  <path
                    d={pathD}
                    stroke="#4d3019"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Golden dashed connecting track */}
                  <path
                    d={pathD}
                    stroke="#b45309"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Trail Nodes positioned over coordinates */}
                {trailCoordinates.map((node) => {
                  const isSelected = selectedDay?.id === node.id;
                  const isCompleted = node.completed;
                  const isToday = node.isToday;
                  const isFuture = node.isFuture;

                  return (
                    <div
                      key={node.id}
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute z-10"
                    >
                      {/* Waypoint Day Label above node */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
                        <span
                          className={`text-[10px] font-clash uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            isToday
                              ? 'bg-amber-400 text-amber-950 font-black shadow-md'
                              : isCompleted
                              ? 'text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                              : 'text-stone-500'
                          }`}
                        >
                          {isToday ? 'TODAY' : node.dayName}
                        </span>
                      </div>

                      {/* Interactive Node Button */}
                      <button
                        type="button"
                        onClick={() => handleNodeClick(node)}
                        aria-label={`${node.dateFormatted}: ${
                          isCompleted ? `${node.questsCount} Quests Conquered` : 'No quests completed'
                        }`}
                        className={`group relative rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          isToday
                            ? 'w-14 h-14 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 border-4 border-yellow-100 shadow-[0_0_22px_rgba(251,191,36,0.8),0_4px_0_#92400e] ring-4 ring-amber-400/40 animate-pulse hover:scale-110'
                            : isCompleted
                            ? 'w-11 h-11 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 border-2 border-yellow-200 shadow-[0_0_14px_rgba(245,158,11,0.5),0_3px_0_#78350f] hover:scale-110 active:translate-y-0.5'
                            : isFuture
                            ? 'w-9 h-9 bg-[#1c120a] border-2 border-dashed border-[#573922] text-stone-600 hover:border-stone-400 opacity-60'
                            : 'w-10 h-10 bg-gradient-to-b from-[#2b211a] to-[#19120e] border-2 border-[#523d31] text-stone-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] hover:border-stone-400 hover:scale-105'
                        } ${isSelected ? 'ring-2 ring-white scale-110' : ''}`}
                      >
                        {/* Node Icon Content */}
                        {isToday ? (
                          <Flame className="w-7 h-7 text-amber-950 fill-yellow-200 stroke-[2.2]" />
                        ) : isCompleted ? (
                          <Flame className="w-5 h-5 text-amber-950 fill-yellow-200 stroke-[2]" />
                        ) : isFuture ? (
                          <Lock className="w-3.5 h-3.5 text-stone-600" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                        )}

                        {/* Gloss shine for active nodes */}
                        {(isCompleted || isToday) && (
                          <div className="absolute top-1 left-2 right-2 h-2 rounded-t-full bg-white/35 pointer-events-none" />
                        )}
                      </button>

                      {/* Day Number underneath node */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
                        <span
                          className={`text-[11px] font-mono font-bold ${
                            isToday
                              ? 'text-amber-300'
                              : isCompleted
                              ? 'text-stone-300'
                              : 'text-stone-500'
                          }`}
                        >
                          {node.dayNumber}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hint */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-[#462c18]/80">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                14 Days Ago
              </span>
              <span className="text-[11px] text-stone-400 italic">
                Scroll horizontally on mobile to view entire expedition path
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                Ahead
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </div>
          </div>
        </section>

        {/* SELECTED DAY INSPECTOR TOOLTIP CARD (Parchment Card) */}
        {selectedDay && (
          <section className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="relative rounded-2xl bg-gradient-to-b from-[#fbf4db] to-[#ecdcba] text-stone-900 border-2 border-[#947449] shadow-[0_5px_0_#4a3420,0_8px_16px_rgba(0,0,0,0.3)] p-4 sm:p-5 overflow-hidden">
              {/* Corner rivets */}
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 opacity-70" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 opacity-70" />
              <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 opacity-70" />
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 opacity-70" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Day Header & Status */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-sm ${
                      selectedDay.isToday
                        ? 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-300 text-amber-950'
                        : selectedDay.completed
                        ? 'bg-gradient-to-b from-amber-600 to-amber-800 border-amber-400 text-amber-100'
                        : selectedDay.isFuture
                        ? 'bg-[#3b2413] border-[#5a381f] text-stone-400'
                        : 'bg-[#2b1f18] border-stone-600 text-stone-400'
                    }`}
                  >
                    {selectedDay.completed ? (
                      <Flame className="w-6 h-6 fill-current" />
                    ) : selectedDay.isFuture ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5 text-stone-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-clash text-lg font-black text-stone-900">
                        {selectedDay.dateFormatted}
                      </span>
                      {selectedDay.isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-900 text-amber-200 text-[10px] font-clash uppercase">
                          Today's Waypoint
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-700 font-medium mt-0.5">
                      {selectedDay.isFuture
                        ? 'Upcoming day on your journey. Complete quests tomorrow to keep the flame burning!'
                        : selectedDay.completed
                        ? `${selectedDay.questsCount} real task${
                            selectedDay.questsCount > 1 ? 's' : ''
                          } marked complete on this day.`
                        : 'No quests conquered. Rest day or streak paused.'}
                    </p>
                  </div>
                </div>

                {/* Right: Metrics / Rewards for that day */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {selectedDay.completed ? (
                    <>
                      <div className="px-3 py-1.5 rounded-xl bg-sky-950/90 text-sky-200 border border-sky-700 text-center">
                        <div className="text-[9px] uppercase font-bold tracking-wider">XP Earned</div>
                        <div className="font-mono text-sm font-bold">+{selectedDay.xpEarned} XP</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-amber-950/90 text-yellow-300 border border-amber-700 text-center">
                        <div className="text-[9px] uppercase font-bold tracking-wider">Gold Coins</div>
                        <div className="font-mono text-sm font-bold">+{selectedDay.goldEarned} 🪙</div>
                      </div>
                    </>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-400 text-xs font-semibold">
                      {selectedDay.isFuture ? 'Locked' : '0 Rewards Earned'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STREAK MILESTONE REWARDS */}
        <section>
          <div className="rounded-2xl bg-gradient-to-b from-[#24170e] to-[#150d07] border-2 border-[#4a2e19] p-4 sm:p-5">
            <h3 className="font-clash text-base sm:text-lg text-amber-200 font-bold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Streak Milestone Chests</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 3-Day Milestone (Claimed) */}
              <div className="p-3 rounded-xl bg-[#1a0e07] border border-amber-700/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-600 to-amber-900 border border-amber-400 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-amber-200 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs font-clash text-amber-100 font-bold">3-Day Bronze Torch</div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold">Claimed (+50 Gold)</div>
                </div>
              </div>

              {/* 7-Day Milestone (In Progress) */}
              <div className="p-3 rounded-xl bg-[#1a0e07] border border-amber-500/80 flex items-center gap-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-yellow-500 to-amber-600 border border-yellow-200 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-yellow-950 fill-yellow-200" />
                </div>
                <div>
                  <div className="text-xs font-clash text-amber-100 font-bold">7-Day Silver Flame</div>
                  <div className="text-[11px] font-mono text-amber-300 font-bold">
                    {currentStreak}/7 Days (2 Days Left!)
                  </div>
                </div>
              </div>

              {/* 14-Day Milestone (Locked) */}
              <div className="p-3 rounded-xl bg-[#140b06] border border-[#3b2413] flex items-center gap-3 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-[#26150a] border border-[#482914] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-stone-500" />
                </div>
                <div>
                  <div className="text-xs font-clash text-stone-400 font-bold">14-Day Golden Crown</div>
                  <div className="text-[11px] font-mono text-stone-500">Locked (+300 XP, +150 Gold)</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StreakTrail;

