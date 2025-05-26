import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: process.cwd(),
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});