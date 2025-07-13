// src/pages/layout/login/login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { GoogleAuthService } from '@/lib/googleAuth';
import { GoogleUserInfo, AuthError } from '@/lib/types';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeAuth();
    
    // Cleanup on unmount
    return () => {
      GoogleAuthService.cleanup();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      // Check if user is already authenticated
      if (GoogleAuthService.isAuthenticated()) {
        navigate('/', { replace: true });
        return;
      }

      // Initialize Google Auth
      const initialized = await GoogleAuthService.initGoogleAuth();
      if (!initialized) {
        throw new Error('Failed to initialize Google Authentication');
      }

      // Setup Google Sign-In with callbacks
      GoogleAuthService.setupGoogleSignIn(
        handleAuthSuccess,
        handleAuthError
      );

      // Render the Google Sign-In button
      setTimeout(() => {
        const buttonRendered = GoogleAuthService.renderGoogleButton('googleSignInButton', {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular'
        });

        if (!buttonRendered) {
          setError('Failed to render Google Sign-In button. Please refresh the page.');
        }
      }, 100);

    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize authentication');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAuthSuccess = (userInfo: GoogleUserInfo) => {
    setIsLoading(true);
    setError(null);

    try {
      // Store user information securely
      const userProfile = {
        id: userInfo.id || userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        emailVerified: userInfo.email_verified || false
      };

      localStorage.setItem('userProfile', JSON.stringify(userProfile));

      // Navigate to dashboard with a slight delay for better UX
      setTimeout(() => {
        setIsLoading(false);
        navigate('/', { replace: true });
      }, 500);

    } catch (err) {
      console.error('Error storing user profile:', err);
      setError('Failed to save user information. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAuthError = (authError: AuthError) => {
    console.error('Authentication error:', authError);
    setIsLoading(false);
    
    // Provide user-friendly error messages
    let errorMessage = 'Authentication failed. Please try again.';
    
    switch (authError.code) {
      case 'SETUP_ERROR':
        errorMessage = 'Failed to setup authentication. Please refresh the page.';
        break;
      case 'AUTH_ERROR':
        errorMessage = authError.message || 'Authentication failed. Please try again.';
        break;
      default:
        errorMessage = authError.message || errorMessage;
    }
    
    setError(errorMessage);
  };

  const handleRetry = () => {
    setError(null);
    initializeAuth();
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4 py-8">
      <div className="w-full max-w-md space-y-8 bg-white shadow-2xl rounded-2xl border border-gray-200 p-10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <div className="text-center">
          {/* Header with icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-indigo-50 p-4 rounded-full shadow-md">
              <Shield className="h-10 w-10 text-indigo-600" />
            </div>
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Project Hub
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Secure Project Management Platform
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="block text-sm">{error}</span>
                  <button
                    onClick={handleRetry}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Google Sign-In Button Container */}
          <div className="w-full">
            <div 
              id="googleSignInButton" 
              className="w-full flex justify-center mb-4"
            />
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {/* Footer Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Lock className="mr-2 h-4 w-4 text-gray-400" />
              Secure login powered by Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
