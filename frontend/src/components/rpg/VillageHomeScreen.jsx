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
  Filter,
  Trash2,
  CheckCircle2,
  Shield,
  Award,
} from 'lucide-react';
import { GameButton, WoodCard, ParchmentCard, RibbonBanner, MascotAvatar } from './GameUI.jsx';
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
    streakBoost: '1.2x',
    dueDate: 'Today, 3:00 PM',
  },
  {
    id: 102,
    title: 'Vitality: 30-Minute Calisthenics & Core Circuit',
    category: 'fitness',
    xp: 150,
    gold: 40,
    difficulty: 'Hard',
    completed: false,
    streakBoost: '1.5x',
    dueDate: 'Today, 6:00 PM',
  },
  {
    id: 103,
    title: 'Wisdom: Read 15 Pages of Distributed Systems',
    category: 'study',
    xp: 120,
    gold: 30,
    difficulty: 'Easy',
    completed: false,
    streakBoost: '1.1x',
    dueDate: 'Tonight, 9:00 PM',
  },
  {
    id: 104,
    title: 'Focus Ritual: 45-min Deep Work Sprint',
    category: 'coding',
    xp: 140,
    gold: 35,
    difficulty: 'Medium',
    completed: true,
    streakBoost: '1.0x',
    dueDate: 'Completed',
  },
];

const CATEGORY_META = {
  coding: {
    label: 'Code Runic',
    icon: Code2,
    badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-500/50',
    iconColor: 'text-cyan-400',
  },
  fitness: {
    label: 'Iron Vitality',
    icon: Dumbbell,
    badgeBg: 'bg-red-950 text-red-300 border-red-500/50',
    iconColor: 'text-red-400',
  },
  study: {
    label: 'Scroll Wisdom',
    icon: BookOpen,
    badgeBg: 'bg-purple-950 text-purple-300 border-purple-500/50',
    iconColor: 'text-purple-400',
  },
};

