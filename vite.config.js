import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The production build is served from a domain root (idealfresh360.pages.dev),
  // so asset URLs must be absolute and identical in every environment.
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          motion: ['gsap'],
        },
      },
    },
  },
})
