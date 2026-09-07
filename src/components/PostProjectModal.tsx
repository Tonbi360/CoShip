import React, { useState } from 'react';
import { User, CommitmentType, HelpType, Project } from '../types';
import { COMMITMENT_OPTIONS, HELP_OPTIONS, getCommitmentColor } from '../utils';
import { X, Sparkles, Plus, Check } from 'lucide-react';

interface PostProjectModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (newProject: Omit<Project, 'id' | 'createdAt' | 'requests' | 'contributorIds' | 'status'>) => void;
}

export const PostProjectModal: React.FC<PostProjectModalProps> = ({
  currentUser,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [commitment, setCommitment] = useState<CommitmentType>('weekend');
  const [selectedHelp, setSelectedHelp] = useState<HelpType[]>(['frontend', 'polish']);
  const [maxContributors, setMaxContributors] = useState<number>(1);

  const toggleHelp = (chip: HelpType) => {
    if (selectedHelp.includes(chip)) {
      if (selectedHelp.length > 1) {
        setSelectedHelp(selectedHelp.filter((c) => c !== chip));
      }
    } else {
      if (selectedHelp.length < 5) {
        setSelectedHelp([...selectedHelp, chip]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      projectLink: projectLink.trim() || undefined,
      owner: currentUser,
      helpNeeded: selectedHelp,
      commitment,
      maxContributors
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="post-project-modal"
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-zinc-100 shrink-0">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Post to Matchboard
            </span>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              Share a side project & find 1-2 contributors
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Project Name & One-Liner
            </label>
            <input
              type="text"
              id="project-title-input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Recipe Remix — Pantry meal planner from fridge photos"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] font-medium text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                What are you building & what do you need?
              </label>
              <span className="text-[11px] text-zinc-400">Casual & direct</span>
            </div>
            <textarea
              id="project-description-input"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the current state, the tech stack, and what specific 1-2 things would be awesome to collaborate on."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] resize-none text-zinc-800 placeholder:text-zinc-400 leading-relaxed"
            />
          </div>

          {/* Project / GitHub Link */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Repo, Demo, or Figma Link <span className="font-normal text-zinc-400">(optional)</span>
            </label>
            <input
              type="url"
              id="project-link-input"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              placeholder="https://github.com/yourname/project"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] text-zinc-800"
            />
          </div>

          {/* Commitment Expectation Chips */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Commitment level
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              Sets expectations upfront so contributors feel comfortable jumping in without feeling trapped.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMMITMENT_OPTIONS.map((opt) => {
                const isSelected = commitment === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setCommitment(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${getCommitmentColor(opt)} ring-2 ring-blue-500/20 shadow-xs font-bold`
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Help Needed Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                What kind of help are you looking for?
              </label>
              <span className="text-[11px] text-zinc-400">{selectedHelp.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HELP_OPTIONS.map((chip) => {
                const isSelected = selectedHelp.includes(chip);
                return (
                  <button
                    type="button"
                    key={chip}
                    onClick={() => toggleHelp(chip)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200/70'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots count */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/60">
            <div>
              <p className="text-xs font-bold text-zinc-800">Contributors needed</p>
              <p className="text-[11px] text-zinc-500">
                CoShip is intentionally for small, focused matches.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setMaxContributors(1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  maxContributors === 1
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                1 person
              </button>
              <button
                type="button"
                onClick={() => setMaxContributors(2)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  maxContributors === 2
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                2 people
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="publish-project-btn"
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] rounded-full shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish to Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
