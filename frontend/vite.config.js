import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In Docker dev, set VITE_PROXY_TARGET=http://backend:3001 (Compose service name)
const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    },
    proxy: {
      '/api': { target: proxyTarget, changeOrigin: true },
      '/ws': { target: proxyTarget, ws: true },
    },
  },
});
