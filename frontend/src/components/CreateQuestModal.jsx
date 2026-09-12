import React, { useState, useEffect } from 'react';
import {
  Sword,
  Book,
  Hammer,
  Scroll,
  Sparkles,
  X,
  Plus,
  Coins,
  Calendar,
  Clock,
  AlertCircle,
  Award,
  Zap,
} from 'lucide-react';

// Categories matching existing Quest Board and Character Sheet attributes
export const QUEST_CATEGORIES = {
  physical: {
    id: 'physical',
    name: 'Physical',
    attribute: 'Strength',
    icon: Sword,
    badgeBg: 'bg-rose-950/80 text-rose-200 border-rose-700/60',
    activeBg: 'bg-gradient-to-b from-rose-600 to-rose-800 border-rose-300 text-white shadow-[0_2px_0_#4c0505]',
  },
  study: {
    id: 'study',
    name: 'Study',
    attribute: 'Intellect',
    icon: Book,
    badgeBg: 'bg-sky-950/80 text-sky-200 border-sky-700/60',
    activeBg: 'bg-gradient-to-b from-sky-600 to-sky-800 border-sky-300 text-white shadow-[0_2px_0_#082f49]',
  },
  work: {
    id: 'work',
    name: 'Work',
    attribute: 'Discipline',
    icon: Hammer,
    badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-700/60',
    activeBg: 'bg-gradient-to-b from-amber-600 to-amber-800 border-amber-300 text-white shadow-[0_2px_0_#451a03]',
  },
  errands: {
    id: 'errands',
    name: 'Errands',
    attribute: 'Agility',
    icon: Scroll,
    badgeBg: 'bg-emerald-950/80 text-emerald-200 border-emerald-700/60',
    activeBg: 'bg-gradient-to-b from-emerald-600 to-emerald-800 border-emerald-300 text-white shadow-[0_2px_0_#022c22]',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    attribute: 'Charisma',
    icon: Sparkles,
    badgeBg: 'bg-purple-950/80 text-purple-200 border-purple-700/60',
    activeBg: 'bg-gradient-to-b from-purple-600 to-purple-800 border-purple-300 text-white shadow-[0_2px_0_#3b0764]',
  },
};

