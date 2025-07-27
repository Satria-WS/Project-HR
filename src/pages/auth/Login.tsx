import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/supabase';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSupabaseAuth();

  // Navigate to dashboard when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('User is authenticated, navigating to dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Initiating Google login...');
      const { error } = await auth.signInWithGoogle();
      
      if (error) {
        console.error('Google login error:', error);
        
        // Handle specific Supabase provider errors
        if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider')) {
          setError('Google OAuth is not configured in Supabase. Please contact administrator.');
        } else {
          setError(error.message || 'Failed to login with Google');
        }
        setIsLoading(false);
        return;
      }
      
      console.log('Google login initiated successfully');
      // Auth state will be handled automatically by useSupabaseAuth hook
    } catch (err) {
      console.error('Unexpected Google login error:', err);
      setError('An unexpected error occurred during login');
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-indigo-100 mb-6">
            <User className="h-10 w-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Project Hub
          </h1>
          <p className="text-lg text-gray-600">
            Sign in with your Google account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Authentication Error</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-4 px-6 border-2 border-blue-300 rounded-lg shadow-sm text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
            ) : (
              <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Secure Authentication</p>
                <p className="mt-1">
                  We use Google OAuth through Supabase for secure authentication. 
                  Your data is protected and we never store your password.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">After signing in, you can:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Manage projects and tasks
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Collaborate with team members
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Generate reports and analytics
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Track progress with Kanban boards
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>© 2025 Project Hub</p>
          <p>Powered by Supabase & Google OAuth</p>
        </div>
      </div>
    </div>
  );
}
