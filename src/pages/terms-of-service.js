import { BasePage } from './BasePage.js'

export default class TermsOfServicePage extends BasePage {
    constructor() {
        super()
        this.title = 'Terms of Service - Technorox TCG'
    }

    createContent() {
        const content = document.createElement('div')
        content.innerHTML = `
                <div class="container mx-auto px-4 py-8 max-w-4xl bg-dark-900 text-white min-h-screen">
                    <div class="prose prose-invert max-w-none">
                        <h1 class="text-4xl font-bold text-neon-cyan mb-8">Terms of Service</h1>
                        
                        <div class="bg-dark-800 p-6 rounded-lg mb-8 border border-neon-cyan/20">
                            <p class="text-lg"><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <p class="text-lg"><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">1. Agreement to Terms</h2>
                        <p class="mb-4">
                            Welcome to Technorox, a digital trading card game ("Game") operated by <strong>KAAI TECH LLC</strong> ("Company," "we," "us," or "our"). 
                            By accessing or using Technorox, you agree to be bound by these Terms of Service ("Terms"). 
                            If you do not agree to these Terms, do not use our Game.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">2. About KAAI TECH LLC</h2>
                        <p class="mb-4">
                            Technorox is a product of <strong>KAAI TECH LLC</strong>, a limited liability company. 
                            When you make purchases, including Rox Chips transactions, you will see "KAAI TECH LLC" as the merchant name on your payment statements and receipts.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">3. Game Description</h2>
                        <p class="mb-4">
                            Technorox is a cyberpunk-themed digital trading card game where players collect cards, build decks, and compete against other players. 
                            The Game includes virtual currency called "Rox Chips" that can be purchased with real money to acquire in-game items.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">4. Account Registration</h2>
                        <p class="mb-4">
                            To use certain features of the Game, you must create an account. You agree to:
                        </p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and update your account information</li>
                            <li>Keep your account credentials secure</li>
                            <li>Be responsible for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">5. Rox Chips and Virtual Currency</h2>
                        <p class="mb-4">
                            <strong>Rox Chips</strong> are the virtual currency used in Technorox. Important terms regarding Rox Chips:
                        </p>
                        <ul class="list-disc pl-6 mb-4">
                            <li><strong>Purchase:</strong> Rox Chips can be purchased through our payment processor (Stripe) with real money</li>
                            <li><strong>No Cash Value:</strong> Rox Chips have no real-world monetary value and cannot be exchanged for cash</li>
                            <li><strong>Non-Refundable:</strong> All Rox Chip purchases are final and non-refundable</li>
                            <li><strong>No Transfer:</strong> Rox Chips cannot be transferred between accounts</li>
                            <li><strong>Game Use Only:</strong> Rox Chips can only be used within the Technorox game</li>
                            <li><strong>Merchant Name:</strong> Purchases will appear as "KAAI TECH LLC" on your payment statements</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">6. Acceptable Use</h2>
                        <p class="mb-4">You agree NOT to:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Cheat, hack, or use unauthorized software</li>
                            <li>Create multiple accounts to gain unfair advantages</li>
                            <li>Harass, threaten, or abuse other players</li>
                            <li>Use offensive language or inappropriate content</li>
                            <li>Attempt to reverse engineer the Game</li>
                            <li>Sell, trade, or transfer your account</li>
                            <li>Use bots or automated systems</li>
                            <li>Exploit bugs or glitches for personal gain</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">7. Intellectual Property</h2>
                        <p class="mb-4">
                            All content in Technorox, including but not limited to graphics, text, software, music, and game mechanics, 
                            is the property of KAAI TECH LLC and is protected by copyright, trademark, and other intellectual property laws.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">8. Privacy and Data Collection</h2>
                        <p class="mb-4">
                            Your privacy is important to us. Please review our <a href="/privacy-policy" target="_blank" class="text-neon-cyan hover:underline">Privacy Policy</a> 
                            to understand how we collect, use, and protect your information.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">9. Account Termination</h2>
                        <p class="mb-4">
                            We reserve the right to suspend or terminate your account at any time for violation of these Terms. 
                            Upon termination, you lose access to your account and all associated virtual items, including Rox Chips.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">10. Disclaimers</h2>
                        <p class="mb-4">
                            THE GAME IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. KAAI TECH LLC DISCLAIMS ALL WARRANTIES, 
                            EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">11. Limitation of Liability</h2>
                        <p class="mb-4">
                            KAAI TECH LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES 
                            ARISING FROM YOUR USE OF THE GAME, INCLUDING LOSS OF VIRTUAL ITEMS OR ROX CHIPS.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">12. Governing Law</h2>
                        <p class="mb-4">
                            These Terms are governed by the laws of the jurisdiction where KAAI TECH LLC is incorporated, 
                            without regard to conflict of law principles.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">13. Changes to Terms</h2>
                        <p class="mb-4">
                            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. 
                            Continued use of the Game constitutes acceptance of modified Terms.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">14. Contact Information</h2>
                        <p class="mb-4">
                            If you have questions about these Terms, please contact us:
                        </p>
                        <div class="bg-dark-800 p-4 rounded-lg border border-neon-cyan/20">
                            <p><strong>KAAI TECH LLC</strong></p>
                            <p>Technorox Support Team</p>
                            <p>Email: support@technorox.com</p>
                            <p>Website: https://technorox.com</p>
                        </div>

                        <div class="mt-12 pt-8 border-t border-gray-600">
                            <p class="text-center text-gray-400">
                                © ${new Date().getFullYear()} KAAI TECH LLC. All rights reserved. Technorox is a trademark of KAAI TECH LLC.
                            </p>
                        </div>
                    </div>
                </div>
        `
        
        return content
    }
}
