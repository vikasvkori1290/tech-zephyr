import React from 'react';
import { soundFx } from '../../services/soundFx.js';

// Tactile 3D Game Button (Gold, Emerald, Ruby, Wood, Stone)
export const GameButton = ({
  children,
  variant = 'gold',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  sound = 'click',
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    if (sound === 'click') soundFx.playClick();
    if (sound === 'coin') soundFx.playCoin();
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs font-bold rounded-lg',
    md: 'px-5 py-2.5 text-sm font-extrabold rounded-xl tracking-wide',
    lg: 'px-7 py-3.5 text-base font-black rounded-2xl tracking-wider uppercase',
  };

  const variantClasses = {
    gold: 'game-btn-gold',
    emerald: 'game-btn-emerald',
    ruby: 'game-btn-ruby',
    wood: 'game-btn-wood',
    stone: 'bg-gradient-to-b from-slate-600 to-slate-800 text-slate-100 border-t border-slate-400 border-b-4 border-slate-950 shadow-md hover:brightness-110 active:translate-y-1 active:border-b-0',
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer select-none transition-all ${variantClasses[variant] || variantClasses.gold} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Rustic Wood Plaque Card with Brass Corner Studs
export const WoodCard = ({ children, className = '', header = null, decoration = true }) => {
  return (
    <div className={`relative wood-card rounded-2xl p-4 sm:p-6 ${className}`}>
      {/* Brass Corner Rivets */}
      {decoration && (
        <>
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-800 shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
        </>
      )}

      {header && <div className="mb-4">{header}</div>}
      {children}
    </div>
  );
};

// Weathered Parchment Paper Card
export const ParchmentCard = ({ children, className = '', stamp = null }) => {
  return (
    <div className={`relative parchment-card rounded-xl p-4 sm:p-5 shadow-lg ${className}`}>
      {stamp && (
        <div className="absolute -top-3 -right-2 transform rotate-12 bg-amber-700/20 border-2 border-amber-900/60 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-widest pointer-events-none">
          {stamp}
        </div>
      )}
      {children}
    </div>
  );
};

// Royal Heraldic Ribbon Banner
export const RibbonBanner = ({ title, subtitle = '', variant = 'red', className = '' }) => {
  const bgStyles = {
    red: 'from-red-600 via-rose-600 to-red-800 border-amber-300 text-amber-100',
    gold: 'from-amber-500 via-yellow-500 to-amber-700 border-amber-200 text-amber-950',
    blue: 'from-blue-600 via-indigo-600 to-blue-800 border-cyan-300 text-cyan-100',
    purple: 'from-purple-600 via-fuchsia-600 to-purple-800 border-purple-200 text-purple-100',
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Main Banner Body */}
      <div
        className={`relative z-10 px-8 py-2 bg-gradient-to-r ${bgStyles[variant] || bgStyles.red} rounded-md border-y-2 shadow-xl text-center`}
      >
        <span className="font-black text-base sm:text-lg tracking-wider drop-shadow-md uppercase">
          {title}
        </span>
        {subtitle && (
          <span className="block text-[11px] font-bold opacity-90 tracking-wide mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
      {/* Gold Fringe Dots */}
      <div className="flex gap-1.5 mt-0.5 z-0">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-600 shadow" />
        <div className="w-2 h-2 rounded-full bg-amber-300 border border-amber-600 shadow" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-600 shadow" />
      </div>
    </div>
  );
};

// Clash of Clans Pill Resource Badge
export const ResourceBadge = ({ icon, label, value, color = 'gold', subtext = '', onClick }) => {
  const colorMap = {
    gold: {
      bg: 'from-amber-950/90 to-slate-950/95',
      border: 'border-amber-600/70',
      text: 'text-amber-300',
      glow: 'shadow-amber-500/20',
    },
    elixir: {
      bg: 'from-purple-950/90 to-slate-950/95',
      border: 'border-fuchsia-500/70',
      text: 'text-fuchsia-300',
      glow: 'shadow-fuchsia-500/20',
    },
    emerald: {
      bg: 'from-emerald-950/90 to-slate-950/95',
      border: 'border-emerald-500/70',
      text: 'text-emerald-300',
      glow: 'shadow-emerald-500/20',
    },
    flame: {
      bg: 'from-orange-950/90 to-slate-950/95',
      border: 'border-orange-500/70',
      text: 'text-orange-400',
      glow: 'shadow-orange-500/30',
    },
  };

  const scheme = colorMap[color] || colorMap.gold;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${scheme.bg} border-2 ${scheme.border} shadow-lg ${scheme.glow} cursor-pointer hover:scale-105 transition-transform select-none`}
    >
      <div className="flex-shrink-0 text-xl filter drop-shadow-md">{icon}</div>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {label}
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className={`text-sm sm:text-base font-black tracking-tight ${scheme.text}`}>
            {value}
          </span>
          {subtext && <span className="text-[10px] text-slate-400">{subtext}</span>}
        </div>
      </div>
    </div>
  );
};

// Mascot Avatar with Animations, Level badge & Equipment
export const MascotAvatar = ({
  size = 'md',
  speech = '',
  level = 7,
  title = 'Zephyr the Code Alchemist',
  equipped = 'wand',
  animated = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-12 h-12', badge: 'text-[9px] -bottom-1 -right-1 px-1.5' },
    md: { box: 'w-20 h-20', badge: 'text-xs -bottom-1.5 -right-1.5 px-2' },
    lg: { box: 'w-32 h-32', badge: 'text-sm -bottom-2 -right-2 px-2.5' },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Speech Bubble */}
      {speech && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-amber-400/80 text-amber-200 text-xs font-bold shadow-xl animate-float-subtle max-w-[200px] text-center relative z-20">
          {speech}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-amber-400/80 rotate-45" />
        </div>
      )}

      {/* Mascot Graphic */}
      <div className={`relative ${s.box} ${animated ? 'animate-float-slow' : ''}`}>
        {/* Glowing Aura Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-500/40 to-amber-400/30 blur-md animate-pulse-ring" />

        {/* Outer Frame with Gold Rivets */}
        <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 border-2 border-amber-300 shadow-2xl overflow-hidden flex items-center justify-center">
          {/* Avatar SVG Graphic */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Sky/Dungeon Circle */}
            <circle cx="50" cy="50" r="46" fill="#1e1b4b" />
            <path
              d="M10 75 Q 50 55 90 75 L 90 95 L 10 95 Z"
              fill="#312e81"
            />
            {/* Character Hood / Robe */}
            <path
              d="M26 85 C26 65 35 40 50 40 C65 40 74 65 74 85 Z"
              fill="#4338ca"
            />
            {/* Golden Trim on Robe */}
            <path
              d="M50 40 L50 85"
              stroke="#fbbf24"
              strokeWidth="2.5"
            />
            {/* Face/Shadow inside hood */}
            <ellipse cx="50" cy="52" rx="16" ry="18" fill="#1e1b4b" />
            {/* Glowing Anime/RPG Hero Eyes */}
            <ellipse cx="44" cy="51" rx="3.5" ry="5" fill="#38bdf8" />
            <circle cx="45" cy="50" r="1.5" fill="#ffffff" />
            <ellipse cx="56" cy="51" rx="3.5" ry="5" fill="#38bdf8" />
            <circle cx="57" cy="50" r="1.5" fill="#ffffff" />
            {/* Wizard/Warrior Headband & Rune Gem */}
            <path
              d="M34 44 Q 50 38 66 44"
              stroke="#fbbf24"
              strokeWidth="4"
              fill="none"
            />
            <polygon points="50,37 53,42 50,47 47,42" fill="#ef4444" />

            {/* Sparkles / Magic Sparks */}
            <circle cx="30" cy="30" r="1.5" fill="#facc15" className="animate-ping" />
            <circle cx="72" cy="32" r="2" fill="#38bdf8" />
            <circle cx="68" cy="65" r="1.5" fill="#a855f7" />
          </svg>
        </div>

        {/* Level Badge in Gold Shield */}
        <div
          className={`absolute ${s.badge} rounded-md bg-gradient-to-b from-amber-400 to-amber-700 border border-yellow-200 text-slate-950 font-black shadow-lg flex items-center gap-0.5 select-none`}
        >
          <span className="text-[8px] opacity-75">LV</span>
          <span>{level}</span>
        </div>
      </div>

      {title && (
        <span className="mt-2 text-xs font-black text-amber-300 drop-shadow tracking-wide">
          {title}
        </span>
      )}
    </div>
  );
};
