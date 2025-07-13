import { GoogleCredentialResponse } from './types';

export class GoogleAuthService {
  private static CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private static REDIRECT_URI = 'http://localhost:5173/login';
  private static scriptLoaded = false;

  // Initialize Google Sign-In
  static initGoogleAuth(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Prevent multiple script loads
      if (this.scriptLoaded) {
        resolve(true);
        return;
      }

      // Check if script is already loaded
      if (window.google?.accounts?.id) {
        this.scriptLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Initialize Google Sign-In
        window.google?.accounts.id.initialize({
          client_id: this.CLIENT_ID,
          callback: this.handleGoogleSignIn
        });

        this.scriptLoaded = true;
        resolve(true);
      };

      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        reject(false);
      };

      document.head.appendChild(script);
    });
  }

  // Handle Google Sign-In Callback
  static handleGoogleSignIn(response: GoogleCredentialResponse) {
    if (!response.credential) {
      console.error('No credential received');
      return;
    }

    try {
      // Decode the JWT token
      const userInfo = this.decodeGoogleToken(response.credential);
      
      // Store user information
      localStorage.setItem('userProfile', JSON.stringify(userInfo));
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Google Sign-In failed', error);
    }
  }

  // Decode Google JWT Token
  static decodeGoogleToken(token: string): GoogleUserInfo {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const payload = JSON.parse(window.atob(base64));

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };
  }

  // Render Google Sign-In Button
  static renderGoogleButton(elementId: string) {
    if (!window.google?.accounts?.id) {
      console.error('Google Sign-In script not loaded');
      return;
    }

    try {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId)!,
        { 
          type: 'standard', 
          theme: 'outline', 
          size: 'large', 
          text: 'continue_with', 
          shape: 'rectangular', 
          logo_alignment: 'center' 
        }
      );
    } catch (error) {
      console.error('Failed to render Google Sign-In button', error);
    }
  }
}

// Define user info interface
export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}