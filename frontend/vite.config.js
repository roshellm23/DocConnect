import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxyTarget = process.env.VITE_BACKEND_TARGET || process.env.BACKEND_URL || 'http://localhost:5000';

const apiProxy = {
  '/auth': {
    target: proxyTarget,
    changeOrigin: true,
  },
  '/doctors': {
    target: proxyTarget,
    changeOrigin: true,
  },
  '/appointments': {
    target: proxyTarget,
    changeOrigin: true,
  },
  '/admin': {
    target: proxyTarget,
    changeOrigin: true,
  },
  '/health': {
    target: proxyTarget,
    changeOrigin: true,
  },
  '/api': {
    target: proxyTarget,
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: apiProxy,
  },
  preview: {
    host: '0.0.0.0',
    port: 80,
    proxy: apiProxy,
  },
})
