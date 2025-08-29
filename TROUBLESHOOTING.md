# 🔧 Technorox TCG - Troubleshooting Guide

## Common Issues and Solutions

### 🌐 WebSocket Connection Issues

**Error:** `WebSocket connection to 'ws://localhost:3000/?token=...' failed`

**Cause:** Vite development server WebSocket configuration issues.

**Solutions:**

1. **Use the new Vite config** (already created):
   ```bash
   # Make sure vite.config.js is in your project root
   # Restart your development server
   npm run dev
   ```

2. **Alternative: Use different ports**:
   ```bash
   # Start Vite on a different port
   npm run dev -- --port 3001
   ```

3. **Network configuration**:
   - Check if port 3000 is already in use
   - Try disabling firewall/antivirus temporarily
   - Use `127.0.0.1` instead of `localhost` if needed

---

### 🔥 Firebase Permissions Error

**Error:** `Missing or insufficient permissions`

**Cause:** Firebase security rules are too restrictive or not deployed.

**Solutions:**

1. **Deploy the security rules**:
   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project (if not done)
   firebase init firestore
   
   # Deploy the security rules
   firebase deploy --only firestore:rules
   ```

2. **Temporary: Use test mode** (DEVELOPMENT ONLY):
   ```javascript
   // In Firebase Console > Firestore > Rules
   // Replace with (WARNING: This allows all access):
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Check authentication**:
   - Make sure user is logged in before accessing Firestore
   - Verify Firebase Auth is working properly

---

### 🔄 Router Method Missing

**Error:** `this.router.setAuthManager is not a function`

**Cause:** Router class method not properly defined.

**Solution:** The router has been updated with the missing method. If you still see this error:

1. **Clear browser cache**:
   ```bash
   # Hard refresh in browser
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

2. **Restart development server**:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

3. **Check imports**:
   ```javascript
   // Make sure Router is properly imported in app.js
   import { Router } from './utils/router.js'
   ```

---

### 💎 Rox Chips Service Issues

**Error:** Various Rox Chips related errors

**Solutions:**

1. **Initialize service properly**:
   ```javascript
   // Make sure to initialize before use
   const user = authManager.getCurrentUser()
   if (user) {
     await roxChipsService.init(user.uid)
   }
   ```

2. **Check Firebase collections**:
   - Ensure `user_wallets` collection exists
   - Verify user has proper permissions
   - Check security rules allow wallet access

---

### 🛒 Stripe Integration Issues

**Error:** Stripe checkout not working

**Solutions:**

1. **Set up environment variables**:
   ```env
   # Add to your .env file
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

2. **Start Stripe server**:
   ```bash
   # In a separate terminal
   node server/stripe.js
   ```

3. **Install Stripe package**:
   ```bash
   npm install stripe
   ```

---

## 🚀 Quick Fixes

### 1. Complete Reset
If you're experiencing multiple issues:

```bash
# Clear all caches and restart
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### 2. Check Console Errors
Open browser DevTools (F12) and check:
- **Console tab**: JavaScript errors
- **Network tab**: Failed requests
- **Application tab**: Local storage issues

### 3. Verify Environment
Make sure you have:
- Node.js 16+ installed
- Firebase project configured
- All environment variables set
- Proper network connectivity

---

## 🔍 Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
NODE_ENV=development
```

This will show additional console logs to help identify issues.

---

## 📞 Getting Help

If issues persist:

1. **Check browser console** for detailed error messages
2. **Verify Firebase configuration** in the console
3. **Test with a fresh browser profile** to rule out extension conflicts
4. **Check network connectivity** and firewall settings

---

## ✅ Verification Checklist

After applying fixes, verify:

- [ ] No WebSocket errors in console
- [ ] Firebase authentication works
- [ ] Firestore read/write operations succeed
- [ ] Router navigation works properly
- [ ] Rox Chips display shows in header
- [ ] Store page loads without errors
- [ ] Mission page displays correctly

---

## 🔧 Development Commands

```bash
# Start main development server
npm run dev

# Start Stripe server (separate terminal)
node server/stripe.js

# Deploy Firebase rules
firebase deploy --only firestore:rules

# Clear browser cache
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
# Safari: Cmd+Option+E

# Reset project
rm -rf node_modules && npm install
```

Most issues can be resolved by following these steps in order. If you continue to experience problems, the error messages in the browser console will provide more specific guidance.
