import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
//   server: {
//     port: 3000, // Optional: Match CRA's default port
//   },
  build: {
    outDir: 'dist', // Optional: Match CRA's output directory
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Suppress deprecation warnings from dependencies
      },
    },
  },
  define: {
    global: {}, // Polyfill the global variable
  },
});