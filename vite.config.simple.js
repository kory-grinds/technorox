import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: 'localhost',
    hmr: false, // Completely disable HMR to eliminate WebSocket issues
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
  }
})
