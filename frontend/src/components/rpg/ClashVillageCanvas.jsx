import React, { useState } from 'react';
import { Sparkles, Shield, Flame, HardHat, Info, X, Zap } from 'lucide-react';
import { soundFx } from '../../services/soundFx.js';

export const ClashVillageCanvas = ({ onSelectBuilding }) => {
  const [activeBuilding, setActiveBuilding] = useState(null);

  const buildings = [
    {
      id: 'townhall',
      name: 'Town Keep',
      level: 7,
      role: 'Heart of the Realm',
      buff: '+20% Defense to habit streak',
      desc: 'Command fortress where all daily decrees and focus rituals are ratified.',
      x: '52%',
      y: '42%',
    },
    {
      id: 'elixir',
      name: 'Mana Elixir Collector',
      level: 6,
      role: 'Mental Energy Core',
      buff: '+15% Bonus XP on study tasks',
      desc: 'Condenses ambient focus into glowing violet elixir to level up your character.',
      x: '28%',
      y: '58%',
    },
    {
      id: 'goldmine',
      name: 'Gold Vault & Treasury',
      level: 8,
      role: 'Resource Storage',
      buff: 'Capacity: 5,000 Gold',
      desc: 'Stores gold earned from conquered trials. Used for guild equipment upgrades.',
      x: '75%',
      y: '56%',
    },
    {
      id: 'barracks',
      name: 'Discipline Forge',
      level: 5,
      role: 'Physical Training Ground',
      buff: 'Double strength multiplier',
      desc: 'Where daily workouts and calisthenic reps forge unyielding iron vitality.',
      x: '68%',
      y: '28%',
    },
  ];

  const handleBuildingClick = (b) => {
    soundFx.playClick();
    setActiveBuilding(b);
    if (onSelectBuilding) onSelectBuilding(b);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gradient-to-b from-[#1b381e] via-[#244c29] to-[#163319]">
      {/* ISOMETRIC CHECKERBOARD GRASS FIELD */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="isoGrid" width="60" height="34" patternUnits="userSpaceOnUse">
            <polygon points="30,0 60,17 30,34 0,17" fill="#2d5e33" stroke="#254e2a" strokeWidth="1" />
            <polygon points="30,0 60,17 30,34 0,17" fill="#326939" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#isoGrid)" />
      </svg>

      {/* COBBLESTONE PATHWAY RUNNING THROUGH VILLAGE */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 10 90 Q 30 75 52 50 T 75 30 Q 90 20 95 10"
          fill="none"
          stroke="#5c4d3c"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 10 90 Q 30 75 52 50 T 75 30 Q 90 20 95 10"
          fill="none"
          stroke="#857157"
          strokeWidth="4"
          strokeDasharray="2, 3"
          strokeLinecap="round"
        />
      </svg>

      {/* VILLAGE TREES WITH SNOW CAPS & ROCKS */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Tree 1 (Top Left) */}
        <div className="absolute top-[16%] left-[18%] flex flex-col items-center animate-float-subtle">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-800 border-2 border-emerald-950 relative shadow-xl">
            <div className="absolute -top-1 left-2 right-2 h-4 bg-slate-100 rounded-full opacity-90" />
          </div>
          <div className="w-3 h-5 bg-amber-950 rounded-b" />
        </div>

        {/* Tree 2 (Bottom Right) */}
        <div className="absolute bottom-[20%] right-[10%] flex flex-col items-center">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-emerald-900 border-2 border-emerald-950 relative shadow-xl">
            <div className="absolute -top-1 left-2 right-2 h-5 bg-slate-100 rounded-full opacity-90" />
          </div>
          <div className="w-4 h-6 bg-amber-950 rounded-b" />
        </div>

        {/* Rock Cluster (Top Right) */}
        <div className="absolute top-[12%] right-[22%] flex items-center gap-1 opacity-80">
          <div className="w-7 h-5 rounded-lg bg-slate-500 border border-slate-700 shadow" />
          <div className="w-5 h-4 rounded-md bg-slate-600 border border-slate-700 shadow -ml-2" />
        </div>

        {/* Drifting Mist / Clouds */}
        <div className="absolute top-[8%] left-[10%] opacity-20 text-6xl animate-float-slow">☁️</div>
        <div className="absolute top-[22%] right-[15%] opacity-20 text-7xl animate-float-subtle">☁️</div>
      </div>

      {/* ISOMETRIC PROCEDURAL BUILDINGS */}

      {/* 1. TOWN KEEP (CENTER) */}
      <div
        style={{ left: '50%', top: '44%' }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        onClick={() => handleBuildingClick(buildings[0])}
      >
        <div className="relative flex flex-col items-center transition-transform group-hover:scale-105 active:scale-95">
          {/* Level Shield Banner */}
          <div className="mb-1 px-2 py-0.5 rounded-md bg-amber-500 border border-amber-800 text-amber-950 text-[10px] font-black uppercase shadow tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 fill-amber-950" />
            <span>Keep Lv.7</span>
          </div>

          {/* Procedural Castle Keep SVG */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 relative">
            <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.8)]">
              {/* Ground Shadow */}
              <ellipse cx="80" cy="140" rx="65" ry="20" fill="rgba(0,0,0,0.4)" />

              {/* Stone Foundation */}
              <polygon points="25,120 80,145 135,120 80,95" fill="#475569" stroke="#1e293b" strokeWidth="2" />

              {/* Keep Main Walls */}
              <polygon points="35,115 80,135 80,75 35,55" fill="#854d0e" stroke="#3b1d06" strokeWidth="2" />
              <polygon points="80,135 125,115 125,55 80,75" fill="#a16207" stroke="#3b1d06" strokeWidth="2" />

              {/* Timber Beam Insets */}
              <line x1="35" y1="85" x2="80" y2="105" stroke="#451a03" strokeWidth="3" />
              <line x1="80" y1="105" x2="125" y2="85" stroke="#451a03" strokeWidth="3" />

              {/* Arched Heavy Door */}
              <path d="M 68 130 C 68 112 92 112 92 130 Z" fill="#1e1b4b" stroke="#facc15" strokeWidth="2" />
              <circle cx="88" cy="122" r="1.5" fill="#facc15" />

              {/* Upper Floor Slate Roof & Snow Cap */}
              <polygon points="20,60 80,85 140,60 80,30" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
              <polygon points="25,58 80,78 135,58 80,35" fill="#e2e8f0" opacity="0.85" />

              {/* Watchtower Chimney with Smoke */}
              <rect x="95" y="15" width="14" height="24" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
              {/* Crest Flag */}
              <polygon points="80,30 80,10 98,16 80,22" fill="#facc15" stroke="#854d0e" strokeWidth="1.5" />
              <line x1="80" y1="30" x2="80" y2="8" stroke="#ca8a04" strokeWidth="2" />
            </svg>

            {/* Smoke particle puffing from chimney */}
            <div className="absolute top-2 right-8 w-4 h-4 rounded-full bg-white/50 blur-xs animate-float-slow pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. ELIXIR LABORATORY (BOTTOM-LEFT) */}
      <div
        style={{ left: '26%', top: '60%' }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        onClick={() => handleBuildingClick(buildings[1])}
      >
        <div className="relative flex flex-col items-center transition-transform group-hover:scale-105 active:scale-95">
          <div className="mb-1 px-2 py-0.5 rounded-md bg-purple-600 border border-purple-300 text-white text-[9px] font-black uppercase shadow flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-200" />
            <span>Elixir Vat</span>
          </div>

          <div className="w-28 h-28 sm:w-34 sm:h-34 relative">
            <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]">
              <ellipse cx="60" cy="105" rx="45" ry="14" fill="rgba(0,0,0,0.4)" />
              {/* Brass Base Ring */}
              <ellipse cx="60" cy="95" rx="38" ry="12" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              {/* Glass Vat Cylinder */}
              <path d="M 28 50 C 28 30 92 30 92 50 L 92 88 C 92 102 28 102 28 88 Z" fill="rgba(255,255,255,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Glowing Purple Elixir Fluid inside */}
              <path d="M 30 62 C 30 50 90 50 90 62 L 90 86 C 90 98 30 98 30 86 Z" fill="#9333ea" />
              <ellipse cx="60" cy="62" rx="30" ry="8" fill="#c084fc" className="animate-pulse" />
              {/* Rising bubbles */}
              <circle cx="50" cy="72" r="2.5" fill="#f5d0fe" />
              <circle cx="70" cy="68" r="3" fill="#f5d0fe" />
              {/* Brass dome lid */}
              <ellipse cx="60" cy="40" rx="28" ry="10" fill="#facc15" stroke="#854d0e" strokeWidth="2" />
            </svg>
            {/* Ambient purple glow */}
            <div className="absolute inset-2 rounded-full bg-purple-500/20 blur-lg pointer-events-none animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. GOLD VAULT & MINE (BOTTOM-RIGHT) */}
      <div
        style={{ left: '76%', top: '58%' }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        onClick={() => handleBuildingClick(buildings[2])}
      >
        <div className="relative flex flex-col items-center transition-transform group-hover:scale-105 active:scale-95">
          <div className="mb-1 px-2 py-0.5 rounded-md bg-amber-500 border border-yellow-200 text-amber-950 text-[9px] font-black uppercase shadow flex items-center gap-1">
            <span>🪙 Gold Mine</span>
          </div>

          <div className="w-28 h-28 sm:w-34 sm:h-34 relative">
            <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]">
              <ellipse cx="60" cy="105" rx="44" ry="14" fill="rgba(0,0,0,0.4)" />
              {/* Wooden Mine Shaft Arch */}
              <polygon points="20,100 60,115 100,100 60,85" fill="#334155" stroke="#0f172a" strokeWidth="2" />
              <path d="M 35 100 L 35 55 L 85 55 L 85 100" fill="#582a0b" stroke="#271003" strokeWidth="4" />
              {/* Mine Entrance Cave */}
              <path d="M 42 98 C 42 65 78 65 78 98 Z" fill="#020617" />
              {/* Mining Cart spilling golden coins */}
              <rect x="46" y="80" width="28" height="18" rx="3" fill="#854d0e" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="52" cy="98" r="4" fill="#334155" />
              <circle cx="68" cy="98" r="4" fill="#334155" />
              {/* Shiny Gold Coins in cart */}
              <circle cx="54" cy="80" r="4" fill="#facc15" stroke="#b45309" strokeWidth="1" />
              <circle cx="62" cy="78" r="5" fill="#facc15" stroke="#b45309" strokeWidth="1" />
              <circle cx="67" cy="81" r="4" fill="#fde047" stroke="#b45309" strokeWidth="1" />
            </svg>
            <div className="absolute top-12 right-6 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
          </div>
        </div>
      </div>

      {/* 4. DISCIPLINE FORGE & TRAINING GROUNDS (TOP-RIGHT) */}
      <div
        style={{ left: '70%', top: '26%' }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        onClick={() => handleBuildingClick(buildings[3])}
      >
        <div className="relative flex flex-col items-center transition-transform group-hover:scale-105 active:scale-95">
          <div className="mb-1 px-2 py-0.5 rounded-md bg-red-600 border border-red-300 text-white text-[9px] font-black uppercase shadow flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-200 fill-red-200" />
            <span>Discipline Forge</span>
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.7)]">
              <ellipse cx="50" cy="85" rx="36" ry="12" fill="rgba(0,0,0,0.4)" />
              {/* Training Ring Dirt Platform */}
              <polygon points="15,75 50,88 85,75 50,62" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              {/* Anvil */}
              <rect x="42" y="62" width="16" height="12" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
              {/* Target Dummy */}
              <rect x="25" y="48" width="4" height="22" fill="#78350f" />
              <circle cx="27" cy="45" r="7" fill="#facc15" stroke="#b91c1c" strokeWidth="2" />
              {/* Flaming Brazier with Torch */}
              <rect x="70" y="52" width="6" height="18" fill="#334155" />
              <polygon points="68,52 78,52 75,44 71,44" fill="#b91c1c" />
              <circle cx="73" cy="40" r="4.5" fill="#f97316" className="animate-flame-flicker" />
            </svg>
          </div>
        </div>
      </div>

      {/* VILLAGE SQUARE HERO & SATCHEL MAIDEN */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
        {/* Clickable prompt */}
        <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/70 text-amber-300 text-xs font-black shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
          <span>🏰 Village Base Active</span>
          <span className="text-[10px] text-slate-400 font-bold">• Tap buildings to inspect</span>
        </div>
      </div>

      {/* BUILDING INSPECTION MODAL CARD */}
      {activeBuilding && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 w-80 sm:w-96 animate-spring-up">
          <div className="wood-card rounded-2xl p-4 shadow-2xl border-4 border-amber-800 relative">
            <button
              onClick={() => setActiveBuilding(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md bg-amber-950 text-amber-200 font-black text-xs flex items-center justify-center hover:bg-red-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏛️</span>
              <div>
                <h4 className="text-base font-black text-amber-100 uppercase leading-none">
                  {activeBuilding.name} (Lv.{activeBuilding.level})
                </h4>
                <span className="text-[10px] font-bold text-amber-400">
                  {activeBuilding.role}
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed mb-3">
              {activeBuilding.desc}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-600/60 text-xs font-black text-emerald-300 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{activeBuilding.buff}</span>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveBuilding(null);
                }}
                className="game-btn-gold px-4 py-1.5 text-xs font-black rounded-lg uppercase cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
