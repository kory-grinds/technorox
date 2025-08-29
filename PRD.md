# Technorox Trading Card Game (TCG) - Product Requirements Document (PRD)

## 1. Overview
Technorox is a browser-based, cyberpunk-inspired trading card game featuring cybernetic beasts, unique upgrade mechanics, and competitive online multiplayer. The game combines collectible card mechanics, strategic deck-building, and real-time multiplayer battles. It is designed to be a Free-to-Play game with optional monetization through cosmetics and expansions.

---

## 2. Vision and Goals
- **Goal:** Create a competitive and visually striking TCG that blends cyberpunk aesthetics with strategic gameplay.
- **Target Audience:** Gamers aged 14–35 who enjoy TCGs (like Pokémon, MTG, Hearthstone) and cyberpunk themes.
- **Platform:** Browser-first (Phaser 3) with PWA support for installability on mobile and desktop.
- **Differentiator:** Unique "Data Stream" resource system and modular creature upgrades (Mod Cards).

- **Players will buy packs of cards.** They can open them to gain additional cards, mod cards, data cards, and Realm cards. Include a **pack opening UI/UX** (inspired by MTG/Hearthstone) with animations, rarity reveals, and a collection summary screen.

---

## 3. Game Loop
1. Player builds a deck of **40 cards**: creatures, mod cards, and data manipulation cards.
2. Match is **1v1 turn-based**, each player starts with:
   - **5 cards in hand**
   - **3 Data Streams (energy resource)**
3. Win condition:
   - Reduce opponent's **Core Integrity (life total)** from 50 to 0, or
   - Force opponent to deck out (no cards to draw).

---

## 4. Card Types
1. **Creature Cards:** Cyber-beasts that attack and defend.
2. **Mod Cards:** Attachments that change stats or abilities.
3. **Data Cards:** Manipulate resources, deck, or battlefield conditions.
4. **Realm Cards (Optional):** Set battlefield effects.

---

## 5. Core Mechanics
- **Data Stream Resource System:** Dynamic resource gain with a max of 10 streams.
- **Combat Flow:** Summon, boost, attack enemy creatures or Core Integrity.
- **Upgrades and Mods:** Dynamic slots per rarity tier.
- **Rarity and Collectibility:** Common, Uncommon, Rare, Mythic tiers.

---

## 6. Technical Requirements
- **Frontend:** Phaser 3, TailwindCSS, MUI Library.
- **Backend:** Node.js, WebSockets.
- **Database:** Firebase.
- **Hosting:** Cloudflare Pages.
- **Card Data:** JSON structure with versioning.

---

## 7. UI/UX Design
- Neon-themed grid, panels, HUD elements.
- Accessibility mode for colorblind users.
- MUI library
- **Pack Opening UI:** Animated pack cracking, rarity reveal, add-to-collection flow.
- **Collection & Deck Builder:** Filters by type, faction, rarity; drag-and-drop into deck.

---

## 8. Monetization Strategy
- Free-to-play with cosmetic cards, expansions, battle passes.

---

## 9. Roadmap
| Phase     | Duration | Deliverables                          |
|-----------|----------|--------------------------------------|
| Prototype | 3 months | Basic battle loop, 30-card set.      |
| Alpha     | 6 months | PvP, balance testing.                |
| Beta      | 9 months | Monetization, matchmaking.           |
| Launch    | 12 months| Marketing push, expansions.          |

---

