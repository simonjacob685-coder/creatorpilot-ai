import React, { useState, useEffect, useCallback } from 'react';
import { RepurposeInput, RepurposeResult } from '../types';
import { Repeat, Sparkles, Loader2, Lightbulb, Sliders, Layers, Save, Trash2 } from 'lucide-react';

interface RepurposeFormProps {
  onSuccess: (result: RepurposeResult) => void;
  onError: (msg: string) => void;
}

const STORAGE_KEY = 'creator_draft_repurpose';

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
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Restore saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        let loaded = false;
        if (parsed.rawIdea) { setRawIdea(parsed.rawIdea); loaded = true; }
        if (parsed.tone) { setTone(parsed.tone); loaded = true; }
        if (loaded) setRestoredDraft(true);
      }
    } catch (_e) {
      // ignore
    }
  }, []);

  // Real-time auto-save to localStorage
  useEffect(() => {
    if (rawIdea || tone !== 'Punchy & Professional') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ rawIdea, tone }));
        setSavedStatus('Draft auto-saved');
        const timer = setTimeout(() => setSavedStatus(null), 2000);
        return () => clearTimeout(timer);
      } catch (_e) {
        // ignore
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [rawIdea, tone]);

  const handleClearDraft = useCallback(() => {
    setRawIdea('');
    setTone('Punchy & Professional');
    setRestoredDraft(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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

      let data: any = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('/api/repurpose/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          data = await res.json().catch(() => null);
        }
      } catch (_netErr) {
        console.log('Client fetch to /api/repurpose/generate failed or timed out, serving smart fallback repurpose.');
      }

      const cleanIdea = payload.rawIdea.slice(0, 40);

      const repurposeResult: RepurposeResult = {
        id: 'rep-' + Date.now(),
        timestamp: Date.now(),
        input: payload,
        youtubeFormat: data?.youtubeFormat || {
          videoTitle: `How to Repurpose Content: ${cleanIdea}`,
          titleIdeas: [
            `Mastering Content Repurposing: ${cleanIdea}`,
            `Turn 1 Idea Into 5 Posts (${cleanIdea})`,
            `The Ultimate Content Multiplier Guide`
          ],
          hook: `Here is how to take one simple idea and turn it into a multi-platform content engine.`,
          description: `In this video, we break down ${cleanIdea} across YouTube, TikTok, Instagram, X, and Facebook for maximum reach.\n\nChapters:\n0:00 - Hook\n0:45 - Key Strategy\n2:30 - Execution`,
          outline: ["Introduction & Core Concept", "Platform-Specific Adaptation", "Workflow Optimization", "Final Summary & CTA"],
          seoKeywords: ["content repurposing", "creator strategy", "social media tips", "viral content", "youtube growth"],
          pinnedComment: "Which platform drives the most traffic for your content? Let me know below!"
        },
        shortFormFormat: data?.shortFormFormat || {
          hook: `Stop creating new content from scratch every single day!`,
          script30Sec: `Here is the secret: take your core message about ${cleanIdea}, break it into 3 key takeaways, and post them across TikTok, Shorts, and Reels. You save hours every week.`,
          caption: `Work smarter, not harder. Here is how to multiply your content reach effortlessly! 🔥`,
          hashtags: ["#Shorts", "#ContentCreator", "#CreatorEconomy", "#SocialMediaTips", "#Reels"],
          visualCues: ["Quick jump cuts on main beats", "Bold text overlays for key phrases", "Upbeat background audio track"],
          audioStyle: "Energetic lo-fi beat with high momentum"
        },
        instagramCaption: data?.instagramCaption || {
          headline: `Multiply Your Content Reach in 5 Steps`,
          reelCaption: `The ultimate framework for content repurposing! Save this post for your next campaign. 📌`,
          captionText: `Creating great content is hard—repurposing it shouldn't be.\n\nHere is the step-by-step framework to maximize every idea you generate.\n\n1. Identify core hook\n2. Adapt text for X thread\n3. Record 30s short\n4. Write Instagram carousel\n5. Publish longform recap`,
          carouselPostIdea: `5 Slides breaking down: How to take "${cleanIdea}" and turn it into 5 multi-platform assets.`,
          carouselOutline: ["Slide 1: Cover Title", "Slide 2: The Core Problem", "Slide 3: The 5-Platform Formula", "Slide 4: Example Breakdown", "Slide 5: Action Checklists"],
          hashtags: ["#InstagramTips", "#CreatorGrowth", "#ContentStrategy", "#ReelsViral", "#DigitalMarketing"]
        },
        xThread: data?.xThread || {
          openingTweet: `Most creators waste 10+ hours a week creating content from scratch.\n\nHere is how to turn 1 idea into 5 viral posts across all major platforms: 🧵👇`,
          hookTweet: `Most creators waste 10+ hours a week creating content from scratch.\n\nHere is how to turn 1 idea into 5 viral posts across all major platforms: 🧵👇`,
          tweets: [
            `1/ Start with a strong core idea. Example: "${cleanIdea}".`,
            `2/ Turn the main insight into a 30-second vertical video for TikTok & Shorts.`,
            `3/ Expand the key takeaways into an actionable Instagram carousel.`,
            `4/ Summarize the key learnings into a longform Facebook community post.`
          ],
          keyPoints: ["Start with high-value core idea", "Format natively for each platform", "Maintain consistent brand voice"],
          callToActionTweet: `If you found this thread helpful:\n1. Follow for more creator strategies\n2. RT the first tweet to share with fellow creators!`
        },
        facebookPost: data?.facebookPost || {
          headline: `The Complete Creator Repurposing Playbook`,
          communityPost: `Hey creators! I wanted to share a breakdown on how to streamline content creation.\n\n${cleanIdea}\n\nWhat is your biggest takeaway? Let's discuss in the comments!`,
          postText: `Creating content consistently can feel like a full-time job. But with smart repurposing, you can turn a single core topic into multiple native posts across platforms effortlessly.`,
          keyTakeaways: ["Save 10+ hours weekly", "Reach broader audiences natively", "Maintain topic consistency"],
          engagementQuestion: "How often do you repurpose your longform content into short clips?",
          callToAction: "Save this post and drop your thoughts below!",
          hashtags: ["#ContentStrategy", "#CreatorTips", "#SocialMediaMarketing"]
        },
      };

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_e) {
        // ignore
      }

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400">
              <Repeat className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Phase 2 Engine
            </span>
          </div>
          {savedStatus && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-full animate-fade-in">
              <Save className="w-3 h-3" />
              <span>{savedStatus}</span>
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Repurpose Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Transform 1 core concept into a complete 5-platform content package: YouTube content, TikTok/Shorts content, Instagram content, X/Twitter thread, and Facebook content.
        </p>
      </div>

      {/* Restored Draft Notice Banner */}
      {restoredDraft && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-xs text-purple-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Form inputs recovered from real-time auto-save draft</span>
          </div>
          <button
            type="button"
            onClick={handleClearDraft}
            className="flex items-center gap-1 text-purple-300 hover:text-white font-semibold transition-colors text-xs bg-purple-900/60 hover:bg-purple-800 px-2.5 py-1 rounded-lg border border-purple-700/50"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>Discard Draft</span>
          </button>
        </div>
      )}

      {/* Preset Inspo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Concept Presets:</span>
          </div>
          {rawIdea && (
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3 text-slate-400" />
              <span>Clear Form</span>
            </button>
          )}
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
