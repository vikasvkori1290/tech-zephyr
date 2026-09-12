import React, { useState, useEffect } from 'react';
import knightUrgentImg from '../assets/knight-urgent.png';
import {
  Flame,
  Clock,
  Shield,
  AlertTriangle,
  X,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const StreakWarningModal = ({
  isOpen = true,
  onClose = () => {},
  streakDays = 5,
  hoursRemaining = 3,
  minutesRemaining = 42,
  characterName = 'Commander Valen',
  characterTitle = 'Watch Captain',
  recommendedQuest = {
    title: 'Weekly Grocery Run & Meal Prep',
    category: 'Errands',
    xp: 50,
  },
  onCompleteQuest = () => {},
  onActivateShield = () => {},
  soundEnabled = true,
  onPlaySound = () => {},
}) => {
  const [shieldActive, setShieldActive] = useState(false);

  if (!isOpen) return null;

  const handleUseShield = () => {
    setShieldActive(true);
    onPlaySound('levelup');
    onActivateShield();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleGoToQuest = () => {
    onPlaySound('click');
    onClose();
    onCompleteQuest();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Ambient Flickering Ember Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(16)].map((_, i) => (
          <div
            key={`ember-${i}`}
            className="absolute w-2 h-2 rounded-full bg-orange-500 animate-ping opacity-75"
            style={{
              top: `${20 + ((i * 17) % 65)}%`,
              left: `${10 + ((i * 23) % 80)}%`,
              animationDuration: `${1.1 + (i % 4) * 0.3}s`,
              animationDelay: `${(i % 3) * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Warning Modal Box */}
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2e1208] via-[#1c0c05] to-[#100602] border-4 border-orange-500/80 shadow-[0_0_55px_rgba(249,115,22,0.4),0_10px_0_#541c0b] p-5 sm:p-7 text-center animate-modal-pop my-auto max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#4b2214]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Metallic Gold Rivets */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-700 border border-amber-900 shadow-inner pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-700 border border-amber-900 shadow-inner pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-700 border border-amber-900 shadow-inner pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-700 border border-amber-900 shadow-inner pointer-events-none" />

        {/* Ambient Radial Flame Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#180903] hover:bg-[#341407] border border-[#5c2411] text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close streak warning modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. TOP WARNING BADGE */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950/90 border border-red-500/60 text-red-300 text-[11px] font-clash uppercase font-bold tracking-wider mb-2 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Hearth Fire In Jeopardy · Action Required</span>
        </div>

        {/* 2. LARGE BOLD WARNING HEADING */}
        <h2 className="font-clash text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-200 via-amber-300 to-red-500 tracking-wider drop-shadow-[0_4px_12px_rgba(239,68,68,0.7)] leading-tight mb-1">
          DEFEND YOUR STREAK!
        </h2>

        {/* 3. URGENT COUNTDOWN STRIP */}
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#1d0a04] border border-[#64240f] text-amber-300 text-xs font-mono font-bold mb-4 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Only {hoursRemaining}h {minutesRemaining}m left to log a quest today!</span>
        </div>

        {/* 4. CHARACTER CARD: WORRIED / URGENT POSE */}
        <div className="relative mx-auto mb-4 w-32 sm:w-36">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#4a1c0d] via-[#2f1107] to-[#1a0803] border-4 border-orange-500/80 p-1 shadow-[0_0_30px_rgba(249,115,22,0.5),0_6px_0_#4a1506] overflow-hidden group">
            {/* Character Artwork Frame */}
            <div className="w-full h-28 sm:h-32 rounded-xl bg-gradient-to-b from-[#183941] via-[#102429] to-[#071114] flex items-center justify-center relative overflow-hidden p-0.5">
              <img
                src={knightUrgentImg}
                alt="Worried / Urgent Knight Mascot"
                className="w-full h-full object-cover rounded-lg drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] scale-105"
              />
              {/* Gloss highlight */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 rounded-t-lg pointer-events-none" />
            </div>

            {/* "AT RISK!" Alert Ribbon */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[112%] py-0.5 rounded-lg bg-gradient-to-r from-red-700 via-orange-600 to-red-700 border-2 border-orange-300 shadow-[0_3px_6px_rgba(0,0,0,0.8)] text-center">
              <span className="font-clash text-[10px] font-black uppercase text-white tracking-wider">
                ⚠ STREAK AT RISK ⚠
              </span>
            </div>
          </div>

          {/* Character Label & Mood Badge */}
          <div className="mt-2 text-center">
            <span className="text-xs font-bold text-amber-200 font-clash tracking-wide block">
              {characterName}
            </span>
            <span className="text-[10px] text-stone-400 uppercase font-bold block leading-tight">
              {characterTitle}
            </span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[9px] font-bold uppercase tracking-wider">
              <span>Mood: Worried · Urgent</span>
            </div>
          </div>
        </div>

        {/* 5. URGENT FLAVOR DIALOGUE */}
        <div className="rounded-2xl bg-[#180903] border-2 border-[#4f1e0e] p-3 mb-4 text-left shadow-inner">
          <p className="text-xs text-stone-300 italic leading-relaxed text-center">
            "Commander, our campfire flickers low! The {streakDays}-day momentum we fought for will shatter at midnight unless a directive is completed!"
          </p>
        </div>

        {/* 6. QUICK DIRECTIVE RECOMMENDATION */}
        <div className="rounded-2xl bg-gradient-to-r from-[#240e05] via-[#331307] to-[#240e05] border-2 border-orange-500/50 p-3 mb-5 text-left flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-950 border border-orange-500/60 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-extrabold text-orange-300 tracking-wider block">
                Quick Save Directive:
              </span>
              <p className="text-xs font-bold text-stone-200 truncate">
                {recommendedQuest.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoToQuest}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-200 text-amber-950 font-clash text-xs font-black uppercase shadow-md hover:brightness-110 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
          >
            <span>Log It</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7. TWO ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Primary CTA: Go Defend Streak */}
          <button
            type="button"
            onClick={handleGoToQuest}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-b from-orange-500 via-amber-500 to-orange-600 border-2 border-amber-200 text-amber-950 font-clash font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_#7c2d12,0_8px_16px_rgba(0,0,0,0.5)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#7c2d12] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-amber-950" />
            <span>Conquer A Quest Now</span>
          </button>

          {/* Secondary Button: Deploy Streak Shield */}
          <button
            type="button"
            onClick={handleUseShield}
            disabled={shieldActive}
            className={`w-full sm:w-auto py-3 px-4 rounded-2xl border-2 font-clash text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              shieldActive
                ? 'bg-sky-900 border-sky-400 text-sky-200 cursor-default'
                : 'bg-[#180903] hover:bg-[#2b1206] border-[#5a2512] text-stone-300 hover:text-white'
            }`}
            title="Freeze streak for 24h"
          >
            <Shield className={`w-4 h-4 ${shieldActive ? 'text-sky-300 fill-sky-300' : 'text-amber-400'}`} />
            <span>{shieldActive ? 'Shield Armed ✓' : 'Use Streak Shield'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakWarningModal;

