import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdf.worker.min.js')) {
            return 'pdfjs'; // Custom chunk for the worker file
          }
        }
      }
    }
  }
});
