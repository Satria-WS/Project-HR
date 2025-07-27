import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Project-HR/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@store': path.resolve(__dirname, './src/store'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@types': path.resolve(__dirname, './src/types'),
      '@services': path.resolve(__dirname, './src/services'),
      '@interface': path.resolve(__dirname, './src/interface')
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Fallback for environment variables if .env is not working
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || '614508406727-jj1l2blt4u74rrvs0t9kriv8kof8v48o.apps.googleusercontent.com'),
  },
});
