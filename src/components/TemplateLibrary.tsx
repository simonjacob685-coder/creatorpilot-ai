import React, { useState, useMemo } from 'react';
import { IDEA_TEMPLATES, IdeaTemplate } from '../data/ideaTemplates';
import { Lightbulb, Search, ArrowRight, Sparkles, Video, Play, FileText, MessageSquare, Compass } from 'lucide-react';

interface TemplateLibraryProps {
  onSelectCampaignTopic?: (topic: string) => void;
}

const CATEGORIES = [
  'All',
  'AI & Technology',
  'Personal Brand',
  'Finance',
  'Fitness',
  'Education',
  'Gaming',
] as const;

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectCampaignTopic }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    return IDEA_TEMPLATES.filter((template) => {
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        template.title.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q) ||
        template.suggestedHook.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getTypeIcon = (type: IdeaTemplate['contentType']) => {
    switch (type) {
      case 'YouTube Video':
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case 'Short / Reel':
        return <Play className="w-3.5 h-3.5 text-amber-400" />;
      case 'X Thread':
        return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
      case 'LinkedIn Post':
        return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div
      id="creator-templates-library-widget"
      className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Content Idea Bank
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Creator Templates & Viral Concepts
          </h2>
          <p className="text-xs text-slate-400">
            Browse high-converting video concepts across major niches. Click &quot;Use This Idea&quot; to transfer directly into Phase 1 Strategy Generator.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas or hooks..."
            className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-[#0a0d14] text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Grid of Templates */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-[#0a0d14] border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-2">
          <Lightbulb className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-300 font-semibold">No templates found for this search</p>
          <p className="text-[11px] text-slate-500">Try selecting a different category or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-[#0a0d14] hover:bg-[#161e2e] border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-5 transition-all space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2.5 py-0.5 rounded-md">
                    {template.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md">
                    {getTypeIcon(template.contentType)}
                    <span>{template.contentType}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {template.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {template.description}
                </p>

                {/* Hook preview box */}
                <div className="p-3 bg-[#121824] border border-slate-800/80 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Suggested Hook:
                  </span>
                  <p className="text-[11px] italic text-slate-300 leading-relaxed">
                    &quot;{template.suggestedHook}&quot;
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (onSelectCampaignTopic) {
                    onSelectCampaignTopic(template.title);
                  }
                }}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 hover:border-amber-400 transition-all group-hover:shadow-md group-hover:shadow-amber-500/20"
              >
                <span>Use This Idea</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
