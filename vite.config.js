import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // React plugin add karein
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdf.worker.min.js')) {
            return 'pdfjs';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
