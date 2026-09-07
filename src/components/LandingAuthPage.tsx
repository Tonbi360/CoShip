import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Sparkles, Github, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';

interface LandingAuthPageProps {
  onAuthSuccess?: () => void;
}

export const LandingAuthPage: React.FC<LandingAuthPageProps> = ({ onAuthSuccess }) => {
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isInIframe] = useState(() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  });

  const handleGitHubSignIn = async () => {
    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize GitHub sign in.');
      setIsSubmitting(false);
    }
  };

  const handleEmailMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send magic link. Please check your Supabase Email Auth settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-between items-center px-4 sm:px-6 py-8 sm:py-12 selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
      {/* Top Brand Pill */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200/80 shadow-xs">
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#0071E3] to-[#0051A8] flex items-center justify-center text-white">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="text-xs font-bold text-zinc-900 tracking-tight">CoShip</span>
      </div>

      {/* Hero Container */}
      <div className="w-full max-w-md my-auto pt-6 pb-12 flex flex-col items-center text-center">
        {/* Supabase Notice Banner if unconfigured */}
        {!isSupabaseConfigured && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-left text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-amber-950">Supabase Connection Required</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                To sign in and access real data, add <code className="font-mono bg-amber-100/90 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-amber-100/90 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to your environment variables.
              </p>
            </div>
          </div>
        )}

        {/* Small line */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/60 text-[11px] font-medium text-zinc-600 mb-5">
          <span>No resume. No portfolio review. Just real projects.</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 text-balance leading-tight mb-3">
          Find one or two people to help ship your project.
        </h1>

        {/* Subheading */}
        <p className="text-xs sm:text-sm text-zinc-600 text-balance leading-relaxed mb-8 max-w-sm">
          CoShip is a lightweight matchboard for solo builders who want small, low-commitment help on real projects.
        </p>

        {/* Auth Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-zinc-200/80 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {magicLinkSent ? (
            <div className="py-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">Check your inbox</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We sent a secure magic link to <strong className="text-zinc-800">{email}</strong>. Tap the link in your email to sign in instantly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMagicLinkSent(false);
                  setEmail('');
                }}
                className="text-xs font-semibold text-[#0071E3] hover:underline pt-2"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              {/* GitHub OAuth */}
              <button
                type="button"
                id="github-signin-btn"
                onClick={handleGitHubSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-[#1D1D1F] hover:bg-[#2C2C2E] active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Github className="w-4 h-4" />
                )}
                <span>Continue with GitHub</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <span className="h-px flex-1 bg-zinc-200"></span>
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">or</span>
                <span className="h-px flex-1 bg-zinc-200"></span>
              </div>

              {/* Email Magic Link */}
              {!emailMode ? (
                <button
                  type="button"
                  id="email-signin-toggle-btn"
                  onClick={() => setEmailMode(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200/80 active:scale-[0.98] transition-all border border-zinc-200/60 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span>Continue with email</span>
                </button>
              ) : (
                <form onSubmit={handleEmailMagicLink} className="space-y-3 text-left">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-100 focus:bg-white text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 border border-transparent focus:border-[#0071E3] focus:ring-3 focus:ring-blue-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Sending Link...' : 'Send Magic Link'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailMode(false)}
                    className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors pt-1"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* If inside AI Studio preview iframe, offer direct new-tab link for smooth OAuth */}
        {isInIframe && (
          <div className="mt-4">
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#0071E3] bg-blue-50/90 hover:bg-blue-100 border border-blue-200/60 shadow-2xs transition-all active:scale-[0.98]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in browser for sign in</span>
            </a>
          </div>
        )}
      </div>

      {/* Minimal bottom footer */}
      <div className="text-center text-[11px] text-zinc-400">
        <p>Post → Discover → Request → Accept → Exchange Contact → Leave to build.</p>
      </div>
    </div>
  );
};
