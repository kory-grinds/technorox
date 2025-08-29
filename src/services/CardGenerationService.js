import OpenAI from 'openai'
import { firebaseService } from './FirebaseService.js'

export class CardGenerationService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true // Only for development
        })
        
        this.factions = ['Scrap Titans', 'Neon Phantoms', 'Bio-Cyber Hive', 'Skybound Aegis']
        this.rarities = ['Common', 'Uncommon', 'Rare', 'Mythic']
        
        // Example cards to provide context
        this.exampleCards = [
            {
                name: "Emberhorn Colossus",
                faction: "Scrap Titans",
                type: "Beast/Mech",
                cost: 4,
                attack: 120,
                defense: 80,
                rarity: "Rare",
                ability: "Berserk (Gains +40 attack when damaged)",
                flavor_text: "When the forges run cold, the Colossus burns brightest.",
                image_prompt: "A massive cybernetic rhinoceros with glowing orange armor plating and steam vents, standing in an industrial wasteland with neon city lights in the background"
            },
            {
                name: "Pulsefang Alpha",
                faction: "Neon Phantoms", 
                type: "Wolf/Cyber",
                cost: 2,
                attack: 130,
                defense: 110,
                rarity: "Uncommon",
                ability: "Once per turn, hack enemy shields.",
                flavor_text: "In the digital wilderness, only the connected survive.",
                image_prompt: "A sleek cybernetic wolf with glowing green circuit patterns, prowling through a dark cyber-forest with holographic trees"
            },
            {
                name: "Synthscale Drake",
                faction: "Skybound Aegis",
                type: "Dragon/AI",
                cost: 3,
                attack: 70,
                defense: 50,
                rarity: "Mythic",
                ability: "Gains +20 attack when in neon zone.",
                flavor_text: "Born from code, raised by lightning.",
                image_prompt: "An elegant cybernetic dragon with translucent wings and purple energy coursing through its body, soaring above a neon-lit cityscape"
            }
        ]
    }
    
    async generateCreatureCard() {
        const prompt = `You are designing a creature card for the Technorox Trading Card Game. 
Generate ONE new creature card with these requirements:

- **Name:** Unique, cyberpunk/steampunk hybrid creature name (2-3 words max).
- **Faction:** Choose from Scrap Titans, Neon Phantoms, Bio-Cyber Hive, Skybound Aegis.
- **Type:** Animal inspiration + cybernetics (e.g., Wolf/Mech, Dragon/AI, Beast/Cyber).
- **Stats:** Attack (30–180), Defense (20–150), Cost (1–5 Data Streams).
- **Ability:** A unique ability (1-2 sentences) that fits faction and card theme.
- **Rarity:** Common, Uncommon, Rare, or Mythic.
- **Flavor Text:** 1 sentence lore snippet.
- **Visual Prompt:** An AI image generation prompt describing its look in cinematic cyberpunk/steampunk style.

Here are example cards for reference:
${JSON.stringify(this.exampleCards, null, 2)}

Return ONLY valid JSON:
{
  "id": "unique-id",
  "name": "",
  "faction": "",
  "type": "",
  "cost": 0,
  "attack": 0,
  "defense": 0,
  "rarity": "",
  "ability": "",
  "flavor_text": "",
  "image_prompt": ""
}`

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional trading card game designer specializing in cyberpunk/steampunk themes. Always return valid JSON only."
                    },
                    {
                        role: "user", 
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 500
            })
            
            const cardData = JSON.parse(response.choices[0].message.content)
            
            // Add generated ID and timestamp
            cardData.id = this.generateCardId()
            cardData.cardType = 'creature'
            cardData.createdAt = new Date().toISOString()
            
            // Validate the card
            this.validateCreatureCard(cardData)
            
            return cardData
            
        } catch (error) {
            console.error('Error generating creature card:', error)
            throw new Error('Failed to generate creature card')
        }
    }
    
    async generateModCard() {
        const prompt = `Create ONE Mod Card for the Technorox TCG.

- **Theme:** Cybernetic upgrade, weapon, or enhancement.
- **Effect:** Modifies stats or grants a temporary/conditional buff.
- **Cost:** 1-3 Data Streams.
- **Rarity:** Any.
- **Visual Prompt:** Describe a piece of futuristic tech gear for a creature card.

Return ONLY valid JSON:
{
  "id": "unique-id",
  "name": "",
  "type": "Mod",
  "cost": 0,
  "rarity": "",
  "effect": "",
  "image_prompt": ""
}`

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional trading card game designer specializing in cyberpunk/steampunk themes. Always return valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 300
            })
            
            const cardData = JSON.parse(response.choices[0].message.content)
            
            cardData.id = this.generateCardId()
            cardData.cardType = 'mod'
            cardData.createdAt = new Date().toISOString()
            
            this.validateModCard(cardData)
            
            return cardData
            
        } catch (error) {
            console.error('Error generating mod card:', error)
            throw new Error('Failed to generate mod card')
        }
    }
    
    async generateDataCard() {
        const prompt = `Design ONE Data Card for the Technorox TCG.

- **Theme:** Hacking, resource manipulation, battlefield control.
- **Effect:** Explain card's effect clearly.
- **Cost:** 1-4 Data Streams.
- **Visual Prompt:** Futuristic hacking tool or glowing code injection scene.

Return ONLY valid JSON:
{
  "id": "unique-id",
  "name": "",
  "type": "Data",
  "cost": 0,
  "rarity": "",
  "effect": "",
  "image_prompt": ""
}`

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional trading card game designer specializing in cyberpunk/steampunk themes. Always return valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 300
            })
            
            const cardData = JSON.parse(response.choices[0].message.content)
            
            cardData.id = this.generateCardId()
            cardData.cardType = 'data'
            cardData.createdAt = new Date().toISOString()
            
            this.validateDataCard(cardData)
            
            return cardData
            
        } catch (error) {
            console.error('Error generating data card:', error)
            throw new Error('Failed to generate data card')
        }
    }
    
    async generateRealmCard() {
        const prompt = `Design ONE Realm Card for Technorox.

- **Theme:** Futuristic location (scrapyard, cyber jungle, neon skyport, etc.)
- **Effect:** Global buff/debuff affecting all creatures.
- **Visual Prompt:** Wide cinematic shot of the location in cyberpunk/steampunk fusion style.

Return ONLY valid JSON:
{
  "id": "unique-id",
  "name": "",
  "type": "Realm",
  "rarity": "",
  "effect": "",
  "image_prompt": ""
}`

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional trading card game designer specializing in cyberpunk/steampunk themes. Always return valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 300
            })
            
            const cardData = JSON.parse(response.choices[0].message.content)
            
            cardData.id = this.generateCardId()
            cardData.cardType = 'realm'
            cardData.cost = 0 // Realms typically don't have costs
            cardData.createdAt = new Date().toISOString()
            
            this.validateRealmCard(cardData)
            
            return cardData
            
        } catch (error) {
            console.error('Error generating realm card:', error)
            throw new Error('Failed to generate realm card')
        }
    }
    
    async generateCardSet(count = 10) {
        const cards = []
        const distribution = {
            creature: Math.ceil(count * 0.5), // 50% creatures
            mod: Math.ceil(count * 0.25),     // 25% mods
            data: Math.ceil(count * 0.2),     // 20% data
            realm: Math.ceil(count * 0.05)    // 5% realms
        }
        
        try {
            // Generate creatures
            for (let i = 0; i < distribution.creature; i++) {
                const card = await this.generateCreatureCard()
                cards.push(card)
                await this.delay(1000) // Rate limiting
            }
            
            // Generate mods
            for (let i = 0; i < distribution.mod; i++) {
                const card = await this.generateModCard()
                cards.push(card)
                await this.delay(1000)
            }
            
            // Generate data cards
            for (let i = 0; i < distribution.data; i++) {
                const card = await this.generateDataCard()
                cards.push(card)
                await this.delay(1000)
            }
            
            // Generate realm cards
            for (let i = 0; i < distribution.realm; i++) {
                const card = await this.generateRealmCard()
                cards.push(card)
                await this.delay(1000)
            }
            
            return cards
            
        } catch (error) {
            console.error('Error generating card set:', error)
            throw new Error('Failed to generate card set')
        }
    }
    
    generateCardId() {
        return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    
    validateCreatureCard(card) {
        const errors = []
        
        if (!card.name || card.name.length === 0) {
            errors.push('Name is required')
        }
        
        if (!this.factions.includes(card.faction)) {
            errors.push('Invalid faction')
        }
        
        if (card.cost < 1 || card.cost > 5) {
            errors.push('Cost must be between 1-5')
        }
        
        if (card.attack < 30 || card.attack > 180) {
            errors.push('Attack must be between 30-180')
        }
        
        if (card.defense < 20 || card.defense > 150) {
            errors.push('Defense must be between 20-150')
        }
        
        if (!this.rarities.includes(card.rarity)) {
            errors.push('Invalid rarity')
        }
        
        if (errors.length > 0) {
            throw new Error(`Card validation failed: ${errors.join(', ')}`)
        }
    }
    
    validateModCard(card) {
        const errors = []
        
        if (!card.name || card.name.length === 0) {
            errors.push('Name is required')
        }
        
        if (card.cost < 1 || card.cost > 3) {
            errors.push('Cost must be between 1-3')
        }
        
        if (!this.rarities.includes(card.rarity)) {
            errors.push('Invalid rarity')
        }
        
        if (!card.effect || card.effect.length === 0) {
            errors.push('Effect is required')
        }
        
        if (errors.length > 0) {
            throw new Error(`Mod card validation failed: ${errors.join(', ')}`)
        }
    }
    
    validateDataCard(card) {
        const errors = []
        
        if (!card.name || card.name.length === 0) {
            errors.push('Name is required')
        }
        
        if (card.cost < 1 || card.cost > 4) {
            errors.push('Cost must be between 1-4')
        }
        
        if (!this.rarities.includes(card.rarity)) {
            errors.push('Invalid rarity')
        }
        
        if (!card.effect || card.effect.length === 0) {
            errors.push('Effect is required')
        }
        
        if (errors.length > 0) {
            throw new Error(`Data card validation failed: ${errors.join(', ')}`)
        }
    }
    
    validateRealmCard(card) {
        const errors = []
        
        if (!card.name || card.name.length === 0) {
            errors.push('Name is required')
        }
        
        if (!this.rarities.includes(card.rarity)) {
            errors.push('Invalid rarity')
        }
        
        if (!card.effect || card.effect.length === 0) {
            errors.push('Effect is required')
        }
        
        if (errors.length > 0) {
            throw new Error(`Realm card validation failed: ${errors.join(', ')}`)
        }
    }
    
    async checkForDuplicates(cardName, existingCards = []) {
        // Check against existing cards to prevent duplicates
        const duplicate = existingCards.find(card => 
            card.name.toLowerCase() === cardName.toLowerCase()
        )
        
        return !!duplicate
    }
    
    async generateArtwork(imagePrompt, cardId) {
        try {
            const response = await this.openai.images.generate({
                model: "dall-e-3",
                prompt: `${imagePrompt}, trading card game art, professional illustration, cyberpunk style, high quality, detailed`,
                size: "1024x1024",
                quality: "standard",
                n: 1,
            })
            
            const imageUrl = response.data[0].url
            
            // Download and save image to Firebase Storage if Firebase is available
            if (firebaseService.isReady()) {
                try {
                    const savedImageUrl = await this.saveImageToStorage(imageUrl, cardId)
                    return savedImageUrl
                } catch (storageError) {
                    console.warn('Failed to save image to Firebase Storage, using original URL:', storageError)
                    return imageUrl
                }
            }
            
            return imageUrl
            
        } catch (error) {
            console.error('Error generating artwork:', error)
            // Return placeholder URL
            return `https://via.placeholder.com/400x560/1A001F/00FFF7?text=Technorox+Card`
        }
    }

    async saveImageToStorage(imageUrl, cardId) {
        try {
            // Download the image
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            
            // Create a file from the blob
            const file = new File([blob], `${cardId}.png`, { type: 'image/png' })
            
            // Upload to Firebase Storage
            const uploadResult = await firebaseService.uploadFile(
                `card-images/${cardId}.png`,
                file,
                {
                    contentType: 'image/png',
                    customMetadata: {
                        'generated': 'true',
                        'cardId': cardId,
                        'timestamp': new Date().toISOString()
                    }
                }
            )
            
            if (uploadResult.success) {
                console.log(`Card image saved to Firebase Storage: ${uploadResult.path}`)
                return uploadResult.downloadURL
            } else {
                throw new Error(uploadResult.error)
            }
            
        } catch (error) {
            console.error('Error saving image to Firebase Storage:', error)
            throw error
        }
    }

    async saveCardToFirestore(cardData) {
        if (!firebaseService.isReady()) {
            console.warn('Firebase not available, cannot save card to Firestore')
            return { success: false, error: 'Firebase not available' }
        }

        try {
            // Prepare card data for Firestore
            const firestoreCard = {
                ...cardData,
                status: 'pending_approval',
                createdBy: firebaseService.getCurrentUser()?.uid || 'system',
                approvedBy: null,
                approvedAt: null,
                version: '1.0.0'
            }

            const result = await firebaseService.createDocument('cards', firestoreCard)
            
            if (result.success) {
                console.log(`Card saved to Firestore with ID: ${result.id}`)
                
                // Log analytics event
                firebaseService.logGameEvent('card_generated', {
                    cardId: result.id,
                    cardType: cardData.cardType,
                    rarity: cardData.rarity,
                    faction: cardData.faction
                })
                
                return { success: true, id: result.id }
            } else {
                throw new Error(result.error)
            }
            
        } catch (error) {
            console.error('Error saving card to Firestore:', error)
            return { success: false, error: error.message }
        }
    }
}
