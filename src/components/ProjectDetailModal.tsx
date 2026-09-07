import React from 'react';
import { Project, User } from '../types';
import { formatTimeAgo, getCommitmentColor } from '../utils';
import { X, Clock, ExternalLink, Sparkles, UserPlus, Users, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project;
  currentUser: User;
  onClose: () => void;
  onRequestJoin: (project: Project) => void;
  onOpenExchange: (project: Project, requestId: string) => void;
  onGoToDashboard: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  currentUser,
  onClose,
  onRequestJoin,
  onOpenExchange,
  onGoToDashboard
}) => {
  const isOwner = currentUser.id === project.owner.id;
  const myRequest = project.requests.find((r) => r.applicant.id === currentUser.id);
  const pendingRequests = project.requests.filter((r) => r.status === 'pending');
  const acceptedRequests = project.requests.filter((r) => r.status === 'accepted');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="project-detail-modal"
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Project Details
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTimeAgo(project.createdAt)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title & Status */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${getCommitmentColor(
                  project.commitment
                )}`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{project.commitment}</span>
              </span>
              <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                {project.status === 'matched' ? 'Matched' : `Need ${project.maxContributors}`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight leading-snug">
              {project.title}
            </h2>
          </div>

          {/* Builder Profile Card */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={project.owner.avatar}
                alt={project.owner.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm text-zinc-900 truncate">{project.owner.name}</p>
                  {isOwner && (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{project.owner.blurb}</p>
                {project.owner.github && (
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    github.com/{project.owner.github}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Full description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              About the Project
            </h4>
            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
              {project.description}
            </p>
          </div>

          {/* Repo or prototype link */}
          {project.projectLink && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Project Link
              </h4>
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50/70 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200/60 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="truncate max-w-sm">{project.projectLink}</span>
              </a>
            </div>
          )}

          {/* Help Needed Chips */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Help Wanted
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.helpNeeded.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200/80"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Owner view summary or applicant status */}
          {isOwner ? (
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-800">
                  Requests ({project.requests.length})
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onGoToDashboard();
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Open Management View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                {pendingRequests.length > 0
                  ? `${pendingRequests.length} pending builder request waiting for your reply.`
                  : 'No new requests right now.'}
              </p>
            </div>
          ) : myRequest ? (
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-800">Your Request Status</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {myRequest.status === 'accepted'
                    ? 'Accepted! You are connected.'
                    : myRequest.status === 'pending'
                    ? 'Sent — waiting for owner review.'
                    : 'Owner declined with "Not this time".'}
                </p>
              </div>
              {myRequest.status === 'accepted' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenExchange(project, myRequest.id);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  View Contact
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
          >
            Close
          </button>

          {!isOwner && !myRequest && project.status === 'open' && (
            <button
              id="detail-modal-request-btn"
              onClick={() => {
                onClose();
                onRequestJoin(project);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] rounded-full shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Hop on this project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
