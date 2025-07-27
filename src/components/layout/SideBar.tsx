// src/pages/layout/Sidebar.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { NAVIGATION_ITEMS } from '@/config/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { UserAvatar } from '@/components/ui';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Use Supabase auth instead of localStorage
  const { user, profile, signOut, loading } = useSupabaseAuth();

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      setShowUserMenu(false); // Close menu immediately
      
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful');
      }
      
      // Navigate to login regardless of logout result
      navigate('/login', { replace: true });
      
      // Force page reload to clear any remaining state
      window.location.href = '/login';
    } catch (error) {
      console.error('Unexpected logout error:', error);
      // Force navigation even if there's an error
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 py-8 px-4 flex flex-col">
      {/* Header */}
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold text-gray-800">Project Hub</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
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

      {/* User Profile Section */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        {user && profile ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <div className="flex items-center flex-1">
                <UserAvatar
                  src={profile.avatar_url}
                  name={profile.full_name || user.email}
                  size="md"
                  className="mr-3"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3 text-gray-400" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 py-3">
            {loading ? (
              <div className="w-full flex items-center justify-center px-4 py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
