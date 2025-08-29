export class GameEngine {
    constructor() {
        this.gameRules = {
            maxHandSize: 7,
            startingHandSize: 5,
            maxDataStreams: 10,
            startingCoreIntegrity: 50
        }
    }
    
    async initializeGame(gameState) {
        const { player1, player2 } = gameState
        
        // Shuffle decks
        player1.shuffleDeck()
        player2.shuffleDeck()
        
        // Draw starting hands
        player1.drawCards(this.gameRules.startingHandSize)
        player2.drawCards(this.gameRules.startingHandSize)
        
        // Set initial game state
        gameState.setPhase('main')
        gameState.logEvent('Game initialized', {
            player1: player1.name,
            player2: player2.name
        })
        
        return gameState
    }
    
    async playCard(gameState, cardId, targetId = null, modSlotIndex = null) {
        const currentPlayer = gameState.getCurrentPlayer()
        const card = currentPlayer.hand.find(c => c.id === cardId)
        
        if (!card) {
            throw new Error('Card not found in hand')
        }
        
        // Validate card play
        const canPlay = gameState.canPlayCard(card, currentPlayer)
        if (!canPlay.canPlay) {
            throw new Error(canPlay.reason)
        }
        
        // Play the card
        const playedCard = currentPlayer.playCard(cardId)
        
        // Handle different card types
        switch (playedCard.type) {
            case 'creature':
                await this.playCreature(gameState, playedCard)
                break
                
            case 'mod':
                await this.playMod(gameState, playedCard, targetId)
                break
                
            case 'data':
                await this.playDataCard(gameState, playedCard, targetId)
                break
                
            case 'realm':
                await this.playRealm(gameState, playedCard)
                break
        }
        
        gameState.logEvent(`${currentPlayer.name} played ${playedCard.name}`, {
            card: playedCard,
            targetId
        })
        
        return {
            success: true,
            card: playedCard,
            gameState: gameState.getGameState()
        }
    }
    
    async playCreature(gameState, creature) {
        // Creature is already added to battlefield in Player.playCard()
        // Apply any enter-the-battlefield effects
        if (creature.abilities) {
            for (const ability of creature.abilities) {
                await this.resolveAbility(gameState, ability, creature)
            }
        }
    }
    
    async playMod(gameState, mod, targetId) {
        if (!targetId) {
            throw new Error('Mod cards require a target')
        }
        
        const currentPlayer = gameState.getCurrentPlayer()
        const target = currentPlayer.battlefield.find(c => c.id === targetId)
        
        if (!target || target.type !== 'creature') {
            throw new Error('Invalid target for mod')
        }
        
        // Attach mod to creature
        currentPlayer.attachMod(mod, targetId)
        
        // Resolve mod effects
        if (mod.grantedAbilities) {
            target.grantedAbilities = target.grantedAbilities || []
            target.grantedAbilities.push(...mod.grantedAbilities)
        }
    }
    
    async playDataCard(gameState, dataCard, targetId) {
        // Resolve data card effects
        if (dataCard.effects) {
            for (const effect of dataCard.effects) {
                await this.resolveEffect(gameState, effect, dataCard, targetId)
            }
        }
        
        // Data cards go to graveyard after use
        gameState.getCurrentPlayer().graveyard.push(dataCard)
    }
    
    async playRealm(gameState, realm) {
        // Realm cards create ongoing effects
        // For now, just add to battlefield
        gameState.getCurrentPlayer().battlefield.push(realm)
    }
    
    async attack(gameState, attackerId, targetId) {
        const attacker = gameState.getCurrentPlayer()
        const defender = gameState.getOpponentPlayer()
        
        const attackingCreature = attacker.battlefield.find(c => c.id === attackerId)
        if (!attackingCreature || attackingCreature.type !== 'creature') {
            throw new Error('Invalid attacking creature')
        }
        
        // Validate attack
        const canAttack = gameState.canAttack(attackingCreature, attacker, targetId)
        if (!canAttack.canAttack) {
            throw new Error(canAttack.reason)
        }
        
        // Perform attack
        attacker.attackWithCreature(attackerId, targetId)
        
        let result = {}
        
        if (targetId === defender.id) {
            // Direct attack on player
            const damage = this.calculateDamage(attackingCreature)
            defender.takeDamage(damage)
            
            result = {
                type: 'direct_attack',
                attacker: attackingCreature,
                target: defender,
                damage
            }
            
            gameState.logEvent(`${attackingCreature.name} attacks ${defender.name} for ${damage} damage`)
            
        } else {
            // Attack on creature
            const defendingCreature = defender.battlefield.find(c => c.id === targetId)
            if (!defendingCreature) {
                throw new Error('Invalid target creature')
            }
            
            result = await this.resolveCombat(gameState, attackingCreature, defendingCreature)
        }
        
        return result
    }
    
    async resolveCombat(gameState, attacker, defender) {
        const attackerDamage = this.calculateDamage(attacker)
        const defenderDamage = this.calculateDamage(defender)
        
        // Apply damage
        attacker.health -= defenderDamage
        defender.health -= attackerDamage
        
        const result = {
            type: 'creature_combat',
            attacker,
            defender,
            attackerDamage,
            defenderDamage,
            destroyed: []
        }
        
        // Check for destroyed creatures
        const attackerPlayer = gameState.getCurrentPlayer()
        const defenderPlayer = gameState.getOpponentPlayer()
        
        if (attacker.health <= 0) {
            attackerPlayer.destroyCreature(attacker.id)
            result.destroyed.push(attacker)
        }
        
        if (defender.health <= 0) {
            defenderPlayer.destroyCreature(defender.id)
            result.destroyed.push(defender)
        }
        
        gameState.logEvent(`Combat: ${attacker.name} vs ${defender.name}`, result)
        
        return result
    }
    
    calculateDamage(creature) {
        let damage = creature.attack || 0
        
        // Add damage from attached mods
        if (creature.attachedMods) {
            creature.attachedMods.forEach(mod => {
                if (mod.statModifiers?.attack) {
                    damage += mod.statModifiers.attack
                }
            })
        }
        
        return Math.max(0, damage)
    }
    
    async endTurn(gameState) {
        const currentPlayer = gameState.getCurrentPlayer()
        
        // End turn for current player
        currentPlayer.endTurn()
        
        // Switch to next player
        gameState.switchPlayer()
        
        // Start turn for new player
        const newPlayer = gameState.getCurrentPlayer()
        newPlayer.startTurn()
        
        // Draw card for new turn
        const drawnCard = newPlayer.drawCard()
        if (drawnCard) {
            gameState.logEvent(`${newPlayer.name} draws a card`)
        } else {
            gameState.logEvent(`${newPlayer.name} cannot draw - deck is empty!`)
        }
        
        // Check hand size limit
        await this.enforceHandSizeLimit(gameState, newPlayer)
        
        return {
            newCurrentPlayer: newPlayer.id,
            drawnCard: drawnCard ? { drawn: true } : null, // Don't reveal card to opponent
            gameState: gameState.getGameState()
        }
    }
    
    async enforceHandSizeLimit(gameState, player) {
        while (player.hand.length > this.gameRules.maxHandSize) {
            // Player must discard down to hand size limit
            // For AI, discard randomly; for human players, this would be a choice
            if (player.id === 'ai') {
                const randomIndex = Math.floor(Math.random() * player.hand.length)
                const discarded = player.hand.splice(randomIndex, 1)[0]
                player.graveyard.push(discarded)
                gameState.logEvent(`${player.name} discards ${discarded.name}`)
            } else {
                // Human player needs to choose - this would trigger a UI event
                gameState.logEvent(`${player.name} must discard down to ${this.gameRules.maxHandSize} cards`)
                break // Let UI handle the choice
            }
        }
    }
    
    async resolveAbility(gameState, ability, source) {
        // Resolve creature abilities
        switch (ability.type) {
            case 'draw_card':
                const owner = this.getCardOwner(gameState, source)
                owner.drawCard()
                break
                
            case 'deal_damage':
                if (ability.target && ability.amount) {
                    const target = this.findTarget(gameState, ability.target)
                    if (target) {
                        target.takeDamage(ability.amount)
                    }
                }
                break
                
            // Add more ability types as needed
        }
    }
    
    async resolveEffect(gameState, effect, source, targetId) {
        switch (effect) {
            case 'destroy_target_creature':
                if (targetId) {
                    const target = this.findCreatureById(gameState, targetId)
                    if (target) {
                        const owner = this.getCardOwner(gameState, target)
                        owner.destroyCreature(targetId)
                    }
                }
                break
                
            case 'deal_damage':
                // Implementation depends on specific card
                break
                
            // Add more effects as needed
        }
    }
    
    findCreatureById(gameState, creatureId) {
        const allCreatures = [
            ...gameState.player1.battlefield,
            ...gameState.player2.battlefield
        ].filter(card => card.type === 'creature')
        
        return allCreatures.find(creature => creature.id === creatureId)
    }
    
    getCardOwner(gameState, card) {
        if (gameState.player1.battlefield.includes(card) || 
            gameState.player1.hand.includes(card)) {
            return gameState.player1
        }
        return gameState.player2
    }
    
    findTarget(gameState, targetQuery) {
        // Simple target finding - can be expanded
        if (targetQuery === 'opponent') {
            return gameState.getOpponentPlayer()
        }
        // Add more target types as needed
        return null
    }
}
