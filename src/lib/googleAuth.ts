// src/lib/googleAuth.ts
import { jwtDecode } from 'jwt-decode';

interface GoogleUserInfo {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export class GoogleAuthService {
  private static CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  static initGoogleAuth() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  static handleGoogleSignIn(callback: (userInfo: GoogleUserInfo) => void) {
    const googleSignInButton = document.getElementById('g_id_onload');
    
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: this.CLIENT_ID,
        callback: (response) => {
          const userObject = jwtDecode(response.credential) as GoogleUserInfo;
          callback(userObject);
        }
      });

      window.google.accounts.id.renderButton(
        googleSignInButton,
        { 
          theme: 'outline', 
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left'
        }
      );
    }
  }
}