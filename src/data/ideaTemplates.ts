export interface IdeaTemplate {
  id: string;
  category: 'AI & Technology' | 'Personal Brand' | 'Finance' | 'Fitness' | 'Education' | 'Gaming';
  title: string;
  description: string;
  contentType: 'YouTube Video' | 'Short / Reel' | 'X Thread' | 'LinkedIn Post';
  suggestedHook: string;
}

export const IDEA_TEMPLATES: IdeaTemplate[] = [
  // AI & Technology
  {
    id: 'ai-1',
    category: 'AI & Technology',
    title: '10 AI Tools That Save Developers 10 Hours Every Week',
    description: 'A practical breakdown of underrated AI developer tools, APIs, and CLI extensions for 2026.',
    contentType: 'YouTube Video',
    suggestedHook: 'Most developers are wasting 10+ hours a week on manual boilerplate. Here are 10 AI tools changing that.',
  },
  {
    id: 'ai-2',
    category: 'AI & Technology',
    title: 'How I Built a Full Stack AI App in 2 Hours Using Free APIs',
    description: 'Step-by-step tutorial demonstrating rapid AI application prototyping with Gemini API and React.',
    contentType: 'YouTube Video',
    suggestedHook: 'You don’t need a $10,000 budget or a team of 5 to launch an AI SaaS in 2026.',
  },
  {
    id: 'ai-3',
    category: 'AI & Technology',
    title: '5 AI Coding Prompts Every Engineer Must Master',
    description: 'Bite-sized productivity tips showing high-impact system prompts for code refactoring and bug hunting.',
    contentType: 'Short / Reel',
    suggestedHook: 'Stop typing plain code questions into AI. Use these 5 battle-tested prompts instead.',
  },
  {
    id: 'ai-4',
    category: 'AI & Technology',
    title: 'The AI Engineering Roadmap for 2026: From Beginner to Senior',
    description: 'Comprehensive breakdown of skills needed to master modern LLMs, vector search, and agent architectures.',
    contentType: 'X Thread',
    suggestedHook: 'Want to become an AI engineer in 2026? Here is the exact step-by-step roadmap.',
  },

  // Personal Brand
  {
    id: 'brand-1',
    category: 'Personal Brand',
    title: 'How I Quit My 9-to-5 to Build a $100k Solo Creator Business',
    description: 'Transparent origin story revealing key pivots, mistakes, and strategies that built brand authority.',
    contentType: 'YouTube Video',
    suggestedHook: 'Three years ago, I had zero followers and $0 in online revenue. Here is what actually changed everything.',
  },
  {
    id: 'brand-2',
    category: 'Personal Brand',
    title: '3 Hard Truths I Learned After 1,000 Days of Content Creation',
    description: 'Raw reflection on consistency, audience trust, avoiding burnout, and monetization tactics.',
    contentType: 'LinkedIn Post',
    suggestedHook: '99% of creators fail not because of algorithm shifts, but because of these 3 silent mistakes.',
  },
  {
    id: 'brand-3',
    category: 'Personal Brand',
    title: 'A Behind-the-Scenes Look at My Daily Creator Routine',
    description: 'A day-in-the-life vlog style breakdown showing time blocking, batching, and recording setups.',
    contentType: 'Short / Reel',
    suggestedHook: 'How I manage a full content engine in just 2 hours a day without losing my mind.',
  },

  // Finance
  {
    id: 'fin-1',
    category: 'Finance',
    title: 'How to Build a Passive $1,000/Month Index Fund Portfolio',
    description: 'Actionable financial literacy guide breaking down low-cost ETF investing for beginners.',
    contentType: 'YouTube Video',
    suggestedHook: 'If you leave $10,000 in a standard savings account, inflation is quietly stealing your wealth.',
  },
  {
    id: 'fin-2',
    category: 'Finance',
    title: '5 Money Rules I Wish I Knew Before Turning 25',
    description: 'High-impact personal finance principles covering emergency funds, debt management, and compound growth.',
    contentType: 'Short / Reel',
    suggestedHook: 'If you are under 30, these 5 money habits will set you up for financial freedom.',
  },
  {
    id: 'fin-3',
    category: 'Finance',
    title: 'The Simple 50/30/20 Budget Formula That Actually Works',
    description: 'Easy-to-follow budgeting framework explaining needs, wants, and automated savings goals.',
    contentType: 'LinkedIn Post',
    suggestedHook: 'You don’t need complex spreadsheets to master your money. Use this 3-number system instead.',
  },

  // Fitness
  {
    id: 'fit-1',
    category: 'Fitness',
    title: 'The Ultimate 20-Minute Full Body Home Workout (No Equipment Needed)',
    description: 'High-energy, follow-along workout designed for busy professionals and remote workers.',
    contentType: 'YouTube Video',
    suggestedHook: 'No gym membership? No problem. Do this 20-minute workout 3x a week for real strength gains.',
  },
  {
    id: 'fit-2',
    category: 'Fitness',
    title: '3 Science-Backed Nutrition Hacks to Cut Fat Without Starving',
    description: 'Dietary tips focusing on protein intake, hydration, and sustainable calorie deficits.',
    contentType: 'Short / Reel',
    suggestedHook: 'Stop doing crash diets. Here are 3 science-backed tweaks to lose fat while keeping energy high.',
  },
  {
    id: 'fit-3',
    category: 'Fitness',
    title: 'My 90-Day Physical Transformation: What Worked vs What Failed',
    description: 'Honest case study sharing workout splits, meal prep tactics, and body metric tracking.',
    contentType: 'X Thread',
    suggestedHook: 'In 90 days I dropped 15 lbs of fat while gaining muscle. Here is the exact daily routine I followed.',
  },

  // Education
  {
    id: 'edu-1',
    category: 'Education',
    title: 'How Quantum Computing Works (Explained Simply in 10 Minutes)',
    description: 'Visual explainer breaking down complex physics concepts into clear, everyday analogies.',
    contentType: 'YouTube Video',
    suggestedHook: 'Imagine a computer that can solve a 10,000-year problem in 3 minutes. Here is how quantum bits work.',
  },
  {
    id: 'edu-2',
    category: 'Education',
    title: 'The Feynman Technique: How to Learn Anything 10x Faster',
    description: 'Study and memory method breakdown for students, researchers, and lifelong learners.',
    contentType: 'Short / Reel',
    suggestedHook: 'If you cannot explain a topic to a 5-year-old, you don’t truly understand it yet.',
  },

  // Gaming
  {
    id: 'game-1',
    category: 'Gaming',
    title: '10 Hidden Easter Eggs & Secrets in the Year’s Biggest RPG',
    description: 'Engaging review and discovery breakdown of secret mechanics and hidden lore in top gaming titles.',
    contentType: 'YouTube Video',
    suggestedHook: 'You probably missed these 10 insane hidden details during your first play-through.',
  },
  {
    id: 'game-2',
    category: 'Gaming',
    title: '5 Pro Settings That Will Instantly Boost Your Aim in FPS Games',
    description: 'Technical setup guide covering sensitivity, FOV, crosshair settings, and refresh rate optimization.',
    contentType: 'Short / Reel',
    suggestedHook: 'If your aim feels off in competitive games, turn OFF this single default setting immediately.',
  },
];
