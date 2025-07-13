// src/pages/layout/login/login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Shield, Lock } from 'lucide-react';
import { GoogleAuthService } from '@/lib/googleAuth';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check existing authentication
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      navigate('/dashboard');
      return;
    }

    // Initialize Google Sign-In
    GoogleAuthService.initGoogleAuth();

    // Setup Sign-In callback
    GoogleAuthService.handleGoogleSignIn(
      (userInfo) => {
        setIsLoading(true);
        try {
          // Store user information securely
          localStorage.setItem('userProfile', JSON.stringify({
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            emailVerified: userInfo.email_verified
          }));

          // Simulate a slight delay to show loading state
          setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
          }, 500);
        } catch (err) {
          setError('Authentication failed. Please try again.');
          setIsLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    // Render Google Sign-In button
    GoogleAuthService.renderGoogleButton('googleSignInButton');

    // Cleanup
    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [navigate]);

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
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center">
              <Lock className="mr-2 h-5 w-5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button Container */}
          <div 
            id="googleSignInButton" 
            className="w-full flex justify-center"
          >
            {/* Fallback button if Google button doesn't render */}
            {!isLoading && (
              <button 
                className="w-full flex items-center justify-center py-3 px-4 
                border border-gray-300 rounded-lg shadow-md 
                text-gray-700 bg-white hover:bg-gray-50 
                transition duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                <svg 
                  className="w-6 h-6 mr-3" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 48 48"
                >
                  {/* Google SVG Icon */}
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.68 28.18c-.75-2.24-1.16-4.64-1.16-7.18s.41-4.94 1.16-7.18V8.02H4.34C2.85 10.94 2 14.35 2 18s.85 7.06 2.34 9.98l7.34-5.8z"/>
                  <path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.29 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.02l7.34 5.8c1.74-5.2 6.59-9.07 12.32-9.07z"/>
                </svg>
                Continue with Google
              </button>
            )}
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