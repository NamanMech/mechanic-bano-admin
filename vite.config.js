import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'], // Add this line
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Add this line
    },
    rollupOptions: {
      external: [
        /pdfjs-dist/,
      ]
    }
  }
})
