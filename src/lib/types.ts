// Types for Google Sign-In
export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  email_verified?: boolean;
  sub?: string;
}

export interface GoogleButtonConfig {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: GoogleUserInfo | null;
  error: AuthError | null;
}

// Callback types for authentication
export type AuthSuccessCallback = (userInfo: GoogleUserInfo) => void;
export type AuthErrorCallback = (error: AuthError) => void;
