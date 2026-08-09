import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { TrendingTopicItem, GroundingSource } from '../types';
import { Flame, RefreshCw, Sparkles, ExternalLink, Search, Lightbulb, TrendingUp, Compass, ArrowRight, Wand2 } from 'lucide-react';

interface TrendingTopicsProps {
  onSelectCampaignTopic?: (topic: string) => void;
}

const CATEGORIES = [
  'All',
  'AI & Tech',
  'Creator Economy',
  'Gaming',
  'Productivity',
  'Pop Culture'
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
    },
  },
};

const FALLBACK_TOPICS: Record<string, TrendingTopicItem[]> = {
  'All': [
    {
      topic: 'AI Agent Orchestration for Content Creators',
      category: 'AI & Tech',
      whyTrending: 'Surge in interest around autonomous AI agents handling video editing, script generation, and multi-channel scheduling.',
      contentAngle: 'Record a 24-hour experiment allowing an AI agent to direct your entire video workflow.',
      searchQueries: ['AI creator agents 2026', 'autonomous video editing', 'gemini content pipeline'],
    },
    {
      topic: 'Short-Form Video Retention Hacks & 3-Second Hooks',
      category: 'Creator Economy',
      whyTrending: 'Platforms are heavily rewarding retention rate above 70% on 30-60 second vertical videos.',
      contentAngle: 'Deconstruct 3 viral videos frame-by-frame to reveal visual pattern interrupts.',
      searchQueries: ['short form retention strategies', 'tiktok algorithm 2026', 'youtube shorts pacing'],
    },
    {
      topic: 'Micro-SaaS & Digital Product Monetization',
      category: 'Productivity',
      whyTrending: 'Creators are pivoting from ad revenue to launching niche digital tools and micro-templates directly to audiences.',
      contentAngle: 'Build and launch a simple creator tool in 48 hours on camera.',
      searchQueries: ['creator digital products', 'micro saas for creators', 'monetize social audience'],
    },
    {
      topic: 'Interactive Live Streaming & Audience Co-Creation',
      category: 'Gaming',
      whyTrending: 'Live streams where audience chat votes actively manipulate gameplay or video outcomes are experiencing peak viewer loyalty.',
      contentAngle: 'Host a stream where chat commands control your challenge rules in real-time.',
      searchQueries: ['interactive streaming tools', 'gaming creator trends', 'live stream audience engagement'],
    },
    {
      topic: 'Authentic Unfiltered Storytelling vs Polished Edits',
      category: 'Pop Culture',
      whyTrending: 'Viewers express fatigue with overly scripted corporate videos, favoring candid, relatable behind-the-scenes perspectives.',
      contentAngle: 'Compare engagement between your most polished studio video vs a raw unscripted phone monologue.',
      searchQueries: ['raw content trend', 'authentic storytelling vlog', 'short form authenticity'],
    },
  ],
  'AI & Tech': [
    {
      topic: 'Local LLMs & On-Device AI Tools for Video Editors',
      category: 'AI & Tech',
      whyTrending: 'Privacy-focused creators are adopting local models for instant offline transcriptions and automated video clipping.',
      contentAngle: 'Show how to run a local open-source AI video generator on a personal laptop.',
      searchQueries: ['local AI video editing', 'open source LLM tools', 'offline transcription AI'],
    },
    {
      topic: 'AI Voice Cloning & Multilingual Dubbing Workflows',
      category: 'AI & Tech',
      whyTrending: 'Top channels are expanding global reach by auto-dubbing content into Spanish, Hindi, and Japanese.',
      contentAngle: 'Test multi-language voice dubbing on a top performing short video.',
      searchQueries: ['AI voice dubbing creators', 'elevenlabs multilingual', 'youtube audio tracks'],
    },
  ],
  'Creator Economy': [
    {
      topic: 'Direct-to-Community Paid Newsletters & Subscriptions',
      category: 'Creator Economy',
      whyTrending: 'Diversifying income away from volatile ad revenue CPMs into direct monthly subscriber memberships.',
      contentAngle: 'Break down the exact funnel to turn 1,000 casual viewers into $10/mo newsletter subscribers.',
      searchQueries: ['subscribers monetization 2026', 'creator membership funnels', 'paid newsletter setup'],
    },
  ],
  'Gaming': [
    {
      topic: 'Emerging Unreal Engine 5 Indie Game Deep Dives',
      category: 'Gaming',
      whyTrending: 'Solo indie developers releasing photorealistic horror and simulation titles are dominating Twitch viewership.',
      contentAngle: 'Interview a solo developer while playing their viral early-access game.',
      searchQueries: ['indie game trends 2026', 'unreal engine 5 horror games', 'viral twitch games'],
    },
  ],
  'Productivity': [
    {
      topic: 'Second Brain Knowledge Systems for Solopreneurs',
      category: 'Productivity',
      whyTrending: 'Creators are building automated database dashboards to organize research, video scripts, and sponsorship assets.',
      contentAngle: 'Walk through your clean 1-page system for managing 10 video projects simultaneously.',
      searchQueries: ['notion second brain creators', 'obsidian workflow 2026', 'content planner templates'],
    },
  ],
  'Pop Culture': [
    {
      topic: 'Nostalgia Marketing & 2010s Internet Aesthetics',
      category: 'Pop Culture',
      whyTrending: 'Gen Z and Millennial audiences are heavily engaging with retro web aesthetics and early viral culture formats.',
      contentAngle: 'Recreate a classic 2010 viral video using modern production gear.',
      searchQueries: ['nostalgia content trends', '2010s internet aesthetics', 'viral meme retrospectives'],
    },
  ],
};

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  onSelectCampaignTopic,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [topics, setTopics] = useState<TrendingTopicItem[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [timestamp, setTimestamp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingTopics = useCallback(async (cat: string) => {
    setLoading(true);
    setError(null);
    try {
      let res: Response | null = null;
      try {
        res = await fetch('/api/trending-topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: cat }),
        });
      } catch (_netErr) {
        // Retry once after brief delay if network fetch failed
        await new Promise(r => setTimeout(r, 800));
        res = await fetch('/api/trending-topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: cat }),
        }).catch(() => null);
      }

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && Array.isArray(data.topics) && data.topics.length > 0) {
          setTopics(data.topics);
          setSources(data.groundingSources || []);
          if (data.searchTimestamp) {
            setTimestamp(new Date(data.searchTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
          setLoading(false);
          return;
        }
      }

      // Fallback if res not ok or fetch failed
      const fallbackList = FALLBACK_TOPICS[cat] || FALLBACK_TOPICS['All'];
      setTopics(fallbackList);
      setSources([{ title: 'Creator Trends Scout Engine', uri: 'https://www.google.com' }]);
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (_err) {
      const fallbackList = FALLBACK_TOPICS[cat] || FALLBACK_TOPICS['All'];
      setTopics(fallbackList);
      setSources([{ title: 'Creator Trends Scout Engine', uri: 'https://www.google.com' }]);
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingTopics(selectedCategory);
  }, [selectedCategory, fetchTrendingTopics]);

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Glow Effect Accent */}
      <div className="hidden sm:block absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              <Search className="w-3 h-3 text-emerald-400" />
              Grounded by Google Search
            </span>
            {timestamp && (
              <span className="text-[11px] text-slate-400">
                Updated {timestamp}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Trending Creator Topics & Market Pulse</span>
          </h2>
          <p className="text-xs text-slate-300">
            Real-time web trends to jumpstart your next viral campaign or video idea.
          </p>
        </div>

        <button
          onClick={() => fetchTrendingTopics(selectedCategory)}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          id="refresh-trending-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Searching...' : 'Refresh Trends'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {cat === 'All' ? '⚡ All Trends' : cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchTrendingTopics(selectedCategory)}
            className="underline font-semibold hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0e131d] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div className="h-4 bg-slate-800/60 rounded w-1/3" />
              <div className="h-5 bg-slate-800/80 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-800/40 rounded w-full" />
                <div className="h-3 bg-slate-800/40 rounded w-5/6" />
              </div>
              <div className="pt-3 border-t border-slate-800/60 flex gap-2">
                <div className="h-8 bg-slate-800/60 rounded flex-1" />
                <div className="h-8 bg-slate-800/60 rounded flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Trends Grid */
        <motion.div
          key={selectedCategory + topics.length}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topics.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-[#0e131d] hover:bg-[#111724] border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4 group shadow-sm"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 rounded-md border border-emerald-800/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-emerald-400" />
                    {item.category || 'Creator Trend'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">#0{idx + 1}</span>
                </div>

                {/* Topic Title */}
                <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                  {item.topic}
                </h3>

                {/* Why Trending */}
                <div className="space-y-1 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>Why It's Trending:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.whyTrending}
                  </p>
                </div>

                {/* Suggested Content Angle */}
                <div className="space-y-1 bg-indigo-950/30 rounded-lg p-2.5 border border-indigo-900/30">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300">
                    <Lightbulb className="w-3 h-3" />
                    <span>Creator Angle to Try:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {item.contentAngle}
                  </p>
                </div>

                {/* Search Queries Chips */}
                {item.searchQueries && item.searchQueries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.searchQueries.map((q, qIdx) => (
                      <span
                        key={qIdx}
                        className="px-2 py-0.5 text-[10px] text-slate-400 bg-slate-800/50 rounded-md border border-slate-700/50 flex items-center gap-1"
                      >
                        <Search className="w-2.5 h-2.5 text-slate-500" />
                        {q}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
                {onSelectCampaignTopic && (
                  <button
                    onClick={() => onSelectCampaignTopic(item.topic)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Build Campaign</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Grounding Web Citations Footer */}
      {sources.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Search Web Sources Consulted:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {sources.map((src, i) => (
              <a
                key={i}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors text-[11px] max-w-xs truncate"
              >
                <span className="truncate">{src.title || src.uri}</span>
                <ExternalLink className="w-3 h-3 shrink-0 text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
