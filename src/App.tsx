import React, { useState, useEffect, useCallback } from 'react';
import { Project, User, JoinRequest, CommitmentType, HelpType, UserContact } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { COMMITMENT_OPTIONS, HELP_OPTIONS } from './utils';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { PostProjectModal } from './components/PostProjectModal';
import { RequestJoinModal } from './components/RequestJoinModal';
import { ContactExchangeModal } from './components/ContactExchangeModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { ProfileView } from './components/ProfileView';
import { DesignSystemModal } from './components/DesignSystemModal';
import { AuthModal } from './components/AuthModal';
import { LandingAuthPage } from './components/LandingAuthPage';
import { DatabaseSetupCard } from './components/DatabaseSetupCard';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Plus, 
  Compass, 
  Layers, 
  UserCircle2, 
  AlertCircle,
  Database,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';

export default function App() {
  // Real Supabase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Real Database Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [isSchemaMissing, setIsSchemaMissing] = useState(false);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'feed' | 'dashboard' | 'profile'>('feed');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDesignSystemModalOpen, setIsDesignSystemModalOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [selectedProjectForJoin, setSelectedProjectForJoin] = useState<Project | null>(null);
  const [exchangeModalState, setExchangeModalState] = useState<{
    project: Project;
    request: JoinRequest;
  } | null>(null);

  // Feed Filters
  const [selectedCommitmentFilter, setSelectedCommitmentFilter] = useState<string>('all');
  const [selectedHelpFilter, setSelectedHelpFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Helper to map DB profile to User
  const mapProfileToUser = (profile: any, fallbackEmail?: string): User => {
    if (!profile) {
      return {
        id: 'unknown',
        name: 'Anonymous Builder',
        handle: 'builder',
        avatar: '',
        blurb: '',
        contact: { type: 'discord', handle: '' }
      };
    }
    return {
      id: profile.id,
      name: profile.name || profile.handle || (fallbackEmail ? fallbackEmail.split('@')[0] : 'Builder'),
      handle: profile.handle || profile.id.slice(0, 8),
      avatar: profile.avatar_url || '',
      email: profile.email || fallbackEmail,
      github: profile.github_url || undefined,
      blurb: profile.blurb || '',
      contact: {
        type: profile.discord_handle ? 'discord' : profile.telegram_handle ? 'telegram' : 'email',
        handle: profile.discord_handle || profile.telegram_handle || profile.email || ''
      }
    };
  };

  // 1. Listen to Real Supabase Auth
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email);
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email);
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
        console.warn('Profile notice:', error.message);
      }

      if (data) {
        setCurrentUser(mapProfileToUser(data, email));
      } else {
        // Fallback user from auth metadata if profile trigger hasn't fired
        setCurrentUser({
          id: userId,
          name: email ? email.split('@')[0] : 'Builder',
          handle: email ? email.split('@')[0].toLowerCase() : userId.slice(0, 8),
          avatar: '',
          email: email,
          blurb: 'Solo builder on CoShip',
          contact: { type: 'email', handle: email || '' }
        });
      }
    } catch {
      // Graceful fallback
    } finally {
      setAuthLoading(false);
    }
  };

  // 2. Fetch Real Projects from Supabase
  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProjects([]);
      setProjectsLoading(false);
      return;
    }

    setProjectsLoading(true);
    setProjectsError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          demo_url,
          commitment,
          help_needed,
          max_contributors,
          status,
          created_at,
          owner:profiles!projects_owner_id_fkey(*),
          requests:join_requests(
            id,
            project_id,
            note,
            offered_contact,
            status,
            created_at,
            applicant:profiles!join_requests_applicant_id_fkey(*)
          ),
          marks:contribution_marks(contributor_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        // PostgREST 205: Table not found in schema cache
        if (
          error.code === 'PGRST205' ||
          error.message?.includes('schema cache') ||
          error.message?.includes('public.projects')
        ) {
          setIsSchemaMissing(true);
          setProjects([]);
          setProjectsLoading(false);
          setProjectsError(null);
          return;
        }
        throw error;
      }

      setIsSchemaMissing(false);
      setProjectsError(null);

      if (data) {
        const formattedProjects: Project[] = data.map((p: any) => {
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            projectLink: p.demo_url || undefined,
            owner: mapProfileToUser(p.owner),
            helpNeeded: p.help_needed || [],
            commitment: p.commitment || 'weekend',
            maxContributors: p.max_contributors || 1,
            status: p.status || 'open',
            createdAt: p.created_at,
            requests: (p.requests || []).map((r: any) => {
              const contactParts = (r.offered_contact || '').split(': ');
              const contactType = contactParts[0] === 'telegram' || contactParts[0] === 'x' || contactParts[0] === 'email' ? contactParts[0] : 'discord';
              const contactHandle = contactParts[1] || r.offered_contact || '';

              return {
                id: r.id,
                projectId: p.id,
                applicant: mapProfileToUser(r.applicant),
                casualNote: r.note || '',
                applicantContact: { type: contactType, handle: contactHandle },
                status: r.status,
                createdAt: r.created_at,
                exchangeNotes: []
              };
            }),
            contributorIds: (p.marks || []).map((m: any) => m.contributor_id)
          };
        });
        setProjects(formattedProjects);
      }
    } catch (err: any) {
      if (
        err?.code === 'PGRST205' ||
        err?.message?.includes('schema cache') ||
        err?.message?.includes('public.projects')
      ) {
        setIsSchemaMissing(true);
        setProjects([]);
        setProjectsError(null);
      } else {
        setProjectsError(err.message || 'Failed to fetch projects from Supabase.');
      }
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser, fetchProjects]);

  // Counts for pending requests on current user's projects
  const myProjects = currentUser ? projects.filter((p) => p.owner.id === currentUser.id) : [];
  const pendingCount = myProjects.reduce((sum, p) => {
    return sum + p.requests.filter((r) => r.status === 'pending').length;
  }, 0);

  // Handlers for real actions
  const handlePostProject = async (
    newProjData: Omit<Project, 'id' | 'createdAt' | 'requests' | 'contributorIds' | 'status'>
  ) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isSupabaseConfigured) {
      showToast('Supabase connection needed to save projects.');
      return;
    }

    try {
      const { error } = await supabase.from('projects').insert({
        owner_id: currentUser.id,
        title: newProjData.title,
        description: newProjData.description,
        demo_url: newProjData.projectLink || null,
        commitment: newProjData.commitment,
        help_needed: newProjData.helpNeeded,
        max_contributors: newProjData.maxContributors,
        status: 'open'
      });

      if (error) throw error;

      setIsPostModalOpen(false);
      showToast('Project posted! Solo builders can now request to help.');
      await fetchProjects();
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Could not post project.'}`);
    }
  };

  const handleSendJoinRequest = async (projectId: string, note: string, contact: UserContact) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isSupabaseConfigured) {
      showToast('Supabase connection needed to send requests.');
      return;
    }

    try {
      const { error } = await supabase.from('join_requests').insert({
        project_id: projectId,
        applicant_id: currentUser.id,
        note: note || '',
        offered_contact: `${contact.type}: ${contact.handle}`,
        status: 'pending'
      });

      if (error) {
        if (error.code === '23505') {
          showToast('You already sent a request for this project!');
        } else {
          throw error;
        }
      } else {
        showToast('Request sent! The project owner will review it.');
      }

      setSelectedProjectForJoin(null);
      await fetchProjects();
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Failed to submit request.'}`);
    }
  };

  const handleAcceptRequest = async (projectId: string, requestId: string) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase
        .from('join_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      // Find the project and request to open the exchange screen immediately
      const project = projects.find((p) => p.id === projectId);
      const req = project?.requests.find((r) => r.id === requestId);

      // Create conversation if one does not exist
      if (project && req) {
        await supabase.from('conversations').upsert({
          project_id: projectId,
          request_id: requestId,
          owner_id: currentUser.id,
          contributor_id: req.applicant.id
        }, { onConflict: 'request_id' });

        setExchangeModalState({ project, request: { ...req, status: 'accepted' } });
      }

      showToast('Request accepted! Exchanging contact info.');
      await fetchProjects();
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Failed to accept request.'}`);
    }
  };

  const handleDeclineRequest = async (projectId: string, requestId: string) => {
    try {
      const { error } = await supabase
        .from('join_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (error) throw error;
      showToast('Request passed.');
      await fetchProjects();
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Failed to update request.'}`);
    }
  };

  const handleToggleContributed = async (projectId: string, contributorUserId: string) => {
    if (!currentUser) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const alreadyMarked = project.contributorIds.includes(contributorUserId);

    try {
      if (alreadyMarked) {
        await supabase
          .from('contribution_marks')
          .delete()
          .match({ project_id: projectId, contributor_id: contributorUserId });
        showToast('Contribution mark removed.');
      } else {
        await supabase
          .from('contribution_marks')
          .insert({
            project_id: projectId,
            contributor_id: contributorUserId,
            marked_by: currentUser.id
          });
        showToast('Marked as contributor! Great job shipping.');
      }
      await fetchProjects();
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Could not update contribution mark.'}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    if (selectedCommitmentFilter !== 'all' && p.commitment !== selectedCommitmentFilter) {
      return false;
    }
    if (selectedHelpFilter !== 'all' && !p.helpNeeded.includes(selectedHelpFilter as HelpType)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.helpNeeded.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  // Session verification loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mb-3" />
        <p className="text-xs font-medium text-zinc-500">Checking builder session...</p>
      </div>
    );
  }

  // Real Auth Gate: If unauthenticated, render LandingAuthPage
  if (!currentUser) {
    return (
      <>
        <LandingAuthPage onAuthSuccess={fetchProjects} />
        {isDesignSystemModalOpen && (
          <DesignSystemModal onClose={() => setIsDesignSystemModalOpen(false)} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1D1D1F] flex flex-col font-sans pb-16 sm:pb-0 selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
      {/* Global Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if ((tab === 'dashboard' || tab === 'profile') && !currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenNewProject={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIsPostModalOpen(true);
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenDesignSystem={() => setIsDesignSystemModalOpen(true)}
        pendingRequestsCount={pendingCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-zinc-900/90 backdrop-blur-md text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A84FF] shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Supabase Connection Banner (if environment variables are not yet configured) */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block">Supabase Connection Required</span>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                  CoShip runs on real Supabase Postgres & Auth. Set <code className="font-mono bg-amber-100/90 px-1 py-0.5 rounded text-amber-900">VITE_SUPABASE_URL</code> and <code className="font-mono bg-amber-100/90 px-1 py-0.5 rounded text-amber-900">VITE_SUPABASE_ANON_KEY</code> in your environment variables to enable live persistence.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-900 text-white hover:bg-amber-800 transition-colors"
            >
              Auth Instructions
            </button>
          </div>
        )}

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Feed Hero & Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                    Find 1 or 2 low-commitment contributors
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                    Real projects by solo builders looking for a weekend sprint or quick help.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchProjects}
                    disabled={projectsLoading}
                    className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-white rounded-full transition-colors border border-transparent hover:border-zinc-200"
                    title="Refresh feed"
                  >
                    <RefreshCw className={`w-4 h-4 ${projectsLoading ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      if (!currentUser) setIsAuthModalOpen(true);
                      else setIsPostModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.97] transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Project</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keywords, tech, or problem (e.g. Tailwind, AI wiring, notes)..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 border border-zinc-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                  <span className="text-[11px] font-semibold text-zinc-400 shrink-0 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    <span>Commitment:</span>
                  </span>

                  <button
                    onClick={() => setSelectedCommitmentFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                      selectedCommitmentFilter === 'all'
                        ? 'bg-[#0071E3] text-white shadow-xs'
                        : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60'
                    }`}
                  >
                    All
                  </button>

                  {COMMITMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedCommitmentFilter(opt)}
                      className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                        selectedCommitmentFilter === opt
                          ? 'bg-[#0071E3] text-white shadow-xs'
                          : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {projectsLoading ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
                <p className="text-xs text-zinc-500 font-medium">Loading matchboard from Supabase...</p>
              </div>
            ) : isSchemaMissing ? (
              <DatabaseSetupCard onRetry={fetchProjects} isRetrying={projectsLoading} />
            ) : projectsError ? (
              <div className="p-6 rounded-3xl bg-white border border-rose-200 text-center space-y-2 shadow-xs">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h3 className="font-bold text-sm text-zinc-900">Unable to load projects</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">{projectsError}</p>
                <button
                  onClick={fetchProjects}
                  className="mt-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#0071E3] bg-blue-50 hover:bg-blue-100 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              /* Authentic Notion/iOS-style Empty State */
              <div className="bg-white rounded-3xl border border-dashed border-zinc-300 p-8 sm:p-12 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center">
                  <Compass className="w-6 h-6 text-[#0071E3]" />
                </div>
                <h3 className="font-bold text-base text-zinc-900">
                  {projects.length === 0 ? 'No projects posted yet' : 'No matching projects found'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
                  {projects.length === 0
                    ? "Be the first solo builder to post what you're making and find 1 or 2 weekend contributors."
                    : 'Try clearing your filters or search terms to see all open projects.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (!currentUser) setIsAuthModalOpen(true);
                      else setIsPostModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.97] transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post the First Project</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Project Feed Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    currentUser={currentUser}
                    onViewProject={setSelectedProjectForDetail}
                    onRequestJoin={(proj) => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else {
                        setSelectedProjectForJoin(proj);
                      }
                    }}
                    onOpenExchange={(proj, reqId) => {
                      const req = proj.requests.find((r) => r.id === reqId);
                      if (req) {
                        setExchangeModalState({ project: proj, request: req });
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* OWNER DASHBOARD TAB */}
        {activeTab === 'dashboard' && currentUser && (
          <OwnerDashboard
            myProjects={myProjects}
            currentUser={currentUser}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onOpenExchange={(p, reqId) => {
              const r = p.requests.find((req) => req.id === reqId);
              if (r) setExchangeModalState({ project: p, request: r });
            }}
            onToggleContributed={handleToggleContributed}
            onOpenNewProject={() => setIsPostModalOpen(true)}
          />
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && currentUser && (
          <ProfileView
            user={currentUser}
            allProjects={projects}
            onUpdateProfile={async (updated) => {
              if (!isSupabaseConfigured) {
                setCurrentUser({ ...currentUser, ...updated });
                showToast('Profile updated locally.');
                return;
              }
              try {
                const { error } = await supabase.from('profiles').upsert({
                  id: currentUser.id,
                  email: currentUser.email || '',
                  name: updated.name || currentUser.name,
                  blurb: updated.blurb || currentUser.blurb,
                  github_url: updated.github || currentUser.github,
                  discord_handle: updated.contact?.type === 'discord' ? updated.contact.handle : null,
                  telegram_handle: updated.contact?.type === 'telegram' ? updated.contact.handle : null,
                  updated_at: new Date().toISOString()
                });
                if (error) throw error;
                setCurrentUser({ ...currentUser, ...updated });
                showToast('Profile updated in Supabase!');
              } catch (err: any) {
                showToast(`Error: ${err.message}`);
              }
            }}
            onViewProject={setSelectedProjectForDetail}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-zinc-200/80 bg-white/60 text-center text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-zinc-500">
            CoShip — post → discover → request → accept → exchange contact → leave to build.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDesignSystemModalOpen(true)}
              className="text-[#0071E3] hover:underline font-semibold"
            >
              iOS Design System
            </button>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-400 text-[11px]">
              {isSupabaseConfigured ? 'Connected to Supabase' : 'Supabase Config Needed'}
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => {
            setIsAuthModalOpen(false);
            showToast('Signed in successfully!');
            fetchProjects();
          }}
        />
      )}

      {/* iOS Design System Spec Modal */}
      {isDesignSystemModalOpen && (
        <DesignSystemModal onClose={() => setIsDesignSystemModalOpen(false)} />
      )}

      {/* Post Project Modal */}
      {isPostModalOpen && currentUser && (
        <PostProjectModal
          currentUser={currentUser}
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handlePostProject}
        />
      )}

      {/* Project Detail Modal */}
      {selectedProjectForDetail && (
        <ProjectDetailModal
          project={selectedProjectForDetail}
          currentUser={currentUser || {
            id: '',
            name: '',
            handle: '',
            avatar: '',
            blurb: '',
            contact: { type: 'discord', handle: '' }
          }}
          onClose={() => setSelectedProjectForDetail(null)}
          onRequestJoin={(proj) => {
            setSelectedProjectForDetail(null);
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setSelectedProjectForJoin(proj);
            }
          }}
          onOpenExchange={(proj, reqId) => {
            setSelectedProjectForDetail(null);
            const r = proj.requests.find((req) => req.id === reqId);
            if (r) setExchangeModalState({ project: proj, request: r });
          }}
          onGoToDashboard={() => {
            setSelectedProjectForDetail(null);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* Request to Join Modal */}
      {selectedProjectForJoin && currentUser && (
        <RequestJoinModal
          project={selectedProjectForJoin}
          currentUser={currentUser}
          onClose={() => setSelectedProjectForJoin(null)}
          onSubmitRequest={handleSendJoinRequest}
        />
      )}

      {/* Private Contact Exchange Modal */}
      {exchangeModalState && currentUser && (
        <ContactExchangeModal
          project={exchangeModalState.project}
          request={exchangeModalState.request}
          currentUser={currentUser}
          onClose={() => setExchangeModalState(null)}
          onSendMessage={async (_pId, _rId, text) => {
            // Send real message in Supabase
            try {
              const { data: conv } = await supabase
                .from('conversations')
                .select('id')
                .eq('request_id', exchangeModalState.request.id)
                .maybeSingle();

              if (conv) {
                await supabase.from('messages').insert({
                  conversation_id: conv.id,
                  sender_id: currentUser.id,
                  body: text
                });
              }
              showToast('Note sent!');
            } catch (e) {
              console.error(e);
            }
          }}
          onToggleContributed={handleToggleContributed}
        />
      )}

      {/* Mobile Bottom Navigation Bar (Real routes only) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-zinc-200/80 px-4 py-2 flex items-center justify-around">
        <button
          id="mobile-nav-feed-btn"
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-[#0071E3]' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Feed</span>
        </button>

        <button
          id="mobile-nav-dashboard-btn"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold relative transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-[#0071E3]' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Projects</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#0071E3] text-white text-[9px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          id="mobile-nav-profile-btn"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#0071E3]' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <UserCircle2 className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
