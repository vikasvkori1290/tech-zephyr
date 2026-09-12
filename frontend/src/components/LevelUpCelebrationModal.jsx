import React, { useState } from 'react';
import knightCelebratingImg from '../assets/knight-celebrating.png';
import {
  Trophy,
  Sparkles,
  Zap,
  Shield,
  Award,
  Share2,
  Check,
  Star,
  Flame,
  X,
  Coins,
} from 'lucide-react';

export const LevelUpCelebrationModal = ({
  isOpen = true,
  onClose = () => {},
  newLevel = 7,
  oldLevel = 6,
  characterName = 'Sir Ethan the Champion',
  avatar = knightCelebratingImg,
  subheading = 'Bravest Quest Completed',
  statIncrease = 'Intellect +2',
  stats = [
    {
      id: 'stamina',
      label: 'Max Stamina',
      value: '120 pts',
      delta: '+15 Stamina',
      icon: Flame,
      color: 'text-orange-400',
    },
    {
      id: 'intellect',
      label: 'Intellect',
      value: 'Lv. 17',
      delta: '+2 Intellect',
      icon: Award,
      color: 'text-sky-400',
    },
    {
      id: 'rank',
      label: 'Tier Rank',
      value: 'Vanguard II',
      delta: 'UNLOCKED',
      isUnlocked: true,
      icon: Shield,
      color: 'text-amber-400',
    },
  ],
  skill = {
    name: 'Deep Flow',
    description:
      'Completing 3 consecutive categorized quests awards an automatic 1.5x Gold & XP multiplier on your next directive!',
  },
  soundEnabled = true,
  onPlaySound = () => {},
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    onPlaySound('click');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🏆 I just leveled up to Level ${newLevel} in my Gamified Quest Board! Powered by real-world productivity.`
      );
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = () => {
    onPlaySound('levelup');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Background Animated Floating Confetti & Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Confetti Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`confetti-${i}`}
            className={`absolute w-2.5 h-2.5 rounded-sm animate-ping ${
              [
                'bg-yellow-400',
                'bg-amber-300',
                'bg-emerald-400',
                'bg-cyan-400',
                'bg-rose-400',
                'bg-purple-400',
              ][i % 6]
            }`}
            style={{
              top: `${8 + ((i * 19) % 84)}%`,
              left: `${6 + ((i * 27) % 88)}%`,
              animationDuration: `${1.4 + (i % 5) * 0.25}s`,
              animationDelay: `${(i % 5) * 0.12}s`,
              opacity: 0.85,
            }}
          />
        ))}

        {/* Twinkling Star Sparkles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300 font-bold animate-sparkle-twinkle select-none"
            style={{
              top: `${12 + ((i * 29) % 76)}%`,
              left: `${10 + ((i * 33) % 80)}%`,
              fontSize: `${14 + (i % 3) * 6}px`,
              animationDelay: `${(i * 0.35) % 2}s`,
              opacity: 0.9,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Main Modal Box with Bounce/Scale-In Animation */}
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2e1a0d] via-[#1d1007] to-[#100803] border-4 border-yellow-300 shadow-[0_0_60px_rgba(245,158,11,0.5),0_10px_0_#6c3a10] p-5 sm:p-7 text-center animate-modal-pop my-auto max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#4b2f18]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Metallic Gold Studs */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-600 border border-yellow-100 shadow-inner pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-600 border border-yellow-100 shadow-inner pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-600 border border-yellow-100 shadow-inner pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-600 border border-yellow-100 shadow-inner pointer-events-none" />

        {/* Ambient Radial Golden Sunburst Ray */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#180e07] hover:bg-[#341f11] border border-[#523319] text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close celebration modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. TOP BADGE: "Focus Mastery Milestone Reached" small pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/60 text-amber-300 text-[11px] font-clash uppercase font-bold tracking-wider mb-2">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Focus Mastery Milestone Reached</span>
        </div>

        {/* 2. LARGE BOLD "LEVEL UP!" HEADING WITH GLOWING GOLD GRADIENT */}
        <h2 className="font-clash text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 tracking-wider drop-shadow-[0_4px_12px_rgba(245,158,11,0.7)] leading-none mb-1">
          LEVEL UP!
        </h2>

        {/* 3. SUBHEADING: "Bravest Quest Completed" */}
        <p className="text-xs sm:text-sm font-bold text-amber-200/90 font-sans tracking-wide uppercase mb-4">
          {subheading}
        </p>

        {/* 4. CENTER: CHARACTER PORTRAIT CARD */}
        <div className="relative mx-auto mb-3.5 w-32 sm:w-36">
          {/* Portrait Frame */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#4a2e19] via-[#311c0e] to-[#1a0e06] border-4 border-amber-400 p-1 shadow-[0_0_25px_rgba(251,191,36,0.6),0_6px_0_#78350f] overflow-hidden group">
            {/* Illustrated Celebrating Character Image */}
            <div className="w-full h-28 sm:h-32 rounded-xl bg-gradient-to-b from-[#38bdf8]/20 via-[#0284c7]/20 to-[#0c1926] flex items-center justify-center relative overflow-hidden p-0.5">
              {/* Radial Sunburst glow */}
              <div className="absolute inset-0 bg-radial from-amber-400/30 via-transparent to-transparent pointer-events-none" />

              <img
                src={avatar || knightCelebratingImg}
                alt="Excited Celebrating Knight"
                className="w-full h-full object-cover rounded-lg drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              />

              {/* Top gloss highlight */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/25 rounded-t-lg pointer-events-none" />
            </div>

            {/* "LEVEL UP!" Overlaid Ribbon */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[112%] py-0.5 rounded-lg bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border-2 border-yellow-200 shadow-[0_3px_6px_rgba(0,0,0,0.8)] text-center">
              <span className="font-clash text-[11px] font-black uppercase text-amber-950 tracking-wider">
                ★ LEVEL UP! ★
              </span>
            </div>
          </div>

          {/* Character Name and Level */}
          <div className="mt-2 text-center">
            <span className="text-xs font-bold text-amber-300 font-clash tracking-wide block truncate">
              {characterName} · Lv. {newLevel}
            </span>
          </div>
        </div>

        {/* 5. "YOU REACHED LEVEL X" IN BOLD */}
        <div className="mb-2">
          <h3 className="font-clash text-2xl sm:text-3xl font-black text-white tracking-wide">
            You reached <span className="text-yellow-400">LEVEL {newLevel}</span>
          </h3>
        </div>

        {/* 6. STAT-INCREASE PILL */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-300" />
          <span>{statIncrease}</span>
        </div>

        {/* 7. ROW OF 3 STAT CARDS: Current values with deltas */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {stats.map((item) => {
            const IconComponent = item.icon || Award;
            return (
              <div
                key={item.id}
                className="p-2.5 rounded-2xl bg-[#1a0e07] border-2 border-[#4f311a] shadow-inner text-center flex flex-col justify-between"
              >
                <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-stone-400 mb-0.5">
                  <IconComponent className={`w-3 h-3 ${item.color || 'text-amber-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="font-clash text-base sm:text-lg text-white font-extrabold truncate">
                  {item.value}
                </div>
                <div className="mt-0.5">
                  {item.isUnlocked ? (
                    <span className="text-[9px] font-extrabold uppercase font-clash px-1.5 py-0.5 rounded bg-emerald-900/80 border border-emerald-500 text-emerald-300">
                      {item.delta}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] font-bold text-emerald-400">
                      {item.delta}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 8. HIGHLIGHTED "NEW SKILL MASTERED" BANNER */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2a170a] via-[#381f0d] to-[#2a170a] border-2 border-amber-500/60 p-3 mb-5 text-left shadow-inner">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            </div>
            <span className="font-clash text-xs uppercase font-extrabold text-amber-300 tracking-wider">
              New Skill Mastered: {skill.name}
            </span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed pl-7">
            {skill.description}
          </p>
        </div>

        {/* 9. TWO ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Primary Gold CTA: Claim Level Rewards */}
          <button
            type="button"
            onClick={handleClaim}
            className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-200 text-amber-950 font-clash font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-[0_4px_0_#92400e,0_8px_16px_rgba(0,0,0,0.5)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
          >
            Claim Level Rewards
          </button>

          {/* Secondary Button: Share Triumph */}
          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-[#1c0f07] hover:bg-[#2e190d] border-2 border-[#54341b] text-stone-300 hover:text-white font-clash text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share Triumph</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpCelebrationModal;
