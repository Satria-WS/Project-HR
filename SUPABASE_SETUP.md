# Supabase Integration Setup Guide

## 🚀 Quick Setup

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

### 2. Set up the Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create all tables, policies, and triggers

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Update Your Components

Replace your existing auth hooks with the new Supabase auth:

```tsx
// Old way
import { useAuth } from '@/hooks/useAuth';

// New way
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

function MyComponent() {
  const { user, signIn, signOut, loading } = useSupabaseAuth();
  // ... rest of your component
}
```

## 📊 Available Services

### ProjectService
```tsx
import { ProjectService } from '@/services/projectService';

// Get all projects
const projects = await ProjectService.getProjects();

// Create a project
const project = await ProjectService.createProject({
  name: 'My Project',
  description: 'Project description',
  created_by: user.id
});
```

### TaskService
```tsx
import { TaskService } from '@/services/taskService';

// Get tasks for a project
const tasks = await TaskService.getTasks(projectId);

// Create a task
const task = await TaskService.createTask({
  title: 'New Task',
  project_id: projectId,
  created_by: user.id
});
```

### TeamService
```tsx
import { TeamService } from '@/services/teamService';

// Get team members
const members = await TeamService.getTeamMembers();

// Update user profile
const profile = await TeamService.updateTeamMember(userId, {
  full_name: 'New Name'
});
```

## 🔐 Authentication Features

### Sign Up / Sign In
```tsx
const { signUp, signIn, signOut, user } = useSupabaseAuth();

// Sign up
await signUp(email, password, { full_name: 'John Doe' });

// Sign in
await signIn(email, password);

// Sign out
await signOut();
```

### Profile Management
```tsx
const { updateProfile, profile } = useSupabaseAuth();

// Update profile
await updateProfile({
  full_name: 'New Name',
  avatar_url: 'https://example.com/avatar.jpg'
});
```

## 📱 Real-time Features

Supabase provides real-time subscriptions out of the box:

```tsx
useEffect(() => {
  const subscription = supabase
    .channel('tasks')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tasks' },
      (payload) => {
        console.log('Change received!', payload);
        // Update your local state
      }
    )
    .subscribe();

  return () => supabase.removeChannel(subscription);
}, []);
```

## 🛡️ Security

- All tables have Row Level Security (RLS) enabled
- Users can only access projects they're members of
- Project creators have full control over their projects
- Team members can be assigned different roles (manager, member, viewer)

## 📋 Migration from Current Setup

1. **Replace Axios calls** with Supabase services
2. **Update authentication** to use `useSupabaseAuth`
3. **Migrate data** from your current backend to Supabase
4. **Test thoroughly** with the new auth flow

## 🔧 Advanced Configuration

### Custom Authentication Providers
You can add Google OAuth, GitHub, etc. through Supabase:

1. Go to Authentication > Providers in Supabase dashboard
2. Enable desired providers
3. Update your auth flow accordingly

### File Storage
For file uploads (avatars, attachments):

```tsx
import { supabase } from '@/lib/supabase';

const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${user.id}/${file.name}`, file);
    
  if (error) throw error;
  return data;
};
```

## 🎯 Benefits of Supabase Integration

✅ **Real-time capabilities** - Live updates across all clients  
✅ **Built-in authentication** - User management made simple  
✅ **Row Level Security** - Database-level security policies  
✅ **Type safety** - Full TypeScript support  
✅ **Scalability** - PostgreSQL backend that scales  
✅ **Cost effective** - Generous free tier  

Your project is now ready to use Supabase as the backend! 🎉
