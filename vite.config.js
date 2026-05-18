import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          // If the backend expects /api prefix, keep it. 
          // If the backend endpoint is just /auth/login but mounted at /api, we might need rewrite.
          // Based on user request: Endpoint: /api/auth/login, so we keep /api.
        }
      }
    }
  }
})
