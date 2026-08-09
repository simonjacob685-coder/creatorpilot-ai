import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, RotateCcw, ShieldCheck, Flame, Award } from 'lucide-react';

interface QualityCheckItem {
  id: string;
  category: string;
  label: string;
  description: string;
  points: number;
}

const QUALITY_PILLARS: QualityCheckItem[] = [
  {
    id: 'hook',
    category: 'Viral Hook',
    label: 'Strong hook',
    description: 'Scroll-stopping opening (<3s) that creates curiosity or addresses pain point immediately.',
    points: 20,
  },
  {
    id: 'audience',
    category: 'Audience Fit',
    label: 'Clear target audience',
    description: 'Tailored language, tone, and framing for your ideal viewer persona.',
    points: 20,
  },
  {
    id: 'value',
    category: 'Core Value',
    label: 'Provides value',
    description: 'Delivers a specific, practical outcome, key takeaway, or transformation.',
    points: 20,
  },
  {
    id: 'cta',
    category: 'Call To Action',
    label: 'Has a call to action',
    description: 'Clear prompt for viewers to comment, subscribe, share, or click link.',
    points: 20,
  },
  {
    id: 'platform',
    category: 'Platform Optimization',
    label: 'Optimized for platform',
    description: 'Native formatting, aspect ratio, thumbnails, and descriptions.',
    points: 20,
  },
];

const STORAGE_KEY = 'creator_quality_checklist_v1';

export const ContentQualityChecklist: React.FC = () => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      // Ignore
    }
    return { hook: true, value: true, audience: true, cta: true }; // Default initial state
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedMap));
    } catch (_e) {
      // Ignore
    }
  }, [checkedMap]);

  const toggleCheck = useCallback((id: string) => {
    setCheckedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleReset = useCallback(() => {
    setCheckedMap({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      // Ignore
    }
  }, []);

  const totalScore = QUALITY_PILLARS.reduce((acc, item) => {
    return acc + (checkedMap[item.id] ? item.points : 0);
  }, 0);

  let badgeLabel = 'Needs Polish';
  let badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-800/50';
  if (totalScore === 100) {
    badgeLabel = '🔥 Viral Potential (100/100)';
    badgeColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50';
  } else if (totalScore >= 80) {
    badgeLabel = '⚡ High Quality (80/100)';
    badgeColor = 'text-indigo-400 bg-indigo-950/60 border-indigo-800/50';
  } else if (totalScore >= 60) {
    badgeLabel = '📈 Solid Baseline (60/100)';
    badgeColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50';
  }

  return (
    <div
      id="creator-quality-audit-widget"
      className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Content Quality Audit
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Content Quality Checklist
          </h3>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Content Readiness Indicator */}
          <div className="flex items-center gap-3 bg-[#0a0d14] border border-slate-800 rounded-xl px-3.5 py-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs font-extrabold">
                <span className="text-slate-300">Content Readiness:</span>
                <span className={totalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                  {totalScore}%
                </span>
              </div>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    totalScore >= 80
                      ? 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                      : 'bg-gradient-to-r from-amber-500 to-cyan-500'
                  }`}
                  style={{ width: `${totalScore}%` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-800/60 hover:bg-slate-800 transition-colors border border-slate-700/50"
            title="Reset Checklist"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Checklist Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {QUALITY_PILLARS.map((item) => {
          const isChecked = !!checkedMap[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isChecked
                  ? 'bg-indigo-950/20 border-indigo-800/40 text-slate-200'
                  : 'bg-[#0a0d14] hover:bg-[#161e2e] border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="mt-0.5 text-indigo-400 shrink-0">
                {isChecked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    +{item.points} pts
                  </span>
                </div>
                <p className={`text-xs font-bold ${isChecked ? 'text-slate-100' : 'text-slate-300'}`}>
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
    </div>
  );
};
