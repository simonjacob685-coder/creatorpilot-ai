import React, { useState, useCallback, useRef } from 'react';
import { ActiveResult, CampaignResult, RepurposeResult, AnalyzeResult, PageView } from '../types';
import { 
  Sparkles, Copy, Check, Download, ArrowLeft, Wand2, 
  Youtube, Video, Instagram, Twitter, Facebook, AlertTriangle, CheckCircle, TrendingUp, 
  Lightbulb, Image as ImageIcon, FileText, ChevronDown, Flame, ArrowRight
} from 'lucide-react';

interface ResultsViewProps {
  activeResult: ActiveResult;
  onNavigate: (page: PageView) => void;
  onToast: (msg: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = React.memo(({
  activeResult,
  onNavigate,
  onToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    onToast(`Copied ${label} to clipboard!`);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
  }, [onToast]);

  const downloadReport = useCallback((format: 'md' | 'txt' = 'md') => {
    let content = '';
    let filename = `CreatorPilot_Report.${format}`;

    if (activeResult.type === 'campaign') {
      const data = activeResult.data;
      const topicStr = data.input?.topic || 'topic';
      filename = `Campaign_${topicStr.slice(0, 20)}.${format}`;
      content = `# CreatorPilot AI — Content Strategy Report\n\n`;
      content += `**Topic:** ${data.input?.topic || 'N/A'}\n`;
      content += `**Target Audience:** ${data.input?.audience || 'N/A'}\n`;
      content += `**Platform:** ${data.input?.platform || 'N/A'}\n`;
      content += `**Style:** ${data.input?.style || 'N/A'}\n\n`;
      content += `--- \n\n## 💡 Content Strategy\n${data.contentStrategy || ''}\n\n`;
      content += `## 📌 5 Optimized Titles\n` + (data.titles || []).map((t, i) => `${i + 1}. ${t}`).join('\n') + `\n\n`;
      content += `## 🎣 5 Viral Hooks\n` + (data.hooks || []).map((h, i) => `${i + 1}. ${h}`).join('\n') + `\n\n`;
      content += `## 📝 Video Script Structure\n` + (data.scriptStructure || []).map((s) => `### ${s.phase} (${s.timing})\n${s.scriptText}\n*Creator Tip:* ${s.creatorTips}\n`).join('\n') + `\n`;
      content += `## 🎨 Thumbnail Concepts\n` + (data.thumbnailConcepts || []).map((t, i) => `### ${i + 1}. ${t.title}\n- **Overlay:** "${t.textOverlay}"\n- **Visual:** ${t.visualDescription}\n`).join('\n') + `\n`;
      content += `## 🏷️ Hashtags\n${(data.hashtags || []).join(' ')}\n\n`;
      content += `## 📄 Description\n${data.description || ''}\n`;
    } else if (activeResult.type === 'repurpose') {
      const data = activeResult.data;
      const rawStr = data.input?.rawIdea || 'idea';
      filename = `Repurpose_${rawStr.slice(0, 20)}.${format}`;
      content = `# CreatorPilot AI — Multi-Platform Repurpose Plan\n\n`;
      content += `**Source Idea:** ${data.input?.rawIdea || 'N/A'}\n\n`;
      content += `## 📺 YouTube Content\n**Title:** ${data.youtubeFormat?.videoTitle || ''}\n**Pinned Comment:** ${data.youtubeFormat?.pinnedComment || ''}\n\n### Outline\n` + (data.youtubeFormat?.outline || []).map((o) => `- ${o}`).join('\n') + `\n\n`;
      content += `## 📱 TikTok / Shorts Content\n**Hook:** ${data.shortFormFormat?.hook || ''}\n**30-60s Script:**\n${data.shortFormFormat?.script30Sec || ''}\n\n`;
      content += `## 📸 Instagram Content\n**Headline:** ${data.instagramCaption?.headline || ''}\n**Caption:**\n${data.instagramCaption?.captionText || ''}\n\n`;
      content += `## 🐦 X / Twitter Thread\n**Tweet 1:** ${data.xThread?.hookTweet || ''}\n\n` + (data.xThread?.tweets || []).map((t, i) => `**Tweet ${i + 2}:** ${t}`).join('\n\n') + `\n\n**CTA Tweet:** ${data.xThread?.callToActionTweet || ''}\n\n`;
      content += `## 📘 Facebook Content\n**Headline:** ${data.facebookPost?.headline || ''}\n\n**Post Text:**\n${data.facebookPost?.postText || ''}\n\n**Key Takeaways:**\n` + (data.facebookPost?.keyTakeaways || []).map((k) => `- ${k}`).join('\n') + `\n\n**CTA:** ${data.facebookPost?.callToAction || ''}\n\n**Hashtags:** ${(data.facebookPost?.hashtags || []).join(' ')}\n`;
    } else {
      const data = activeResult.data;
      const titleStr = data.input?.title || 'analysis';
      filename = `Analysis_${titleStr.slice(0, 20)}.${format}`;
      content = `# CreatorPilot AI — Content Retention & Hook Report\n\n`;
      content += `**Title:** ${data.input.title}\n`;
      content += `**Engagement Score:** ${data.engagementScore} / 100\n`;
      content += `**Hook Rating:** ${data.hookAnalysis.rating}\n\n`;
      content += `## 🎣 Hook Analysis\n- **Retention Potential:** ${data.hookAnalysis.retentionPotential}\n- **Curiosity Factor:** ${data.hookAnalysis.curiosityFactor}\n\n`;
      content += `## 💪 Strengths\n` + data.strengths.map((s) => `- ${s}`).join('\n') + `\n\n`;
      content += `## ⚠️ Weaknesses\n` + data.weaknesses.map((w) => `- ${w}`).join('\n') + `\n\n`;
      content += `## 🚀 Recommendations\n` + data.suggestions.map((s) => `- ${s}`).join('\n') + `\n`;
    }

    const mimeType = format === 'txt' ? 'text/plain;charset=utf-8;' : 'text/markdown;charset=utf-8;';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast(`Downloaded ${filename}!`);
  }, [activeResult, onToast]);

  const copyEverything = useCallback(() => {
    let content = '';
    if (activeResult.type === 'campaign') {
      const data = activeResult.data;
      content = `CreatorPilot AI Campaign Strategy\nTopic: ${data.input?.topic || ''}\n\nTitles:\n${(data.titles || []).map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nHooks:\n${(data.hooks || []).map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nDescription:\n${data.description || ''}`;
    } else if (activeResult.type === 'repurpose') {
      const data = activeResult.data;
      content = `CreatorPilot AI Repurpose Strategy\nYouTube: ${data.youtubeFormat?.videoTitle || ''}\nShorts Hook: ${data.shortFormFormat?.hook || ''}\nInstagram: ${data.instagramCaption?.captionText || ''}`;
    } else {
      const data = activeResult.data;
      content = `CreatorPilot AI Audit Score: ${data.engagementScore}/100\nTitle: ${data.input.title}\nRecommendations:\n${data.suggestions.join('\n')}`;
    }
    navigator.clipboard.writeText(content);
    onToast('Copied complete strategy to clipboard!');
  }, [activeResult, onToast]);

  // Compute text statistics
  let statsText = '';
  if (activeResult.type === 'campaign') {
    statsText = (activeResult.data.contentStrategy || '') + (activeResult.data.description || '') + (activeResult.data.titles || []).join(' ');
  } else if (activeResult.type === 'repurpose') {
    statsText = (activeResult.data.youtubeFormat?.videoTitle || '') + (activeResult.data.instagramCaption?.captionText || '') + (activeResult.data.facebookPost?.postText || '');
  } else {
    statsText = (activeResult.data.input?.script || '') + (activeResult.data.suggestions || []).join(' ');
  }
  const calcWords = statsText.trim() ? statsText.trim().split(/\s+/).length : 0;
  const calcChars = statsText.length;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate('dashboard')}
              type="button"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              id="results-back-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Output Ready</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
              📊 {calcWords} Words ({calcChars} Chars)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {activeResult.type === 'campaign' && 'Campaign Strategy Results'}
            {activeResult.type === 'repurpose' && 'Multi-Platform Repurpose Results'}
            {activeResult.type === 'analyze' && 'Content Audit & Score Results'}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyEverything}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a2333] hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-sm"
            title="Copy complete strategy to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copy All</span>
          </button>

          <button
            onClick={() => downloadReport('txt')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a2333] hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-sm"
            title="Export as plain text file"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export TXT</span>
          </button>

          <button
            onClick={() => downloadReport('md')}
            type="button"
            id="download-report-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a2333] hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export MD</span>
          </button>

          <button
            onClick={() => onNavigate(activeResult.type)}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            id="results-new-gen-btn"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>New Generation</span>
          </button>
        </div>
      </div>

      {/* RENDER CAMPAIGN RESULT */}
      {activeResult.type === 'campaign' && (
        <CampaignResultsSection
          data={activeResult.data}
          copiedId={copiedId}
          onCopy={copyToClipboard}
        />
      )}

      {/* RENDER REPURPOSE RESULT */}
      {activeResult.type === 'repurpose' && (
        <RepurposeResultsSection
          data={activeResult.data}
          copiedId={copiedId}
          onCopy={copyToClipboard}
        />
      )}

      {/* RENDER ANALYZE RESULT */}
      {activeResult.type === 'analyze' && (
        <AnalyzeResultsSection
          data={activeResult.data}
          copiedId={copiedId}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
});

