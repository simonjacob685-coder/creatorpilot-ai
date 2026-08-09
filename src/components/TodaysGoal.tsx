import React, { useState, useEffect, useCallback } from 'react';
import { Target, CheckCircle2, Circle, Save, Sparkles } from 'lucide-react';

const GOAL_STORAGE_KEY = 'creator_todays_goal_v1';
const GOAL_COMPLETED_KEY = 'creator_todays_goal_completed_v1';

export const TodaysGoal: React.FC = () => {
  const [goal, setGoal] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(GOAL_STORAGE_KEY);
      return saved || '';
    } catch (_e) {
      return '';
    }
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GOAL_COMPLETED_KEY) === 'true';
    } catch (_e) {
      return false;
    }
  });

  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(GOAL_STORAGE_KEY, goal);
    } catch (_e) {
      // Ignore
    }
  }, [goal]);

  useEffect(() => {
    try {
      localStorage.setItem(GOAL_COMPLETED_KEY, isCompleted ? 'true' : 'false');
    } catch (_e) {
      // Ignore
    }
  }, [isCompleted]);

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(e.target.value);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const toggleComplete = useCallback(() => {
    setIsCompleted((prev) => !prev);
  }, []);

  return (
    <div
      id="todays-goal-widget"
      className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Today&apos;s Focus Goal
            </h3>
            <p className="text-[11px] text-slate-400">Set a target for this creation session</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedFeedback && (
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
              <Save className="w-3 h-3" /> Auto-saved
            </span>
          )}
          {goal.trim() && (
            <button
              type="button"
              onClick={toggleComplete}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                isCompleted
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
              }`}
              title={isCompleted ? 'Mark as active' : 'Mark as complete'}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-slate-400" />
                  <span>In Progress</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={goal}
          onChange={handleGoalChange}
          placeholder="e.g. Write 2 YouTube scripts & outline 3 Reels..."
          className={`w-full bg-[#0a0d14] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner ${
            isCompleted
              ? 'line-through text-slate-400 border-emerald-900/40 bg-emerald-950/10'
              : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
        {goal.trim() && !isCompleted && (
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        )}
      </div>
    </div>
  );
};
