import React, { useState, useEffect, useCallback } from 'react';
import { ActiveResult } from '../types';
import { Heart, Sparkles, Trash2, ExternalLink, Star } from 'lucide-react';

interface FavoriteCampaignsProps {
  savedHistory: ActiveResult[];
  onSelectResult: (result: ActiveResult) => void;
  onToast?: (message: string) => void;
}

const FAVORITES_KEY = 'creator_favorite_ids_v1';

export const FavoriteCampaigns: React.FC<FavoriteCampaignsProps> = ({
  savedHistory,
  onSelectResult,
  onToast,
}) => {
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      // Ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteMap));
    } catch (_e) {
      // Ignore
    }
  }, [favoriteMap]);

  const removeFavorite = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setFavoriteMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (onToast) onToast('Removed from favorites');
    },
    [onToast]
  );

  const favoriteItems = savedHistory.filter((item) => favoriteMap[item.data.id]);

  if (favoriteItems.length === 0) {
    return (
      <div
        id="favorite-campaigns-widget"
        className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Favorite Campaigns
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            0 Saved
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          No favorited campaigns yet. Click the <Heart className="w-3 h-3 inline text-rose-400 fill-current mx-0.5" /> heart icon on any output card below to save it to your quick-access favorites list.
        </p>
      </div>
    );
  }

  return (
    <div
      id="favorite-campaigns-widget"
      className="bg-[#121824] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg relative overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Favorite Campaigns &amp; Saved Outputs
          </h3>
        </div>
        <span className="text-[10px] font-extrabold text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2.5 py-0.5 rounded-full">
          {favoriteItems.length} Saved
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {favoriteItems.map((item) => {
          let title = '';
          let badgeColor = '';
          let typeLabel = '';

          if (item.type === 'campaign') {
            title = item.data.input?.topic || 'Untitled Campaign';
            badgeColor = 'text-indigo-300 bg-indigo-950/60 border-indigo-800/50';
            typeLabel = 'Campaign Strategy';
          } else if (item.type === 'repurpose') {
            title = item.data.input?.rawIdea || 'Untitled Repurpose';
            badgeColor = 'text-emerald-300 bg-emerald-950/60 border-emerald-800/50';
            typeLabel = 'Multi-Platform';
          } else {
            title = item.data.input?.title || 'Untitled Audit';
            badgeColor = 'text-cyan-300 bg-cyan-950/60 border-cyan-800/50';
            typeLabel = `Audit (${item.data.engagementScore || 0}/100)`;
          }

          return (
            <div
              key={`fav-${item.type}-${item.data.id}`}
              onClick={() => onSelectResult(item)}
              className="bg-[#0a0d14] hover:bg-[#161e2e] border border-slate-800/90 hover:border-rose-500/40 rounded-xl p-3.5 cursor-pointer transition-all space-y-2.5 group relative"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${badgeColor}`}>
                  {typeLabel}
                </span>
                <button
                  type="button"
                  onClick={(e) => removeFavorite(e, item.data.id)}
                  className="p-1 rounded-md text-rose-400 hover:bg-rose-950/40 transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-300 line-clamp-2 transition-colors">
                {title}
              </h4>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                <span>{new Date(item.data.timestamp).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  View <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
