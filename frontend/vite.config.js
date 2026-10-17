import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/auth': {
        target: 'http://backend-service',
        changeOrigin: true,
      },
      '/doctors': {
        target: 'http://backend-service',
        changeOrigin: true,
      },
      '/appointments': {
        target: 'http://backend-service',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://backend-service',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://backend-service',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://backend-service',
        changeOrigin: true,
      },
    },
  },
})
