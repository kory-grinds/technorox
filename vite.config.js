import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      port: 24678,
      host: 'localhost'
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
  }
})