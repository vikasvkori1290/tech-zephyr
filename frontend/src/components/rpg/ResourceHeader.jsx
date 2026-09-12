import React, { useState } from 'react';
import { Volume2, VolumeX, Flame, Coins, Sparkles, Gem, Map, Home, Gift, Palette } from 'lucide-react';
import { soundFx } from '../../services/soundFx.js';

export const ResourceHeader = ({
  playerStats = {
    level: 7,
    currentXp: 1450,
    maxXp: 2000,
    gold: 3450,
    gems: 120,
    streak: 5,
  },
  activeTab = 'village',
  onTabChange,
  onOpenChest,
  isXpAnimating = false,
  xpRef = null,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.playClick();
  };

  const xpPercent = Math.min(100, Math.round((playerStats.currentXp / playerStats.maxXp) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b-2 border-amber-900/60 shadow-2xl">
      {/* Top Resource HUD Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player Level & XP Gauge */}
        <div ref={xpRef} className="flex items-center gap-2.5 min-w-[210px] sm:min-w-[260px]">
          {/* Level Shield */}
          <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-b from-amber-400 via-amber-600 to-amber-950 border-2 border-yellow-200 shadow-lg flex flex-col items-center justify-center select-none">
            <span className="text-[9px] uppercase font-black text-amber-950 leading-none">LVL</span>
            <span className="text-base font-black text-white leading-none drop-shadow">
              {playerStats.level}
            </span>
            <div className="absolute -bottom-1 w-4 h-1 bg-yellow-300 rounded-full blur-[1px]" />
          </div>

          {/* XP Progress Bar */}
          <div className="flex-1">
            <div className="flex justify-between items-center text-[11px] font-black tracking-wide mb-1 select-none">
              <span className="text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                EXP BAR
              </span>
              <span className="text-purple-200 font-mono">
                {playerStats.currentXp} / {playerStats.maxXp} XP
              </span>
            </div>
            {/* The bar track */}
            <div
              className={`relative h-4 rounded-full bg-slate-900 border-2 border-purple-800/80 overflow-hidden shadow-inner ${
                isXpAnimating ? 'ring-2 ring-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.8)]' : ''
              }`}
            >
              {/* Animated Progress Fill */}
              <div
                className={`h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-400 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-1.5 ${
                  isXpAnimating ? 'brightness-150' : ''
                }`}
                style={{ width: `${xpPercent}%` }}
              >
                <div className="w-2 h-2 rounded-full bg-white/80 animate-ping opacity-75" />
              </div>
              {/* Gloss highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Center / Right: Resource Counters (Gold, Gems, Streak) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Gold Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-amber-600/70 shadow-md">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-yellow-100 flex items-center justify-center text-amber-950 font-black text-xs shadow">
              🪙
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] uppercase font-bold text-amber-500/90 tracking-wider">Gold</span>
              <span className="text-xs sm:text-sm font-black text-amber-200 font-mono">
                {playerStats.gold.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Gems Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-emerald-600/70 shadow-md">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 border border-emerald-100 flex items-center justify-center text-emerald-950 font-black text-xs shadow">
              💎
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] uppercase font-bold text-emerald-500/90 tracking-wider">Gems</span>
              <span className="text-xs sm:text-sm font-black text-emerald-200 font-mono">
                {playerStats.gems}
              </span>
            </div>
          </div>

          {/* Streak Flame Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-orange-500/70 shadow-md relative overflow-hidden group">
            <div className="animate-flame-flicker">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] uppercase font-bold text-orange-400 tracking-wider">Streak</span>
              <span className="text-xs sm:text-sm font-black text-orange-300 font-mono">
                {playerStats.streak} Days
              </span>
            </div>
            {/* Animated Glow Mote */}
            <div className="absolute -right-2 -bottom-2 w-5 h-5 bg-orange-500/20 rounded-full blur-sm pointer-events-none" />
          </div>

          {/* Daily Reward Chest Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              if (onOpenChest) onOpenChest();
            }}
            title="Open Welcome Back Chest"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 border-2 border-yellow-300 text-amber-950 font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Gift className="w-4 h-4 text-amber-950 animate-bounce" />
            <span className="hidden md:inline uppercase tracking-wider">Daily Loot</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Screen Mode Navigation Tabs */}
      <div className="bg-slate-900/90 border-t border-amber-950/50 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-1 sm:gap-2 py-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              soundFx.playClick();
              onTabChange('village');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
              activeTab === 'village'
                ? 'bg-gradient-to-b from-amber-600 to-amber-800 text-amber-100 border-t border-amber-300 border-b-2 border-amber-950 shadow-md scale-105'
                : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>🏰 Village Base (Today's Tasks)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onTabChange('journey');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
              activeTab === 'journey'
                ? 'bg-gradient-to-b from-indigo-600 to-indigo-800 text-indigo-100 border-t border-indigo-300 border-b-2 border-indigo-950 shadow-md scale-105'
                : 'text-slate-400 hover:text-indigo-200 hover:bg-slate-800/60'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>🗺️ Journey Map (Candy Crush Path)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenChest();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black text-amber-300 hover:bg-amber-900/30 transition-all cursor-pointer select-none"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>🎁 Welcome Back Modal</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onTabChange('styleguide');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
              activeTab === 'styleguide'
                ? 'bg-gradient-to-b from-emerald-600 to-emerald-800 text-emerald-100 border-t border-emerald-300 border-b-2 border-emerald-950 shadow-md scale-105'
                : 'text-slate-400 hover:text-emerald-200 hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🎨 Visual Style Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
