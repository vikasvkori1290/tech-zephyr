import React, { useState, useRef } from 'react';
import { ResourceHeader } from './ResourceHeader.jsx';
import { VillageHomeScreen } from './VillageHomeScreen.jsx';
import { JourneyMap } from './JourneyMap.jsx';
import { WelcomeBackModal } from './WelcomeBackModal.jsx';
import { StyleGuide } from './StyleGuide.jsx';
import { RibbonBanner } from './GameUI.jsx';
import { soundFx } from '../../services/soundFx.js';
import { Sparkles, Trophy, Crown } from 'lucide-react';

export const LifeRpgApp = () => {
  const [activeTab, setActiveTab] = useState('village');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true); // Pops up on initial load
  const [isXpAnimating, setIsXpAnimating] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState(null);

  const [playerStats, setPlayerStats] = useState({
    level: 7,
    currentXp: 1450,
    maxXp: 2000,
    gold: 3450,
    gems: 120,
    streak: 5,
  });

  const xpRef = useRef(null);

  // Handle task completion rewards & XP progression
  const handleTaskCompleted = ({ xp, gold }) => {
    setIsXpAnimating(true);

    setPlayerStats((prev) => {
      let nextXp = prev.currentXp + xp;
      let nextLevel = prev.level;
      let nextMaxXp = prev.maxXp;
      let didLevelUp = false;

      if (nextXp >= prev.maxXp) {
        didLevelUp = true;
        nextLevel += 1;
        nextXp = nextXp - prev.maxXp;
        nextMaxXp = Math.round(prev.maxXp * 1.35);
      }

      if (didLevelUp) {
        setTimeout(() => {
          soundFx.playChestFanfare();
          setLevelUpMessage(`LEVEL UP! You have attained Sovereign Level ${nextLevel}!`);
          setTimeout(() => setLevelUpMessage(null), 3500);
        }, 500);
      }

      return {
        ...prev,
        level: nextLevel,
        currentXp: nextXp,
        maxXp: nextMaxXp,
        gold: prev.gold + gold,
      };
    });

    setTimeout(() => {
      setIsXpAnimating(false);
    }, 1000);
  };

  // Handle Welcome Back popup bonus claim
  const handleClaimBonus = ({ xp, gold, gems }) => {
    handleTaskCompleted({ xp, gold });
    setPlayerStats((prev) => ({
      ...prev,
      gems: prev.gems + gems,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* LEVEL UP NOTIFICATION BANNER */}
      {levelUpMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-4 border-white shadow-[0_0_30px_rgba(251,191,36,0.9)] flex items-center gap-3 text-amber-950 font-black text-sm sm:text-base uppercase tracking-wider">
            <Crown className="w-6 h-6 text-amber-950 fill-amber-950 animate-spin" />
            <span>{levelUpMessage}</span>
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
      )}

      {/* CLASH OF CLANS TOP PINNED RESOURCE BAR */}
      <ResourceHeader
        playerStats={playerStats}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenChest={() => setShowWelcomeModal(true)}
        isXpAnimating={isXpAnimating}
        xpRef={xpRef}
      />

      {/* MAIN GAME VIEWPORT CONTAINER */}
      <main className="flex-1 w-full pb-16">
        {/* Core Screen 2 & 3: Village Home Base & Task Completion Animation */}
        {activeTab === 'village' && (
          <div className="animate-fade-in">
            <VillageHomeScreen
              onTaskCompleted={handleTaskCompleted}
              playerStats={playerStats}
            />
          </div>
        )}

        {/* Core Screen 1: Journey Map (Candy Crush Path) */}
        {activeTab === 'journey' && (
          <div className="animate-fade-in">
            <JourneyMap
              currentAvatarNode={playerStats.level}
              onSelectQuest={(quest) => {
                setActiveTab('village');
              }}
            />
          </div>
        )}

        {/* Shared Visual Style Guide */}
        {activeTab === 'styleguide' && (
          <div className="animate-fade-in">
            <StyleGuide />
          </div>
        )}
      </main>

      {/* Core Screen 4: WELCOME BACK POPUP (Clash of Clans Reward Chest) */}
      <WelcomeBackModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onClaimBonus={handleClaimBonus}
      />
    </div>
  );
};
