import { useState, useEffect, useCallback, useRef } from 'react';
import { PageView, ActiveResult, CampaignResult, RepurposeResult, AnalyzeResult, IdeasResult } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { IdeaGeneratorForm } from './components/IdeaGeneratorForm';
import { CampaignForm } from './components/CampaignForm';
import { RepurposeForm } from './components/RepurposeForm';
import { AnalyzeForm } from './components/AnalyzeForm';
import { ResultsView } from './components/ResultsView';
import { Toast } from './components/Toast';
import { getSavedHistory, saveResultToHistory, clearHistory } from './utils/storage';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('landing');
  const [activeResult, setActiveResult] = useState<ActiveResult | null>(null);
  const [savedHistory, setSavedHistory] = useState<ActiveResult[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [prefilledCampaignTopic, setPrefilledCampaignTopic] = useState<string>('');
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState<boolean>(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSavedHistory(getSavedHistory());
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 3500);
  }, []);

  const showError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 6000);
  }, []);

  const handleIdeasSuccess = useCallback((result: IdeasResult) => {
    const wrapped: ActiveResult = { type: 'ideas', data: result };
    const updated = saveResultToHistory(wrapped);
    setSavedHistory(updated);
    setActiveResult(wrapped);
    showToast('💡 10 Content ideas generated successfully!');
  }, [showToast]);

  const handleSelectCampaignTopic = useCallback((topic: string) => {
    const safeTopic = topic || '';
    setPrefilledCampaignTopic(safeTopic);
    setActivePage('campaign');
    showToast(`Transferred topic: "${safeTopic.slice(0, 30)}..." to Campaign Generator!`);
  }, [showToast]);

  const handleCampaignSuccess = useCallback((result: CampaignResult) => {
    const wrapped: ActiveResult = { type: 'campaign', data: result };
    const updated = saveResultToHistory(wrapped);
    setSavedHistory(updated);
    setActiveResult(wrapped);
    setActivePage('results');
    showToast('✨ Campaign strategy generated successfully!');
  }, [showToast]);

  const handleGenerateCampaignFromIdea = useCallback(async (ideaTitle: string, ideaDetails?: string) => {
    setIsGeneratingCampaign(true);
    const safeTitle = ideaTitle || 'Idea';
    showToast(`🚀 Generating full campaign for: "${safeTitle.slice(0, 25)}..."`);
    try {
      const topicText = ideaDetails ? `${ideaTitle} - ${ideaDetails}` : ideaTitle;
      const payload = {
        topic: topicText,
        audience: 'Creators & Viewers',
        platform: 'YouTube',
        style: 'Engaging & Actionable',
      };

      const [campaignRes, repurposeRes] = await Promise.all([
        fetch('/api/campaign/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(r => r.ok ? r.json() : null),
        fetch('/api/repurpose/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawIdea: topicText, tone: payload.style }),
        }).then(r => r.ok ? r.json() : null),
      ]);

      if (!campaignRes && !repurposeRes) {
        throw new Error('Failed to generate campaign strategy.');
      }

      const data = campaignRes || {};
      const repurposeData = repurposeRes || {};

      const campaignResult: CampaignResult = {
        id: 'camp-' + Date.now(),
        timestamp: Date.now(),
        input: payload,
        contentStrategy: data.contentStrategy || `Multi-platform campaign strategy for: ${ideaTitle}`,
        titles: data.titles || repurposeData.youtubeFormat?.titleIdeas || [ideaTitle],
        hooks: data.hooks || [repurposeData.youtubeFormat?.hook || ''],
        videoOutline: data.videoOutline || [],
        scriptStructure: data.scriptStructure || [],
        description: data.description || repurposeData.youtubeFormat?.description || '',
        hashtags: data.hashtags || repurposeData.instagramCaption?.hashtags || [],
        thumbnailConcepts: data.thumbnailConcepts || [],
        intelligenceScore: data.intelligenceScore || repurposeData.intelligenceScore,
        youtubeFormat: repurposeData.youtubeFormat,
        shortFormFormat: repurposeData.shortFormFormat,
        instagramCaption: repurposeData.instagramCaption,
        xThread: repurposeData.xThread,
        facebookPost: repurposeData.facebookPost,
      };

      handleCampaignSuccess(campaignResult);
    } catch (err: any) {
      showError(err.message || 'Error generating campaign from idea.');
    } finally {
      setIsGeneratingCampaign(false);
    }
  }, [showToast, showError, handleCampaignSuccess]);

  const handleRepurposeSuccess = useCallback((result: RepurposeResult) => {
    const wrapped: ActiveResult = { type: 'repurpose', data: result };
    const updated = saveResultToHistory(wrapped);
    setSavedHistory(updated);
    setActiveResult(wrapped);
    setActivePage('results');
    showToast('✨ Content repurposed into 4 platform formats!');
  }, [showToast]);

  const handleAnalyzeSuccess = useCallback((result: AnalyzeResult) => {
    const wrapped: ActiveResult = { type: 'analyze', data: result };
    const updated = saveResultToHistory(wrapped);
    setSavedHistory(updated);
    setActiveResult(wrapped);
    setActivePage('results');
    showToast('✨ Content engagement analysis ready!');
  }, [showToast]);

  const handleSelectHistoryResult = useCallback((result: ActiveResult) => {
    setActiveResult(result);
    setActivePage('results');
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setSavedHistory([]);
    showToast('History cleared.');
  }, [showToast]);

  const handleNavigate = useCallback((page: PageView) => {
    setActivePage(page);
  }, []);

  const handleCloseToast = useCallback(() => {
    setToastMsg(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        hasActiveResult={!!activeResult}
      />

      {/* Global Error Banner if any */}
      {errorMsg && (
        <div className="max-w-4xl mx-auto my-4 px-4 w-full">
          <div className="bg-rose-950/80 border border-rose-600/60 rounded-xl p-4 flex items-center justify-between text-rose-200 text-xs shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activePage === 'landing' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            savedHistory={savedHistory}
            onSelectResult={handleSelectHistoryResult}
            onClearHistory={handleClearHistory}
          />
        )}

        {activePage === 'ideas' && (
          <IdeaGeneratorForm
            onSuccess={handleIdeasSuccess}
            onError={showError}
            onSelectCampaignTopic={handleSelectCampaignTopic}
            onGenerateCampaignFromIdea={handleGenerateCampaignFromIdea}
            isGeneratingCampaign={isGeneratingCampaign}
          />
        )}

        {activePage === 'campaign' && (
          <CampaignForm
            onSuccess={handleCampaignSuccess}
            onError={showError}
            initialTopic={prefilledCampaignTopic}
          />
        )}

        {activePage === 'repurpose' && (
          <RepurposeForm
            onSuccess={handleRepurposeSuccess}
            onError={showError}
          />
        )}

        {activePage === 'analyze' && (
          <AnalyzeForm
            onSuccess={handleAnalyzeSuccess}
            onError={showError}
          />
        )}

        {activePage === 'results' && activeResult && (
          <ResultsView
            activeResult={activeResult}
            onNavigate={handleNavigate}
            onToast={showToast}
            onGenerateCampaignFromIdea={handleGenerateCampaignFromIdea}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-16 py-8 bg-[#080b11] text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CreatorPilot AI</span>
            <span>— Move from idea to multi-platform virality</span>
          </div>
          <div className="text-slate-600">
            Powered by Gemini 3.6 Flash • React • Express
          </div>
        </div>
      </footer>

      {/* Toast */}
      <Toast message={toastMsg} onClose={handleCloseToast} />
    </div>
  );
}
