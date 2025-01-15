// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Set this to the correct subdirectory
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});