## 10. Art & Branding Guidelines
- **Style:** Neon cyberpunk/steampunk hybrid.
- **Colors:** Cyan (#00FFF7), Magenta (#FF3EF5), Purple (#1A001F), Gray (#0A0A0F).

---

## 11. Key Features to Build
- Home page, about page, register page, login page all with a public footer.
- Admin, Player, Dashboard and sidebar with an authenticated user header, and authenticated user footer that displays when the user logs into the app.
- Real-time PvP.
- Deck builder UI.
- Card library & filters.
- Matchmaking system.
- Leaderboard.
- Purchase and open packs just like MTG/Hearthstone.
- Player will press a play button to play the game.
- AI player that the user will play against; Player Versus Player will also be created. When no real players are found the AI steps in.

---

## 12. Future Considerations
- Mobile native app.
- AR card scanning.
- Community-driven content.

---

## 13. Card Generation & Management System
To streamline development and avoid manual tracking, the Technorox project will include a **Card Generation App**. This app will:

- **Generate Cards Dynamically:** 
  - Procedurally create cards with unique IDs, stats, abilities, and artwork links.
- **Centralized Card Database:** 
  - Store all cards and link artwork, types, rarity, and abilities.
- **Duplicate Prevention:** 
  - Ensure unique card stats and concepts for diversity.
- **Versioning & History:** 
  - Maintain card history, track updates, and allow rollbacks.
- **Integration With Game Engine:** 
  - Sync Phaser client with card data for expansion support.

### Checklist
- [ ] Design and implement Card Generator tool.
- [ ] Build database schema for cards and metadata.
- [ ] Integrate generator into game engine workflow.
- [ ] Develop admin panel for managing cards.
- [ ] Build anything else we need.

---

## 14. AI-Assisted Card Generation
The Technorox card generation pipeline will leverage **OpenAI models** for:

- **Card Concept Generation:** AI-assisted creation of card lore, abilities, and unique creature ideas.
- **Procedural Art Prompts:** AI-generated prompts for image generation tools to maintain consistent art style.
- **Stat Balancing:** Use AI to propose balanced stats based on meta-data from matches.
- **Expansion Planning:** Automatically propose new mechanics and card sets.

This ensures **rapid iteration**, **scalability**, and **consistent style** across thousands of cards.

---

## 15. SEO and Rendering Strategy
Technorox will implement a **dual rendering strategy** to maximize SEO performance while keeping the game experience smooth:

- **Marketing Pages:** 
  - The home page, about page, register page, and other marketing content will use **Static Site Generation (SSG)** or **Server-Side Rendering (SSR)** (via frameworks like Next.js or Astro).
  - Pre-rendered HTML ensures proper SEO indexing, rich search snippets, and fast first-contentful-paint times.
  - Pages will include structured metadata, Open Graph tags, and schema.org markup.

- **Game Client:** 
  - The actual trading card game (TCG) client will remain a **Single-Page Application (SPA)** built with Phaser for seamless game interactions.
  - SEO is not a concern for this portion since it is accessed after authentication.

- **Separation of Concerns:**
  - Marketing content will be on `technorox.com`, optimized for search and social previews.
  - The game client will run at `play.technorox.com`, optimized for performance and user retention.

This approach ensures Technorox is discoverable on search engines while keeping the actual game performant.

---

## 16. Rox Chips – Technorox In-Game Currency and Monetization System

Technorox will use **Rox Chips** as the official in-game currency. Rox Chips are fragments of ancient tech cores that power the machines and arenas of Technorox. Each chip is infused with encrypted data, making them both a universal currency and a badge of status among competitors. Players earn and spend Rox Chips to unlock new cards, cosmetics, and strategic options, tying the economy directly into the game's lore and progression.

---

### 🎯 Currency Details
- **Conversion Rate:**  
  - 1 Rox Chip = $0.05  
  - 20 Rox Chips = $1.00  
- Rox Chips can be **purchased in bundles** via Stripe with bonus tiers:  
  - $4.99 → 100 Rox Chips  
  - $9.99 → 220 Rox Chips (10% bonus)  
  - $24.99 → 600 Rox Chips (20% bonus)  
  - $49.99 → 1,300 Rox Chips (30% bonus)  
  - $99.99 → 2,800 Rox Chips (40% bonus)

---

### 💎 Pricing of Items
| Item                          | Price (Rox Chips) | USD Approx. |
|------------------------------|------------------|------------|
| Standard Card Pack (5 cards) | 100 Chips        | $5.00      |
| Premium Pack (1 Rare)        | 200 Chips        | $10.00     |
| Legendary Pack (1 Mythic)    | 500 Chips        | $25.00     |
| Card Back Designs            | 200 Chips        | $10.00     |
| Avatars/Board Skins          | 300–500 Chips    | $15–25     |
| Seasonal Battle Pass         | 1,000 Chips      | $50.00     |

---

### 🔐 Compliance & Safety
- Rox Chips are **one-way only**: Purchases are final, and chips cannot be converted back to cash.  
- This prevents gambling classification and regulatory complications, ensuring Technorox remains a safe, **virtual goods marketplace**.  
- All transactions are powered by **Stripe** for global payment security and fraud protection.

---

### 🏆 Rewards & Engagement
- Players can **earn small amounts of Rox Chips** through:
  - Daily/weekly missions  
  - Achievements  
  - Tournaments (non-cash prize pools)  
- Earned Rox Chips encourage player engagement while maintaining the value of purchased bundles.  
- **Rotating cosmetic rewards** and limited-time card packs create urgency and incentivize spending.

---

### 🔑 Revenue Goals
- Encourage larger **upfront purchases** with generous bonus tiers.  
- Keep the system **fair and grindable** to attract free-to-play players while monetizing dedicated fans.  
- Introduce seasonal battle passes and rotating cosmetics to drive recurring revenue.  
- Maintain a steady economy tied deeply to lore: Rox Chips aren't just currency, they're **status symbols** in the Technorox world.

---