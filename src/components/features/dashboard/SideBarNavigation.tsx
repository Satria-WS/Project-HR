// src/components/layout/SidebarNavigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../../../config/navigation';
import { RecentProjects } from './RecentProject';

export function SidebarNavigation() {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen px-4 py-6 bg-white border-r border-gray-200">
      <nav className="space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon 
                className={`w-5 h-5 mr-3 ${
                  isActive 
                    ? 'text-indigo-600' 
                    : 'text-gray-400 group-hover:text-gray-500'
                }`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <RecentProjects />
    </div>
  );
}