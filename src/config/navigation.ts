// src/config/navigation.ts
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Projects', 
    href: '/projects', 
    icon: FolderKanban 
  },
  { 
    name: 'Tasks', 
    href: '/tasks', 
    icon: CheckSquare 
  },
  { 
    name: 'Team', 
    href: '/team', 
    icon: Users 
  },
  // Uncomment when ready
  // { 
  //   name: 'Reports', 
  //   href: '/reports', 
  //   icon: BarChart3 
  // },
  // { 
  //   name: 'Settings', 
  //   href: '/settings', 
  //   icon: Settings 
  // }
];