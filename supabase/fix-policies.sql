-- Drop existing policies that cause circular references
drop policy if exists "Users can view projects they're members of" on public.projects;
drop policy if exists "Project creators and managers can update projects" on public.projects;
drop policy if exists "Users can view tasks in their projects" on public.tasks;
drop policy if exists "Users can create tasks in their projects" on public.tasks;
drop policy if exists "Users can update tasks in their projects" on public.tasks;
drop policy if exists "Users can view comments on accessible tasks" on public.comments;
drop policy if exists "Users can create comments on accessible tasks" on public.comments;
drop policy if exists "Users can view team members of their projects" on public.team_members;
drop policy if exists "Project creators can manage team members" on public.team_members;

-- Create new policies without circular references

-- Projects policies
create policy "Users can view projects they're members of" on public.projects
  for select using (
    created_by = auth.uid() or
    auth.uid() in (
      select user_id from public.team_members where project_id = projects.id
    )
  );

create policy "Project creators and managers can update projects" on public.projects
  for update using (
    created_by = auth.uid() or 
    auth.uid() in (
      select user_id from public.team_members 
      where project_id = projects.id and role = 'manager'
    )
  );

create policy "Project creators can delete projects" on public.projects
  for delete using (created_by = auth.uid());

-- Tasks policies
create policy "Users can view tasks in their projects" on public.tasks
  for select using (
    created_by = auth.uid() or
    assigned_to = auth.uid() or
    project_id in (
      select id from public.projects where created_by = auth.uid()
    ) or
    project_id in (
      select project_id from public.team_members where user_id = auth.uid()
    )
  );

create policy "Users can create tasks in their projects" on public.tasks
  for insert with check (
    project_id in (
      select id from public.projects where created_by = auth.uid()
    ) or
    project_id in (
      select project_id from public.team_members where user_id = auth.uid()
    )
  );

create policy "Users can update tasks in their projects" on public.tasks
  for update using (
    created_by = auth.uid() or
    assigned_to = auth.uid() or
    project_id in (
      select id from public.projects where created_by = auth.uid()
    ) or
    project_id in (
      select project_id from public.team_members where user_id = auth.uid()
    )
  );

create policy "Users can delete tasks they created or in their projects" on public.tasks
  for delete using (
    created_by = auth.uid() or
    project_id in (
      select id from public.projects where created_by = auth.uid()
    )
  );

-- Comments policies
create policy "Users can view comments on accessible tasks" on public.comments
  for select using (
    created_by = auth.uid() or
    task_id in (
      select id from public.tasks where 
        created_by = auth.uid() or
        assigned_to = auth.uid() or
        project_id in (
          select id from public.projects where created_by = auth.uid()
        ) or
        project_id in (
          select project_id from public.team_members where user_id = auth.uid()
        )
    )
  );

create policy "Users can create comments on accessible tasks" on public.comments
  for insert with check (
    task_id in (
      select id from public.tasks where 
        created_by = auth.uid() or
        assigned_to = auth.uid() or
        project_id in (
          select id from public.projects where created_by = auth.uid()
        ) or
        project_id in (
          select project_id from public.team_members where user_id = auth.uid()
        )
    )
  );

create policy "Users can update their own comments" on public.comments
  for update using (created_by = auth.uid());

create policy "Users can delete their own comments" on public.comments
  for delete using (created_by = auth.uid());

-- Team members policies
create policy "Users can view team members of their projects" on public.team_members
  for select using (
    user_id = auth.uid() or
    project_id in (
      select id from public.projects where created_by = auth.uid()
    )
  );

create policy "Project creators can manage team members" on public.team_members
  for insert with check (
    project_id in (
      select id from public.projects where created_by = auth.uid()
    )
  );

create policy "Project creators can update team members" on public.team_members
  for update using (
    project_id in (
      select id from public.projects where created_by = auth.uid()
    )
  );

create policy "Project creators can remove team members" on public.team_members
  for delete using (
    project_id in (
      select id from public.projects where created_by = auth.uid()
    )
  );
