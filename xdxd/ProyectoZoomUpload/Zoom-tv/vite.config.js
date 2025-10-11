import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Puedes agregar aliases si es necesario
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-icons'],
          ai: ['@google/generative-ai'],
          utils: ['axios', 'hls.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})  