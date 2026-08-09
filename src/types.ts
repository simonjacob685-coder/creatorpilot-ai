export type PageView = 'landing' | 'dashboard' | 'campaign' | 'repurpose' | 'analyze' | 'results';

export interface CampaignInput {
  topic: string;
  audience: string;
  platform: string;
  style: string;
}

export interface ThumbnailConcept {
  title: string;
  visualDescription: string;
  textOverlay: string;
}

export interface VideoOutlineItem {
  timestamp: string;
  section: string;
  keyPoints: string[];
}

export interface ScriptSection {
  phase: string;
  timing: string;
  scriptText: string;
  creatorTips: string;
}

export interface IndividualScore {
  score: number;
  explanation: string;
  suggestion: string;
}

export interface CreatorIntelligenceScore {
  overallScore: number;
  hookStrength: IndividualScore;
  clickPotential: IndividualScore;
  seoOptimization: IndividualScore;
  audienceMatch: IndividualScore;
  engagementPotential: IndividualScore;
  retentionPotential: IndividualScore;
  recommendations: string[];
}

export interface CampaignResult {
  id: string;
  timestamp: number;
  input: CampaignInput;
  contentStrategy: string;
  titles: string[];
  hooks: string[];
  videoOutline: VideoOutlineItem[];
  scriptStructure: ScriptSection[];
  description: string;
  hashtags: string[];
  thumbnailConcepts: ThumbnailConcept[];
  intelligenceScore?: CreatorIntelligenceScore;
  improvedData?: CampaignResult;
  youtubeFormat?: RepurposeResult['youtubeFormat'];
  shortFormFormat?: RepurposeResult['shortFormFormat'];
  instagramCaption?: RepurposeResult['instagramCaption'];
  xThread?: RepurposeResult['xThread'];
  facebookPost?: RepurposeResult['facebookPost'];
}

export interface RepurposeInput {
  rawIdea: string;
  tone: string;
}

export interface RepurposeResult {
  id: string;
  timestamp: number;
  input: RepurposeInput;
  youtubeFormat: {
    videoTitle?: string;
    titleIdeas?: string[];
    hook?: string;
    description: string;
    outline: string[];
    seoKeywords?: string[];
    pinnedComment?: string;
  };
  shortFormFormat: {
    hook: string;
    script30Sec: string;
    caption?: string;
    hashtags?: string[];
    visualCues?: string[];
    audioStyle?: string;
  };
  instagramCaption: {
    headline?: string;
    reelCaption?: string;
    captionText: string;
    carouselPostIdea?: string;
    carouselOutline: string[];
    hashtags: string[];
  };
  xThread: {
    openingTweet?: string;
    hookTweet: string;
    tweets: string[];
    keyPoints?: string[];
    callToActionTweet?: string;
  };
  facebookPost: {
    headline?: string;
    communityPost?: string;
    postText: string;
    keyTakeaways?: string[];
    engagementQuestion?: string;
    callToAction: string;
    hashtags?: string[];
  };
  intelligenceScore?: CreatorIntelligenceScore;
  improvedData?: RepurposeResult;
}

export interface AnalyzeInput {
  title: string;
  script: string;
}

export interface AnalyzeResult {
  id: string;
  timestamp: number;
  input: AnalyzeInput;
  engagementScore: number;
  hookAnalysis: {
    rating: 'Weak' | 'Moderate' | 'Strong' | 'Viral';
    retentionPotential: string;
    curiosityFactor: string;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export type ActiveResult = 
  | { type: 'campaign'; data: CampaignResult }
  | { type: 'repurpose'; data: RepurposeResult }
  | { type: 'analyze'; data: AnalyzeResult };

export interface TrendingTopicItem {
  topic: string;
  category: string;
  whyTrending: string;
  contentAngle: string;
  searchQueries: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TrendingTopicsResult {
  topics: TrendingTopicItem[];
  searchTimestamp?: string;
  groundingSources?: GroundingSource[];
}
