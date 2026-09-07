export const COSHIP_SQL_SCHEMA = `-- ==============================================================================
-- CoShip MVP — Supabase Postgres Schema & Row Level Security (RLS)
-- Run this in your Supabase SQL Editor to initialize all tables
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  handle TEXT,
  avatar_url TEXT,
  blurb TEXT DEFAULT '',
  github_url TEXT,
  discord_handle TEXT,
  telegram_handle TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-create profile on Supabase auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, handle, avatar_url, github_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    LOWER(COALESCE(NEW.raw_user_meta_data->>'user_name', split_part(NEW.email, '@', 1))),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 1000),
  help_needed TEXT[] NOT NULL DEFAULT '{}',
  commitment TEXT NOT NULL DEFAULT 'weekend',
  demo_url TEXT,
  github_repo TEXT,
  max_contributors SMALLINT NOT NULL DEFAULT 2 CHECK (max_contributors BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. JOIN REQUESTS
CREATE TABLE IF NOT EXISTS public.join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note TEXT CHECK (char_length(note) <= 500),
  offered_contact TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_applicant_project UNIQUE (applicant_id, project_id)
);

-- 4. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.join_requests(id) ON DELETE CASCADE UNIQUE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contributor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_participants CHECK (owner_id <> contributor_id)
);

-- 5. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) > 0 AND char_length(body) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CONTRIBUTION MARKS
CREATE TABLE IF NOT EXISTS public.contribution_marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  contributor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  marked_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_project_contributor UNIQUE (project_id, contributor_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_created ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_join_requests_project ON public.join_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_applicant ON public.join_requests(applicant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(owner_id, contributor_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_marks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects Policies
DROP POLICY IF EXISTS "Anyone can view open and matched projects" ON public.projects;
CREATE POLICY "Anyone can view open and matched projects" ON public.projects FOR SELECT USING (status IN ('open', 'matched') OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Authenticated users can post projects" ON public.projects;
CREATE POLICY "Authenticated users can post projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update their projects" ON public.projects;
CREATE POLICY "Owners can update their projects" ON public.projects FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete their projects" ON public.projects;
CREATE POLICY "Owners can delete their projects" ON public.projects FOR DELETE USING (auth.uid() = owner_id);

-- Join Requests Policies
DROP POLICY IF EXISTS "Users can request to join other projects" ON public.join_requests;
CREATE POLICY "Users can request to join other projects" ON public.join_requests FOR INSERT WITH CHECK (
  auth.uid() = applicant_id AND NOT EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "Applicants and project owners can view requests" ON public.join_requests;
CREATE POLICY "Applicants and project owners can view requests" ON public.join_requests FOR SELECT USING (
  auth.uid() = applicant_id OR EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "Owners can accept/decline; applicants can withdraw" ON public.join_requests;
CREATE POLICY "Owners can accept/decline; applicants can withdraw" ON public.join_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()) OR (auth.uid() = applicant_id AND status = 'pending')
);

-- Conversations Policies
DROP POLICY IF EXISTS "Participants can view their conversation" ON public.conversations;
CREATE POLICY "Participants can view their conversation" ON public.conversations FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = contributor_id);

DROP POLICY IF EXISTS "Project owners can create conversation upon acceptance" ON public.conversations;
CREATE POLICY "Project owners can create conversation upon acceptance" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Messages Policies
DROP POLICY IF EXISTS "Participants can view conversation messages" ON public.messages;
CREATE POLICY "Participants can view conversation messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (owner_id = auth.uid() OR contributor_id = auth.uid()))
);

DROP POLICY IF EXISTS "Participants can insert messages" ON public.messages;
CREATE POLICY "Participants can insert messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (owner_id = auth.uid() OR contributor_id = auth.uid()))
);

-- Contribution Marks Policies
DROP POLICY IF EXISTS "Anyone can view contribution marks" ON public.contribution_marks;
CREATE POLICY "Anyone can view contribution marks" ON public.contribution_marks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only project owner can mark contributions" ON public.contribution_marks;
CREATE POLICY "Only project owner can mark contributions" ON public.contribution_marks FOR INSERT WITH CHECK (
  auth.uid() = marked_by AND EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);
`;
