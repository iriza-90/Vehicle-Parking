// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Auth routes
      '/api/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },

      // Vehicle CRUD routes
      '/vehicles': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})