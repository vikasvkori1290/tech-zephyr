import React, { useState } from 'react';
import knightImg from '../assets/knight-neutral.png';
import {
  Heart,
  Gift,
  Sparkles,
  Coins,
  Check,
  Clock,
  X,
  Award,
  Trophy,
  Flame,
  ChevronRight,
  Shield,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const DailyMilestoneModal = ({
  isOpen = true,
  onClose = () => {},
  onClaimBounty = (amount) => {},
  soundEnabled = true,
  onPlaySound = () => {},
}) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const [activeCompanion, setActiveCompanion] = useState('knight'); // 'knight' or 'sylph'

  if (!isOpen) return null;

  // Mock data for milestone progress
  const completedCount = 3;
  const totalDailyTarget = 5;
  const progressPercent = Math.round((completedCount / totalDailyTarget) * 100);
  const bountyGold = 50;

  const handleClaim = () => {
    if (isClaimed) return;
    setIsClaimed(true);
    onPlaySound('levelup');
    onClaimBounty(bountyGold);
  };

  return (
    <aside
      aria-label="Daily Milestone Progress"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[580px] max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#28170c] via-[#1a0e06] to-[#0f0703] border-4 border-[#5c371b] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.25)] animate-in slide-in-from-bottom-5 duration-300 select-none scrollbar-thin scrollbar-thumb-[#4b2f18]"
    >
      {/* Corner Metallic Gold Rivets */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner pointer-events-none" />

      {/* Top Close Button */}
      <button
        type="button"
        onClick={() => {
          onPlaySound('click');
          onClose();
        }}
        className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#180d05] hover:bg-[#341b0b] border border-[#523319] text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Close milestone dialog"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch">
        {/* LEFT COLUMN: Companion Creature Mascot & Affinity */}
        <div className="sm:w-[185px] shrink-0 rounded-2xl bg-gradient-to-b from-[#1c1007] to-[#0c0502] border-2 border-[#472a15] p-3.5 flex flex-col items-center justify-between text-center relative overflow-hidden">
          {/* Subtle companion background glow */}
          <div
            className={`absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
              activeCompanion === 'knight' ? 'bg-cyan-500/15' : 'bg-emerald-500/15'
            }`}
          />

          {/* Quick Companion Switcher Button */}
          <button
            type="button"
            onClick={() => {
              onPlaySound('click');
              setActiveCompanion((prev) => (prev === 'knight' ? 'sylph' : 'knight'));
            }}
            className="absolute top-2 right-2 z-10 p-1 rounded-lg bg-[#241308] hover:bg-[#381e0d] border border-[#523319] text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
            title={`Switch to ${activeCompanion === 'knight' ? 'Sylph' : 'Sir Ethan'}`}
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          <div className="w-full flex flex-col items-center">
            {/* Mascot Illustration Emblem */}
            <div className="relative mb-2.5 group">
              <div
                className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 flex items-center justify-center relative overflow-hidden p-0.5 ${
                  activeCompanion === 'knight'
                    ? 'bg-[#183941] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'bg-gradient-to-b from-emerald-900 via-[#152e18] to-[#09150b] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                }`}
              >
                {activeCompanion === 'knight' ? (
                  <img
                    src={knightImg}
                    alt="Neutral/Attentive Knight Companion"
                    className="w-full h-full object-cover rounded-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  />
                ) : (
                  /* Stylized Verdant Spirit Creature SVG */
                  <svg
                    viewBox="0 0 100 100"
                    className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-pulse"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 40 C10 25, 30 15, 45 35 C30 38, 22 45, 20 40 Z"
                      fill="url(#spiritGrad)"
                      opacity="0.9"
                    />
                    <path
                      d="M80 40 C90 25, 70 15, 55 35 C70 38, 78 45, 80 40 Z"
                      fill="url(#spiritGrad)"
                      opacity="0.9"
                    />
                    <circle cx="50" cy="52" r="22" fill="#10b981" />
                    <circle cx="50" cy="52" r="19" fill="#047857" />
                    <path
                      d="M50 20 C46 32, 54 32, 50 20 Z"
                      fill="#34d399"
                      stroke="#a7f3d0"
                      strokeWidth="1.5"
                    />
                    <ellipse cx="43" cy="50" rx="4.5" ry="6" fill="#fef08a" />
                    <ellipse cx="57" cy="50" rx="4.5" ry="6" fill="#fef08a" />
                    <circle cx="43" cy="51" r="2.2" fill="#1e293b" />
                    <circle cx="57" cy="51" r="2.2" fill="#1e293b" />
                    <circle cx="44.5" cy="48.5" r="1.2" fill="#ffffff" />
                    <circle cx="58.5" cy="48.5" r="1.2" fill="#ffffff" />
                    <path
                      d="M47 58 Q50 61 53 58"
                      stroke="#fef08a"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="spiritGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}

                {/* Shimmer reflection */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 rounded-t-xl pointer-events-none" />
              </div>

              {/* Level Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-yellow-200 shadow-md flex items-center gap-1 whitespace-nowrap">
                {activeCompanion === 'knight' ? (
                  <Shield className="w-3 h-3 text-amber-950 fill-amber-300" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-950 fill-amber-300" />
                )}
                <span className="font-clash text-[10px] font-black text-amber-950 leading-none">
                  {activeCompanion === 'knight' ? 'LVL 4' : 'LVL 3'}
                </span>
              </div>
            </div>

            {/* Companion Name & Title */}
            <h4 className="font-clash text-sm text-amber-200 font-extrabold tracking-wide leading-snug mt-1.5">
              {activeCompanion === 'knight' ? 'Sir Ethan' : 'Sylph'}
            </h4>
            <span className="text-[10px] uppercase font-bold text-stone-400 leading-tight">
              {activeCompanion === 'knight' ? 'Watchful Sentinel' : 'Verdant Spirit'}
            </span>

            {/* Mood Indicator: Neutral / Attentive */}
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                activeCompanion === 'knight'
                  ? 'bg-cyan-950/90 border border-cyan-500/50 text-cyan-300'
                  : 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-300'
              }`}
            >
              <Eye className="w-2.5 h-2.5" />
              <span>{activeCompanion === 'knight' ? 'Neutral · Attentive' : 'Cheerful · Helpful'}</span>
            </div>

            {/* Affinity Hearts */}
            <div className="flex items-center gap-1 mt-2" title="Companion Affinity: 4 of 5 Hearts">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < 4
                      ? 'text-rose-500 fill-rose-500 filter drop-shadow-[0_0_3px_rgba(244,63,94,0.7)]'
                      : 'text-stone-600 fill-transparent'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] font-medium text-amber-400/90 mt-0.5">
              Affinity: High (80%)
            </span>
          </div>

          {/* Flavor Quote */}
          <div className="w-full pt-2 mt-2 border-t border-[#3b200e] text-[10px] text-stone-300 italic leading-snug">
            {activeCompanion === 'knight'
              ? '"Standing post and attentive. 3 deeds secured, awaiting your next directive."'
              : '"Your focus fuels the forest spirits! Keep pressing forward!"'}
          </div>
        </div>

        {/* RIGHT COLUMN: Milestone Progress Card */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {/* Header Greeting & Badge */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-300 text-[10px] font-clash uppercase font-bold tracking-wider">
                <Award className="w-3 h-3 text-yellow-400" />
                <span>Daily Focus Milestone</span>
              </span>
              <span className="font-mono text-xs font-bold text-amber-400 pr-6">
                {completedCount}/{totalDailyTarget} Done
              </span>
            </div>

            <h3 className="font-clash text-xl sm:text-2xl font-black text-amber-100 tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Huzzah, Adventurer!
            </h3>

            {/* Dynamic Flavor Text */}
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              You've conquered{' '}
              <strong className="text-amber-300 font-bold">
                {completedCount} of {totalDailyTarget} quests
              </strong>{' '}
              today. The sanctuary basks in your momentum!
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-stone-400 uppercase text-[10px]">
                Daily Quest Quota
              </span>
              <span className="font-mono font-bold text-emerald-300">
                {progressPercent}% Complete
              </span>
            </div>
            <div className="h-3.5 bg-[#120803] rounded-full p-0.5 border-2 border-[#4a2b15] shadow-inner relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.6)] relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
              </div>
            </div>
          </div>

          {/* Today's Deeds List */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
              Today's Deeds:
            </div>

            {/* Completed Task 1 */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c0f07]/90 border border-[#442712] text-xs">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-4 h-4 rounded-full bg-emerald-900/80 border border-emerald-500 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-300 stroke-[3]" />
                </div>
                <span className="text-stone-200 truncate font-medium">
                  Morning 5km Run & Mobility <span className="text-stone-400 text-[11px]">(Physical)</span>
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-300 shrink-0">
                +50 XP, +25 🪙
              </span>
            </div>

            {/* Completed Task 2 */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c0f07]/90 border border-[#442712] text-xs">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-4 h-4 rounded-full bg-emerald-900/80 border border-emerald-500 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-300 stroke-[3]" />
                </div>
                <span className="text-stone-200 truncate font-medium">
                  Finish Architecture Refactor <span className="text-stone-400 text-[11px]">(Work)</span>
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-300 shrink-0">
                +100 XP, +50 🪙
              </span>
            </div>

            {/* Completed Task 3 */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c0f07]/90 border border-[#442712] text-xs">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-4 h-4 rounded-full bg-emerald-900/80 border border-emerald-500 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-300 stroke-[3]" />
                </div>
                <span className="text-stone-200 truncate font-medium">
                  Read Chapter 4 System Design <span className="text-stone-400 text-[11px]">(Study)</span>
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-300 shrink-0">
                +25 XP, +10 🪙
              </span>
            </div>

            {/* Pending Task Row (Greyed out & dashed) */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#140b05]/60 border border-dashed border-[#442a18] text-xs opacity-70">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="w-4 h-4 rounded-full border border-stone-600 flex items-center justify-center shrink-0">
                  <Clock className="w-2.5 h-2.5 text-stone-400" />
                </div>
                <span className="text-stone-400 truncate italic">
                  Weekly Grocery Run & Meal Prep <span className="text-stone-500">(Errands)</span>
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-500/80 tracking-wider shrink-0">
                Pending
              </span>
            </div>
          </div>

          {/* Earned Today Summary Strip */}
          <div className="rounded-xl bg-gradient-to-r from-[#170c05] via-[#241308] to-[#170c05] border border-[#4a2d17] p-2.5 flex items-center justify-between text-xs">
            <span className="font-clash text-stone-300 uppercase tracking-wide text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Earned Today:</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sky-300 bg-sky-950/70 border border-sky-800 px-2 py-0.5 rounded-lg text-[11px]">
                +175 XP
              </span>
              <span className="font-mono font-bold text-yellow-300 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded-lg text-[11px] flex items-center gap-0.5">
                +85 🪙
              </span>
              <span
                className="flex items-center gap-1 font-mono font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-lg text-[11px]"
                title="Milestone Bonus: 10 Gems"
              >
                +10 💎
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            {/* Primary Gold CTA: Claim Bounty */}
            <button
              type="button"
              onClick={handleClaim}
              disabled={isClaimed}
              className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl font-clash font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isClaimed
                  ? 'bg-emerald-800 text-emerald-200 border-2 border-emerald-600 shadow-none cursor-default'
                  : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-200 text-amber-950 shadow-[0_4px_0_#92400e,0_6px_12px_rgba(0,0,0,0.5)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#92400e]'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>{isClaimed ? 'Bounty Claimed ✓' : `Claim Milestone Bounty (+${bountyGold}G)`}</span>
            </button>

            {/* Secondary Ghost Button: Continue Journey */}
            <button
              type="button"
              onClick={() => {
                onPlaySound('click');
                onClose();
              }}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#1c0f07] hover:bg-[#2b170c] border border-[#523319] text-stone-300 hover:text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Continue Journey
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DailyMilestoneModal;