/* Accordion Card Container */
const AccordionSection = React.memo<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}>(({ title, subtitle, icon, badge, isOpen, onToggle, headerAction, children }) => {
  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl overflow-hidden font-sans shadow-sm">
      <div 
        onClick={onToggle}
        className="flex items-center justify-between p-4 sm:p-5 cursor-pointer bg-[#121824] hover:bg-[#161e2e] transition-colors select-none"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">{title}</h3>
              {badge && (
                <span className="hidden sm:inline-block text-[10px] text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-800/40 font-mono shrink-0">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
          {headerAction}
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            aria-label={isOpen ? "Collapse section" : "Expand section"}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-6 pt-2 border-t border-slate-800/80">
          {children}
        </div>
      )}
    </div>
  );
});

/* Sub-Component 1: Campaign Results Section */
const CampaignResultsSection: React.FC<{
  data: CampaignResult;
  copiedId: string | null;
  onCopy: (text: string, label: string) => void;
}> = React.memo(({ data, copiedId, onCopy }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleSection = useCallback((idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  }, []);

  return (
    <div className="space-y-4">
      {/* Section 0: Core Content Strategy */}
      <AccordionSection
        title="Core Content Strategy"
        subtitle="High-level directional focus & core message"
        icon={<Lightbulb className="w-4 h-4 text-indigo-400" />}
        isOpen={openIndex === 0}
        onToggle={() => toggleSection(0)}
        headerAction={
          <button
            type="button"
            onClick={() => onCopy(data.contentStrategy, 'Content Strategy')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            {copiedId === 'Content Strategy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy Strategy</span>
          </button>
        }
      >
        <p className="text-sm text-indigo-100 leading-relaxed font-medium bg-indigo-950/30 p-4 rounded-xl border border-indigo-900/40 break-words">
          {data.contentStrategy}
        </p>
      </AccordionSection>

      {/* Section 1: 5 Titles & 5 Hooks */}
      <AccordionSection
        title="5 Titles & 5 Scroll-Stopping Hooks"
        subtitle="High CTR title options and first 5-10 sec hooks"
        icon={<Sparkles className="w-4 h-4 text-purple-400" />}
        badge="High Engagement"
        isOpen={openIndex === 1}
        onToggle={() => toggleSection(1)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Titles */}
          <div className="bg-[#0c1017] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">5 Optimized Titles</h4>
              </div>
              <span className="text-[10px] text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 font-mono">
                High CTR
              </span>
            </div>

            <div className="space-y-3">
              {data.titles.map((title, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 bg-[#121824] p-3 rounded-xl border border-slate-800"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="text-xs font-black text-indigo-400 font-mono mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 font-medium break-words leading-snug">
                      {title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy(title, `Title #${idx + 1}`)}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy title"
                  >
                    {copiedId === `Title #${idx + 1}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hooks */}
          <div className="bg-[#0c1017] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">5 Scroll-Stopping Hooks</h4>
              </div>
              <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 font-mono">
                First 5-10 Sec
              </span>
            </div>

            <div className="space-y-3">
              {data.hooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 bg-[#121824] p-3 rounded-xl border border-slate-800"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="text-xs font-black text-purple-400 font-mono mt-0.5 shrink-0">
                      H{idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 font-medium italic break-words leading-snug">
                      "{hook}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy(hook, `Hook #${idx + 1}`)}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy hook"
                  >
                    {copiedId === `Hook #${idx + 1}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Section 2: Full Video Script & Outline */}
      <AccordionSection
        title="Full Video Script & Outline"
        subtitle="Phase-by-phase script, timing, and creator tips"
        icon={<FileText className="w-4 h-4 text-indigo-400" />}
        isOpen={openIndex === 2}
        onToggle={() => toggleSection(2)}
        headerAction={
          <button
            type="button"
            onClick={() => {
              const fullText = data.scriptStructure.map(s => `${s.phase} (${s.timing}):\n${s.scriptText}\nTip: ${s.creatorTips}`).join('\n\n');
              onCopy(fullText, 'Full Script');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            {copiedId === 'Full Script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy Script</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {data.scriptStructure.map((sec, idx) => (
            <div
              key={idx}
              className="bg-[#0c1017] p-5 rounded-xl border border-slate-800 space-y-3 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {sec.phase}
                </span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/60 px-2 py-0.5 rounded">
                  {sec.timing}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans break-words">
                {sec.scriptText}
              </p>
              <div className="pt-2 border-t border-slate-800/60 text-[11px] text-indigo-300 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="break-words"><strong>Creator Note:</strong> {sec.creatorTips}</span>
              </div>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Section 3: Thumbnail Concepts */}
      <AccordionSection
        title="3 Thumbnail Concepts"
        subtitle="Visual layouts, text overlays, and framing ideas"
        icon={<ImageIcon className="w-4 h-4 text-purple-400" />}
        isOpen={openIndex === 3}
        onToggle={() => toggleSection(3)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {data.thumbnailConcepts.map((thumb, idx) => (
            <div key={idx} className="bg-[#0c1017] p-4 rounded-xl border border-slate-800/80 space-y-3 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">Concept {idx + 1}</span>
                <span className="px-2 py-0.5 text-[10px] bg-purple-950/60 text-purple-300 font-mono rounded border border-purple-800/40">
                  Visual Layout
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 break-words">{thumb.title}</h4>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
                <span className="text-xs font-extrabold text-amber-300 tracking-wide uppercase break-words">
                  "{thumb.textOverlay}"
                </span>
                <div className="text-[10px] text-slate-500 mt-0.5">Thumbnail Text Overlay</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed break-words">
                {thumb.visualDescription}
              </p>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Section 4: Description & Hashtags */}
      <AccordionSection
        title="Optimized Description & Hashtags"
        subtitle="SEO description text and niche tags"
        icon={<FileText className="w-4 h-4 text-emerald-400" />}
        isOpen={openIndex === 4}
        onToggle={() => toggleSection(4)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Optimized Description</h4>
              <button
                type="button"
                onClick={() => onCopy(data.description, 'Description')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedId === 'Description' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 bg-[#0c1017] p-4 rounded-xl border border-slate-800 leading-relaxed font-mono whitespace-pre-wrap break-words">
              {data.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hashtags</h4>
              <button
                type="button"
                onClick={() => onCopy(data.hashtags.join(' '), 'Hashtags')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedId === 'Hashtags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.hashtags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 text-xs bg-indigo-950/60 text-indigo-300 rounded-lg border border-indigo-800/40 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Multi-Platform Distribution Package (YouTube, TikTok, Instagram, X, Facebook) */}
      {(data.youtubeFormat || data.shortFormFormat || data.instagramCaption || data.xThread || data.facebookPost || data.titles) && (
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Multi-Platform Campaign Package (YouTube, TikTok, Instagram, X, Facebook)
            </h3>
          </div>
          <RepurposeResultsSection
            data={{
              id: data.id + '-repurpose',
              timestamp: data.timestamp,
              input: { rawIdea: data.input?.topic || '', tone: data.input?.style || '' },
              youtubeFormat: data.youtubeFormat || {
                videoTitle: data.titles?.[0] || 'YouTube Video Concept',
                titleIdeas: data.titles || [],
                hook: data.hooks?.[0] || '',
                outline: data.videoOutline ? data.videoOutline.map(v => `${v.phase}: ${v.keyPoint}`) : [data.contentStrategy || ''],
                description: data.description || '',
                seoKeywords: data.hashtags || [],
                pinnedComment: 'What are your thoughts on this? Leave a comment below!',
              },
              shortFormFormat: data.shortFormFormat || {
                hook: data.hooks?.[0] || '',
                script30Sec: data.scriptStructure ? data.scriptStructure.map(s => `${s.phase}: ${s.scriptText}`).join('\n\n') : (data.contentStrategy || ''),
                caption: (data.description || '').slice(0, 200),
                hashtags: data.hashtags || [],
                visualCues: ['Fast paced visual edits', 'Text on screen overlay'],
                audioStyle: 'Upbeat trending audio track',
              },
              instagramCaption: data.instagramCaption || {
                reelCaption: data.description || '',
                carouselPostIdea: 'Carousel slide deck breaking down key steps with clean visual callouts.',
                headline: data.titles?.[0] || 'Key Insights',
                captionText: data.description || '',
                carouselOutline: data.titles || [],
                hashtags: data.hashtags || [],
              },
              xThread: data.xThread || {
                openingTweet: data.hooks?.[0] || data.titles?.[0] || '',
                hookTweet: data.hooks?.[0] || '',
                tweets: data.titles || [],
                keyPoints: data.titles || [],
                callToActionTweet: 'Follow for more high-value creator breakdowns!',
              },
              facebookPost: data.facebookPost || {
                communityPost: data.description || '',
                headline: data.titles?.[0] || 'Community Discussion',
                postText: data.description || '',
                keyTakeaways: data.titles || [],
                engagementQuestion: 'What is your biggest takeaway from this concept?',
                callToAction: 'Drop your thoughts in the comments!',
                hashtags: data.hashtags || [],
              },
            }}
            copiedId={copiedId}
            onCopy={onCopy}
          />
        </div>
      )}
    </div>
  );
});

/* Sub-Component 2: Repurpose Results Section */
const RepurposeResultsSection: React.FC<{
  data: RepurposeResult;
  copiedId: string | null;
  onCopy: (text: string, label: string) => void;
}> = React.memo(({ data, copiedId, onCopy }) => {
  const { youtubeFormat, shortFormFormat, instagramCaption, xThread, facebookPost } = data;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleSection = useCallback((idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  }, []);

  // YouTube calculations & fallbacks
  const titleIdeas = youtubeFormat.titleIdeas && youtubeFormat.titleIdeas.length > 0 
    ? youtubeFormat.titleIdeas 
    : [youtubeFormat.videoTitle || 'Untitled Video Concept'];
  const videoHook = youtubeFormat.hook || 'Jump straight into the central insight in the first 10 seconds.';
  const seoKeywords = youtubeFormat.seoKeywords || ['content creation', 'creator tips', 'viral content'];

  // TikTok / Shorts calculations & fallbacks
  const shortCaption = shortFormFormat.caption || shortFormFormat.script30Sec;
  const shortHashtags = shortFormFormat.hashtags || ['#shorts', '#tiktok', '#viral', '#creators'];

  // Instagram calculations & fallbacks
  const reelCaption = instagramCaption.reelCaption || instagramCaption.captionText;
  const carouselIdea = instagramCaption.carouselPostIdea || 'Interactive slide deck breaking down key steps with clean visual callouts.';

  // X (Twitter) calculations & fallbacks
  const openingTweet = xThread.openingTweet || xThread.hookTweet;
  const keyPoints = xThread.keyPoints && xThread.keyPoints.length > 0 
    ? xThread.keyPoints 
    : xThread.tweets;

  // Facebook calculations & fallbacks
  const communityPost = facebookPost.communityPost || facebookPost.postText;
  const engagementQuestion = facebookPost.engagementQuestion || facebookPost.callToAction;

  return (
    <div className="space-y-4">
      {/* 5 Platform Package Sections Required */}
      
      {/* Section 1: YouTube Package */}
      <AccordionSection
        title="1. YouTube Package"
        subtitle="Video title ideas, hook, outline, description & SEO keywords"
        icon={<Youtube className="w-4 h-4 text-red-400" />}
        isOpen={openIndex === 0}
        onToggle={() => toggleSection(0)}
        headerAction={
          <button
            onClick={() => {
              const text = `YOUTUBE PACKAGE\n\nTitle Ideas:\n${titleIdeas.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nVideo Hook:\n${videoHook}\n\nOutline:\n${youtubeFormat.outline.map(o => `• ${o}`).join('\n')}\n\nDescription:\n${youtubeFormat.description}\n\nSEO Keywords:\n${seoKeywords.join(', ')}`;
              onCopy(text, 'YouTube Package');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            {copiedId === 'YouTube Package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy YouTube</span>
          </button>
        }
      >
        <div className="space-y-4 pt-2">
          {/* Video Title Ideas */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Video Title Ideas:
            </span>
            <div className="space-y-2">
              {titleIdeas.map((title, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-[#0c1017] p-3 rounded-xl border border-slate-800 text-xs font-bold text-indigo-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-[10px] font-mono text-indigo-400 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="min-w-0 flex-1">{title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Hook & Outline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl space-y-1.5">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                Video Hook (First 15-30s):
              </span>
              <p className="text-xs font-medium text-slate-200 leading-relaxed italic">
                "{videoHook}"
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Video Outline:
              </span>
              <ul className="space-y-1.5">
                {youtubeFormat.outline.map((item, idx) => (
                  <li key={idx} className="bg-[#0c1017] p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Description & SEO Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Description:
              </span>
              <p className="text-xs text-slate-300 bg-[#0c1017] p-3.5 rounded-xl border border-slate-800 whitespace-pre-wrap font-mono leading-relaxed">
                {youtubeFormat.description}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  SEO Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {seoKeywords.map((kw, idx) => (
                    <span key={idx} className="text-[11px] text-red-300 bg-red-950/50 px-2.5 py-1 rounded-lg border border-red-800/40 font-mono">
                      #{kw.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              </div>

              {youtubeFormat.pinnedComment && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Pinned Comment Draft:
                  </span>
                  <p className="text-xs text-amber-200 bg-amber-950/20 p-3 rounded-xl border border-amber-900/40 italic">
                    "{youtubeFormat.pinnedComment}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Section 2: TikTok / YouTube Shorts Package */}
      <AccordionSection
        title="2. TikTok / YouTube Shorts Package"
        subtitle="Short-form hook, spoken short script, caption & viral hashtags"
        icon={<Video className="w-4 h-4 text-pink-400" />}
        isOpen={openIndex === 1}
        onToggle={() => toggleSection(1)}
        headerAction={
          <button
            onClick={() => {
              const text = `TIKTOK / SHORTS PACKAGE\n\nShort-Form Hook (0-3s):\n${shortFormFormat.hook}\n\nShort Script:\n${shortFormFormat.script30Sec}\n\nCaption:\n${shortCaption}\n\nHashtags:\n${shortHashtags.join(' ')}`;
              onCopy(text, 'TikTok/Shorts Package');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            {copiedId === 'TikTok/Shorts Package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy TikTok/Shorts</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-4">
            {/* Short-Form Hook */}
            <div className="bg-pink-950/30 border border-pink-900/50 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                Short-Form Hook (First 3 Seconds):
              </span>
              <p className="text-xs font-bold text-white italic">"{shortFormFormat.hook}"</p>
            </div>

            {/* Short Script */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Short Script (30-60s Vertical Spoken Draft):
              </span>
              <p className="text-xs text-slate-200 bg-[#0c1017] p-4 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
                {shortFormFormat.script30Sec}
              </p>
            </div>

            {/* Caption & Hashtags */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Caption & Hashtags:
              </span>
              <div className="bg-[#0c1017] p-3.5 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-200 whitespace-pre-wrap">{shortCaption}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {shortHashtags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-pink-300 bg-pink-950/50 px-2 py-0.5 rounded border border-pink-800/40">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {shortFormFormat.visualCues && shortFormFormat.visualCues.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Visual Edit Cues:
                </span>
                <div className="space-y-2">
                  {shortFormFormat.visualCues.map((cue, idx) => (
                    <div key={idx} className="bg-[#0c1017] p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                      <span>{cue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {shortFormFormat.audioStyle && (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">Audio Track Vibe:</span>{' '}
                <span className="text-purple-300 font-medium">{shortFormFormat.audioStyle}</span>
              </div>
            )}
          </div>
        </div>
      </AccordionSection>

      {/* Section 3: Instagram Package */}
      <AccordionSection
        title="3. Instagram Package"
        subtitle="Reel caption, carousel/post idea & hashtags"
        icon={<Instagram className="w-4 h-4 text-purple-400" />}
        isOpen={openIndex === 2}
        onToggle={() => toggleSection(2)}
        headerAction={
          <button
            onClick={() => {
              const text = `INSTAGRAM PACKAGE\n\nReel Caption:\n${reelCaption}\n\nCarousel / Post Idea:\n${carouselIdea}\n\nSlide Breakdown:\n${instagramCaption.carouselOutline.map((s, i) => `Slide ${i + 1}: ${s}`).join('\n')}\n\nHashtags:\n${instagramCaption.hashtags.join(' ')}`;
              onCopy(text, 'Instagram Package');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            {copiedId === 'Instagram Package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy Instagram</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            {/* Reel Caption */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Reel / Post Caption:
              </span>
              <div className="bg-[#0c1017] p-4 rounded-xl border border-slate-800 space-y-2">
                {instagramCaption.headline && (
                  <p className="text-xs font-bold text-purple-300">{instagramCaption.headline}</p>
                )}
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{reelCaption}</p>
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Target Hashtags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {instagramCaption.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded-lg border border-purple-800/40 font-mono">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Carousel / Post Idea */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Carousel / Post Idea Concept:
              </span>
              <div className="bg-purple-950/20 border border-purple-900/40 p-3.5 rounded-xl text-xs text-purple-200">
                {carouselIdea}
              </div>
            </div>

            {/* Carousel Slide Breakdown */}
            {instagramCaption.carouselOutline && instagramCaption.carouselOutline.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Carousel Slide-by-Slide Outline:
                </span>
                <div className="space-y-2">
                  {instagramCaption.carouselOutline.map((slide, idx) => (
                    <div key={idx} className="bg-[#0c1017] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-900/60 text-purple-300 rounded font-mono shrink-0">
                        Slide {idx + 1}
                      </span>
                      <span className="min-w-0 flex-1">{slide}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AccordionSection>

      {/* Section 4: X (Twitter) Package */}
      <AccordionSection
        title="4. X (Twitter) Package"
        subtitle="Thread structure, opening tweet & key points summary"
        icon={<Twitter className="w-4 h-4 text-cyan-400" />}
        isOpen={openIndex === 3}
        onToggle={() => toggleSection(3)}
        headerAction={
          <button
            onClick={() => {
              const fullThread = [openingTweet, ...xThread.tweets, xThread.callToActionTweet]
                .filter(Boolean)
                .map((t, i, arr) => `${i + 1}/${arr.length}\n${t}`)
                .join('\n\n---\n\n');
              onCopy(fullThread, 'X Package');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            {copiedId === 'X Package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy X Thread</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Thread Structure:
            </span>

            {/* Opening Tweet */}
            <div className="bg-[#0c1017] p-4 rounded-xl border border-cyan-500/40 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase">
                <span>Opening Tweet (Hook)</span>
                <span>1/{xThread.tweets.length + (xThread.callToActionTweet ? 2 : 1)}</span>
              </div>
              <p className="text-xs font-semibold text-white leading-relaxed">{openingTweet}</p>
            </div>

            {/* Body Tweets */}
            {xThread.tweets.map((tweet, idx) => (
              <div key={idx} className="bg-[#0c1017] p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 font-mono">
                  Tweet {idx + 2}/{xThread.tweets.length + (xThread.callToActionTweet ? 2 : 1)}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{tweet}</p>
              </div>
            ))}

            {/* Final CTA Tweet */}
            {xThread.callToActionTweet && (
              <div className="bg-[#0c1017] p-4 rounded-xl border border-indigo-500/30 space-y-1">
                <div className="text-[10px] text-indigo-400 font-bold uppercase">
                  Final Tweet (Recap & CTA)
                </div>
                <p className="text-xs text-indigo-200 leading-relaxed">{xThread.callToActionTweet}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Key Points Summary:
            </span>
            <div className="space-y-2">
              {keyPoints.map((point, idx) => (
                <div key={idx} className="bg-[#0c1017] p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Section 5: Facebook Package */}
      <AccordionSection
        title="5. Facebook Package"
        subtitle="Community post version & engagement question"
        icon={<Facebook className="w-4 h-4 text-blue-400" />}
        isOpen={openIndex === 4}
        onToggle={() => toggleSection(4)}
        headerAction={
          <button
            onClick={() => {
              const text = `FACEBOOK PACKAGE\n\nCommunity Post Version:\n${communityPost}\n\nEngagement Question:\n${engagementQuestion}\n\nKey Takeaways:\n${(facebookPost.keyTakeaways || []).map(k => `• ${k}`).join('\n')}\n\nHashtags:\n${(facebookPost.hashtags || []).join(' ')}`;
              onCopy(text, 'Facebook Package');
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            {copiedId === 'Facebook Package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy Facebook</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Community Post Version:
              </span>
              <div className="bg-[#0c1017] p-4 rounded-xl border border-slate-800 space-y-2">
                {facebookPost.headline && (
                  <p className="text-xs font-bold text-blue-300">{facebookPost.headline}</p>
                )}
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{communityPost}</p>
              </div>
            </div>

            {facebookPost.hashtags && facebookPost.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {facebookPost.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] text-blue-300 bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-800/40 font-mono">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Engagement Question */}
            <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-900/50 space-y-1.5">
              <span className="font-bold text-blue-400 uppercase tracking-wider block text-[10px]">
                Engagement Question:
              </span>
              <p className="text-xs text-blue-100 font-semibold italic">
                "{engagementQuestion}"
              </p>
            </div>

            {/* Key Takeaways */}
            {facebookPost.keyTakeaways && facebookPost.keyTakeaways.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Key Takeaways:
                </span>
                <ul className="space-y-2">
                  {facebookPost.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="bg-[#0c1017] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </AccordionSection>
    </div>
  );
});

/* Sub-Component 3: Analyze Results Section */
const AnalyzeResultsSection: React.FC<{
  data: AnalyzeResult;
  copiedId: string | null;
  onCopy: (text: string, label: string) => void;
}> = React.memo(({ data }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleSection = useCallback((idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/50 bg-indigo-950/40';
    if (score >= 55) return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/50 bg-rose-950/40';
  };

  return (
    <div className="space-y-4">
      {/* Section 0: Score Overview */}
      <AccordionSection
        title="Overall AI Virality Score & Hook Rating"
        subtitle={`Audit results for "${data.input.title || 'Draft Script'}"`}
        icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
        badge={`${data.engagementScore}/100 Virality`}
        isOpen={openIndex === 0}
        onToggle={() => toggleSection(0)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
          <div className="text-center md:text-left space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Target Script Title
            </span>
            <h4 className="text-lg font-bold text-white break-words">
              "{data.input.title || 'Draft Script Audit'}"
            </h4>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(data.engagementScore)} shadow-md`}>
              <span className="text-2xl font-black">{data.engagementScore}</span>
              <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">/ 100 Score</span>
            </div>
          </div>

          <div className="space-y-2 bg-[#0c1017] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Hook Strength:</span>
              <span className="px-2.5 py-0.5 text-xs font-bold text-cyan-300 bg-cyan-950 rounded border border-cyan-800/50">
                {data.hookAnalysis.rating}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed break-words">
              <strong>Retention potential:</strong> {data.hookAnalysis.retentionPotential}
            </p>
          </div>
        </div>
      </AccordionSection>

      {/* Section 1: Hook Curiosity Mechanics */}
      <AccordionSection
        title="Hook Curiosity Mechanics"
        subtitle="Psychological curiosity triggers and viewer retention"
        icon={<TrendingUp className="w-4 h-4 text-cyan-400" />}
        isOpen={openIndex === 1}
        onToggle={() => toggleSection(1)}
      >
        <p className="text-xs text-slate-200 bg-[#0c1017] p-4 rounded-xl border border-slate-800 leading-relaxed pt-2 break-words">
          {data.hookAnalysis.curiosityFactor}
        </p>
      </AccordionSection>

      {/* Section 2: Strengths & Weaknesses */}
      <AccordionSection
        title="Strengths & Drop-off Risks"
        subtitle="What works well vs elements causing viewer loss"
        icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}
        isOpen={openIndex === 2}
        onToggle={() => toggleSection(2)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Strengths */}
          <div className="bg-[#0c1017] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Strengths</h4>
            </div>
            <ul className="space-y-2.5">
              {data.strengths.map((str, idx) => (
                <li key={idx} className="bg-[#121824] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span className="break-words">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-[#0c1017] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Drop-off Risks & Weaknesses</h4>
            </div>
            <ul className="space-y-2.5">
              {data.weaknesses.map((weak, idx) => (
                <li key={idx} className="bg-[#121824] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span className="break-words">{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AccordionSection>

      {/* Section 3: Actionable Improvement Suggestions */}
      <AccordionSection
        title="Actionable Improvement Suggestions"
        subtitle="Specific tweaks to boost retention & virality"
        icon={<Sparkles className="w-4 h-4 text-purple-400" />}
        isOpen={openIndex === 3}
        onToggle={() => toggleSection(3)}
      >
        <div className="space-y-3 pt-2">
          {data.suggestions.map((sug, idx) => (
            <div key={idx} className="bg-[#0c1017] p-4 rounded-xl border border-slate-800 text-xs text-indigo-200 flex items-start gap-3">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-950 text-indigo-300 rounded border border-indigo-800 font-mono shrink-0">
                Action {idx + 1}
              </span>
              <p className="leading-relaxed break-words">{sug}</p>
            </div>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
});


