import React from 'react';
import { PageView, ActiveResult } from '../types';
import { Wand2, Repeat, BarChart3, ArrowRight, Sparkles, Clock, FileText, Trash2, ExternalLink, Lightbulb } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
  savedHistory: ActiveResult[];
  onSelectResult: (result: ActiveResult) => void;
  onClearHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({
  onNavigate,
  savedHistory,
  onSelectResult,
  onClearHistory,
}) => {
  return (
    <div className="space-y-8 py-6">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121824] p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Creator Studio Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Creator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Select an AI engine to start building your content strategy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('campaign')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            id="dash-quick-campaign-btn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Core Action Cards Required by User Prompt */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Core AI Engines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 0: Creator Idea Generator */}
          <div
            onClick={() => onNavigate('ideas')}
            id="dash-card-idea-generator"
            className="group bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-amber-500/60 rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between space-y-6 shadow-md hover:shadow-amber-500/10"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-[10px] font-semibold text-amber-300 bg-amber-950/60 rounded-full border border-amber-800/40">
                  10 Ideas
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Idea Generator
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Brainstorm 10 high-performing content ideas with why it works, hooks, best platforms, angles, and difficulty levels.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Brainstorm Ideas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 1: Create Campaign */}
          <div
            onClick={() => onNavigate('campaign')}
            id="dash-card-create-campaign"
            className="group bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between space-y-6 shadow-md hover:shadow-indigo-500/10"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Wand2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-[10px] font-semibold text-indigo-300 bg-indigo-950/60 rounded-full border border-indigo-800/40">
                  Full Pipeline
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Create Campaign
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Turn a single topic into 5 viral titles, 5 scroll-stopping hooks, video chapter outlines, script structure, descriptions, and thumbnail prompts.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Start Generator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Repurpose Content */}
          <div
            onClick={() => onNavigate('repurpose')}
            id="dash-card-repurpose-content"
            className="group bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-purple-500/60 rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between space-y-6 shadow-md hover:shadow-purple-500/10"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Repeat className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-[10px] font-semibold text-purple-300 bg-purple-950/60 rounded-full border border-purple-800/40">
                  5 Platforms
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Repurpose Content
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Convert one core concept into YouTube content, TikTok/Shorts vertical scripts, Instagram carousels, X/Twitter threads, and Facebook posts.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400">
              <span>Open Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Analyze Content */}
          <div
            onClick={() => onNavigate('analyze')}
            id="dash-card-analyze-content"
            className="group bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between space-y-6 shadow-md hover:shadow-cyan-500/10"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 rounded-full border border-cyan-800/40">
                  Retention Scoring
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Analyze Content
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Audit your title and script drafts before recording. Receive an engagement score, hook analysis, drop-off risks, and actionable tweaks.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>Launch Analyzer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* History / Saved AI Outputs Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Recent Strategy Output History</span>
          </h2>
          {savedHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
              id="clear-history-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {savedHistory.length === 0 ? (
          <div className="bg-[#121824] border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">No saved strategies yet.</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Use any of the AI engines above to generate titles, scripts, and repurposing plans. They will automatically be saved here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedHistory.map((item) => {
              let title = '';
              let badgeColor = '';
              let typeLabel = '';

              if (item.type === 'campaign') {
                title = item.data.input?.topic || 'Campaign Strategy';
                badgeColor = 'text-indigo-400 bg-indigo-950/60 border-indigo-800/50';
                typeLabel = 'Campaign Generator';
              } else if (item.type === 'ideas') {
                title = item.data.input?.niche ? `Ideas: ${item.data.input.niche}` : 'Generated Ideas';
                badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-800/50';
                typeLabel = 'Idea Generator';
              } else if (item.type === 'repurpose') {
                const raw = item.data.input?.rawIdea || 'Repurpose Content';
                title = raw.slice(0, 50) + (raw.length > 50 ? '...' : '');
                badgeColor = 'text-purple-400 bg-purple-950/60 border-purple-800/50';
                typeLabel = 'Repurpose Engine';
              } else {
                const scriptText = item.data.input?.script || '';
                const fallbackTitle = scriptText ? scriptText.slice(0, 50) + '...' : 'Content Analysis';
                title = item.data.input?.title || fallbackTitle;
                badgeColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50';
                typeLabel = `Analyzer (${item.data.engagementScore || 0}/100)`;
              }

              return (
                <div
                  key={`${item.type}-${item.data.id}`}
                  onClick={() => onSelectResult(item)}
                  className="bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${badgeColor}`}>
                      {typeLabel}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.data.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 line-clamp-2 transition-colors">
                    {title}
                  </h4>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>View Output</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});
