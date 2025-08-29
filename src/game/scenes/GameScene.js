import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
        this.gameBoard = null
        this.playerHand = []
        this.playerBattlefield = []
        this.opponentBattlefield = []
        this.selectedCard = null
        this.cardSlots = {
            playerHand: [],
            playerField: [],
            opponentField: []
        }
    }
    
    preload() {
        // Create placeholder graphics for cards and UI elements
        this.createPlaceholderAssets()
    }
    
    create() {
        // Set up the game board
        this.setupGameBoard()
        
        // Create card zones
        this.createCardZones()
        
        // Set up input handling
        this.setupInputHandling()
        
        // Initialize with mock data
        this.initializeMockGame()
    }
    
    createPlaceholderAssets() {
        // Create card back texture
        this.add.graphics()
            .fillStyle(0x1A001F)
            .fillRoundedRect(0, 0, 80, 112, 8)
            .lineStyle(2, 0x00FFF7)
            .strokeRoundedRect(0, 0, 80, 112, 8)
            .generateTexture('card_back', 80, 112)
        
        // Create creature card texture
        this.add.graphics()
            .fillStyle(0x0A0A0F)
            .fillRoundedRect(0, 0, 80, 112, 8)
            .lineStyle(2, 0x00FFF7)
            .strokeRoundedRect(0, 0, 80, 112, 8)
            .fillStyle(0x00FFF7, 0.2)
            .fillRoundedRect(4, 4, 72, 60, 4)
            .generateTexture('creature_card', 80, 112)
        
        // Create mod card texture
        this.add.graphics()
            .fillStyle(0x0A0A0F)
            .fillRoundedRect(0, 0, 80, 112, 8)
            .lineStyle(2, 0xFF3EF5)
            .strokeRoundedRect(0, 0, 80, 112, 8)
            .fillStyle(0xFF3EF5, 0.2)
            .fillRoundedRect(4, 4, 72, 60, 4)
            .generateTexture('mod_card', 80, 112)
        
        // Create data card texture
        this.add.graphics()
            .fillStyle(0x0A0A0F)
            .fillRoundedRect(0, 0, 80, 112, 8)
            .lineStyle(2, 0x00FF00)
            .strokeRoundedRect(0, 0, 80, 112, 8)
            .fillStyle(0x00FF00, 0.2)
            .fillRoundedRect(4, 4, 72, 60, 4)
            .generateTexture('data_card', 80, 112)
        
        // Create card slot texture
        this.add.graphics()
            .lineStyle(2, 0x00FFF7, 0.3)
            .strokeRoundedRect(0, 0, 80, 112, 8)
            .lineStyle(1, 0x00FFF7, 0.5)
            .strokeRoundedRect(2, 2, 76, 108, 6)
            .generateTexture('card_slot', 80, 112)
    }
    
    setupGameBoard() {
        const { width, height } = this.scale
        
        // Background grid
        const graphics = this.add.graphics()
        graphics.lineStyle(1, 0x00FFF7, 0.1)
        
        const gridSize = 40
        for (let x = 0; x < width; x += gridSize) {
            graphics.moveTo(x, 0)
            graphics.lineTo(x, height)
        }
        for (let y = 0; y < height; y += gridSize) {
            graphics.moveTo(0, y)
            graphics.lineTo(width, y)
        }
        graphics.strokePath()
        
        // Game zones
        this.createGameZones()
    }
    
    createGameZones() {
        // Simple Hearthstone/MTG layout - no visual zones, just clean battlefield
        // The card slots will define the play areas
    }
    
    createCardZones() {
        const { width, height } = this.scale
        
        // MTG Layout: Library (deck), Hand, Battlefield, Graveyard
        
        // === OPPONENT ZONES ===
        
        // Opponent Library (deck) - top left
        const opponentLibrary = this.add.image(80, height * 0.15, 'card_slot')
            .setInteractive()
            .setData('zone', 'opponentLibrary')
            .setScale(0.7)
            .setTint(0x444444)
        
        // Opponent Graveyard - top right  
        const opponentGraveyard = this.add.image(width - 80, height * 0.15, 'card_slot')
            .setInteractive()
            .setData('zone', 'opponentGraveyard')
            .setScale(0.7)
            .setTint(0x666666)
        
        // Opponent Hand (top center)
        const opponentHandY = height * 0.15
        const opponentHandStartX = width / 2 - (6 * 60) / 2
        
        for (let i = 0; i < 7; i++) {
            const slot = this.add.image(opponentHandStartX + i * 60, opponentHandY, 'card_slot')
                .setInteractive()
                .setData('zone', 'opponentHand')
                .setData('index', i)
                .setScale(0.5)
                .setRotation(Math.PI) // Face down toward player
                .setAlpha(0.4)
            
            this.cardSlots.opponentHand = this.cardSlots.opponentHand || []
            this.cardSlots.opponentHand.push(slot)
        }
        
        // === BATTLEFIELD (MIDDLE) ===
        
        // Opponent side of battlefield
        const opponentFieldY = height * 0.4
        const fieldStartX = width / 2 - (6 * 85) / 2
        
        for (let i = 0; i < 7; i++) {
            const slot = this.add.image(fieldStartX + i * 85, opponentFieldY, 'card_slot')
                .setInteractive()
                .setData('zone', 'opponentField')
                .setData('index', i)
                .setAlpha(0.15)
            
            this.cardSlots.opponentField.push(slot)
        }
        
        // Player side of battlefield
        const playerFieldY = height * 0.6
        
        for (let i = 0; i < 7; i++) {
            const slot = this.add.image(fieldStartX + i * 85, playerFieldY, 'card_slot')
                .setInteractive()
                .setData('zone', 'playerField')
                .setData('index', i)
                .setAlpha(0.15)
            
            this.cardSlots.playerField.push(slot)
        }
        
        // === PLAYER ZONES ===
        
        // Player Library (deck) - bottom left
        const playerLibrary = this.add.image(80, height * 0.85, 'card_slot')
            .setInteractive()
            .setData('zone', 'playerLibrary')
            .setScale(0.7)
            .setTint(0x00FFF7)
        
        // Player Graveyard - bottom right
        const playerGraveyard = this.add.image(width - 80, height * 0.85, 'card_slot')
            .setInteractive()
            .setData('zone', 'playerGraveyard')
            .setScale(0.7)
            .setTint(0x666666)
        
        // Player Hand (bottom center)
        const playerHandY = height * 0.85
        const playerHandStartX = width / 2 - (6 * 60) / 2
        
        for (let i = 0; i < 7; i++) {
            const slot = this.add.image(playerHandStartX + i * 60, playerHandY, 'card_slot')
                .setInteractive()
                .setData('zone', 'playerHand')
                .setData('index', i)
                .setScale(0.5)
                .setAlpha(0.3)
            
            this.cardSlots.playerHand.push(slot)
        }
        
        // Store special zones
        this.cardSlots.playerLibrary = playerLibrary
        this.cardSlots.playerGraveyard = playerGraveyard
        this.cardSlots.opponentLibrary = opponentLibrary
        this.cardSlots.opponentGraveyard = opponentGraveyard
    }
    
    setupInputHandling() {
        // Card drag and drop
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.getData('draggable')) {
                gameObject.setTint(0x00FFF7)
                this.selectedCard = gameObject
            }
        })
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.getData('draggable')) {
                gameObject.x = dragX
                gameObject.y = dragY
            }
        })
        
        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject.getData('draggable')) {
                gameObject.clearTint()
                this.handleCardDrop(gameObject, pointer)
            }
        })
        
        // Zone click handling
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject.getData('zone')) {
                this.handleZoneClick(gameObject, pointer)
            }
        })
    }
    
    handleCardDrop(card, pointer) {
        // Find the zone under the pointer
        const hitZones = this.input.hitTestPointer(pointer)
        let targetZone = null
        
        for (const zone of hitZones) {
            if (zone.getData('zone')) {
                targetZone = zone
                break
            }
        }
        
        if (targetZone && this.canPlayCardToZone(card, targetZone)) {
            this.playCardToZone(card, targetZone)
        } else {
            // Return card to original position
            this.returnCardToOriginalPosition(card)
        }
    }
    
    canPlayCardToZone(card, zone) {
        const cardType = card.getData('cardType')
        const zoneName = zone.getData('zone')
        
        // Only allow playing cards from hand to player field
        if (card.getData('currentZone') === 'hand' && zoneName === 'playerField') {
            return true
        }
        
        return false
    }
    
    playCardToZone(card, zone) {
        const zoneIndex = zone.getData('index')
        const zoneName = zone.getData('zone')
        
        // Move card to zone
        this.tweens.add({
            targets: card,
            x: zone.x,
            y: zone.y,
            duration: 300,
            ease: 'Power2'
        })
        
        // Update card data
        card.setData('currentZone', zoneName)
        card.setData('zoneIndex', zoneIndex)
        
        // Emit game event
        this.events.emit('cardPlayed', {
            cardId: card.getData('cardId'),
            zone: zoneName,
            index: zoneIndex
        })
    }
    
    returnCardToOriginalPosition(card) {
        const originalX = card.getData('originalX')
        const originalY = card.getData('originalY')
        
        this.tweens.add({
            targets: card,
            x: originalX,
            y: originalY,
            duration: 300,
            ease: 'Power2'
        })
    }
    
    handleZoneClick(zone, pointer) {
        const zoneName = zone.getData('zone')
        const zoneIndex = zone.getData('index')
        
        // Handle different zone interactions
        switch (zoneName) {
            case 'playerField':
                this.handlePlayerFieldClick(zoneIndex)
                break
            case 'opponentField':
                this.handleOpponentFieldClick(zoneIndex)
                break
        }
    }
    
    handlePlayerFieldClick(index) {
        // Handle clicking on player's battlefield creatures
        console.log(`Clicked player field slot ${index}`)
    }
    
    handleOpponentFieldClick(index) {
        // Handle attacking opponent creatures
        console.log(`Clicked opponent field slot ${index}`)
    }
    
    initializeMockGame() {
        // Add some mock cards to player hand
        this.addCardToHand({
            id: 'card_1',
            name: 'Cyber Wolf',
            type: 'creature',
            cost: 2,
            attack: 2,
            defense: 1
        })
        
        this.addCardToHand({
            id: 'card_2',
            name: 'Neural Implant',
            type: 'mod',
            cost: 1
        })
        
        this.addCardToHand({
            id: 'card_3',
            name: 'Data Hack',
            type: 'data',
            cost: 1
        })
        
        // Add opponent cards
        this.addOpponentCard({
            id: 'opp_card_1',
            name: 'AI Construct',
            type: 'creature',
            cost: 3,
            attack: 3,
            defense: 2
        })
    }
    
    addCardToHand(cardData) {
        const handSlot = this.findEmptyHandSlot()
        if (!handSlot) return
        
        const texture = this.getCardTexture(cardData.type)
        const card = this.add.image(handSlot.x, handSlot.y, texture)
            .setInteractive({ draggable: true })
            .setData('cardId', cardData.id)
            .setData('cardType', cardData.type)
            .setData('cardData', cardData)
            .setData('currentZone', 'hand')
            .setData('draggable', true)
            .setData('originalX', handSlot.x)
            .setData('originalY', handSlot.y)
        
        // Add card text
        this.add.text(card.x, card.y - 40, cardData.name, {
            fontSize: '10px',
            fontFamily: 'Orbitron',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 70 }
        }).setOrigin(0.5)
        
        if (cardData.type === 'creature') {
            this.add.text(card.x - 25, card.y + 35, cardData.attack.toString(), {
                fontSize: '12px',
                fontFamily: 'Orbitron',
                color: '#FF3EF5',
                fontStyle: 'bold'
            }).setOrigin(0.5)
            
            this.add.text(card.x + 25, card.y + 35, cardData.defense.toString(), {
                fontSize: '12px',
                fontFamily: 'Orbitron',
                color: '#00FFF7',
                fontStyle: 'bold'
            }).setOrigin(0.5)
        }
        
        // Cost indicator
        this.add.circle(card.x - 30, card.y - 45, 10, 0x00FFF7)
        this.add.text(card.x - 30, card.y - 45, cardData.cost.toString(), {
            fontSize: '12px',
            fontFamily: 'Orbitron',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        
        this.playerHand.push(card)
    }
    
    addOpponentCard(cardData) {
        const fieldSlot = this.findEmptyOpponentFieldSlot()
        if (!fieldSlot) return
        
        const card = this.add.image(fieldSlot.x, fieldSlot.y, 'creature_card')
            .setData('cardId', cardData.id)
            .setData('cardType', cardData.type)
            .setData('cardData', cardData)
            .setData('currentZone', 'opponentField')
        
        // Add card name
        this.add.text(card.x, card.y - 40, cardData.name, {
            fontSize: '10px',
            fontFamily: 'Orbitron',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 70 }
        }).setOrigin(0.5)
        
        // Add stats for creatures
        if (cardData.type === 'creature') {
            this.add.text(card.x - 25, card.y + 35, cardData.attack.toString(), {
                fontSize: '12px',
                fontFamily: 'Orbitron',
                color: '#FF3EF5',
                fontStyle: 'bold'
            }).setOrigin(0.5)
            
            this.add.text(card.x + 25, card.y + 35, cardData.defense.toString(), {
                fontSize: '12px',
                fontFamily: 'Orbitron',
                color: '#00FFF7',
                fontStyle: 'bold'
            }).setOrigin(0.5)
        }
        
        this.opponentBattlefield.push(card)
    }
    
    findEmptyHandSlot() {
        for (let i = 0; i < this.cardSlots.playerHand.length; i++) {
            const slot = this.cardSlots.playerHand[i]
            if (!this.isSlotOccupied('hand', i)) {
                return slot
            }
        }
        return null
    }
    
    findEmptyOpponentFieldSlot() {
        for (let i = 0; i < this.cardSlots.opponentField.length; i++) {
            const slot = this.cardSlots.opponentField[i]
            if (!this.isSlotOccupied('opponentField', i)) {
                return slot
            }
        }
        return null
    }
    
    isSlotOccupied(zone, index) {
        const cards = zone === 'hand' ? this.playerHand : 
                     zone === 'playerField' ? this.playerBattlefield :
                     this.opponentBattlefield
        
        return cards.some(card => 
            card.getData('currentZone') === zone && 
            card.getData('zoneIndex') === index
        )
    }
    
    getCardTexture(cardType) {
        switch (cardType) {
            case 'creature': return 'creature_card'
            case 'mod': return 'mod_card'
            case 'data': return 'data_card'
            default: return 'card_back'
        }
    }
    
    update() {
        // Game loop updates
    }
}
