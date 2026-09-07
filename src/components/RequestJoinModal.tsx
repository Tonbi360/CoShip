import React, { useState } from 'react';
import { Project, User, UserContact } from '../types';
import { X, Send, Sparkles, ShieldCheck } from 'lucide-react';

interface RequestJoinModalProps {
  project: Project;
  currentUser: User;
  onClose: () => void;
  onSubmitRequest: (projectId: string, note: string, contact: UserContact) => void;
}

export const RequestJoinModal: React.FC<RequestJoinModalProps> = ({
  project,
  currentUser,
  onClose,
  onSubmitRequest
}) => {
  const [note, setNote] = useState('');
  const [contactType, setContactType] = useState<UserContact['type']>(currentUser?.contact?.type || 'discord');
  const [contactHandle, setContactHandle] = useState(currentUser?.contact?.handle || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactHandle.trim()) return;

    onSubmitRequest(project.id, note.trim(), {
      type: contactType,
      handle: contactHandle.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="request-join-modal"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-zinc-100">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Join Request
            </span>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              Hop on {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Friendly prompt */}
          <div className="bg-blue-50/60 rounded-2xl p-3.5 border border-blue-100/80 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Keep it casual & friendly</p>
              <p className="text-blue-800/90">
                This is not a job application. Just tell {project.owner.name.split(' ')[0]} how you'd like to chip in or what you vibe with!
              </p>
            </div>
          </div>

          {/* Casual Note Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Quick note to {project.owner.name.split(' ')[0]} <span className="font-normal text-zinc-400">(optional)</span>
            </label>
            <textarea
              id="request-note-input"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Hey! I saw your project and love the idea. I have some time this weekend and can help clean up the frontend and responsive cards!"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all resize-none text-zinc-800 placeholder:text-zinc-400"
            />
          </div>

          {/* Contact Exchange Info */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Your contact handle <span className="font-normal text-zinc-400">(shared only if accepted)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                id="request-contact-type"
                value={contactType}
                onChange={(e) => setContactType(e.target.value as UserContact['type'])}
                className="text-xs p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
              >
                <option value="discord">Discord</option>
                <option value="telegram">Telegram</option>
                <option value="x">X / Twitter</option>
                <option value="email">Email</option>
              </select>
              <input
                id="request-contact-handle"
                type="text"
                required
                value={contactHandle}
                onChange={(e) => setContactHandle(e.target.value)}
                placeholder={contactType === 'discord' ? 'username#1234 or @handle' : '@handle or email'}
                className="sm:col-span-2 text-xs sm:text-sm p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] text-zinc-800"
              />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              Private until the owner taps "Accept & Swap Info".
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-request-btn"
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] rounded-full shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send casual request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
