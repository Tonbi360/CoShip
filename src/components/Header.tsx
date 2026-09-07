import React, { useState } from 'react';
import { User } from '../types';
import { Compass, Plus, Sparkles, UserCircle2, Layers, LogIn, LogOut, ChevronDown, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: 'feed' | 'dashboard' | 'profile';
  onTabChange: (tab: 'feed' | 'dashboard' | 'profile') => void;
  onOpenNewProject: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenDesignSystem?: () => void;
  pendingRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onOpenNewProject,
  onOpenAuth,
  onSignOut,
  onOpenDesignSystem,
  pendingRequestsCount
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top brand & user bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onTabChange('feed')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="brand-logo-btn"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0071E3] to-[#0051A8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-zinc-900">CoShip</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium hidden sm:block">
                Lightweight matchboard for solo builders
              </p>
            </div>
          </div>

          {/* Quick actions & Auth */}
          <div className="flex items-center gap-2">
            {/* Design System Spec Link */}
            {onOpenDesignSystem && (
              <button
                id="open-design-system-btn"
                onClick={onOpenDesignSystem}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0071E3] hover:text-[#005bb5] bg-blue-50/80 hover:bg-blue-100/80 rounded-full transition-colors border border-blue-200/60"
                title="View iOS Design System"
              >
                <span>🎨 Design System</span>
              </button>
            )}

            {/* Post button */}
            <button
              id="header-post-project-btn"
              onClick={onOpenNewProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Project</span>
            </button>

            {/* Real Auth State */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-zinc-200/90 hover:border-zinc-300 bg-white text-xs font-medium text-zinc-800 transition-colors shadow-xs cursor-pointer"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-200"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0071E3] font-bold text-[10px] flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[70px] sm:max-w-[100px] truncate text-left font-semibold">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Profile menu dropdown */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 p-1.5 bg-white rounded-2xl shadow-xl border border-zinc-100 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                      <p className="font-semibold text-xs text-zinc-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">@{currentUser.handle || 'builder'}</p>
                    </div>

                    <button
                      onClick={() => {
                        onTabChange('profile');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-zinc-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-zinc-400" />
                      <span>My Projects ({pendingRequestsCount} pending)</span>
                    </button>

                    <div className="h-px bg-zinc-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-signin-btn"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 active:scale-[0.98] transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-zinc-500" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* iOS Segmented Navigation Bar */}
        <div className="flex items-center justify-between py-2 border-t border-zinc-100 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-2xl">
            <button
              id="nav-feed-tab"
              onClick={() => onTabChange('feed')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Project Feed</span>
            </button>

            <button
              id="nav-dashboard-tab"
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold relative transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>My Projects</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#0071E3] text-white text-[10px] font-bold">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              id="nav-profile-tab"
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <UserCircle2 className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
