-- SOLUSI UNTUK DEVELOPMENT: Disable RLS yang bermasalah
-- CATATAN: Untuk production nanti bisa diubah lagi

-- 1. Drop semua policies yang bermasalah
DROP POLICY IF EXISTS "Users can view projects they're members of" ON public.projects;
DROP POLICY IF EXISTS "Project creators and managers can update projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks they created or in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can view comments on accessible tasks" ON public.comments;
DROP POLICY IF EXISTS "Users can create comments on accessible tasks" ON public.comments;
DROP POLICY IF EXISTS "Users can view team members of their projects" ON public.team_members;
DROP POLICY IF EXISTS "Project creators can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Project creators can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Project creators can remove team members" ON public.team_members;

-- 2. Disable RLS untuk tabel yang bermasalah (DEVELOPMENT ONLY)
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;

-- 3. Keep profiles RLS enabled dengan policies sederhana
-- (policies profiles sudah OK, tidak bermasalah)

-- 4. Buat policies sederhana untuk yang masih perlu keamanan dasar
-- Re-enable RLS dengan policies yang sangat sederhana
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Projects: Policies super sederhana
CREATE POLICY "allow_all_projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- Tasks: Policies super sederhana
CREATE POLICY "allow_all_tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- Comments: Policies super sederhana
CREATE POLICY "allow_all_comments" ON public.comments FOR ALL USING (true) WITH CHECK (true);

-- Team Members: Policies super sederhana
CREATE POLICY "allow_all_team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
