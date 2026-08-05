import React, { useState, useCallback } from 'react';
import { AnalyzeInput, AnalyzeResult } from '../types';
import { BarChart3, Sparkles, Loader2, FileText, CheckCircle2 } from 'lucide-react';

interface AnalyzeFormProps {
  onSuccess: (result: AnalyzeResult) => void;
  onError: (msg: string) => void;
}

const SAMPLE_SCRIPTS = [
  {
    title: 'Why 99% of Developers Fail at Building SaaS in 2026',
    script: `Stop trying to build complex web apps before you talk to customers.
In this video, I am going to show you the exact 3-step validation framework I used to validate my SaaS idea in 48 hours without writing a single line of code. First, let us look at why most founders spend 6 months building in secret...`,
  },
];

export const AnalyzeForm: React.FC<AnalyzeFormProps> = React.memo(({ onSuccess, onError }) => {
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const applyPreset = useCallback((preset: typeof SAMPLE_SCRIPTS[0]) => {
    setTitle(preset.title);
    setScript(preset.script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !script.trim()) {
      onError('Please enter a title or script text to analyze.');
      return;
    }

    setLoading(true);
    try {
      const payload: AnalyzeInput = {
        title: title.trim(),
        script: script.trim(),
      };

      const res = await fetch('/api/analyze/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze content.');
      }

      const data = await res.json();
      const analyzeResult: AnalyzeResult = {
        id: 'anz-' + Date.now(),
        timestamp: Date.now(),
        input: payload,
        engagementScore: data.engagementScore || 75,
        hookAnalysis: data.hookAnalysis || { rating: 'Moderate', retentionPotential: '', curiosityFactor: '' },
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        suggestions: data.suggestions || [],
      };

      onSuccess(analyzeResult);
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'An unexpected error occurred during content analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Phase 3 Engine
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Content & Hook Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Paste your video title and script draft. CreatorPilot AI evaluates hook strength, retention drop-off risks, strengths, weaknesses, and concrete recommendations.
        </p>
      </div>

      {/* Preset Inspo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Sample Draft for Testing:</span>
          {SAMPLE_SCRIPTS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(s)}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Load Sample Script
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Content Title / Headline</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Why 99% of Software Engineers Fail at Building SaaS in 2026"
            id="analyze-title-input"
            className="w-full bg-[#0c1017] border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Full Script / Post Body *</span>
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your spoken word script, video intro, or post draft..."
            rows={6}
            required
            id="analyze-script-input"
            className="w-full bg-[#0c1017] border border-slate-800 focus:border-cyan-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          id="generate-analyze-btn"
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-colors disabled:opacity-50 touch-manipulation"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Retention & Hook Mechanics...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Analyze Engagement & Retention</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
});
