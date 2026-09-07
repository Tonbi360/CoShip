import React from 'react';
import { Project, User } from '../types';
import { formatTimeAgo, getCommitmentColor } from '../utils';
import { Clock, ExternalLink, Sparkles, CheckCircle, ArrowRight, UserPlus, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  currentUser: User | null;
  onViewProject: (project: Project) => void;
  onRequestJoin: (project: Project) => void;
  onOpenExchange: (project: Project, requestId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  currentUser,
  onViewProject,
  onRequestJoin,
  onOpenExchange
}) => {
  const isOwner = currentUser ? currentUser.id === project.owner.id : false;
  
  // Find current user's request if any
  const myRequest = currentUser ? project.requests.find((r) => r.applicant?.id === currentUser.id) : undefined;
  const pendingRequestsCount = project.requests.filter((r) => r.status === 'pending').length;

  return (
    <div
      id={`project-card-${project.id}`}
      className="bg-white rounded-[24px] border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-zinc-300 transition-all p-4 sm:p-5 flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Owner info & Project age */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {project.owner.avatar ? (
              <img
                src={project.owner.avatar}
                alt={project.owner.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0071E3] font-bold text-xs flex items-center justify-center ring-1 ring-blue-200 shrink-0">
                {project.owner.name?.charAt(0).toUpperCase() || 'B'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-xs sm:text-sm text-zinc-900 truncate">
                  {project.owner.name}
                </span>
                {isOwner && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-50 text-[#0071E3] rounded-md border border-blue-200">
                    You
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 truncate">{project.owner.blurb || `@${project.owner.handle}`}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-medium text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimeAgo(project.createdAt)}</span>
          </div>
        </div>

        {/* Project Title */}
        <h3
          onClick={() => onViewProject(project)}
          className="font-bold text-base text-zinc-900 mb-1.5 cursor-pointer hover:text-[#0071E3] transition-colors line-clamp-1 tracking-tight"
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-600 mb-3.5 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Link if present */}
        {project.projectLink && (
          <a
            href={project.projectLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] text-[#0071E3] hover:text-[#005bb5] hover:underline mb-3.5 font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="truncate max-w-[280px]">
              {project.projectLink.replace(/^https?:\/\//, '')}
            </span>
          </a>
        )}

        {/* Chips: Commitment & Help Needed */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {/* Commitment chip */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getCommitmentColor(
              project.commitment
            )}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{project.commitment}</span>
          </span>

          {/* Help chips */}
          {project.helpNeeded.map((chip) => (
            <span
              key={chip}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100/90 text-zinc-700 border border-zinc-200/60"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            {project.status === 'matched'
              ? 'Matched & Building'
              : `Looking for ${project.maxContributors} ${project.maxContributors === 1 ? 'contributor' : 'contributors'}`}
          </span>
        </div>

        {/* Action Button depending on user role */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <button
              id={`owner-manage-btn-${project.id}`}
              onClick={() => onViewProject(project)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-zinc-100 hover:bg-zinc-200/80 active:scale-[0.97] text-zinc-800 transition-all cursor-pointer"
            >
              <span>Manage</span>
              {pendingRequestsCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-[#0071E3] text-white text-[10px] font-bold">
                  {pendingRequestsCount} new
                </span>
              ) : (
                <ArrowRight className="w-3 h-3" />
              )}
            </button>
          ) : myRequest ? (
            myRequest.status === 'accepted' ? (
              <button
                id={`open-exchange-btn-${project.id}`}
                onClick={() => onOpenExchange(project, myRequest.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 active:scale-[0.97] border border-emerald-200/80 transition-all cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Connected (Swap info)</span>
              </button>
            ) : myRequest.status === 'pending' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                <Clock className="w-3.5 h-3.5" />
                <span>Request sent</span>
              </span>
            ) : (
              <span className="text-xs text-zinc-400 italic">
                Not matched this time
              </span>
            )
          ) : project.status === 'matched' ? (
            <button
              onClick={() => onViewProject(project)}
              className="text-xs text-zinc-500 font-semibold px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200/80 transition-colors"
            >
              View details
            </button>
          ) : (
            <button
              id={`request-to-join-btn-${project.id}`}
              onClick={() => onRequestJoin(project)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.97] text-white transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Hop on</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
