import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Shield,
  Coins,
  Gem,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { GameButton, RibbonBanner, ParchmentCard } from './GameUI.jsx';
import { soundFx } from '../../services/soundFx.js';

export const WelcomeBackModal = ({ isOpen, onClose, onClaimBonus }) => {
  // Stages: 'closed' -> 'shaking' -> 'opened'
  const [chestStage, setChestStage] = useState('closed');
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChestStage('closed');
      setHasClaimed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChestClick = () => {
    if (chestStage !== 'closed') return;

    soundFx.playClick();
    setChestStage('shaking');

    setTimeout(() => {
      soundFx.playChestFanfare();
      setChestStage('opened');
    }, 850);
  };

  const handleContinue = () => {
    soundFx.playCoin();
    setHasClaimed(true);
    if (onClaimBonus) {
      onClaimBonus({ xp: 250, gold: 100, gems: 10 });
    }
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      {/* GOD-RAY ROTATING BACKGROUND LIGHT BEAMS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full opacity-25 animate-ray-spin">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="rayGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>
            {Array.from({ length: 16 }).map((_, i) => (
              <polygon
                key={i}
                points="50,50 46,0 54,0"
                fill="url(#rayGradient)"
                transform={`rotate(${i * 22.5} 50 50)`}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* MODAL WINDOW CONTAINER */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Top Floating Ribbon */}
        <RibbonBanner
          title="Village Homecoming"
          subtitle="The kingdom rejoices at your return, Champion!"
          variant="gold"
          className="mb-4"
        />

        {/* INTERACTIVE 3D CHEST SHOWPIECE */}
        <div className="relative flex flex-col items-center my-3">
          {/* Glowing Aura & Floating particles */}
          <div
            className={`absolute -inset-10 rounded-full bg-amber-400/20 blur-2xl pointer-events-none transition-opacity duration-700 ${
              chestStage === 'opened' ? 'opacity-90 bg-amber-300/40' : 'opacity-40 animate-pulse'
            }`}
          />

          {/* Treasure Chest Interactive Graphic */}
          <div
            onClick={handleChestClick}
            className={`relative w-44 h-40 sm:w-56 sm:h-48 cursor-pointer transition-transform ${
              chestStage === 'closed'
                ? 'hover:scale-105 active:scale-95 animate-float-subtle'
                : chestStage === 'shaking'
                ? 'animate-chest-shake'
                : 'animate-chest-pop'
            }`}
          >
            {/* SVG 3D-Styled Clash of Clans Treasure Chest */}
            <svg
              viewBox="0 0 200 180"
              className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="chestWood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#854d0e" />
                  <stop offset="50%" stopColor="#582a0b" />
                  <stop offset="100%" stopColor="#311504" />
                </linearGradient>

                <linearGradient id="chestGold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#eab308" />
                  <stop offset="70%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>

                <linearGradient id="lootGlow" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Chest Base Body */}
              <rect x="30" y="80" width="140" height="75" rx="8" fill="url(#chestWood)" />

              {/* Base Gold Corner Brackets & Rivets */}
              <path d="M 30 80 L 50 80 L 50 155 L 30 155 Z" fill="url(#chestGold)" />
              <path d="M 150 80 L 170 80 L 170 155 L 150 155 Z" fill="url(#chestGold)" />
              <circle cx="40" cy="95" r="2.5" fill="#fef08a" stroke="#713f12" />
              <circle cx="40" cy="140" r="2.5" fill="#fef08a" stroke="#713f12" />
              <circle cx="160" cy="95" r="2.5" fill="#fef08a" stroke="#713f12" />
              <circle cx="160" cy="140" r="2.5" fill="#fef08a" stroke="#713f12" />

              {/* Chest Lock Plate */}
              <rect x="85" y="85" width="30" height="35" rx="4" fill="url(#chestGold)" stroke="#713f12" strokeWidth="1.5" />
              <circle cx="100" cy="98" r="4.5" fill="#1e1b4b" />
              <polygon points="98,98 102,98 103,109 97,109" fill="#1e1b4b" />
              {/* Glowing Ruby Gem in Lock */}
              <polygon points="100,94 104,98 100,102 96,98" fill="#ef4444" />

              {/* Chest Lid - CLOSED or OPEN */}
              {chestStage !== 'opened' ? (
                // Closed Lid
                <g>
                  <path
                    d="M 25 80 Q 100 35 175 80 L 170 88 Q 100 48 30 88 Z"
                    fill="url(#chestWood)"
                  />
                  {/* Lid Gold Bands */}
                  <path d="M 40 76 Q 100 42 160 76" stroke="url(#chestGold)" strokeWidth="6" fill="none" />
                  <path d="M 25 80 L 175 80" stroke="url(#chestGold)" strokeWidth="4" />
                  {/* Metal Rivets on Lid */}
                  <circle cx="45" cy="74" r="2.5" fill="#fef08a" />
                  <circle cx="100" cy="50" r="3" fill="#fef08a" />
                  <circle cx="155" cy="74" r="2.5" fill="#fef08a" />
                </g>
              ) : (
                // Open Lid (Angled up) + Glowing Core with bursting loot
                <g>
                  {/* Radiant light beam from inside chest */}
                  <polygon
                    points="35,82 165,82 195,10 5,10"
                    fill="url(#lootGlow)"
                    opacity="0.65"
                  />
                  {/* Flying Coins & Sparks */}
                  <circle cx="70" cy="40" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <circle cx="130" cy="35" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <circle cx="100" cy="20" r="10" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                  <polygon points="50,30 55,35 50,40 45,35" fill="#38bdf8" />
                  <polygon points="150,25 156,31 150,37 144,31" fill="#ec4899" />
                  <polygon points="115,10 119,15 115,20 111,15" fill="#a855f7" />

                  {/* Open Lid Shell tilted backwards */}
                  <path
                    d="M 20 80 Q 100 10 180 80 L 175 60 Q 100 -5 25 60 Z"
                    fill="url(#chestWood)"
                  />
                  <path d="M 30 65 Q 100 15 170 65" stroke="url(#chestGold)" strokeWidth="5" fill="none" />
                </g>
              )}
            </svg>

            {/* Instruction tooltip if unopened */}
            {chestStage === 'closed' && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 border border-amber-900 rounded-full text-[11px] font-black text-amber-950 uppercase tracking-wider shadow-lg animate-bounce whitespace-nowrap">
                ✨ Tap Chest to Open!
              </div>
            )}
            {chestStage === 'shaking' && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-300 border border-amber-900 rounded-full text-[11px] font-black text-amber-950 uppercase tracking-wider shadow-lg whitespace-nowrap">
                Unlocking Treasures...
              </div>
            )}
          </div>
        </div>

        {/* ACCUMULATED REWARDS & OFFLINE REPORT (Visible once chest opens) */}
        {chestStage === 'opened' ? (
          <div className="w-full animate-chest-pop space-y-4">
            <ParchmentCard
              stamp="DAILY REWARD"
              className="border-4 border-amber-800 shadow-2xl"
            >
              <div className="text-center mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Offline Bounty Report
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-amber-950">
                  Treasures Harvested While Away!
                </h3>
              </div>

              {/* 4 Key Reward Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                {/* Reward 1: XP */}
                <div className="p-3 rounded-xl bg-purple-950/15 border border-purple-800/30 flex flex-col items-center text-center">
                  <Sparkles className="w-6 h-6 text-purple-700 mb-1 animate-pulse" />
                  <span className="text-[10px] font-bold text-purple-950 uppercase">Login XP</span>
                  <span className="text-base font-black text-purple-950 font-mono">+250 XP</span>
                </div>

                {/* Reward 2: Gold */}
                <div className="p-3 rounded-xl bg-amber-950/15 border border-amber-800/30 flex flex-col items-center text-center">
                  <div className="text-xl mb-0.5">🪙</div>
                  <span className="text-[10px] font-bold text-amber-950 uppercase">Village Gold</span>
                  <span className="text-base font-black text-amber-950 font-mono">+100 Gold</span>
                </div>

                {/* Reward 3: Gems */}
                <div className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-800/30 flex flex-col items-center text-center">
                  <div className="text-xl mb-0.5">💎</div>
                  <span className="text-[10px] font-bold text-emerald-950 uppercase">Life Gems</span>
                  <span className="text-base font-black text-emerald-950 font-mono">+10 Gems</span>
                </div>

                {/* Reward 4: Streak Retention */}
                <div className="p-3 rounded-xl bg-orange-950/15 border border-orange-800/30 flex flex-col items-center text-center">
                  <Flame className="w-6 h-6 text-orange-600 mb-1" />
                  <span className="text-[10px] font-bold text-orange-950 uppercase">Streak Intact</span>
                  <span className="text-base font-black text-orange-950 font-mono">5 Days</span>
                </div>
              </div>

              {/* Status Lore Highlights */}
              <div className="space-y-2 border-t border-amber-900/20 pt-3 text-xs text-amber-900 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>
                    <strong>Streak Shield Maintained:</strong> Your 1.5x XP Multiplier remains active.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>3 Tavern Bounties</strong> are waiting on the Noticeboard for today.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-700 flex-shrink-0" />
                  <span>
                    <strong>Well-Rested Blessing:</strong> +10% bonus XP on your first quest completion!
                  </span>
                </div>
              </div>
            </ParchmentCard>

            {/* SINGLE HIGH-PRODUCTION BANNER CONTINUE BUTTON */}
            <div className="flex justify-center pt-2">
              <GameButton
                variant="gold"
                size="lg"
                onClick={handleContinue}
                className="w-full sm:w-auto min-w-[280px] shadow-2xl py-4"
              >
                <span>CLAIM ALL & ENTER VILLAGE</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </GameButton>
            </div>
          </div>
        ) : (
          <div className="text-center text-amber-200/80 text-xs font-bold mt-2">
            Tap the chest above to unseal your accumulated offline loot & streak blessings
          </div>
        )}
      </div>
    </div>
  );
};
