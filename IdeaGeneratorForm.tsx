import React, { useState, useCallback } from 'react';
import { IdeasInput, IdeasResult, ContentIdeaItem } from '../types';
import { Lightbulb, Sparkles, Loader2, Target, Users, Rocket, Copy, Check, ArrowRight, Layers, Flame } from 'lucide-react';

interface IdeaGeneratorFormProps {
  onSuccess: (result: IdeasResult) => void;
  onError: (msg: string) => void;
  onSelectCampaignTopic?: (topic: string) => void;
  onGenerateCampaignFromIdea?: (ideaTitle: string, ideaDetails?: string) => void;
  isGeneratingCampaign?: boolean;
}

const SAMPLE_IDEAS_PRESETS = [
  {
    label: 'AI & Tech',
    niche: 'AI Tools & Productivity',
    audience: 'Students, developers, and remote workers',
    goal: 'Educate and save time',
  },
  {
    label: 'Personal Finance',
    niche: 'Investing & Budgeting',
    audience: 'Young adults and beginners',
    goal: 'Grow audience and build trust',
  },
  {
    label: 'Fitness & Health',
    niche: 'Home Workouts & Nutrition',
    audience: 'Busy professionals',
    goal: 'Inspire and promote wellness',
  },
  {
    label: 'Gaming & Tech',
    niche: 'Gaming Hardware & Setup',
    audience: 'Gamers and tech enthusiasts',
    goal: 'Entertain and drive engagement',
  },
];

export const IdeaGeneratorForm: React.FC<IdeaGeneratorFormProps> = React.memo(({
  onSuccess,
  onError,
  onSelectCampaignTopic,
  onGenerateCampaignFromIdea,
  isGeneratingCampaign = false,
}) => {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<IdeasResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const applyPreset = useCallback((preset: typeof SAMPLE_IDEAS_PRESETS[0]) => {
    setNiche(preset.niche);
    setAudience(preset.audience);
    setGoal(preset.goal);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) {
      onError('Please enter a niche or topic.');
      return;
    }

    setLoading(true);

    try {
      const payload: IdeasInput = {
        niche: niche.trim(),
        audience: audience.trim(),
        goal: goal.trim(),
      };

      const res = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate content ideas.');
      }

      const data = await res.json();
      const resultObj: IdeasResult = {
        id: 'ideas-' + Date.now(),
        timestamp: Date.now(),
        input: payload,
        ideas: data.ideas || [],
      };

      setGeneratedResult(resultObj);
      onSuccess(resultObj);
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'An unexpected error occurred during idea generation.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="bg-[#121824] p-6 rounded-2xl border border-slate-800 shadow-lg space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Creator Idea Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Brainstorm 10 high-performing content ideas before building your campaign.
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Quick Presets:</span>
          {SAMPLE_IDEAS_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              ⚡ {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-[#121824] p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Niche / Topic */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Niche / Topic *</span>
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. AI, education, finance, gaming"
              className="w-full bg-[#0a0d14] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
            <p className="text-[11px] text-slate-400">Main industry, niche, or topic area</p>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Audience</span>
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. students, entrepreneurs, beginners"
              className="w-full bg-[#0a0d14] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <p className="text-[11px] text-slate-400">Who are you creating content for?</p>
          </div>

          {/* Content Goal */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Content Goal</span>
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. grow audience, educate, promote product"
              className="w-full bg-[#0a0d14] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <p className="text-[11px] text-slate-400">What outcome do you want to achieve?</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          id="generate-ideas-btn"
          className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Generating 10 Content Ideas...</span>
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 text-slate-950 fill-current" />
              <span>Generate 10 Content Ideas</span>
            </>
          )}
        </button>
      </form>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="h-6 w-64 bg-slate-800/80 rounded-lg"></div>
            <div className="h-6 w-24 bg-slate-800/80 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-slate-800/60 rounded"></div>
                  <div className="h-4 w-24 bg-slate-800/60 rounded"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-800/80 rounded"></div>
                <div className="h-16 bg-[#0a0d14] rounded-xl"></div>
                <div className="h-12 bg-[#0a0d14] rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Ideas Display */}
      {!loading && generatedResult && generatedResult.ideas && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>10 Content Ideas Generated</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 break-words">
                Niche: <span className="text-amber-300 font-semibold">{generatedResult.input.niche}</span>
                {generatedResult.input.audience && (
                  <> • Audience: <span className="text-indigo-300 font-semibold">{generatedResult.input.audience}</span></>
                )}
                {generatedResult.input.goal && (
                  <> • Goal: <span className="text-emerald-300 font-semibold">{generatedResult.input.goal}</span></>
                )}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 shrink-0">
              10 Ideas Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedResult.ideas.map((idea: ContentIdeaItem, idx: number) => (
              <div
                key={idx}
                className="bg-[#121824] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  {/* Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/40">
                      Idea #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                        {idea.difficulty || 'Beginner'}
                      </span>
                      <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800/40">
                        {idea.angle || 'Educational'}
                      </span>
                    </div>
                  </div>

                  {/* 1. Title */}
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-snug break-words">
                      "{idea.title}"
                    </h3>
                  </div>

                  {/* 2. Why it works */}
                  <div className="bg-[#0a0d14] p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Why it works
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed break-words">
                      {idea.whyItWorks}
                    </p>
                  </div>

                  {/* 3. Hook */}
                  <div className="bg-[#0a0d14] p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      Suggested Hook
                    </span>
                    <p className="text-xs text-amber-200/90 font-medium italic leading-relaxed break-words">
                      "{idea.hook}"
                    </p>
                  </div>

                  {/* 4. Best platforms */}
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span className="text-slate-400 font-semibold">Best platforms:</span>
                    <span className="font-bold text-indigo-300 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-800/30 break-words">
                      {idea.bestPlatforms}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`Idea: ${idea.title}\nWhy it works: ${idea.whyItWorks}\nHook: ${idea.hook}\nBest platforms: ${idea.bestPlatforms}`, idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors touch-manipulation"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Idea</span>
                      </>
                    )}
                  </button>

                  {(onGenerateCampaignFromIdea || onSelectCampaignTopic) && (
                    <button
                      type="button"
                      disabled={isGeneratingCampaign}
                      onClick={() => {
                        if (onGenerateCampaignFromIdea) {
                          onGenerateCampaignFromIdea(idea.title, idea.whyItWorks);
                        } else if (onSelectCampaignTopic) {
                          onSelectCampaignTopic(idea.title);
                        }
                      }}
                      id={`create-campaign-btn-${idx}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow shadow-amber-500/20 disabled:opacity-50 transition-colors touch-manipulation"
                    >
                      {isGeneratingCampaign ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-3.5 h-3.5" />
                          <span>Create Full Campaign</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
