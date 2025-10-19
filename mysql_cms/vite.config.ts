import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '3001'),
    host: '0.0.0.0', // Importante para Render
    strictPort: true,
    allowedHosts: 'all'
  },
  preview: {
    port: parseInt(process.env.PORT || '3001'),
    host: '0.0.0.0', // Importante para Render
    strictPort: true,
    allowedHosts: 'all'
  },
  build: {
    outDir: 'dist'
  }
})
