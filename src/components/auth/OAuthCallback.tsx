import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuth callback handler triggered');
        console.log('Current URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        
        setStatus('Processing authentication tokens...');
        
        // Check if we have auth tokens in URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus(`Authentication error: ${errorDescription || error}`);
          setTimeout(() => navigate('/login?error=' + encodeURIComponent(errorDescription || error)), 3000);
          return;
        }
        
        if (accessToken) {
          console.log('Found access token, setting session...');
          setStatus('Setting up your session...');
          
          // Set the session using the tokens from URL
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (sessionError) {
            console.error('Error setting session:', sessionError);
            setStatus(`Session error: ${sessionError.message}`);
            setTimeout(() => navigate('/login?error=' + encodeURIComponent('Authentication failed')), 3000);
            return;
          }
          
          console.log('Session set successfully:', data);
          setStatus('Authentication successful! Redirecting...');
          
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          
          // Wait a moment then navigate to dashboard
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          console.log('No access token found, checking current session...');
          setStatus('Checking authentication status...');
          
          // Check if user is already authenticated
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('User already authenticated, redirecting to dashboard');
            setStatus('Already authenticated! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1000);
          } else {
            console.log('No session found, redirecting to login');
            setStatus('No authentication found. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
          }
        }
      } catch (error) {
        console.error('Error in OAuth callback handler:', error);
        setStatus(`Unexpected error: ${error instanceof Error ? error.message : 'Authentication failed'}`);
        setTimeout(() => navigate('/login?error=' + encodeURIComponent('Authentication failed')), 3000);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Completing authentication...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
