import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Code2,
  Dumbbell,
  BookOpen,
  Crown,
  Flame,
  Shield,
  Coins,
  Gem,
  Award,
  Star,
  CheckCircle2,
  Play,
  RotateCcw,
  Palette,
  Layers,
  Component,
} from 'lucide-react';
import { GameButton, WoodCard, ParchmentCard, RibbonBanner, ResourceBadge, MascotAvatar } from './GameUI.jsx';
import { soundFx } from '../../services/soundFx.js';

export const StyleGuide = () => {
  const [copiedToken, setCopiedToken] = useState(null);

  const colors = [
    { name: 'Sovereign Gold', hex: '#EAB308', role: 'Primary buttons, coin counters, level badges, borders', bg: 'bg-yellow-500' },
    { name: 'Astral Elixir', hex: '#A855F7', role: 'Experience points, mana meters, magical runes', bg: 'bg-purple-500' },
    { name: 'Emerald Vitality', hex: '#10B981', role: 'Success actions, claimed stars, gems, active statuses', bg: 'bg-emerald-500' },
    { name: 'Forge Flame', hex: '#F97316', role: 'Streak counter, volcanic biomes, intense boss trials', bg: 'bg-orange-500' },
    { name: 'Citadel Cyan', hex: '#06B6D4', role: 'Coding category, techno-mystic terminals, energy paths', bg: 'bg-cyan-500' },
    { name: 'Rustic Timber', hex: '#5C3519', role: 'Tavern noticeboards, wooden signs, physical card frames', bg: 'bg-amber-900' },
    { name: 'Ancient Parchment', hex: '#FEF7DC', role: 'Quest scrolls, task descriptions, achievement decrees', bg: 'bg-amber-100 text-amber-950' },
    { name: 'Fortress Slate', hex: '#1E293B', role: 'Deep background world, locked nodes, stone pedestals', bg: 'bg-slate-800' },
  ];

  const handleCopy = (hex) => {
    soundFx.playClick();
    navigator.clipboard?.writeText(hex);
    setCopiedToken(hex);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12 select-none">
      {/* Title Banner */}
      <div className="text-center">
        <RibbonBanner
          title="Life RPG Design System & Style Guide"
          subtitle="Clash of Clans & Candy Crush Inspired Visual Identity Specifications"
          variant="purple"
          className="mx-auto"
        />
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed font-medium">
          A physical, game-first design system engineered for maximum tactile satisfaction, bright high-contrast fantasy colorways, and rewarding feedback loops.
        </p>
      </div>

      {/* SECTION 1: COLOR SYSTEM */}
      <WoodCard
        header={
          <div className="flex items-center gap-2 border-b-2 border-amber-900/60 pb-3">
            <Palette className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-amber-200">1. Color Palette & Thematic Roles</h3>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {colors.map((c) => (
            <div
              key={c.hex}
              onClick={() => handleCopy(c.hex)}
              className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/40 hover:border-amber-500/80 transition-all cursor-pointer group"
            >
              <div className={`h-16 rounded-lg ${c.bg} flex items-center justify-center font-black text-xs shadow-inner mb-2 border border-white/20`}>
                <span className="drop-shadow px-2 py-0.5 rounded bg-black/40 text-white font-mono">
                  {copiedToken === c.hex ? 'COPIED!' : c.hex}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-amber-200">{c.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{c.role}</p>
            </div>
          ))}
        </div>
      </WoodCard>

      {/* SECTION 2: 3D TACTILE BUTTONS */}
      <WoodCard
        header={
          <div className="flex items-center gap-2 border-b-2 border-amber-900/60 pb-3">
            <Component className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-amber-200">2. Tactile 3D Buttons & Press Physics</h3>
          </div>
        }
      >
        <p className="text-xs text-amber-300/80 mb-4 font-semibold">
          Buttons feature thick bottom bevels (`border-b-4`), high-contrast gradients, and spring compression on click (`active:translate-y-1 active:border-b-0`).
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <GameButton variant="gold" size="md">
            <span>Sovereign Gold (Primary)</span>
          </GameButton>
          <GameButton variant="emerald" size="md">
            <span>Emerald Victory (Claim)</span>
          </GameButton>
          <GameButton variant="ruby" size="md">
            <span>Ruby Strike (Boss/Danger)</span>
          </GameButton>
          <GameButton variant="wood" size="md">
            <span>Rustic Timber (Secondary)</span>
          </GameButton>
          <GameButton variant="stone" size="md">
            <span>Locked Slate</span>
          </GameButton>
        </div>
      </WoodCard>

      {/* SECTION 3: SURFACE CARD MATERIALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Material 1: Wood Plaque */}
        <WoodCard
          header={
            <h4 className="text-base font-black text-amber-200">
              Material: Rustic Tavern Wood
            </h4>
          }
        >
          <p className="text-xs text-amber-300/80 mb-3 font-medium">
            Double border with woodgrain gradient, brass rivets at 4 corners, and deep drop-shadows.
          </p>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-amber-800/40 text-xs text-amber-200 font-bold">
            Used for: Tavern Noticeboard, Journey Map Frame, Top Village Banners
          </div>
        </WoodCard>

        {/* Material 2: Parchment Scroll */}
        <ParchmentCard stamp="AUTHENTIC">
          <h4 className="text-base font-black text-amber-950 mb-1">
            Material: Weathered Parchment Scroll
          </h4>
          <p className="text-xs text-amber-900/90 mb-3 font-medium">
            Aged yellowed paper texture with sepia ink typography, subtle burnt borders, and wax seal stamps.
          </p>
          <div className="p-2.5 bg-amber-900/10 rounded-lg text-xs text-amber-950 font-bold">
            Used for: Daily Quest Rows, Milestone Decrees, Bounty Post Affordances
          </div>
        </ParchmentCard>
      </div>

      {/* SECTION 4: HERALDIC RIBBON BANNERS */}
      <WoodCard
        header={
          <div className="flex items-center gap-2 border-b-2 border-amber-900/60 pb-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-amber-200">3. Heraldic Ribbon Banners</h3>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <RibbonBanner title="Royal Red" subtitle="Victory & Combat" variant="red" />
          <RibbonBanner title="Gilded Gold" subtitle="Homecoming & Loot" variant="gold" />
          <RibbonBanner title="Ocean Blue" subtitle="Intellect & Focus" variant="blue" />
          <RibbonBanner title="Astral Purple" subtitle="Mastery & Legend" variant="purple" />
        </div>
      </WoodCard>

      {/* SECTION 5: AUDIO SYNTHESIZER SANDBOX */}
      <WoodCard
        header={
          <div className="flex items-center gap-2 border-b-2 border-amber-900/60 pb-3">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-amber-200">4. Interactive Web Audio FX Engine</h3>
          </div>
        }
      >
        <p className="text-xs text-amber-300/80 mb-4 font-semibold">
          Pure browser Web Audio API oscillator synthesis — zero audio file download delay, instant tactile response.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <GameButton
            variant="wood"
            size="sm"
            onClick={() => soundFx.playClick()}
          >
            🔊 Click Sine Tap (440Hz → 880Hz)
          </GameButton>

          <GameButton
            variant="gold"
            size="sm"
            onClick={() => soundFx.playCoin()}
          >
            🪙 Coin Ding (B5 → E6)
          </GameButton>

          <GameButton
            variant="emerald"
            size="sm"
            onClick={() => soundFx.playTaskComplete()}
          >
            ✨ Quest Victory Arpeggio (C-E-G-C)
          </GameButton>

          <GameButton
            variant="ruby"
            size="sm"
            onClick={() => soundFx.playChestFanfare()}
          >
            🎺 Treasure Fanfare (A4 Chord)
          </GameButton>
        </div>
      </WoodCard>
    </div>
  );
};
