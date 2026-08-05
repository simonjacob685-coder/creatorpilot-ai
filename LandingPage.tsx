import React from 'react';
import { PageView } from '../types';
import { Sparkles, Wand2, Repeat, BarChart3, ArrowRight, ShieldCheck, Zap, Layers, PlayCircle, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto text-center space-y-8 px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>The Next-Gen AI Co-Pilot for Content Creators</span>
        </div>

        {/* Exact Headline Required */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Turn one idea into a <br className="hidden sm:inline" />
          <span className="text-indigo-400">
            complete content strategy
          </span>{' '}
          with AI.
        </h1>

        {/* Short Explanation */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Stop staring at a blank screen. CreatorPilot AI turns your raw concepts into optimized video scripts, viral hooks, multi-platform adaptations, and retention analytics in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            id="landing-cta-primary-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors touch-manipulation group"
          >
            <span>Open Creator Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('campaign')}
            id="landing-cta-secondary-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm bg-[#121824] hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors touch-manipulation"
          >
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <span>Try Campaign Generator</span>
          </button>
        </div>

        {/* Quick Highlights */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>5 Viral Hooks & Titles</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>5-Platform Content Package</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Retention & Hook Analytics</span>
          </div>
        </div>
      </section>

      {/* Feature Overview Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How CreatorPilot AI Transforms Your Workflow
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From single seed idea to complete multi-channel distribution pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('campaign')}
            className="group relative bg-[#121824] border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 space-y-4 cursor-pointer transition-all hover:bg-[#161e2e]"
            id="feature-card-campaign"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                Phase 01
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Campaign Generator
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Input a core topic or audience angle. Receive a tailored strategy, 5 viral titles, 5 high-retention hooks, video section outlines, script structures, and thumbnail concepts.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Generate Strategy</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('repurpose')}
            className="group relative bg-[#121824] border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-4 cursor-pointer transition-all hover:bg-[#161e2e]"
            id="feature-card-repurpose"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Repeat className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                Phase 02
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Repurpose Engine
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Adapt a single idea into YouTube longform outlines, TikTok/Shorts vertical scripts, formatted Instagram carousels, X/Twitter threads, and Facebook posts automatically.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Repurpose Content</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('analyze')}
            className="group relative bg-[#121824] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 space-y-4 cursor-pointer transition-all hover:bg-[#161e2e]"
            id="feature-card-analyze"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                Phase 03
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Content Analyzer
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Paste your draft title and script. Get an AI engagement score, hook curiosity breakdown, strength & drop-off analysis, and specific improvement actions.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Analyze Script</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Strip */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#121824] rounded-2xl p-6 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black text-indigo-400">1 Idea</div>
            <div className="text-xs text-slate-400">Starting Input</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-purple-400">5 Platforms</div>
            <div className="text-xs text-slate-400">Automated Adaptations</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-cyan-400">&lt; 10 Sec</div>
            <div className="text-xs text-slate-400">Generation Speed</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-emerald-400">100% AI</div>
            <div className="text-xs text-slate-400">Powered by Gemini 3.6</div>
          </div>
        </div>
      </section>
    </div>
  );
};
