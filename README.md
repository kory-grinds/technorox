# Technorox TCG

A cyberpunk-inspired browser-based trading card game built with modern web technologies.

## 🎮 Game Features

- **Strategic Gameplay**: 40-card decks with unique Data Stream resource system
- **Cyberpunk Theme**: Neon aesthetics with cybernetic creatures and futuristic environments
- **Real-time Multiplayer**: WebSocket-powered matches with AI opponent fallback
- **Animated Pack Opening**: MTG/Hearthstone-inspired pack cracking with rarity reveals
- **Advanced Collection**: Comprehensive card library with filters by type, faction, rarity
- **Drag-and-Drop Deck Builder**: Intuitive deck construction with validation and mana curve
- **PWA Support**: Installable app with offline capabilities and push notifications
- **Competitive Ranking**: ELO-based matchmaking and seasonal leaderboards
- **AI-Generated Content**: Procedural card generation with artwork prompts

## 🛠 Tech Stack

### Frontend
- **Phaser 3**: Game engine for interactive gameplay
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **MUI Components**: Material-UI component library
- **Firebase**: Authentication and database

### Backend
- **Node.js**: Server runtime
- **Express**: Web framework
- **Socket.io**: Real-time communication
- **Firebase Firestore**: NoSQL database
- **OpenAI API**: AI-assisted card generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (for authentication and database)
- OpenAI API key (for card generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd technorox-tcg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Start the development servers**
   
   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Backend):
   ```bash
   npm run start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
technorox-tcg/
├── src/                    # Frontend source code
│   ├── pages/             # Page components
│   ├── managers/          # Core managers (Auth, Game, UI)
│   ├── game/              # Game logic and state
│   ├── data/              # Card schemas and data
│   ├── utils/             # Utility functions
│   └── styles/            # CSS and styling
├── server/                # Backend server code
├── public/                # Static assets
├── dist/                  # Build output
└── docs/                  # Documentation
```

## 🎯 Game Rules

### Basic Gameplay
- **Players**: 1v1 matches
- **Deck Size**: 40 cards exactly
- **Starting Hand**: 5 cards
- **Starting Life**: 50 Core Integrity
- **Starting Energy**: 3 Data Streams (increases by 1 each turn, max 10)

### Card Types
1. **Creature Cards**: Cybernetic beasts that attack and defend
2. **Mod Cards**: Equipment and enhancements for creatures
3. **Data Cards**: Instant effects and manipulation spells
4. **Realm Cards**: Environmental effects (optional)

### Win Conditions
- Reduce opponent's Core Integrity to 0
- Force opponent to deck out (no cards to draw)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start backend server

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- TailwindCSS for styling consistency

## 🎨 Design System

### Colors
- **Neon Cyan**: `#00FFF7` - Primary accent
- **Neon Magenta**: `#FF3EF5` - Secondary accent  
- **Neon Purple**: `#1A001F` - Background accent
- **Neon Gray**: `#0A0A0F` - Primary background

### Typography
- **Orbitron**: Cyberpunk display font
- **Rajdhani**: Technical UI font

## 🚀 Deployment

### Frontend (Cloudflare Pages)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Cloudflare Pages
3. Set environment variables in Cloudflare dashboard

### Backend (Node.js hosting)
1. Deploy server code to your preferred hosting service
2. Set environment variables
3. Ensure WebSocket support is enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Roadmap

### Phase 1: Prototype (Current)
- [x] Basic game mechanics
- [x] Authentication system
- [x] Card system foundation
- [x] UI/UX framework
- [ ] Core gameplay loop
- [ ] AI opponent

### Phase 2: Alpha
- [ ] Real-time multiplayer
- [ ] Deck builder
- [ ] Card collection system
- [ ] Pack opening mechanics
- [ ] Basic matchmaking

### Phase 3: Beta
- [ ] Ranked system
- [ ] Tournaments
- [ ] Advanced AI
- [ ] Mobile optimization
- [ ] Social features

### Phase 4: Launch
- [ ] Marketing campaign
- [ ] Monetization system
- [ ] Community features
- [ ] First expansion set

## 🆘 Support

- **Discord**: [Join our community](https://discord.gg/technorox)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@technorox.com

---

**Built with ⚡ by the Technorox team**
