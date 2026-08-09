import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Square, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: 'idea',
    label: 'Define Content Idea',
    description: 'Find a high-converting topic or trend in your niche.',
  },
  {
    id: 'campaign',
    label: 'Generate Campaign Strategy',
    description: 'Create viral titles, hooks, outlines, and script structures.',
  },
  {
    id: 'repurpose',
    label: 'Repurpose Content',
    description: 'Format ideas into YouTube, Shorts, Instagram, X & Facebook formats.',
  },
  {
    id: 'analyze',
    label: 'Analyze Performance',
    description: 'Audit titles & hooks for retention score and engagement optimization.',
  },
  {
    id: 'publish',
    label: 'Prepare For Publishing',
    description: 'Finalize thumbnail prompts, descriptions, and schedule posting.',
  },
];

const STORAGE_KEY = 'creator_workflow_checklist_v1';

export const CreatorWorkflowChecklist: React.FC = () => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_e) {
      // Ignore parse/storage errors
    }
    return {};
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedMap));
    } catch (_e) {
      // Ignore
    }
  }, [completedMap]);

  const toggleItem = useCallback((id: string) => {
    setCompletedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleReset = useCallback(() => {
    setCompletedMap({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      // Ignore
    }
  }, []);

  const completedCount = DEFAULT_ITEMS.filter((item) => completedMap[item.id]).length;
  const totalCount = DEFAULT_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      id="creator-workflow-checklist-widget"
      className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden"
    >
      {/* Subtle background glow when 100% complete */}
      {progressPercent === 100 && (
        <div className="hidden sm:block absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Creator Workflow
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Production Roadmap Checklist
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-300">
              {completedCount} of {totalCount} Completed
            </span>
            <span className="block text-[11px] font-extrabold text-emerald-400">
              {progressPercent}% Complete
            </span>
          </div>
          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 bg-slate-800/60 hover:bg-slate-800 transition-colors"
              title="Reset Checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {DEFAULT_ITEMS.map((item) => {
          const isDone = !!completedMap[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                  : 'bg-[#0a0d14] hover:bg-[#161e2e] border-slate-800/80 text-slate-300'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-emerald-400 shrink-0 focus:outline-none"
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
                )}
              </button>

              <div className="space-y-0.5">
                <p
                  className={`text-xs font-bold ${
                    isDone ? 'line-through text-slate-400' : 'text-slate-100'
                  }`}
                >
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner when all 5 are checked */}
      {progressPercent === 100 && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Congratulations!</strong> You have completed your content workflow strategy!
          </span>
        </div>
      )}
    </div>
  );
};
