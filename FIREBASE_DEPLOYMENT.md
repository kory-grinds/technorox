# Firebase Deployment Guide for Technorox TCG

## 🔥 Initial Setup

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase in your project (if needed)
```bash
firebase init
```
**Note:** I've already created the configuration files for you, so you can skip the init if you want.

## 📋 Configuration Files Created

I've created these Firebase configuration files for you:

- `firebase.json` - Main Firebase configuration
- `.firebaserc` - Project configuration (points to technorox-tcg)
- `firestore.rules` - Database security rules (already existed)
- `firestore.indexes.json` - Database indexes
- `storage.rules` - Storage security rules

## 🚀 Deployment Commands

### Deploy Everything
```bash
firebase deploy
```

### Deploy Only Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Only Storage Rules
```bash
firebase deploy --only storage
```

### Deploy Only Hosting
```bash
npm run build
firebase deploy --only hosting
```

## 🔧 Common Issues & Solutions

### Issue 1: "Project not found" or "Permission denied"
**Solution:**
```bash
# Make sure you're logged in with the correct account
firebase login --reauth

# List available projects
firebase projects:list

# Set the correct project
firebase use technorox-tcg
```

### Issue 2: "Rules compilation error"
**Solution:**
Check the syntax in `firestore.rules`. Common issues:
- Missing semicolons
- Incorrect function syntax
- Typos in field names

### Issue 3: "Firebase CLI not found"
**Solution:**
```bash
# Install globally
npm install -g firebase-tools

# Or use npx
npx firebase deploy --only firestore:rules
```

### Issue 4: "Insufficient permissions"
**Solution:**
Make sure your Firebase account has:
- Editor or Owner role on the project
- Firestore Admin permissions
- Storage Admin permissions

## 📝 Testing Your Rules

### Test Firestore Rules
```bash
firebase emulators:start --only firestore
```

### Test Storage Rules
```bash
firebase emulators:start --only storage
```

### Test Everything
```bash
firebase emulators:start
```

## 🎯 Quick Fix Commands

If you're still having issues, try these in order:

```bash
# 1. Re-authenticate
firebase login --reauth

# 2. Set project explicitly
firebase use technorox-tcg

# 3. Deploy just the rules
firebase deploy --only firestore:rules

# 4. If that fails, try with force
firebase deploy --only firestore:rules --force

# 5. Check project status
firebase projects:list
```

## 🔍 Debugging

### Check Current Project
```bash
firebase use
```

### Validate Rules Syntax
```bash
firebase firestore:rules:get
```

### View Deployment History
```bash
firebase deploy:history
```

## 📞 Need Help?

If you're still getting errors, please share:
1. The exact error message
2. Output of `firebase use`
3. Output of `firebase projects:list`
4. Your Firebase project settings (Project ID, etc.)

---

**Next Steps:**
1. Run `firebase login` if you haven't already
2. Run `firebase deploy --only firestore:rules`
3. Check the Firebase Console to confirm rules are deployed
4. Test your app to see if the permission errors are resolved
