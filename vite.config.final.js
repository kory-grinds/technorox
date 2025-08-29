import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: '127.0.0.1',
    strictPort: false,
    hmr: false, // Disable HMR completely
    watch: {
      usePolling: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
  },
  define: {
    global: 'globalThis'
  }
})