// Difficulty levels matching XP scaling across app
export const QUEST_DIFFICULTIES = {
  easy: {
    id: 'easy',
    label: 'Easy',
    xp: 25,
    gold: 10,
    accent: 'border-emerald-600/50 text-emerald-300',
    activeStyle: 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-200 text-white shadow-[0_3px_0_#064e3b]',
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    xp: 50,
    gold: 25,
    accent: 'border-amber-600/50 text-amber-300',
    activeStyle: 'bg-gradient-to-b from-amber-500 to-amber-700 border-amber-200 text-amber-950 font-black shadow-[0_3px_0_#78350f]',
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    xp: 100,
    gold: 50,
    accent: 'border-rose-600/50 text-rose-300',
    activeStyle: 'bg-gradient-to-b from-rose-600 to-rose-800 border-rose-200 text-white shadow-[0_3px_0_#5c0909]',
  },
  epic: {
    id: 'epic',
    label: 'Epic',
    xp: 200,
    gold: 100,
    accent: 'border-purple-600/50 text-purple-300',
    activeStyle: 'bg-gradient-to-b from-purple-600 to-purple-800 border-purple-200 text-white shadow-[0_3px_0_#4c1d95]',
  },
};

export const CreateQuestModal = ({
  isOpen,
  onClose,
  onSubmit, // (newQuestData) => void | Promise<void>
  soundEnabled = true,
  onPlaySound = () => {},
}) => {
  // Local Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [difficulty, setDifficulty] = useState('medium');
  const [dueDateType, setDueDateType] = useState('today'); // 'today', 'tomorrow', 'custom', 'none'
  const [customDateTime, setCustomDateTime] = useState('');
  const [titleError, setTitleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('work');
      setDifficulty('medium');
      setDueDateType('today');
      setCustomDateTime('');
      setTitleError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCategoryData = QUEST_CATEGORIES[category] || QUEST_CATEGORIES.work;
  const currentDiffData = QUEST_DIFFICULTIES[difficulty] || QUEST_DIFFICULTIES.medium;

  // Compute friendly due date text
  const getComputedDueDate = () => {
    if (dueDateType === 'today') return 'Today';
    if (dueDateType === 'tomorrow') return 'Tomorrow';
    if (dueDateType === 'custom' && customDateTime) {
      const d = new Date(customDateTime);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      }
    }
    return 'Flexible';
  };

  // Form submission handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Title validation: non-empty check
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Quest objective cannot be empty! Name your directive, Chief.');
      onPlaySound('stone');
      return;
    }

    setIsSubmitting(true);
    onPlaySound('click');

    const newQuestData = {
      id: `quest-${Date.now()}`,
      title: trimmedTitle,
      category,
      difficulty,
      completed: false,
      dueDate: getComputedDueDate(),
      createdAt: Date.now(),
    };

    try {
      // Swapping in a real backend API call later is as simple as making onSubmit return a Promise
      await onSubmit(newQuestData);
      onClose();
    } catch (err) {
      console.error('Failed to create quest:', err);
      setTitleError('An error occurred creating the quest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2e1d11] via-[#20140a] to-[#140c06] border-4 border-[#613f24] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Metallic Gold Studs */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner z-10 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner z-10 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner z-10 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-800 shadow-inner z-10 pointer-events-none" />

        {/* Modal Header Banner */}
        <div className="bg-gradient-to-b from-[#422815] to-[#2b1a0d] border-b-2 border-[#5a3b22] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 border-2 border-amber-300 flex items-center justify-center text-amber-950 shadow-md">
              <Scroll className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="font-clash text-lg sm:text-xl font-extrabold text-amber-100 tracking-wide leading-tight"
              >
                Enlist New Quest
              </h2>
              <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider">
                Directive Scroll
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#180e07] hover:bg-[#341f11] border border-[#523319] text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4.5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#472d17] scrollbar-track-[#170e08]"
        >
          {/* QUEST TITLE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 font-clash mb-1.5">
              Quest Objective (Task Title) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Morning 5km Run, Complete chapter 4..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#140c07] border-2 focus:outline-none text-stone-100 placeholder-stone-500 text-sm shadow-inner transition-colors ${
                titleError
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-[#4c311c] focus:border-amber-400'
              }`}
              autoFocus
            />
            {/* Inline validation error message */}
            {titleError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{titleError}</span>
              </div>
            )}
          </div>

          {/* CATEGORY SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-clash">
                Category
              </label>
              <span className="text-[10px] text-stone-400">
                Powers: <strong className="text-amber-200">{currentCategoryData.attribute}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(QUEST_CATEGORIES).map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onPlaySound('click');
                      setCategory(cat.id);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? cat.activeBg
                        : 'bg-[#180e07] border-[#442b18] text-stone-300 hover:border-amber-700/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DIFFICULTY SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 font-clash">
                Difficulty
              </label>
              <span className="text-[10px] text-stone-400">Determines XP & Gold</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(QUEST_DIFFICULTIES).map((diff) => {
                const isSelected = difficulty === diff.id;

                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => {
                      onPlaySound('click');
                      setDifficulty(diff.id);
                    }}
                    className={`p-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      isSelected
                        ? diff.activeStyle
                        : 'bg-[#180e07] border-[#442b18] text-stone-300 hover:border-amber-700/60'
                    }`}
                  >
                    <div className="text-xs font-clash leading-tight">{diff.label}</div>
                    <div className="text-[10px] font-mono mt-0.5 opacity-90">
                      +{diff.xp} XP / +{diff.gold}🪙
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DUE DATE & TIME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 font-clash mb-1.5">
              Target Deadline (Optional)
            </label>

            {/* Quick Presets */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { id: 'today', label: 'Today' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'custom', label: 'Custom Date' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onPlaySound('click');
                    setDueDateType(preset.id);
                  }}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    dueDateType === preset.id
                      ? 'bg-amber-400 border-amber-300 text-amber-950 font-extrabold'
                      : 'bg-[#180e07] border-[#442b18] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Input */}
            {dueDateType === 'custom' && (
              <div className="animate-in fade-in duration-200">
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#140c07] border-2 border-[#4c311c] focus:border-amber-400 focus:outline-none text-stone-100 text-xs shadow-inner"
                />
              </div>
            )}
          </div>

          {/* LIVE REWARD PREVIEW BANNER */}
          <div className="rounded-2xl bg-gradient-to-r from-[#211409] via-[#2f1b0c] to-[#211409] border-2 border-amber-600/40 p-3 shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="font-clash text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Live Reward Preview:</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-700/60">
                  +{currentDiffData.xp} XP
                </span>
                <span className="font-mono font-black text-yellow-300 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-700/60 flex items-center gap-0.5">
                  +{currentDiffData.gold} 🪙
                </span>
              </div>
            </div>
            <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
              <span>Fuels your</span>
              <strong className="text-amber-200">{currentCategoryData.attribute}</strong>
              <span>attribute upon conquest.</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#462d1a] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#180e07] hover:bg-[#2c190d] border border-[#523319] text-stone-300 font-bold text-xs cursor-pointer transition-colors active:translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-200 text-amber-950 font-clash font-extrabold text-sm tracking-wide uppercase shadow-[0_4px_0_#92400e,0_6px_12px_rgba(0,0,0,0.5)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#92400e] cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Enlisting...' : 'Create Quest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestModal;

