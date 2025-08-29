// Card Schema for Technorox TCG
export const CARD_TYPES = {
    CREATURE: 'creature',
    MOD: 'mod',
    DATA: 'data',
    REALM: 'realm'
}

export const CARD_RARITIES = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    MYTHIC: 'mythic'
}

export const CREATURE_SUBTYPES = {
    CYBER_BEAST: 'cyber_beast',
    ANDROID: 'android',
    DRONE: 'drone',
    AI_CONSTRUCT: 'ai_construct',
    AUGMENTED_HUMAN: 'augmented_human'
}

export const MOD_TYPES = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    ENHANCEMENT: 'enhancement',
    UTILITY: 'utility'
}

export const DATA_TYPES = {
    HACK: 'hack',
    VIRUS: 'virus',
    FIREWALL: 'firewall',
    PROTOCOL: 'protocol'
}

// Base card schema
export const createCard = (cardData) => {
    const baseCard = {
        id: cardData.id || generateCardId(),
        name: cardData.name,
        type: cardData.type,
        rarity: cardData.rarity,
        faction: cardData.faction || 'neutral',
        dataStreamCost: cardData.dataStreamCost || 0,
        description: cardData.description || '',
        flavorText: cardData.flavorText || '',
        artworkUrl: cardData.artworkUrl || generateArtworkUrl(cardData.type, cardData.rarity, cardData.name),
        artworkPrompt: cardData.artworkPrompt || generateArtworkPrompt(cardData.type, cardData.name),
        version: cardData.version || '1.0.0',
        createdAt: cardData.createdAt || new Date().toISOString(),
        updatedAt: cardData.updatedAt || new Date().toISOString(),
        tags: cardData.tags || [],
        abilities: cardData.abilities || [],
        isNew: cardData.isNew || false,
        isFavorite: cardData.isFavorite || false
    }

    // Type-specific properties
    switch (cardData.type) {
        case CARD_TYPES.CREATURE:
            return {
                ...baseCard,
                subtype: cardData.subtype,
                attack: cardData.attack || 0,
                defense: cardData.defense || 0,
                health: cardData.health || 1,
                modSlots: getModSlotsByRarity(cardData.rarity),
                keywords: cardData.keywords || []
            }

        case CARD_TYPES.MOD:
            return {
                ...baseCard,
                modType: cardData.modType,
                attachmentType: cardData.attachmentType || 'creature',
                statModifiers: cardData.statModifiers || {},
                grantedAbilities: cardData.grantedAbilities || []
            }

        case CARD_TYPES.DATA:
            return {
                ...baseCard,
                dataType: cardData.dataType,
                targets: cardData.targets || [],
                effects: cardData.effects || []
            }

        case CARD_TYPES.REALM:
            return {
                ...baseCard,
                globalEffects: cardData.globalEffects || [],
                triggerConditions: cardData.triggerConditions || []
            }

        default:
            return baseCard
    }
}

// Mod slots based on rarity
function getModSlotsByRarity(rarity) {
    switch (rarity) {
        case CARD_RARITIES.COMMON: return 1
        case CARD_RARITIES.UNCOMMON: return 2
        case CARD_RARITIES.RARE: return 3
        case CARD_RARITIES.MYTHIC: return 4
        default: return 1
    }
}

// Generate unique card ID
function generateCardId() {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate artwork URL (placeholder - replace with actual artwork generation)
function generateArtworkUrl(type, rarity, name) {
    const colors = {
        common: 'CCCCCC',
        uncommon: '00FF00', 
        rare: '0066FF',
        mythic: 'FF00FF'
    }
    
    const baseUrl = 'https://via.placeholder.com/400x560'
    const color = colors[rarity] || colors.common
    const encodedName = encodeURIComponent(name || type.toUpperCase())
    
    return `${baseUrl}/${color}/FFFFFF?text=${encodedName}`
}

// Generate AI artwork prompt for consistent style
function generateArtworkPrompt(type, name) {
    const basePrompt = "cyberpunk digital art, neon colors, futuristic, high-tech, detailed"
    
    const typePrompts = {
        creature: `${basePrompt}, cybernetic creature, biomechanical, glowing circuits`,
        mod: `${basePrompt}, technological enhancement, mechanical parts, upgrade module`,
        data: `${basePrompt}, digital interface, holographic display, code visualization`,
        realm: `${basePrompt}, futuristic environment, cyber landscape, atmospheric lighting`
    }
    
    return `${typePrompts[type] || basePrompt}, ${name}, professional game art, card illustration`
}

// Card validation
export function validateCard(card) {
    const errors = []

    if (!card.name || card.name.trim().length === 0) {
        errors.push('Card name is required')
    }

    if (!Object.values(CARD_TYPES).includes(card.type)) {
        errors.push('Invalid card type')
    }

    if (!Object.values(CARD_RARITIES).includes(card.rarity)) {
        errors.push('Invalid card rarity')
    }

    if (card.dataStreamCost < 0 || card.dataStreamCost > 10) {
        errors.push('Data stream cost must be between 0 and 10')
    }

    // Type-specific validation
    if (card.type === CARD_TYPES.CREATURE) {
        if (card.attack < 0) errors.push('Attack cannot be negative')
        if (card.defense < 0) errors.push('Defense cannot be negative')
        if (card.health < 1) errors.push('Health must be at least 1')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// Sample cards for testing
export const SAMPLE_CARDS = [
    createCard({
        name: 'Cyber Wolf',
        type: CARD_TYPES.CREATURE,
        subtype: CREATURE_SUBTYPES.CYBER_BEAST,
        rarity: CARD_RARITIES.COMMON,
        dataStreamCost: 2,
        attack: 2,
        defense: 1,
        health: 3,
        description: 'A cybernetically enhanced wolf with razor-sharp claws.',
        flavorText: 'In the neon wilderness, only the augmented survive.',
        keywords: ['Fast', 'Pack Hunter']
    }),
    
    createCard({
        name: 'Neural Implant',
        type: CARD_TYPES.MOD,
        modType: MOD_TYPES.ENHANCEMENT,
        rarity: CARD_RARITIES.UNCOMMON,
        dataStreamCost: 1,
        description: 'Grants +1 Attack and allows the creature to hack enemy data streams.',
        statModifiers: { attack: 1 },
        grantedAbilities: ['Hack: Steal 1 data stream from opponent']
    }),
    
    createCard({
        name: 'System Crash',
        type: CARD_TYPES.DATA,
        dataType: DATA_TYPES.VIRUS,
        rarity: CARD_RARITIES.RARE,
        dataStreamCost: 3,
        description: 'Destroy target creature and all attached mods.',
        effects: ['destroy_target_creature', 'destroy_attached_mods']
    })
]
