import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PageView, ActiveResult } from '../types';
import { Wand2, Repeat, BarChart3, ArrowRight, Sparkles, Clock, FileText, Trash2, ExternalLink, Search, Heart, X } from 'lucide-react';
import { TemplateLibrary } from './TemplateLibrary';
import { TodaysGoal } from './TodaysGoal';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
  savedHistory: ActiveResult[];
  onSelectResult: (result: ActiveResult) => void;
  onClearHistory: () => void;
  onSelectCampaignTopic?: (topic: string) => void;
}

const FAVORITES_KEY = 'creator_favorite_ids_v1';

/* Lazy-mounts heavy sections only once they scroll near the viewport,
   so the Dashboard doesn't render everything at once on load. */
const LazyMount: React.FC<{ children: React.ReactNode; minHeight?: string }> = ({ children, minHeight = '240px' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} style={isVisible ? undefined : { minHeight }}>
      {isVisible ? children : null}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = React.memo(({
  onNavigate,
  savedHistory,
  onSelectResult,
  onClearHistory,
  onSelectCampaignTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'favorites'>('newest');
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      // Ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch (_e) {
      // Ignore
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavoriteIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const filteredHistory = useMemo(() => {
    let list = [...savedHistory];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => {
        let text = '';
        if (item.type === 'campaign') {
          text = [
            item.data.input?.topic || '',
            item.data.input?.audience || '',
            item.data.description || '',
            ...(item.data.titles || []),
            ...(item.data.hooks || []),
            ...(item.data.hashtags || []),
          ].join(' ');
        } else if (item.type === 'repurpose') {
          text = [
            item.data.input?.rawIdea || '',
            item.data.youtubeFormat?.videoTitle || '',
            item.data.shortFormFormat?.hook || '',
            item.data.instagramCaption?.captionText || '',
          ].join(' ');
        } else {
          text = [
            item.data.input?.title || '',
            item.data.input?.script || '',
            ...(item.data.suggestions || []),
          ].join(' ');
        }
        return text.toLowerCase().includes(q);
      });
    }

    if (sortOrder === 'favorites') {
      list = list.filter((item) => favoriteIds[item.data.id]);
    } else if (sortOrder === 'oldest') {
      list.sort((a, b) => a.data.timestamp - b.data.timestamp);
    } else {
      list.sort((a, b) => b.data.timestamp - a.data.timestamp);
    }

    return list;
  }, [savedHistory, searchQuery, sortOrder, favoriteIds]);

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

        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Today's Focus Goal Input Field Widget */}
      <TodaysGoal />

      {/* Core Action Cards Required by User Prompt */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Core AI Engines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Creator Templates & Content Idea Bank */}
      <LazyMount minHeight="300px"><TemplateLibrary onSelectCampaignTopic={onSelectCampaignTopic} /></LazyMount>

      {/* History / Saved AI Outputs Section with Search & Filter */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Recent Strategy Output History ({savedHistory.length})</span>
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history & topics..."
                className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-[#0a0d14] border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setSortOrder('newest')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  sortOrder === 'newest' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => setSortOrder('oldest')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  sortOrder === 'oldest' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Oldest
              </button>
              <button
                type="button"
                onClick={() => setSortOrder('favorites')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  sortOrder === 'favorites' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>Saved</span>
              </button>
            </div>

            {savedHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-colors"
                id="clear-history-btn"
                title="Clear saved outputs history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-[#121824] border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-200 font-bold">
                {savedHistory.length === 0 ? 'No Saved Strategies Yet' : 'No Results Matching Search'}
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {savedHistory.length === 0
                  ? 'Generate your first campaign strategy or load a sample demo report instantly below.'
                  : 'Try clearing your search query or switching sort filters.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map((item) => {
              let title = '';
              let badgeColor = '';
              let typeLabel = '';

              if (item.type === 'campaign') {
                title = item.data.input?.topic || 'Campaign Strategy';
                badgeColor = 'text-indigo-400 bg-indigo-950/60 border-indigo-800/50';
                typeLabel = 'Campaign Generator';
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

              const isFav = !!favoriteIds[item.data.id];

              return (
                <div
                  key={`${item.type}-${item.data.id}`}
                  onClick={() => onSelectResult(item)}
                  className="bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all space-y-3 group relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${badgeColor}`}>
                      {typeLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, item.data.id)}
                        className={`p-1 rounded-md hover:bg-slate-800 transition-colors ${
                          isFav ? 'text-rose-500' : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.data.timestamp).toLocaleDateString()}
                      </span>
                    </div>
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