export const VillageHomeScreen = ({ onTaskCompleted, playerStats }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('coding');
  const [newTaskXp, setNewTaskXp] = useState(150);

  // Flying XP particle animation state
  const [flyingOrbs, setFlyingOrbs] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [animatingTaskId, setAnimatingTaskId] = useState(null);

  // Handle task checkoff animation
  const handleToggleTask = (task, event) => {
    if (task.completed) {
      // Toggle back to uncompleted
      soundFx.playClick();
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: false } : t))
      );
      return;
    }

    // Trigger Game Juice & Celebratory Animation!
    soundFx.playTaskComplete();
    setAnimatingTaskId(task.id);

    // Get click location for spawning particles
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    // Spawn 7 flying glowing XP orbs arcing to top resource bar
    const targetX = 140; // Top-left XP bar approximate coordinate
    const targetY = 35;
    const newOrbs = Array.from({ length: 7 }).map((_, idx) => ({
      id: `${Date.now()}-${idx}`,
      startX,
      startY,
      targetX,
      targetY,
      delay: idx * 60, // staggered flight
    }));

    setFlyingOrbs(newOrbs);

    // Spawn floating +XP text
    setFloatingTexts((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `+${task.xp} XP`,
        subtext: `+${task.gold} Gold`,
        x: startX + 20,
        y: startY - 10,
      },
    ]);

    // Update tasks state
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
    );

    // Call parent to update global XP & trigger header ripple
    if (onTaskCompleted) {
      onTaskCompleted({ xp: task.xp, gold: task.gold });
    }

    // Clear animations after completion duration (~900ms)
    setTimeout(() => {
      setFlyingOrbs([]);
      setAnimatingTaskId(null);
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
      streakBoost: '1.2x',
      dueDate: 'Today',
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return t.completed;
    return t.category === activeFilter;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 select-none">
      {/* FLYING XP ORBS OVERLAY (Core Screen 3 Animation) */}
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
                opacity: 0.9,
              }}
            />
          ))}
        </div>
      )}

      {/* FLOATING +XP TEXT LABELS */}
      {floatingTexts.map((item) => (
        <div
          key={item.id}
          style={{ left: `${item.x}px`, top: `${item.y}px` }}
          className="fixed pointer-events-none z-50 flex flex-col items-center animate-float-subtle transition-all duration-1000 -translate-y-12 opacity-90"
        >
          <span className="text-xl font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wider">
            {item.text}
          </span>
          <span className="text-xs font-black text-yellow-200 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            🪙 {item.subtext}
          </span>
        </div>
      ))}

      {/* CLASH OF CLANS VILLAGE SCENE HERO BASE */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/90 mb-8 bg-gradient-to-b from-sky-900 via-emerald-950 to-slate-950 min-h-[300px] sm:min-h-[360px] p-4 sm:p-6 flex flex-col justify-between">
        {/* Painterly Sky & Distant Village Hills */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Drifting Clouds */}
          <div className="absolute top-3 left-10 text-4xl opacity-30 animate-float-subtle">☁️</div>
          <div className="absolute top-6 right-20 text-5xl opacity-20 animate-float-slow">☁️</div>

          {/* Isometric Village Structures */}
          {/* Town Hall Fortress */}
          <div className="absolute top-8 left-6 sm:left-12 flex flex-col items-center">
            <div className="text-5xl sm:text-6xl filter drop-shadow-xl">🏰</div>
            <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/60 mt-1 shadow">
              Town Keep Lv.7
            </span>
          </div>

          {/* Elixir Storage & Gold Mine */}
          <div className="absolute top-12 right-6 sm:right-16 flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl filter drop-shadow-lg animate-float-subtle">🧪</div>
              <span className="text-[9px] font-extrabold text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/50 mt-1">
                Mana Vat
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl filter drop-shadow-lg">⛏️</div>
              <span className="text-[9px] font-extrabold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/50 mt-1">
                Gold Mine
              </span>
            </div>
          </div>

          {/* Campfire & Training Dummy */}
          <div className="absolute bottom-6 left-1/3 flex items-center gap-3">
            <div className="text-3xl filter drop-shadow-md animate-flame-flicker">🔥</div>
            <div className="text-2xl filter drop-shadow-md">🎯</div>
          </div>
        </div>

        {/* Top Village Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border-2 border-amber-500/80 shadow-lg flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-amber-200 uppercase tracking-wide">
                Kingdom Fortress Base
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
              <Award className="w-3.5 h-3.5" />
              Today's Defenses: Active
            </div>
          </div>

          {/* Quick Add Quest Button (Wooden Sign Affordance) */}
          <GameButton
            variant="gold"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="shadow-xl"
          >
            <Plus className="w-4 h-4 text-amber-950 stroke-[3]" />
            <span>Post New Bounty</span>
          </GameButton>
        </div>

        {/* Village Center: Character Mascot by War Tent */}
        <div className="relative z-10 mt-12 flex flex-col items-center justify-center">
          <div className="flex items-end gap-6 sm:gap-12">
            {/* Mascot Avatar standing in the village */}
            <MascotAvatar
              size="lg"
              level={playerStats?.level || 7}
              speech={
                completedCount === tasks.length
                  ? 'All bounties conquered! You are unstoppable!'
                  : `${tasks.length - completedCount} bounties remain on the board today, hero!`
              }
              title="Zephyr the Code Alchemist"
              animated={true}
            />

            {/* War Tent Graphics */}
            <div className="hidden sm:flex flex-col items-center mb-4">
              <div className="text-6xl filter drop-shadow-2xl">⛺</div>
              <span className="text-[10px] font-black text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
                Command Pavilion
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Village Status Plaque */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-emerald-800/40 bg-slate-950/60 backdrop-blur-sm -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-200">
              Active Habit Streak:{' '}
              <strong className="text-orange-400 font-mono">
                {playerStats?.streak || 5} Days (1.5x Multiplier)
              </strong>
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300">
            Progress Today:{' '}
            <strong className="text-amber-300 font-mono">
              {completedCount} / {tasks.length} Done
            </strong>
          </span>
        </div>
      </div>

      {/* TODAY'S QUEST BOARD (RUSTIC WOODEN TAVERN NOTICEBOARD) */}
      <WoodCard
        decoration={true}
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-amber-900/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight">
                  Tavern Bounty Board
                </h2>
              </div>
              <p className="text-xs font-bold text-amber-400/80 mt-0.5">
                Check off daily quests to forge discipline & harvest sovereign XP
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-amber-900/60 overflow-x-auto">
              {[
                { key: 'all', label: 'All Bounties' },
                { key: 'coding', label: '💻 Code' },
                { key: 'fitness', label: '🏋️ Vitality' },
                { key: 'study', label: '📚 Wisdom' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveFilter(tab.key);
                  }}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === tab.key
                      ? 'bg-amber-600 text-amber-950 shadow font-extrabold'
                      : 'text-amber-300/80 hover:text-amber-100 hover:bg-amber-900/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {/* Quest Items List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-amber-300/70 font-bold text-sm">
              No bounties match this category filter. Post a new bounty above!
            </div>
          ) : (
            filteredTasks.map((task) => {
              const cat = CATEGORY_META[task.category] || CATEGORY_META.coding;
              const CatIcon = cat.icon;
              const isAnimating = animatingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`relative group transition-all duration-300 rounded-xl p-3 sm:p-4 border-2 flex items-center gap-3 sm:gap-4 select-none ${
                    task.completed
                      ? 'bg-slate-950/70 border-emerald-900/50 opacity-85'
                      : 'parchment-card hover:translate-x-1 hover:shadow-xl'
                  } ${isAnimating ? 'ring-4 ring-purple-400 scale-[1.02]' : ''}`}
                >
                  {/* Checkbox Trigger with Tactile 3D Feedback */}
                  <button
                    onClick={(e) => handleToggleTask(task, e)}
                    title={task.completed ? 'Mark uncompleted' : 'Complete Quest!'}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      task.completed
                        ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-2 border-emerald-300 text-white'
                        : 'bg-gradient-to-b from-amber-100 to-amber-300 border-2 border-amber-700 text-amber-900 hover:scale-110 active:scale-95'
                    }`}
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Square className="w-5 h-5 opacity-40 hover:opacity-100" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {/* Category Tag */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${cat.badgeBg}`}
                      >
                        <CatIcon className="w-3 h-3" />
                        {cat.label}
                      </span>

                      {/* Difficulty */}
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                          task.completed
                            ? 'text-slate-400'
                            : 'text-amber-900 bg-amber-200/60'
                        }`}
                      >
                        {task.difficulty}
                      </span>

                      {/* Due Info */}
                      <span
                        className={`text-[10px] font-medium flex items-center gap-0.5 ${
                          task.completed ? 'text-emerald-500' : 'text-amber-800/80'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-extrabold leading-tight tracking-tight truncate ${
                        task.completed
                          ? 'line-through text-slate-400 font-semibold'
                          : 'text-amber-950'
                      }`}
                    >
                      {task.title}
                    </h4>
                  </div>

                  {/* Rewards Pill */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <div
                      className={`flex flex-col items-end leading-none p-2 rounded-xl border ${
                        task.completed
                          ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                          : 'bg-amber-950/20 border-amber-800/30'
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm font-black flex items-center gap-1 ${
                          task.completed ? 'text-slate-400' : 'text-purple-900'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />+{task.xp} XP
                      </span>
                      <span
                        className={`text-[10px] font-bold mt-0.5 ${
                          task.completed ? 'text-slate-500' : 'text-amber-900'
                        }`}
                      >
                        🪙 +{task.gold} Gold
                      </span>
                    </div>
                  </div>

                  {/* Stamp Badge if Completed */}
                  {task.completed && (
                    <div className="absolute right-24 sm:right-32 top-1/2 -translate-y-1/2 transform -rotate-12 pointer-events-none">
                      <span className="px-2 py-0.5 bg-emerald-600/20 border-2 border-emerald-500 text-emerald-400 text-[10px] font-black uppercase rounded tracking-widest">
                        VICTORY
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </WoodCard>

      {/* QUICK ADD BOUNTY MODAL (PARCHMENT POSTER) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md">
            <ParchmentCard className="border-4 border-amber-800 shadow-2xl">
              <div className="flex items-center justify-between border-b-2 border-amber-900/40 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <h3 className="text-lg font-black text-amber-950">
                    Post New Tavern Bounty
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-amber-900 hover:bg-amber-800/20 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-amber-950 mb-1">
                    Quest Title & Objective
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Complete Chapter 3 Database Indexing"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-800/60 text-amber-950 placeholder-amber-800/50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-amber-950 mb-1">
                      Guild Category
                    </label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-800/60 text-amber-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="coding">💻 Code Runic</option>
                      <option value="fitness">🏋️ Iron Vitality</option>
                      <option value="study">📚 Scroll Wisdom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-amber-950 mb-1">
                      Bounty Reward (XP)
                    </label>
                    <select
                      value={newTaskXp}
                      onChange={(e) => setNewTaskXp(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-800/60 text-amber-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="100">100 XP (Quick Task)</option>
                      <option value="150">150 XP (Standard Quest)</option>
                      <option value="250">250 XP (Heavy Epic)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <GameButton
                    type="button"
                    variant="stone"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </GameButton>
                  <GameButton type="submit" variant="gold" size="sm">
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Nail Bounty to Board
                  </GameButton>
                </div>
              </form>
            </ParchmentCard>
          </div>
        </div>
      )}
    </div>
  );
};
