import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, Image as ImageIcon, Download, Check, RefreshCw, Layers, Shield, Zap } from 'lucide-react';

import techLogoImg from '../assets/images/creator_tech_logo_1786103562185.jpg';
import gamingLogoImg from '../assets/images/creator_gaming_logo_1786103574233.jpg';
import lifestyleLogoImg from '../assets/images/creator_lifestyle_logo_1786103585516.jpg';

interface BrandLogoGeneratorProps {
  onLogoSelected?: (logoUrl: string, brandName: string, niche: string) => void;
}

export interface CreatorBrandProfile {
  brandName: string;
  niche: string;
  logoUrl: string;
  colorHex: string;
  tagline: string;
}

const PRESET_LOGOS: Record<string, { image: string; defaultColor: string; description: string }> = {
  'Tech & AI': {
    image: techLogoImg,
    defaultColor: '#6366f1',
    description: 'Glowing geometric emblem with futuristic dark metallic elements',
  },
  'Gaming & Esports': {
    image: gamingLogoImg,
    defaultColor: '#ec4899',
    description: 'Vibrant cyber crest with high-contrast neon highlights',
  },
  'Lifestyle & Vlogs': {
    image: lifestyleLogoImg,
    defaultColor: '#10b981',
    description: 'Elegant luxury line-art badge on a sleek charcoal canvas',
  },
  'Fitness & Wellness': {
    image: techLogoImg, // High-res fallback asset
    defaultColor: '#f59e0b',
    description: 'Dynamic power emblem with crisp energetic accents',
  },
  'Finance & Crypto': {
    image: gamingLogoImg,
    defaultColor: '#3b82f6',
    description: 'Sleek financial shield badge with premium metallic contrast',
  },
};

export const BrandLogoGenerator: React.FC<BrandLogoGeneratorProps> = ({ onLogoSelected }) => {
  const [brandName, setBrandName] = useState<string>('Nexus Creator');
  const [niche, setNiche] = useState<string>('Tech & AI');
  const [selectedStyle, setSelectedStyle] = useState<string>('Futuristic Cyber');
  const [selectedColor, setSelectedColor] = useState<string>('#6366f1');
  const [tagline, setTagline] = useState<string>('Building the Future of Content');
  const [activeLogoUrl, setActiveLogoUrl] = useState<string>(techLogoImg);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('creator_brand_profile');
    if (saved) {
      try {
        const parsed: CreatorBrandProfile = JSON.parse(saved);
        if (parsed.brandName) setBrandName(parsed.brandName);
        if (parsed.niche) setNiche(parsed.niche);
        if (parsed.logoUrl) setActiveLogoUrl(parsed.logoUrl);
        if (parsed.colorHex) setSelectedColor(parsed.colorHex);
        if (parsed.tagline) setTagline(parsed.tagline);
      } catch (_e) {
        // ignore JSON errors
      }
    }
  }, []);

  const handleNicheChange = (newNiche: string) => {
    setNiche(newNiche);
    const preset = PRESET_LOGOS[newNiche];
    if (preset) {
      setActiveLogoUrl(preset.image);
      setSelectedColor(preset.defaultColor);
    }
  };

  const handleGenerateLogo = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const preset = PRESET_LOGOS[niche] || PRESET_LOGOS['Tech & AI'];
      setActiveLogoUrl(preset.image);
      setIsGenerating(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);

      const profile: CreatorBrandProfile = {
        brandName,
        niche,
        logoUrl: preset.image,
        colorHex: selectedColor,
        tagline,
      };
      localStorage.setItem('creator_brand_profile', JSON.stringify(profile));
      if (onLogoSelected) {
        onLogoSelected(preset.image, brandName, niche);
      }
    }, 600);
  };

  const handleSaveProfile = () => {
    const profile: CreatorBrandProfile = {
      brandName,
      niche,
      logoUrl: activeLogoUrl,
      colorHex: selectedColor,
      tagline,
    };
    localStorage.setItem('creator_brand_profile', JSON.stringify(profile));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    if (onLogoSelected) {
      onLogoSelected(activeLogoUrl, brandName, niche);
    }
  };

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Creator Brand Logo Generator
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Generate and customize a unique brand logo badge matching your creator niche input.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Brand Profile Saved!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Controls + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Brand Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Creator / Channel Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Nexus Tech, Cyber Creator"
              className="w-full bg-[#0d121d] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Niche Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Select Creator Niche
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Tech & AI', icon: Zap },
                { name: 'Gaming & Esports', icon: Shield },
                { name: 'Lifestyle & Vlogs', icon: ImageIcon },
                { name: 'Fitness & Wellness', icon: Layers },
                { name: 'Finance & Crypto', icon: Palette },
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = niche === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleNicheChange(item.name)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-[#0d121d] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Visual Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-[#0d121d] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Futuristic Cyber">Futuristic Cyber Vector</option>
                <option value="Minimalist Luxury">Minimalist Luxury Emblem</option>
                <option value="Modern Tech Badge">Modern Tech Shield</option>
                <option value="Flat Neon Art">Flat Neon Icon</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Accent Theme
              </label>
              <div className="flex items-center gap-2.5 pt-1">
                {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'].map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setSelectedColor(hex)}
                    style={{ backgroundColor: hex }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedColor === hex ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#121824]' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Channel Tagline / Motto
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Short channel tagline"
              className="w-full bg-[#0d121d] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleGenerateLogo}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Logo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Niche Logo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0d121d] hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Set Active Logo</span>
            </button>
          </div>
        </div>

        {/* Right Preview Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0d121d] border border-slate-800 rounded-2xl p-5 space-y-4 text-center flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Generated Brand Identity
          </div>

          {/* Generated Image Preview Container */}
          <div className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl bg-black flex items-center justify-center">
            <img
              src={activeLogoUrl}
              alt={`${brandName} Creator Logo`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                {niche}
              </span>
              <span className="text-sm font-extrabold text-white truncate block">
                {brandName}
              </span>
            </div>
          </div>

          {/* Brand Card Info */}
          <div className="space-y-1 max-w-xs">
            <h3 className="text-base font-bold text-white truncate">{brandName}</h3>
            <p className="text-xs text-indigo-300 font-medium italic">"{tagline}"</p>
            <p className="text-[11px] text-slate-400">{selectedStyle} • {niche}</p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 w-full flex items-center justify-center gap-3">
            <a
              href={activeLogoUrl}
              download={`${brandName.toLowerCase().replace(/\s+/g, '_')}_logo.jpg`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Download className="w-3 h-3 text-indigo-400" />
              <span>Download Logo Asset</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
