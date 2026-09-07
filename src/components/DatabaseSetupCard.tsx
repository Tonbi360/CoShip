import React, { useState } from 'react';
import { COSHIP_SQL_SCHEMA } from '../lib/schemaSql';
import { Database, Copy, Check, ExternalLink, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface DatabaseSetupCardProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const DatabaseSetupCard: React.FC<DatabaseSetupCardProps> = ({ onRetry, isRetrying }) => {
  const [copied, setCopied] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(COSHIP_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5 text-left">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Database Schema Setup Required</h2>
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
              Your Supabase project is connected, but the tables (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">projects</code>, <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">profiles</code>, <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">join_requests</code>) have not been created yet.
            </p>
          </div>
        </div>

        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 active:scale-[0.98] transition-all shrink-0 cursor-pointer disabled:opacity-50"
          title="Check if tables are created"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>Check Again</span>
        </button>
      </div>

      <div className="bg-zinc-50/80 rounded-2xl p-4 border border-zinc-200/60 space-y-2.5 text-xs text-zinc-700">
        <div className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
          <span>Copy the SQL script</span>
        </div>
        <p className="text-zinc-600 pl-5.5 text-[11px]">
          Click below to copy the complete schema with all 6 tables and security policies.
        </p>
        <div className="pl-5.5 flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Schema SQL'}</span>
          </button>

          <button
            onClick={() => setShowSql(!showSql)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
          >
            <span>{showSql ? 'Hide SQL' : 'View SQL Preview'}</span>
            {showSql ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {showSql && (
          <div className="mt-2 pl-5.5">
            <pre className="max-h-56 overflow-y-auto p-3 bg-zinc-900 text-zinc-200 text-[11px] font-mono rounded-xl border border-zinc-800 leading-normal">
              {COSHIP_SQL_SCHEMA}
            </pre>
          </div>
        )}

        <div className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5 pt-2 border-t border-zinc-200/60">
          <span className="w-4 h-4 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
          <span>Paste & run in Supabase SQL Editor</span>
        </div>
        <p className="text-zinc-600 pl-5.5 text-[11px] leading-relaxed">
          Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#0071E3] hover:underline font-medium inline-flex items-center gap-0.5">Supabase Dashboard <ExternalLink className="w-2.5 h-2.5" /></a> → select your project → go to <strong>SQL Editor</strong> → click <strong>+ New Query</strong> → paste the SQL and click <strong>Run</strong>.
        </p>
      </div>
    </div>
  );
};
