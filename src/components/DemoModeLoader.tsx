import React from 'react';
import { ActiveResult, CampaignResult } from '../types';
import { Sparkles, Play } from 'lucide-react';

interface DemoModeLoaderProps {
  onLoadDemo: (demoResult: ActiveResult) => void;
  className?: string;
}

export const SAMPLE_DEMO_CAMPAIGN: CampaignResult = {
  id: 'demo-campaign-2026',
  timestamp: Date.now(),
  input: {
    topic: 'Build & Scale AI Apps in 2026',
    audience: 'Software Engineers & Tech Entrepreneurs',
    platform: 'YouTube',
    style: 'Actionable & Inspiring',
  },
  contentStrategy: 'Comprehensive multi-platform launch strategy focusing on high-retention coding breakdowns, practical architectures, and real-time AI API demos designed to maximize engagement and watch time.',
  titles: [
    'How I Built an AI App in 24 Hours (Full Architecture Breakdown)',
    'The 2026 AI Developer Stack You Must Learn Before It Is Too Late',
    'Stop Building AI Apps Wrong: 5 Costly Mistakes to Avoid',
    'How to Monetize Gemini APIs in 2026: Step-by-Step Guide',
    'From Zero to AI SaaS: Real World Case Study & Code Walkthrough',
  ],
  hooks: [
    '90% of developers building AI apps are overpaying for infrastructure. Here is how to fix it in 3 steps.',
    'If you are still writing manual prompt wrappers in 2026, you are falling behind. Watch this.',
    'I spent 30 days testing 10 AI frameworks — here is the ONE that actually scales to millions of users.',
    'What if you could ship a production-grade AI agent in less than 30 lines of TypeScript?',
    'This single Gemini API trick saved our application $1,200 per month in LLM tokens.',
  ],
  videoOutline: [
    {
      timestamp: '0:00',
      section: 'High Impact Hook & Case Study Demo',
      keyPoints: ['Hook viewer in 3s', 'Show live working demo', 'Highlight speed metrics'],
    },
    {
      timestamp: '1:15',
      section: 'The Core Problem with Legacy LLM Architecture',
      keyPoints: ['Client-side key risks', 'Unpredictable latency', 'Token waste'],
    },
    {
      timestamp: '3:40',
      section: '2026 Modern Stack (Vite + Express + Gemini API)',
      keyPoints: ['Server-side proxying', 'Structured JSON schemas', 'Local caching'],
    },
    {
      timestamp: '7:20',
      section: 'Step-by-Step Code Walkthrough & Live Test',
      keyPoints: ['TypeScript setup', 'Error handling guardrails', 'Streaming UI'],
    },
    {
      timestamp: '11:00',
      section: 'Deployment Blueprint & Cost Optimization',
      keyPoints: ['Cloud Run deployment', 'Cost per 1k requests', 'Free tier limits'],
    },
  ],
  scriptStructure: [
    {
      phase: 'Hook & Problem Statement',
      timing: '0:00 - 1:15',
      scriptText: 'Welcome back, creators. Today we are breaking down the exact blueprint top software engineers use to build and scale production AI applications in 2026.',
      creatorTips: 'Use high-contrast visual code snippet overlays in the first 5 seconds to retention anchor viewers.',
    },
    {
      phase: 'Value Delivery & Architecture',
      timing: '1:15 - 7:20',
      scriptText: 'Let us inspect the 3 core layers: server-side API proxying, streaming client UI, and state persistence with local caching.',
      creatorTips: 'Highlight key diagram elements with smooth zooms and slow pacing.',
    },
    {
      phase: 'Live Demo & Code Execution',
      timing: '7:20 - 11:00',
      scriptText: 'Watch how quickly this model responds when we utilize structured outputs and streaming responses.',
      creatorTips: 'Show real execution time side-by-side with older benchmarks.',
    },
    {
      phase: 'Summary & Call to Action',
      timing: '11:00 - 14:00',
      scriptText: 'If you want to duplicate this exact workflow, grab the free code template linked in the description below and subscribe for weekly AI architecture breakdowns.',
      creatorTips: 'Keep the pinned comment link visible on screen during the final call to action.',
    },
  ],
  description: 'Learn how to build and scale production-ready AI applications in 2026. Includes full stack architecture breakdowns, cost optimization tips, and Gemini API setup.\n\nChapters:\n0:00 - Intro\n1:15 - Core Architecture\n7:20 - Live Code Walkthrough\n11:00 - Deployment\n\n#AICoding #WebDev #GeminiAPI #SoftwareEngineering',
  hashtags: ['#AICoding', '#WebDev', '#GeminiAPI', '#SoftwareEngineering', '#FullStack'],
  thumbnailConcepts: [
    {
      title: 'Split Screen Architecture Vs Code',
      textOverlay: 'BUILD AI IN 2026',
      visualDescription: 'Vibrant glowing split screen with developer terminal on left and high-tech architecture node diagram on right.',
    },
    {
      title: 'Shocking Benchmarks Chart',
      textOverlay: '10X FASTER AI',
      visualDescription: 'Creator pointing at a steep rising speed chart with glowing green metrics and dark clean backdrop.',
    },
  ],
  intelligenceScore: {
    overallScore: 94,
    hookStrength: { score: 96, explanation: 'High curiosity hook addressing developer pain points directly.', suggestion: 'Keep opening statement under 10 seconds.' },
    clickPotential: { score: 92, explanation: 'Strong headline framing with specific numbers and years.', suggestion: 'Use bold yellow contrast text for thumbnail overlay.' },
    seoOptimization: { score: 95, explanation: 'Rich developer keyphrases placed in title and top description.', suggestion: 'Add exact timestamps to pinned comment.' },
    audienceMatch: { score: 95, explanation: 'Directly tailored for software engineers and tech founders.', suggestion: 'Include GitHub code repository link.' },
    engagementPotential: { score: 91, explanation: 'Built-in comment triggers asking viewers for their current stack.', suggestion: 'Pin discussion question about LLM framework preference.' },
    retentionPotential: { score: 93, explanation: 'Clear progression with no visual lull longer than 15 seconds.', suggestion: 'Insert sound effect on chapter transition cards.' },
    recommendations: [
      'Keep title concise for mobile display.',
      'Highlight speed benchmarks in thumbnail visual.',
      'Pin discussion prompt in comment section.',
    ],
  },
  youtubeFormat: {
    videoTitle: 'How to Build & Scale AI Apps in 2026 (Full Stack Tutorial)',
    description: 'Learn how to build and scale production AI applications in 2026 with full stack code examples.',
    pinnedComment: 'Which AI framework are you using for your projects in 2026? Drop your stack below!',
    outline: [
      'High Impact Hook & Problem Framing',
      'The 2026 Modern AI Stack (Vite, Express, Gemini API)',
      'Server-Side Proxy Security & Key Protection',
      'Live Code Test & Optimization Secrets',
      'Summary & Downloadable Resource CTA',
    ],
  },
  shortFormFormat: {
    hook: 'Stop building AI apps wrong in 2026! Here is what top engineers do instead.',
    script30Sec: 'If you want to ship a viral AI app, stop making client-side API calls. Proxy requests through a Node server, use structured JSON schema, and stream your responses. Here is the code snippet.',
  },
  instagramCaption: {
    headline: 'The 2026 AI Developer Blueprint 🚀',
    captionText: 'Building AI apps in 2026 is all about speed and security. Swipe through to see the 5 golden rules of modern AI architecture.',
    carouselOutline: [
      'Slide 1: Cover Title - 5 AI Architecture Golden Rules',
      'Slide 2: Rule 1 - Server Side Proxy Key Protection',
      'Slide 3: Rule 2 - Structured JSON Outputs',
      'Slide 4: Rule 3 - Local Caching & Rate Limiting',
      'Slide 5: Save & Share CTA',
    ],
    hashtags: ['#AICoding', '#DeveloperTips', '#WebDevelopment'],
  },
  xThread: {
    hookTweet: 'How to build production-grade AI apps in 2026 without spending thousands on infrastructure 🧵👇',
    tweets: [
      '1/ Keep your API keys hidden server-side. Never expose keys in client bundles.',
      '2/ Use structured output schemas for 100% predictable JSON responses from LLMs.',
      '3/ Implement client-side caching to prevent duplicate API requests.',
    ],
    callToActionTweet: 'Enjoyed this breakdown? Retweet the first tweet and follow for weekly dev strategies!',
  },
  facebookPost: {
    headline: 'How Top Software Engineers Build AI Applications in 2026',
    postText: 'Are you building AI apps this year? Here is the complete engineering architecture guide for creators and developers.',
    keyTakeaways: [
      'Hide API keys in backend environment variables',
      'Leverage streaming responses for instant UX',
      'Optimize prompts for lower token latency',
    ],
    callToAction: 'Read the full guide and grab the code template now!',
    hashtags: ['#TechNews', '#SoftwareDeveloper', '#AICreators'],
  },
};

export const DemoModeLoader: React.FC<DemoModeLoaderProps> = ({ onLoadDemo, className }) => {
  return (
    <button
      type="button"
      onClick={() => {
        onLoadDemo({ type: 'campaign', data: SAMPLE_DEMO_CAMPAIGN });
      }}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all shadow-sm group ${className || ''}`}
      id="load-demo-mode-btn"
      title="Instantly load sample AI strategy output for review"
    >
      <Play className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform fill-amber-400/20" />
      <span>⚡ Load Demo Sample Strategy</span>
    </button>
  );
};
