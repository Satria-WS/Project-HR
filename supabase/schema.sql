-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'member', 'viewer')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status text check (status in ('planning', 'active', 'completed', 'on-hold')) default 'planning',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_by uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text check (status in ('todo', 'in-progress', 'review', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  project_id uuid references public.projects(id) on delete cascade not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete cascade not null,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  task_id uuid references public.tasks(id) on delete cascade not null,
  created_by uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create team_members table (project memberships)
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('manager', 'member', 'viewer')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, user_id)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.comments enable row level security;
alter table public.team_members enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Projects policies
create policy "Users can view projects they're members of" on public.projects
  for select using (
    created_by = auth.uid() or
    auth.uid() in (
      select user_id from public.team_members where project_id = projects.id
    )
  );

create policy "Users can create projects" on public.projects
  for insert with check (auth.uid() = created_by);

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

-- Functions and Triggers

-- Function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Add updated_at triggers to all tables
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at_column();

create trigger update_tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.update_updated_at_column();

create trigger update_comments_updated_at
  before update on public.comments
  for each row execute procedure public.update_updated_at_column();
