import React from 'react';
import { PageView } from '../types';
import { Sparkles, LayoutDashboard, Wand2, Repeat, BarChart3, FileText, Compass, Lightbulb } from 'lucide-react';

interface NavbarProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  hasActiveResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({
  activePage,
  setActivePage,
  hasActiveResult,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0c1017]/95 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-3 group text-left focus:outline-none touch-manipulation"
          id="brand-logo-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0d121d] border border-indigo-500/50 shadow-lg shadow-indigo-500/20 group-hover:border-indigo-400 transition-all flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                CreatorPilot
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-300 bg-indigo-950/70 border border-indigo-700/50 rounded-md uppercase">
                AI MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Idea → Strategy → Virality</p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#121824] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActivePage('landing')}
            id="nav-landing-btn"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePage === 'landing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            id="nav-dashboard-btn"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePage === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActivePage('ideas')}
            id="nav-ideas-btn"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePage === 'ideas'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-950/40'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Idea Generator</span>
          </button>

          <button
            onClick={() => setActivePage('campaign')}
            id="nav-campaign-btn"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePage === 'campaign'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Campaign</span>
          </button>

          <button
            onClick={() => setActivePage('repurpose')}
            id="nav-repurpose-btn"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePage === 'repurpose'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Repurpose</span>
          </button>

          <button
            onClick={() => setActivePage('analyze')}
            id="nav-analyze-btn"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePage === 'analyze'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analyzer</span>
          </button>

          {hasActiveResult && (
            <button
              onClick={() => setActivePage('results')}
              id="nav-results-btn"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activePage === 'results'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>AI Output</span>
            </button>
          )}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('dashboard')}
            id="launch-app-cta-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors touch-manipulation"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Studio</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-2 border-t border-slate-800/80 text-xs">
        <button
          onClick={() => setActivePage('landing')}
          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
            activePage === 'landing' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActivePage('dashboard')}
          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
            activePage === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActivePage('ideas')}
          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
            activePage === 'ideas' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Ideas</span>
        </button>
        <button
          onClick={() => setActivePage('campaign')}
          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
            activePage === 'campaign' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Campaign</span>
        </button>
        <button
          onClick={() => setActivePage('repurpose')}
          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
            activePage === 'repurpose' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Repurpose</span>
        </button>
        <button
          onClick={() => setActivePage('analyze')}
          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
            activePage === 'analyze' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analyze</span>
        </button>
      </div>
    </header>
  );
});
