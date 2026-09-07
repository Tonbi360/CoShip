import React, { useState } from 'react';
import { Project, User, JoinRequest } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Send, 
  ExternalLink, 
  Award, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ContactExchangeModalProps {
  project: Project;
  request: JoinRequest;
  currentUser: User;
  onClose: () => void;
  onSendMessage: (projectId: string, requestId: string, text: string) => void;
  onToggleContributed: (projectId: string, contributorUserId: string) => void;
}

export const ContactExchangeModal: React.FC<ContactExchangeModalProps> = ({
  project,
  request,
  currentUser,
  onClose,
  onSendMessage,
  onToggleContributed
}) => {
  const isOwner = currentUser.id === project.owner.id;
  const otherUser = isOwner ? request.applicant : project.owner;
  const otherContact = isOwner ? request.applicantContact : project.owner.contact;

  const [copied, setCopied] = useState(false);
  const [noteText, setNoteText] = useState('');

  const isMarkedAsContributor = project.contributorIds.includes(request.applicant.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(otherContact.handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onSendMessage(project.id, request.id, noteText.trim());
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="contact-exchange-modal"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top bar */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-zinc-900">Direct Contact Exchange</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Match Celebratory Banner */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/80 rounded-2xl p-4 text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base">
              You are connected on {project.title}!
            </h3>
            <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
              CoShip is just the matchboard. Copy contact handles below, jump over to Discord or Telegram, and start vibe-coding together!
            </p>
          </div>

          {/* Contact Exchange Cards */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {isOwner ? 'Contributor Contact Details' : 'Project Owner Contact Details'}
            </label>

            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-zinc-900 truncate">{otherUser.name}</p>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-zinc-200 text-zinc-700">
                      {otherContact.type}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-zinc-700 truncate mt-0.5 select-all font-semibold">
                    {otherContact.handle}
                  </p>
                </div>
              </div>

              {/* Copy Button */}
              <button
                id="copy-contact-handle-btn"
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/90 shadow-xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Initial note sent with request */}
          {request.casualNote && (
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
              <p className="font-semibold text-zinc-500 text-[11px] mb-1">
                Note sent with request:
              </p>
              <p className="text-zinc-700 italic">"{request.casualNote}"</p>
            </div>
          )}

          {/* Lightweight Message Thread / Coordination Scratchpad */}
          <div className="border-t border-zinc-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" />
                <span>Quick Handshake Thread (Temporary)</span>
              </span>
              <span className="text-[10px] text-zinc-400">Not a full chat app</span>
            </div>

            {/* Note stream */}
            <div className="bg-zinc-50/70 rounded-2xl p-3 border border-zinc-100 min-h-[90px] max-h-[140px] overflow-y-auto space-y-2 mb-2 text-xs">
              {request.exchangeNotes && request.exchangeNotes.length > 0 ? (
                request.exchangeNotes.map((note) => {
                  const isMe = note.senderId === currentUser.id;
                  return (
                    <div
                      key={note.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-zinc-400 mb-0.5">
                        {isMe ? 'You' : note.senderName}
                      </span>
                      <div
                        className={`px-3 py-1.5 rounded-xl max-w-[85%] leading-relaxed ${
                          isMe
                            ? 'bg-[#0071E3] text-white'
                            : 'bg-white text-zinc-800 border border-zinc-200/70 shadow-xs'
                        }`}
                      >
                        {note.text}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-zinc-400 text-center py-4 text-[11px]">
                  No quick notes yet. Use this to share a Discord server invite or meeting link!
                </p>
              )}
            </div>

            {/* Send quick note form */}
            <form onSubmit={handleSendNote} className="flex gap-2">
              <input
                type="text"
                id="exchange-scratchpad-input"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Share a Discord invite link or quick hello..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] text-zinc-800"
              />
              <button
                type="submit"
                id="exchange-send-note-btn"
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Owner "Mark Contributed" Action */}
          {isOwner && (
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between bg-amber-50/60 p-3 rounded-2xl border border-amber-100/70">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Contribution Completion</span>
                </p>
                <p className="text-[11px] text-amber-800/80">
                  When you wrap up vibe-coding, mark {request.applicant.name.split(' ')[0]} as a contributor.
                </p>
              </div>

              <button
                id="toggle-contributed-btn"
                onClick={() => onToggleContributed(project.id, request.applicant.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isMarkedAsContributor
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {isMarkedAsContributor ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Contributed</span>
                  </>
                ) : (
                  <span>Mark Contributed</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA to leave app */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-zinc-500 font-medium">
            Ready to build? You can close this anytime.
          </p>
          <button
            id="leave-app-close-btn"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-full text-xs font-semibold transition-colors"
          >
            Leave & Start Building
          </button>
        </div>
      </div>
    </div>
  );
};
