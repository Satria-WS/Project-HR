// src/pages/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '@/config/navigation';

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 py-8 px-4">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold text-gray-800">Project Hub</h1>
      </div>

      <nav className="space-y-2">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-4 py-2 rounded-md transition-colors duration-200
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}