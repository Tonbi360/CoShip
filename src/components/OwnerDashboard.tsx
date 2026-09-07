import React from 'react';
import { Project, User, JoinRequest } from '../types';
import { formatTimeAgo, getCommitmentColor } from '../utils';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Award,
  ArrowUpRight,
  Check
} from 'lucide-react';

interface OwnerDashboardProps {
  myProjects: Project[];
  currentUser: User;
  onAcceptRequest: (projectId: string, requestId: string) => void;
  onDeclineRequest: (projectId: string, requestId: string) => void;
  onOpenExchange: (project: Project, requestId: string) => void;
  onToggleContributed: (projectId: string, contributorUserId: string) => void;
  onOpenNewProject: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  myProjects,
  currentUser,
  onAcceptRequest,
  onDeclineRequest,
  onOpenExchange,
  onToggleContributed,
  onOpenNewProject
}) => {
  const allPendingRequests: { project: Project; request: JoinRequest }[] = [];
  myProjects.forEach((proj) => {
    proj.requests.forEach((req) => {
      if (req.status === 'pending') {
        allPendingRequests.push({ project: proj, request: req });
      }
    });
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-zinc-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            My Projects & Incoming Requests
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Review who wants to chip in, swap direct contacts, and mark who contributed.
          </p>
        </div>
        <button
          onClick={onOpenNewProject}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Post Another Project</span>
        </button>
      </div>

      {/* Pending Incoming Requests Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
              Incoming Requests ({allPendingRequests.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400">Soft accept / decline</span>
        </div>

        {allPendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-2.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-semibold text-zinc-800 text-sm">All caught up!</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
              No pending join requests right now. As people discover your project on the feed, they'll pop up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {allPendingRequests.map(({ project, request }) => (
              <div
                key={request.id}
                id={`pending-request-${request.id}`}
                className="bg-white rounded-2xl border border-zinc-200/80 p-4 sm:p-5 shadow-xs transition-all hover:border-zinc-300 space-y-3"
              >
                {/* Project reference tag */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#0071E3] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    For: {project.title}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Requested {formatTimeAgo(request.createdAt)}
                  </span>
                </div>

                {/* Applicant Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={request.applicant.avatar}
                      alt={request.applicant.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-zinc-900 truncate">
                        {request.applicant.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {request.applicant.blurb}
                      </p>
                      {request.applicant.github && (
                        <a
                          href={`https://github.com/${request.applicant.github}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 font-mono mt-0.5"
                        >
                          <span>github.com/{request.applicant.github}</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Casual Note */}
                {request.casualNote ? (
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs sm:text-sm text-zinc-700 leading-relaxed italic">
                    "{request.casualNote}"
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No note attached.</p>
                )}

                {/* Soft Action Buttons */}
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-end gap-2">
                  <button
                    id={`decline-btn-${request.id}`}
                    onClick={() => onDeclineRequest(project.id, request.id)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                  >
                    Not this time
                  </button>
                  <button
                    id={`accept-btn-${request.id}`}
                    onClick={() => onAcceptRequest(project.id, request.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-95 shadow-xs transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connect & swap info</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects List & Active Collaborators */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 mb-3">
          Your Projects ({myProjects.length})
        </h3>

        {myProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-8 text-center">
            <p className="text-sm font-semibold text-zinc-800">You haven't posted any projects yet.</p>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Got a tiny side project or prototype? Post it to find someone to build with!
            </p>
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2 bg-[#0071E3] text-white text-xs font-semibold rounded-full shadow-xs"
            >
              Post your first project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myProjects.map((project) => {
              const accepted = project.requests.filter((r) => r.status === 'accepted');

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getCommitmentColor(
                            project.commitment
                          )}`}
                        >
                          {project.commitment}
                        </span>
                        <span className="text-xs font-medium text-zinc-400">
                          {formatTimeAgo(project.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-zinc-900">{project.title}</h4>
                      <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Connected Collaborators */}
                  <div className="pt-3 border-t border-zinc-100">
                    <p className="text-xs font-bold text-zinc-700 mb-2">
                      Connected Collaborators ({accepted.length})
                    </p>

                    {accepted.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic">
                        No accepted contributors yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {accepted.map((req) => {
                          const isContributed = project.contributorIds.includes(req.applicant.id);

                          return (
                            <div
                              key={req.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex-wrap gap-2"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={req.applicant.avatar}
                                  alt={req.applicant.name}
                                  className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-zinc-900 truncate">
                                    {req.applicant.name}
                                  </p>
                                  <p className="text-[11px] text-zinc-500 font-mono truncate">
                                    {req.applicantContact.type}: {req.applicantContact.handle}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  id={`dashboard-open-exchange-${req.id}`}
                                  onClick={() => onOpenExchange(project, req.id)}
                                  className="px-3 py-1 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors shadow-2xs"
                                >
                                  Open Contact & Chat
                                </button>

                                <button
                                  id={`dashboard-mark-contributed-${req.id}`}
                                  onClick={() => onToggleContributed(project.id, req.applicant.id)}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                    isContributed
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700'
                                  }`}
                                >
                                  {isContributed ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-700" />
                                      <span>Contributed</span>
                                    </>
                                  ) : (
                                    <span>Mark Contributed</span>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
