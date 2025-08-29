#!/usr/bin/env node

/**
 * Quick fix script for Technorox TCG issues
 * Run this with: node fix-issues.js
 */

import fs from 'fs'
import path from 'path'

console.log('🔧 Fixing Technorox TCG issues...')

// 1. Fix Vite config for WebSocket issues
const viteConfig = `import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: 'localhost',
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
  }
})`

fs.writeFileSync('vite.config.js', viteConfig)
console.log('✅ Updated vite.config.js')

// 2. Create a simple main.js that uses debug app
const mainJs = `import './styles/main.css'
import { initializeApp } from './app-debug.js'
import { initializeFirebase } from './config/firebase.js'
import { firebaseService } from './services/FirebaseService.js'

console.log('🚀 Starting Technorox TCG...')

const firebaseEnabled = initializeFirebase()
if (firebaseEnabled) {
    console.log('🔥 Firebase services enabled')
    firebaseService.init().then(() => {
        console.log('🔥 Firebase service initialized')
    }).catch(error => {
        console.error('Firebase service initialization failed:', error)
    })
} else {
    console.log('🎮 Running in demo mode - Firebase disabled')
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration)
                
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateAvailable()
                        }
                    })
                })
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError)
            })
    })
}

function showUpdateAvailable() {
    const updateBanner = document.createElement('div')
    updateBanner.innerHTML = \`
        <div style="position: fixed; top: 0; left: 0; right: 0; background: #00FFF7; color: black; padding: 10px; text-align: center; z-index: 9999;">
            A new version is available! 
            <button onclick="window.location.reload()" style="margin-left: 10px; padding: 5px 10px; background: black; color: #00FFF7; border: none; cursor: pointer;">
                Update Now
            </button>
        </div>
    \`
    document.body.appendChild(updateBanner)
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOM loaded, initializing app...')
    initializeApp()
})`

fs.writeFileSync('src/main-debug.js', mainJs)
console.log('✅ Created src/main-debug.js')

// 3. Create package.json scripts
const packageJsonPath = 'package.json'
let packageJson = {}

if (fs.existsSync(packageJsonPath)) {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
}

packageJson.scripts = {
    ...packageJson.scripts,
    "dev": "vite",
    "dev-debug": "vite --config vite.config.js",
    "build": "vite build",
    "preview": "vite preview",
    "fix-cache": "rm -rf node_modules/.vite && npm run dev"
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
console.log('✅ Updated package.json scripts')

// 4. Create a simple HTML file for debugging
const debugHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technorox TCG - Debug</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-neon-gray text-white font-tech">
    <div id="app"></div>
    <script type="module" src="/src/main-debug.js"></script>
</body>
</html>`

fs.writeFileSync('debug.html', debugHtml)
console.log('✅ Created debug.html')

console.log(`
🎉 Issues fixed! Next steps:

1. Stop your current dev server (Ctrl+C)
2. Clear browser cache (Ctrl+Shift+R)
3. Run one of these commands:

   # Option 1: Use debug version
   npm run dev-debug
   # Then open http://localhost:3000/debug.html

   # Option 2: Clear cache and restart
   npm run fix-cache

   # Option 3: Standard restart
   npm run dev

4. If you still see router errors, open browser DevTools and check the console for detailed logs.

5. For Firebase permissions, run:
   firebase deploy --only firestore:rules

The debug version will show detailed console logs to help identify any remaining issues.
`)

process.exit(0)
