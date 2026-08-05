import React, { useState, useCallback } from 'react';
import { RepurposeInput, RepurposeResult } from '../types';
import { Repeat, Sparkles, Loader2, Lightbulb, Sliders, Layers } from 'lucide-react';

interface RepurposeFormProps {
  onSuccess: (result: RepurposeResult) => void;
  onError: (msg: string) => void;
}

const SAMPLE_IDEAS = [
  {
    label: 'AI Agents in Business',
    text: 'How autonomous AI agents are taking over routine customer support and sales qualifying workflows, freeing human founders to focus purely on high-leverage product design.',
    tone: 'Authoritative & Inspiring',
  },
  {
    label: 'Focus & Deep Work',
    text: 'Why multitasking is ruining your cognitive output. By implementing strict 90-minute deep work blocks with zero phone notifications, you can accomplish in 3 hours what takes most people 2 days.',
    tone: 'Punchy & Actionable',
  },
];

export const RepurposeForm: React.FC<RepurposeFormProps> = React.memo(({ onSuccess, onError }) => {
  const [rawIdea, setRawIdea] = useState('');
  const [tone, setTone] = useState('Punchy & Professional');
  const [loading, setLoading] = useState(false);

  const applyPreset = useCallback((preset: typeof SAMPLE_IDEAS[0]) => {
    setRawIdea(preset.text);
    setTone(preset.tone);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawIdea.trim()) {
      onError('Please enter a content idea or draft text to repurpose.');
      return;
    }

    setLoading(true);
    try {
      const payload: RepurposeInput = {
        rawIdea: rawIdea.trim(),
        tone: tone.trim(),
      };

      const res = await fetch('/api/repurpose/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to repurpose content.');
      }

      const data = await res.json();
      const repurposeResult: RepurposeResult = {
        id: 'rep-' + Date.now(),
        timestamp: Date.now(),
        input: payload,
        youtubeFormat: data.youtubeFormat || { videoTitle: '', titleIdeas: [], hook: '', description: '', outline: [], seoKeywords: [], pinnedComment: '' },
        shortFormFormat: data.shortFormFormat || { hook: '', script30Sec: '', caption: '', hashtags: [], visualCues: [], audioStyle: '' },
        instagramCaption: data.instagramCaption || { headline: '', reelCaption: '', captionText: '', carouselPostIdea: '', carouselOutline: [], hashtags: [] },
        xThread: data.xThread || { openingTweet: '', hookTweet: '', tweets: [], keyPoints: [], callToActionTweet: '' },
        facebookPost: data.facebookPost || { headline: '', communityPost: '', postText: '', keyTakeaways: [], engagementQuestion: '', callToAction: '', hashtags: [] },
      };

      onSuccess(repurposeResult);
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'An unexpected error occurred during repurposing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400">
            <Repeat className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
            Phase 2 Engine
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Repurpose Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Transform 1 core concept into a complete 5-platform content package: YouTube content, TikTok/Shorts content, Instagram content, X/Twitter thread, and Facebook content.
        </p>
      </div>

      {/* Preset Inspo */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Concept Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_IDEAS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-[#121824] hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-xs text-slate-300 transition-all text-left"
            >
              🚀 {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Core Content Idea / Script Draft *</span>
          </label>
          <textarea
            value={rawIdea}
            onChange={(e) => setRawIdea(e.target.value)}
            placeholder="Paste your central video script, podcast summary, or core lesson here..."
            rows={5}
            required
            id="repurpose-idea-input"
            className="w-full bg-[#0c1017] border border-slate-800 focus:border-purple-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Tone & Style Override</span>
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            id="repurpose-tone-select"
            className="w-full bg-[#0c1017] border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none transition-colors"
          >
            <option value="Punchy & Professional">Punchy & Professional</option>
            <option value="High Curiosity & Viral">High Curiosity & Viral</option>
            <option value="Casual & Authentic">Casual & Authentic</option>
            <option value="Direct & Tactical">Direct & Tactical</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          id="generate-repurpose-btn"
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-colors disabled:opacity-50 touch-manipulation"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating 5-Platform Content Package...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate 5-Platform Content Package</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
});
