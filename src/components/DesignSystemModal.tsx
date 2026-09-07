import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  Layers, 
  Sparkles, 
  Smartphone, 
  Sliders, 
  Type, 
  Check, 
  Copy, 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  Heart, 
  Info,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Compass
} from 'lucide-react';

interface DesignSystemModalProps {
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'screens' | 'copy'>('tokens');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-zinc-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0071E3] to-[#0A84FF] text-white flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">CoShip iOS Design System</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-200/60 uppercase tracking-wide">
                  v1.0 Ready
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Apple Human Interface & Arc-inspired consumer tokens</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-200/60 text-zinc-400 hover:text-zinc-700 transition-colors"
            title="Close Design System"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-100/70 border-b border-zinc-200/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'tokens', label: '1. Foundations & Tokens', icon: Sliders },
            { id: 'components', label: '2. Component Showcase', icon: Layers },
            { id: 'screens', label: '3. Screen UX Rules', icon: Smartphone },
            { id: 'copy', label: '4. Voice & Tone Guide', icon: MessageCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-xs ring-1 ring-black/5'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0071E3]' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-zinc-800 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: FOUNDATIONS & TOKENS */}
          {activeTab === 'tokens' && (
            <div className="space-y-8">
              {/* Visual Mood Card */}
              <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-zinc-50 border border-blue-100/80 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#0071E3]" />
                  <h3 className="font-bold text-zinc-900 text-sm">Visual Mood & Archetype</h3>
                </div>
                <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed mb-3">
                  CoShip pairs the quiet restraint of <strong>iOS System UI</strong> (system-grouped backgrounds, hairline separators, rounded sheets) with the playful, energetic accents of <strong>Arc Browser</strong> and <strong>Discord</strong>. It feels like an authentic mobile native app, not a web SaaS dashboard.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-200/50 text-[11px]">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-zinc-900 block">Touch Physics</span>
                    <span className="text-zinc-500">active:scale-[0.97] haptic feel</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-zinc-900 block">Corner Squircle</span>
                    <span className="text-zinc-500">20px–24px smooth iOS curves</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-zinc-900 block">Background Depth</span>
                    <span className="text-zinc-500">#F2F2F7 System Grouped canvas</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-zinc-900 block">Zero Pressure</span>
                    <span className="text-zinc-500">Casual wording, no resumes</span>
                  </div>
                </div>
              </div>

              {/* Color Palette (Light & Dark) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Color Palette (Apple iOS Standard + Friendly Accents)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Light Mode */}
                  <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900">Light Mode Palette (Primary)</span>
                      <span className="text-[10px] bg-zinc-200/70 text-zinc-700 px-2 py-0.5 rounded-full font-medium">Default</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#F2F2F7] border border-zinc-300"></span>
                          <span className="font-medium text-zinc-700">App Background (System Grouped)</span>
                        </div>
                        <code className="text-zinc-500 font-mono">#F2F2F7 (bg-[#F2F2F7])</code>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white border border-zinc-200"></span>
                          <span className="font-medium text-zinc-700">Card Surface (System White)</span>
                        </div>
                        <code className="text-zinc-500 font-mono">#FFFFFF (bg-white)</code>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#0071E3]"></span>
                          <span className="font-medium text-zinc-700">iOS Tint / Primary Blue</span>
                        </div>
                        <code className="text-blue-600 font-mono font-bold">#0071E3 / #0077ED</code>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#34C759]"></span>
                          <span className="font-medium text-zinc-700">Success / Active Pill</span>
                        </div>
                        <code className="text-emerald-600 font-mono">#34C759 (emerald-500)</code>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#FF9500]"></span>
                          <span className="font-medium text-zinc-700">Warning / Low-Commitment</span>
                        </div>
                        <code className="text-amber-600 font-mono">#FF9500 (amber-500)</code>
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div className="bg-[#1C1C1E] text-white rounded-2xl p-4 space-y-2.5 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Dark Mode Palette (iOS Dark)</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-medium">Midnight</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#000000] border border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#000000] border border-zinc-700"></span>
                          <span className="font-medium text-zinc-300">App Background (System Black)</span>
                        </div>
                        <code className="text-zinc-400 font-mono">#000000 (bg-black)</code>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#2C2C2E] border border-zinc-700">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#2C2C2E] border border-zinc-600"></span>
                          <span className="font-medium text-zinc-200">Elevated Card Surface</span>
                        </div>
                        <code className="text-zinc-400 font-mono">#2C2C2E (bg-zinc-800/80)</code>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#1C1C1E] border border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#0A84FF]"></span>
                          <span className="font-medium text-zinc-200">iOS Dark Tint Blue</span>
                        </div>
                        <code className="text-blue-400 font-mono font-bold">#0A84FF</code>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#1C1C1E] border border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#30D158]"></span>
                          <span className="font-medium text-zinc-200">Dark Success Green</span>
                        </div>
                        <code className="text-emerald-400 font-mono">#30D158</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Scale */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Typography Scale (San Francisco / Plus Jakarta Sans)
                </h4>
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 divide-y divide-zinc-100">
                  <div className="py-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-400 font-mono block">Large Title (Screen Hero)</span>
                      <span className="text-2xl font-bold tracking-tight text-zinc-900">Find 1-2 builders</span>
                    </div>
                    <code className="text-xs text-zinc-500 font-mono">text-2xl font-bold tracking-tight (24px)</code>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-400 font-mono block">Title 2 (App Store Card Header)</span>
                      <span className="text-base sm:text-lg font-bold text-zinc-900">Next-gen Canvas for Note-takers</span>
                    </div>
                    <code className="text-xs text-zinc-500 font-mono">text-base sm:text-lg font-bold (18px)</code>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-400 font-mono block">Body Regular (Readability standard)</span>
                      <p className="text-sm text-zinc-600 max-w-sm">
                        Looking for a frontend friend to help wire 2 Tailwind cards over Saturday morning.
                      </p>
                    </div>
                    <code className="text-xs text-zinc-500 font-mono">text-sm text-zinc-600 leading-relaxed (14px)</code>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-400 font-mono block">Footnote & Micro Caption</span>
                      <span className="text-xs text-zinc-500 font-medium">Posted 2 hours ago • Weekend sprint</span>
                    </div>
                    <code className="text-xs text-zinc-500 font-mono">text-xs text-zinc-500 (12px)</code>
                  </div>
                </div>
              </div>

              {/* Radius & Shadow Scales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Border Radius System</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-700 font-medium">Sheets & Modals</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">rounded-t-[32px] or rounded-3xl</code>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-700 font-medium">App Store Project Cards</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">rounded-2xl to rounded-[24px]</code>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-700 font-medium">Buttons & Segmented Nav</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">rounded-full or rounded-xl</code>
                    </li>
                    <li className="flex justify-between items-center py-1">
                      <span className="text-zinc-700 font-medium">Badges & Micro Chips</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">rounded-full</code>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200/80 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">iOS Shadow System</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-700 font-medium">Resting Card</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">shadow-[0_2px_8px_rgba(0,0,0,0.04)]</code>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-700 font-medium">Hover / Lifted State</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">shadow-[0_8px_24px_rgba(0,0,0,0.08)]</code>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-zinc-100">
                      <span className="text-zinc-700 font-medium">Floating Bottom Nav</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">shadow-[0_-4px_20px_rgba(0,0,0,0.05)]</code>
                    </li>
                    <li className="flex justify-between items-center py-1">
                      <span className="text-zinc-700 font-medium">Modal Backdrop Blur</span>
                      <code className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">backdrop-blur-md bg-black/40</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENT SHOWCASE */}
          {activeTab === 'components' && (
            <div className="space-y-6">
              <p className="text-xs text-zinc-500">
                Live interactive specimens rendered with copyable Tailwind classes. Test hover, focus, and touch feedback.
              </p>

              {/* Buttons grid */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  8. Button Styles & Interactions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Primary button */}
                  <div className="p-3 bg-zinc-50/70 rounded-xl border border-zinc-100 text-center space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-500 block">Primary Action (iOS Blue)</span>
                    <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.97] transition-all shadow-sm cursor-pointer">
                      <span>Request to Help</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <code className="text-[10px] text-zinc-400 block font-mono">bg-[#0071E3] rounded-full active:scale-[0.97]</code>
                  </div>

                  {/* Secondary button */}
                  <div className="p-3 bg-zinc-50/70 rounded-xl border border-zinc-100 text-center space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-500 block">Secondary Button</span>
                    <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 active:scale-[0.97] transition-all cursor-pointer">
                      <span>View Project</span>
                    </button>
                    <code className="text-[10px] text-zinc-400 block font-mono">bg-zinc-100 text-zinc-700 rounded-full</code>
                  </div>

                  {/* Soft decline button */}
                  <div className="p-3 bg-zinc-50/70 rounded-xl border border-zinc-100 text-center space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-500 block">Soft Decline (No Harsh Red)</span>
                    <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-transparent hover:bg-zinc-100 active:scale-[0.97] transition-all cursor-pointer">
                      <span>Pass for Now</span>
                    </button>
                    <code className="text-[10px] text-zinc-400 block font-mono">hover:bg-zinc-100 text-zinc-600</code>
                  </div>
                </div>
              </div>

              {/* Chips & Status Pills */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  11. Chips, Status Pills & Badges
                </h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Status Pills */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>1 spot open</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>Connected</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Pending review</span>
                  </span>

                  {/* Commitment Chip */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>Weekend sprint (2-4 hrs)</span>
                  </span>

                  {/* Help Type Chip */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/50">
                    <span>✨ UI Polish</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/50">
                    <span>⚡ API Hookup</span>
                  </span>
                </div>
              </div>

              {/* Input field specimen */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  10. Input Style (iOS Inset Fill)
                </h4>
                <div className="max-w-md space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 block">
                    What are you building?
                  </label>
                  <input
                    type="text"
                    defaultValue="VibePlayer — minimal lo-fi audio player"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100/90 hover:bg-zinc-100 focus:bg-white text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 border border-transparent focus:border-[#0071E3] focus:ring-3 focus:ring-blue-100 transition-all outline-none"
                  />
                  <p className="text-[11px] text-zinc-400">
                    iOS pattern: subtle #F2F2F7 background fill, transitioning to crisp white on focus.
                  </p>
                </div>
              </div>

              {/* App Store Card specimen */}
              <div className="bg-zinc-100/80 p-4 rounded-3xl space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-bold text-xs text-zinc-700">9. App Store Style Feed Card</span>
                  <span className="text-[10px] text-zinc-400 font-mono">rounded-[24px] • shadow-xs</span>
                </div>
                <div className="bg-white rounded-[24px] p-5 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="Elena"
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-zinc-900">Elena Rostova</span>
                          <span className="text-[10px] font-medium text-zinc-400">@elena_builds</span>
                        </div>
                        <span className="text-[11px] text-zinc-500">Design engineer • building canvas apps</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2h ago
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900 mb-1.5">
                    ZenDraft — Distraction-free markdown notes
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mb-4 line-clamp-2">
                    I have the core lexical editor built. Need 1 person to help style the export modal and dark mode palette.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-100 justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        1 spot left
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-700">
                        2-4 hrs total
                      </span>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.97] transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* iMessage Contact Exchange Specimen */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                    iMessage-Style Quick Note Bubble
                  </h4>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Match Accepted
                  </span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl space-y-2.5">
                  <div className="flex justify-end">
                    <div className="bg-[#0071E3] text-white text-xs px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-xs shadow-xs">
                      Hey Alex! Loved your demo. Here is my Discord: <strong className="underline">@elena_dev</strong>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-zinc-200 text-zinc-900 text-xs px-3.5 py-2 rounded-2xl rounded-tl-xs max-w-xs">
                      Awesome, sending you a request on Discord right now! Leaving to build 🙌
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Temporary exchange container: just enough to bridge builders over to Discord or Telegram, then they leave to build.
                </p>
              </div>

              {/* Empty & Loading States */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Notion-style empty state */}
                <div className="bg-zinc-50/80 rounded-2xl border border-dashed border-zinc-300 p-6 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                  <h5 className="font-bold text-xs text-zinc-900">15. Notion-Style Friendly Empty State</h5>
                  <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                    "No pending requests right now. Your project is live on the matchboard!"
                  </p>
                </div>

                {/* Things 3 Skeleton Loader */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-3">
                  <h5 className="font-bold text-xs text-zinc-900">16. Things 3 Calm Skeleton Loader</h5>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-zinc-200/70 rounded-full w-3/4"></div>
                    <div className="h-3 bg-zinc-100 rounded-full w-full"></div>
                    <div className="h-3 bg-zinc-100 rounded-full w-5/6"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-5 w-16 bg-zinc-200/60 rounded-full"></div>
                      <div className="h-5 w-20 bg-zinc-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCREEN UX RULES */}
          {activeTab === 'screens' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    title: '1. Project Feed Screen',
                    icon: Compass,
                    badge: 'Discover',
                    rules: [
                      'App Store card aesthetic with generous vertical margins (gap-4).',
                      'No infinite wall of text: each card shows owner avatar, 1-line blurb, title, 2-line preview, and open spots.',
                      'Sticky filter pills for commitment (e.g. "Weekend sprint", "Under 2 hrs") and help type.',
                      'Floating or bottom-docked action to "Post Project".',
                    ]
                  },
                  {
                    title: '2. Project Detail Sheet',
                    icon: Sliders,
                    badge: 'Inspect',
                    rules: [
                      'Renders as an iOS native bottom sheet on mobile (rounded-t-[32px]) or centered card on desktop.',
                      'Clearly highlights: The Problem, What is Already Built (with live link), and The Exact Small Piece Needed.',
                      'Sticky bottom action bar with single high-contrast primary CTA: "Request to Help".',
                    ]
                  },
                  {
                    title: '3. Post Project Form',
                    icon: Layers,
                    badge: 'Create',
                    rules: [
                      'Max 4 concise fields: Project Name, One-liner Pitch, Exact Help Needed, and Commitment duration.',
                      'Preset chip selectors for Commitment: "Under 2 hrs", "Weekend sprint", "Few evenings". No freeform vague hours.',
                      'No equity sliders, no legal disclaimers, no complex tagging.',
                    ]
                  },
                  {
                    title: '4. Requests Dashboard',
                    icon: AlertCircle,
                    badge: 'Review',
                    rules: [
                      'Grouped by projects owned by current user.',
                      'Linear-style clarity: applicant avatar, brief pitch note, their preferred contact.',
                      'Clear affirmative actions: Accept (Blue/Green) vs Soft Decline ("Pass for now" subtle gray).',
                    ]
                  },
                  {
                    title: '5. Contact Exchange Screen',
                    icon: MessageCircle,
                    badge: 'Bridge',
                    rules: [
                      'iMessage-style temporary exchange container.',
                      'Displays private handles (Discord, Telegram, Twitter, Email) as one-tap copyable chips.',
                      'Explicit exit banner: "You are matched! Head over to Discord or Telegram to build together."',
                    ]
                  },
                  {
                    title: '6. Profile Page',
                    icon: Eye,
                    badge: 'Identity',
                    rules: [
                      'Casual builder card: Name, blurb, preferred contact handles.',
                      'Projects launched and projects contributed to.',
                      'Zero rating stars, zero public reviews, zero badges to keep pressure strictly at zero.',
                    ]
                  },
                ].map((screen, idx) => {
                  const Icon = screen.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-zinc-200/80 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#0071E3]" />
                          <h4 className="font-bold text-xs sm:text-sm text-zinc-900">{screen.title}</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {screen.badge}
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs text-zinc-600 pl-6 list-disc marker:text-blue-500">
                        {screen.rules.map((rule, rIdx) => (
                          <li key={rIdx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VOICE & TONE GUIDE */}
          {activeTab === 'copy' && (
            <div className="space-y-6">
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 mb-1">
                  17. Tone of UI Copy: Casual, Direct, Low-Pressure
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  CoShip speaks like two friendly engineers grabbing coffee at a hackathon. We ban all corporate HR jargon, recruitment terminology, and equity negotiations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Say This (CoShip Voice)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>"Looking for a frontend friend for Saturday morning"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>"Weekend sprint (2-4 hrs)"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>"Pass for now"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>"Exchange contacts and leave to build"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>"1 spot open"</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-rose-50/50 border border-rose-200/70 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Never Say This (Corporate / SaaS Slop)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>"Apply for this position / submit resume"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>"Compensation / Equity / Vesting schedule"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>"Candidate Rejected"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>"Supercharge your synergy with AI team matches"</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>"Manage your talent pipeline"</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/80">
          <span className="text-[11px] text-zinc-500 font-medium">
            Designed for mobile-first iOS touch targets (≥44px) & low-pressure matchmaking
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
