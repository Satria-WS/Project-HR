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
}

// Extend window object to include Google Sign-In types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (element: HTMLElement | null, options: unknown) => void;
          prompt: () => void;
          cancel: () => void;
        }
      }
    }
  }
} 