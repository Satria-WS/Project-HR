// src/types/global.d.ts
import { GoogleCredentialResponse, GoogleButtonConfig } from '../lib/types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (element: HTMLElement | null, options: GoogleButtonConfig) => void;
          cancel: () => void;
          revoke: () => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        }
      }
    };
  }
}

// Ensure the module can be augmented
export {};
