import React, { useState, useCallback } from 'react';
import { CampaignInput, CampaignResult } from '../types';
import { Wand2, Sparkles, Loader2, Lightbulb, Target, Share2, Palette } from 'lucide-react';

interface CampaignFormProps {
  onSuccess: (result: CampaignResult) => void;
  onError: (msg: string) => void;
  initialTopic?: string;
}

const SAMPLE_PRESETS = [
  {
    label: 'AI Coding Tools 2026',
    topic: 'How AI coding assistants are transforming senior software engineering workflows in 2026',
    audience: 'Software engineers, tech leads, and developers',
    platform: 'YouTube & LinkedIn',
    style: 'Deep Dive & Practical',
  },
  {
    label: 'Solopreneur $10k/mo',
    topic: 'How I built a $10,000/month Micro-SaaS using AI automation without hiring a team',
    audience: 'Indie hackers, startup founders, and digital creators',
    platform: 'YouTube & X',
    style: 'Storytelling & High Energy',
  },
  {
    label: 'Peak Productivity',
    topic: '5 subtle habit changes that double focus and reduce screen fatigue for remote workers',
    audience: 'Remote professionals, students, and knowledge workers',
    platform: 'TikTok & Instagram Reels',
    style: 'Fast Paced & Contrarian',
  },
];

export const CampaignForm: React.FC<CampaignFormProps> = React.memo(({ onSuccess, onError, initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic || '');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [style, setStyle] = useState('Educational & Engaging');
  const [loading, setLoading] = useState(false);

  const applyPreset = useCallback((preset: typeof SAMPLE_PRESETS[0]) => {
    setTopic(preset.topic);
    setAudience(preset.audience);
    setPlatform(preset.platform);
    setStyle(preset.style);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      onError('Please enter a content idea or topic.');
      return;
    }

    setLoading(true);
    try {
      const payload: CampaignInput = {
        topic: topic.trim(),
        audience: audience.trim(),
        platform: platform.trim(),
        style: style.trim(),
      };

      const [campaignRes, repurposeRes] = await Promise.all([
        fetch('/api/campaign/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(r => r.ok ? r.json() : null),
        fetch('/api/repurpose/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawIdea: payload.topic, tone: payload.style }),
        }).then(r => r.ok ? r.json() : null),
      ]);

      if (!campaignRes && !repurposeRes) {
        throw new Error('Failed to generate campaign strategy.');
      }

      const data = campaignRes || {};
      const repurposeData = repurposeRes || {};

      const campaignResult: CampaignResult = {
        id: 'camp-' + Date.now(),
        timestamp: Date.now(),
        input: payload,
        contentStrategy: data.contentStrategy || `Multi-platform content strategy for: ${payload.topic}`,
        titles: data.titles || repurposeData.youtubeFormat?.titleIdeas || [],
        hooks: data.hooks || [repurposeData.youtubeFormat?.hook || ''],
        videoOutline: data.videoOutline || [],
        scriptStructure: data.scriptStructure || [],
        description: data.description || repurposeData.youtubeFormat?.description || '',
        hashtags: data.hashtags || repurposeData.instagramCaption?.hashtags || [],
        thumbnailConcepts: data.thumbnailConcepts || [],
        intelligenceScore: data.intelligenceScore || repurposeData.intelligenceScore,
        youtubeFormat: repurposeData.youtubeFormat,
        shortFormFormat: repurposeData.shortFormFormat,
        instagramCaption: repurposeData.instagramCaption,
        xThread: repurposeData.xThread,
        facebookPost: repurposeData.facebookPost,
      };

      onSuccess(campaignResult);
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Phase 1 Engine
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Content Campaign Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Transform your core idea into a complete content strategy with 5 titles, 5 hooks, script outline, description, hashtags, and thumbnail concepts.
        </p>
      </div>

      {/* Preset Quick Fill */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Preset Inspiration:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-[#121824] hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 transition-all text-left"
            >
              ✨ {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-6">
        {/* Input 1: Idea/Topic */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
            <span>Content Idea / Topic *</span>
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How AI is changing web development in 2026, or 5 mistake software engineers make when scaling apps..."
            rows={3}
            required
            id="campaign-topic-input"
            className="w-full bg-[#0c1017] border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Grid for Audience, Platform, Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input 2: Target Audience */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Audience</span>
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Founders & developers"
              id="campaign-audience-input"
              className="w-full bg-[#0c1017] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Input 3: Platform */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Primary Platform</span>
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              id="campaign-platform-select"
              className="w-full bg-[#0c1017] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none transition-colors"
            >
              <option value="YouTube Longform">YouTube Longform</option>
              <option value="TikTok & Shorts">TikTok & YouTube Shorts</option>
              <option value="Instagram Reels & Carousel">Instagram Reels & Carousel</option>
              <option value="LinkedIn Post & Article">LinkedIn Post & Article</option>
              <option value="X (Twitter) Thread">X (Twitter) Thread</option>
              <option value="Cross-Platform Omnichannel">Cross-Platform Omnichannel</option>
            </select>
          </div>

          {/* Input 4: Content Style */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Content Style</span>
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              id="campaign-style-select"
              className="w-full bg-[#0c1017] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none transition-colors"
            >
              <option value="Educational & Step-by-Step">Educational & Step-by-Step</option>
              <option value="High Energy & Cinematic">High Energy & Cinematic</option>
              <option value="Contrarian & Storytelling">Contrarian & Storytelling</option>
              <option value="Casual & Behind-the-Scenes">Casual & Behind-the-Scenes</option>
              <option value="Data-Driven & Analytical">Data-Driven & Analytical</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          id="generate-campaign-btn"
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors disabled:opacity-50 touch-manipulation"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Architecting Content Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Strategy & Campaign Assets</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
});
