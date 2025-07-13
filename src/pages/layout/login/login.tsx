// src/pages/layout/login/login.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Sign-In
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    // Setup Google Sign-In callback
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn
      });
    }

    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  const handleGoogleSignIn = (response: any) => {
    if (response.credential) {
      const userObject = decodeJwtResponse(response.credential);
      
      localStorage.setItem('userProfile', JSON.stringify({
        id: userObject.sub,
        name: userObject.name,
        email: userObject.email,
        picture: userObject.picture
      }));

      navigate('/dashboard');
    }
  };

  // Simple JWT decode function
  const decodeJwtResponse = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  const handleManualGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-8">
      <div className="w-full max-w-md space-y-8 bg-white shadow-2xl rounded-2xl border border-gray-200 p-10">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-indigo-50 p-4 rounded-full">
              <LogIn className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Project Hub
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Streamline Your Project Management
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleManualGoogleSignIn}
            className="w-full flex items-center justify-center py-3 px-4 
            border border-gray-300 rounded-lg shadow-md 
            text-gray-700 bg-white hover:bg-gray-50 
            transition duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            {/* Google SVG Icon */}
            <svg 
              className="w-6 h-6 mr-3" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 48 48"
            >
              <path 
                fill="#4285F4" 
                d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
              />
              <path 
                fill="#34A853" 
                d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
              />
              <path 
                fill="#FBBC05" 
                d="M11.68 28.18c-.75-2.24-1.16-4.64-1.16-7.18s.41-4.94 1.16-7.18V8.02H4.34C2.85 10.94 2 14.35 2 18s.85 7.06 2.34 9.98l7.34-5.8z"
              />
              <path 
                fill="#EA4335" 
                d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.29 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.02l7.34 5.8c1.74-5.2 6.59-9.07 12.32-9.07z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Secure and seamless login powered by Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extend window interface for Google Sign-In
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, options: any) => void;
          prompt: () => void;
          cancel: () => void;
        }
      }
    };
    atob: (encoded: string) => string;
  }
}