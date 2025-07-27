import { 
  GoogleCredentialResponse, 
  GoogleUserInfo, 
  GoogleButtonConfig, 
  AuthError,
  AuthSuccessCallback,
  AuthErrorCallback 
} from '../types/interfaces/auth';

export class GoogleAuthService {
  private static CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private static scriptLoaded = false;
  private static isInitialized = false;

  // Validate environment variables
  private static validateEnvironment(): void {
    console.log('=== ENVIRONMENT DEBUG START ===');
    console.log('Static CLIENT_ID:', this.CLIENT_ID);
    console.log('import.meta.env.VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    console.log('import.meta.env.MODE:', import.meta.env.MODE);
    console.log('import.meta.env.DEV:', import.meta.env.DEV);
    console.log('import.meta.env.PROD:', import.meta.env.PROD);
    console.log('Full import.meta.env:', import.meta.env);
    console.log('Object.keys(import.meta.env):', Object.keys(import.meta.env));
    
    // Check if any VITE_ variables exist
    const viteVars = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
    console.log('All VITE_ variables found:', viteVars);
    
    // Try to get the CLIENT_ID dynamically
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || this.CLIENT_ID;
    console.log('Final clientId:', clientId);
    console.log('=== ENVIRONMENT DEBUG END ===');
    
    if (!clientId) {
      console.error('Environment variables not loaded. This usually means:');
      console.error('1. .env file is not in the root directory');
      console.error('2. Development server needs to be restarted');
      console.error('3. Environment variable name is incorrect');
      console.error('4. .env file has syntax errors');
      throw new Error('VITE_GOOGLE_CLIENT_ID is not configured in environment variables');
    }
    
    // Update the CLIENT_ID if it was found
    this.CLIENT_ID = clientId;
  }

  // Initialize Google Sign-In
  static async initGoogleAuth(): Promise<boolean> {
    try {
      this.validateEnvironment();

      // Prevent multiple initializations
      if (this.isInitialized) {
        return true;
      }

      // Load Google script if not already loaded
      if (!this.scriptLoaded) {
        await this.loadGoogleScript();
      }

      // Check if Google API is available
      if (!window.google?.accounts?.id) {
        throw new Error('Google Sign-In API not available');
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      return false;
    }
  }

  // Load Google Sign-In script
  private static loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google?.accounts?.id) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In script'));
      };

      document.head.appendChild(script);
    });
  }

  // Setup Google Sign-In with callbacks
  static setupGoogleSignIn(
    onSuccess: AuthSuccessCallback,
    onError: AuthErrorCallback
  ): void {
    try {
      if (!window.google?.accounts?.id) {
        throw new Error('Google Sign-In not initialized');
      }

      window.google.accounts.id.initialize({
        client_id: this.CLIENT_ID,
        callback: (response: GoogleCredentialResponse) => {
          this.handleGoogleResponse(response, onSuccess, onError);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (error) {
      const authError: AuthError = {
        code: 'SETUP_ERROR',
        message: 'Failed to setup Google Sign-In',
        details: error
      };
      onError(authError);
    }
  }

  // Handle Google Sign-In response
  private static handleGoogleResponse(
    response: GoogleCredentialResponse,
    onSuccess: AuthSuccessCallback,
    onError: AuthErrorCallback
  ): void {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Decode the JWT token
      const userInfo = this.decodeGoogleToken(response.credential);
      
      // Validate user info
      if (!userInfo.email || !userInfo.name) {
        throw new Error('Invalid user information received');
      }

      onSuccess(userInfo);
    } catch (error) {
      const authError: AuthError = {
        code: 'AUTH_ERROR',
        message: error instanceof Error ? error.message : 'Authentication failed',
        details: error
      };
      onError(authError);
    }
  }

  // Decode Google JWT Token
  static decodeGoogleToken(token: string): GoogleUserInfo {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid token format');
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      return {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified,
        sub: payload.sub
      };
    } catch {
      throw new Error('Failed to decode Google token');
    }
  }

  // Render Google Sign-In Button
  static renderGoogleButton(
    elementId: string, 
    config: Partial<GoogleButtonConfig> = {}
  ): boolean {
    try {
      if (!window.google?.accounts?.id) {
        console.error('Google Sign-In not initialized');
        return false;
      }

      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element with id '${elementId}' not found`);
        return false;
      }

      const defaultConfig: GoogleButtonConfig = {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center'
      };

      const buttonConfig = { ...defaultConfig, ...config };

      window.google.accounts.id.renderButton(element, buttonConfig);
      return true;
    } catch (error) {
      console.error('Failed to render Google Sign-In button:', error);
      return false;
    }
  }

  // Sign out user
  static signOut(): void {
    try {
      // Clear local storage
      localStorage.removeItem('userProfile');
      
      // Cancel Google Sign-In
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    try {
      const userProfile = localStorage.getItem('userProfile');
      return !!userProfile;
    } catch {
      return false;
    }
  }

  // Get current user
  static getCurrentUser(): GoogleUserInfo | null {
    try {
      const userProfile = localStorage.getItem('userProfile');
      return userProfile ? JSON.parse(userProfile) : null;
    } catch {
      return null;
    }
  }

  // Cleanup
  static cleanup(): void {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}
