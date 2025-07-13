// src/lib/googleAuth.ts
import { jwtDecode } from 'jwt-decode';

interface GoogleUserInfo {
  sub: string;
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
}

export class GoogleAuthService {
  private static CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Dynamic script loading for Google Sign-In
  static initGoogleAuth() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  // Token decoding with error handling
  static decodeGoogleToken(token: string): GoogleUserInfo {
    try {
      return jwtDecode<GoogleUserInfo>(token);
    } catch (error) {
      console.error('Token decoding failed', error);
      throw new Error('Invalid token');
    }
  }

  // Google Sign-In initialization and callback handling
  static handleGoogleSignIn(callback: (userInfo: GoogleUserInfo) => void) {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: this.CLIENT_ID,
        callback: (response) => {
          try {
            const userObject = this.decodeGoogleToken(response.credential);
            callback(userObject);
          } catch (error) {
            console.error('Google Sign-In Error', error);
          }
        }
      });
    }
  }

  // Button rendering with customizable options
  static renderGoogleButton(elementId: string, options?: any) {
    if (window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          ...options
        }
      );
    }
  }
}