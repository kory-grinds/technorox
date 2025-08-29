# 🔧 Complete Fix Guide for Technorox Issues

## 🚨 Current Issues:
1. **WebSocket connection failures** (Vite HMR)
2. **Router method error** (`this.router.setAuthManager is not a function`)
3. **Firebase permissions error** (Missing or insufficient permissions)

## 🎯 **IMMEDIATE SOLUTION** (Follow these steps exactly):

### Step 1: Stop Everything
```bash
# Press Ctrl+C to stop current server
# Then run:
taskkill /F /IM node.exe
```

### Step 2: Clear All Cache
```bash
# Clear browser cache (Ctrl+Shift+R in browser)
# Clear Vite cache:
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
```

### Step 3: Test Router Separately
1. Open `test-router.html` in your browser directly (file:// protocol)
2. Check if Router class works in isolation
3. This will tell us if the issue is with the Router or with module loading

### Step 4: Start with Debug Mode
```bash
# Use the debug version that has extensive logging:
npm run dev
```

### Step 5: Check Browser Console
Open browser DevTools (F12) and look for:
- ✅ "Router constructor called"
- ✅ "Router initialized with methods: [list]"
- ✅ "setAuthManager called with: [object]"

## 🔍 **Diagnostic Steps:**

### If Router Test Fails:
The issue is with the Router class itself:
```bash
# Check if router-debug.js exists and is being used
ls src/utils/router*.js
```

### If Router Test Passes:
The issue is with module loading or app initialization:
```bash
# Check main.js is using app-debug.js
grep -n "app-debug" src/main.js
```

### If WebSocket Still Fails:
```bash
# Try completely different port:
npx vite --port 3001 --config vite.config.simple.js
```

## 🔥 **Firebase Permissions Fix:**

### Option 1: Deploy Rules (Recommended)
```bash
firebase login
firebase use technorox-tcg
firebase deploy --only firestore:rules
```

### Option 2: Temporary Test Mode (Development Only)
Go to Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 **Alternative Startup Methods:**

### Method A: Simple Server (No HMR)
```bash
npm run dev:no-hmr
```

### Method B: Different Port
```bash
npx vite --port 3001 --host localhost --config vite.config.simple.js
```

### Method C: Manual Startup
```bash
# Kill processes
taskkill /F /IM node.exe

# Clear cache
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue

# Start fresh
npx vite --port 3000 --host localhost --config vite.config.simple.js
```

## 🧪 **Testing Checklist:**

After starting the server, verify:

1. **Server Starts**: ✅ "Local: http://localhost:3000/"
2. **No WebSocket Errors**: ❌ Should see NO "WebSocket connection failed"
3. **Router Works**: ✅ Should see "Router constructor called" in console
4. **Firebase Connects**: ✅ Should see "Firebase initialized successfully"
5. **App Loads**: ✅ Should see Technorox homepage

## 📞 **If Still Broken:**

### Collect This Information:
1. **Browser Console Output** (full log)
2. **Server Terminal Output** (full log)
3. **Network Tab** (check for 404s or failed requests)
4. **Result of router test** (`test-router.html`)

### Nuclear Option (Last Resort):
```bash
# Completely restart Node.js environment
taskkill /F /IM node.exe
Remove-Item -Recurse -Force "node_modules\.vite"
Remove-Item -Recurse -Force "node_modules\.cache"
npm install
npm run dev:no-hmr
```

## 🎮 **Expected Working State:**

When everything works, you should see:
```
✅ Server running on http://localhost:3000
✅ No WebSocket errors in console
✅ "Router constructor called"
✅ "Firebase initialized successfully"
✅ App loads with Technorox homepage
✅ No JavaScript errors in console
```

---

**🎯 Try the steps in order. Most issues resolve with Step 1-4.**
