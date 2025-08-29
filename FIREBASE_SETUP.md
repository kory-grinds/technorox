# Firebase Setup Documentation

## Overview

This document outlines the Firebase integration for the Technorox TCG project. The setup includes Firebase Authentication, Firestore Database, Firebase Storage, Firebase Analytics, and Firebase App Check.

## Firebase Configuration

### Services Enabled
- **Firebase Authentication**: User registration, login, and session management
- **Firestore Database**: NoSQL database for game data, user profiles, cards, and game state
- **Firebase Storage**: File storage for card images, user avatars, and game assets
- **Firebase Analytics**: User behavior tracking and game analytics
- **Firebase App Check**: Security layer to protect against abuse

### Project Details
- **Project ID**: `technorox-tcg`
- **Auth Domain**: `technorox-tcg.firebaseapp.com`
- **Storage Bucket**: `technorox-tcg.firebasestorage.app`

## File Structure

```
src/
├── config/
│   └── firebase.js          # Firebase configuration and initialization
├── services/
│   └── FirebaseService.js   # Centralized Firebase service wrapper
└── managers/
    └── AuthManager.js       # Authentication management
```

## Configuration Files

### `src/config/firebase.js`
Main Firebase configuration file that:
- Initializes Firebase app with project credentials
- Sets up Authentication, Firestore, Storage, Analytics, and App Check
- Provides initialization function and service exports
- Handles development vs production environments

### `src/services/FirebaseService.js`
Centralized service wrapper that provides:
- Easy-to-use methods for all Firebase operations
- Error handling and logging
- Consistent API across the application
- Real-time data subscriptions
- File upload/download utilities
- Analytics event logging

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAurRuwrHAuig1jGIO-m-RZT51BnMwXQAU
VITE_FIREBASE_AUTH_DOMAIN=technorox-tcg.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=technorox-tcg
VITE_FIREBASE_STORAGE_BUCKET=technorox-tcg.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=715329943130
VITE_FIREBASE_APP_ID=1:715329943130:web:2f78d37adc341561174a63
VITE_FIREBASE_MEASUREMENT_ID=G-2M8YLQJVH4
```

## Usage Examples

### Using FirebaseService

```javascript
import { firebaseService } from './services/FirebaseService.js'

// Initialize the service (done automatically in main.js)
await firebaseService.init()

// Firestore operations
const result = await firebaseService.createDocument('cards', {
  name: 'Cyber Dragon',
  cost: 5,
  attack: 7,
  health: 6
})

// Get documents with query
const cards = await firebaseService.getCollection('cards', {
  where: [['cost', '<=', 5]],
  orderBy: ['cost', 'asc'],
  limit: 10
})

// Real-time subscriptions
const unsubscribe = firebaseService.subscribeToCollection('games', (games) => {
  console.log('Active games:', games)
})

// Storage operations
const uploadResult = await firebaseService.uploadFile(
  'card-images/cyber-dragon.jpg',
  imageFile
)

// Analytics
firebaseService.logGameEvent('card_played', {
  cardId: 'cyber-dragon',
  gameId: 'game-123'
})
```

### Using AuthManager

```javascript
import { AuthManager } from './managers/AuthManager.js'

const authManager = new AuthManager()
await authManager.init()

// Register new user
const result = await authManager.register(
  'user@example.com',
  'password123',
  'PlayerName'
)

// Login
const loginResult = await authManager.login('user@example.com', 'password123')

// Check authentication status
if (authManager.isAuthenticated()) {
  const user = authManager.getCurrentUser()
  const profile = authManager.getUserProfile()
}
```

## Database Structure

### Collections

#### `users`
User profiles and game statistics
```javascript
{
  displayName: "PlayerName",
  email: "user@example.com",
  role: "player", // "player" | "admin"
  createdAt: Timestamp,
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    rank: "Bronze",
    elo: 1000
  },
  collection: [], // Array of owned card IDs
  decks: [] // Array of deck objects
}
```

#### `cards`
Card definitions and metadata
```javascript
{
  name: "Card Name",
  cost: 5,
  attack: 7,
  health: 6,
  rarity: "legendary",
  type: "creature",
  abilities: [],
  imageUrl: "https://...",
  createdAt: Timestamp
}
```

#### `games`
Active and completed games
```javascript
{
  players: ["userId1", "userId2"],
  status: "active", // "waiting" | "active" | "completed"
  currentTurn: "userId1",
  gameState: {}, // Game state object
  createdAt: Timestamp,
  completedAt: Timestamp
}
```

## Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cards are readable by all authenticated users
    match /cards/{cardId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Games are readable/writable by participants
    match /games/{gameId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.players;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Card images - read by all, write by admins
    match /card-images/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User avatars - read by all, write by owner
    match /user-avatars/{userId}/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## App Check Setup

### Development
For development, configure debug tokens in the Firebase Console:
1. Go to Firebase Console > Project Settings > App Check
2. Add debug tokens for local development
3. Use the tokens in your local environment

### Production
For production, configure reCAPTCHA v3:
1. Get a reCAPTCHA v3 site key from Google reCAPTCHA
2. Add the site key to Firebase Console > App Check
3. Update the `firebase.js` configuration with your site key

```javascript
// Replace 'your-recaptcha-site-key' with your actual key
appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('your-actual-site-key'),
  isTokenAutoRefreshEnabled: true
})
```

## Analytics Events

### Game Events
- `game_started`: When a new game begins
- `game_completed`: When a game ends
- `card_played`: When a player plays a card
- `deck_created`: When a player creates a new deck

### User Events
- `user_registered`: New user registration
- `user_login`: User login
- `collection_updated`: User's card collection changes
- `pack_opened`: User opens a card pack

## Development Mode

The application supports running without Firebase for development:
- If Firebase configuration is missing, the app runs in demo mode
- AuthManager provides a demo user with admin privileges
- All Firebase operations are mocked or skipped

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Ensure environment variables are set correctly
2. **Permission denied**: Check Firestore security rules
3. **App Check failures**: Configure debug tokens for development
4. **Storage upload failures**: Verify storage rules and file permissions

### Debug Mode
Enable debug logging by setting:
```javascript
// In browser console
localStorage.debug = 'firebase:*'
```

## Next Steps

1. Configure Firestore security rules in Firebase Console
2. Set up Storage security rules
3. Configure App Check with reCAPTCHA v3 for production
4. Set up Firebase Functions for server-side logic (if needed)
5. Configure Firebase Hosting for deployment

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Firebase Analytics](https://firebase.google.com/docs/analytics)
