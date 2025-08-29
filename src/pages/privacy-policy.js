import { BasePage } from './BasePage.js'

export default class PrivacyPolicyPage extends BasePage {
    constructor() {
        super()
        this.title = 'Privacy Policy - Technorox TCG'
    }

    createContent() {
        const content = document.createElement('div')
        content.innerHTML = `
                <div class="container mx-auto px-4 py-8 max-w-4xl bg-dark-900 text-white min-h-screen">
                    <div class="prose prose-invert max-w-none">
                        <h1 class="text-4xl font-bold text-neon-cyan mb-8">Privacy Policy</h1>
                        
                        <div class="bg-dark-800 p-6 rounded-lg mb-8 border border-neon-cyan/20">
                            <p class="text-lg"><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <p class="text-lg"><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">1. Introduction</h2>
                        <p class="mb-4">
                            This Privacy Policy describes how <strong>KAAI TECH LLC</strong> ("Company," "we," "us," or "our") 
                            collects, uses, and protects your information when you use Technorox ("Game," "Service"). 
                            Technorox is a product of KAAI TECH LLC.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">2. Information We Collect</h2>
                        
                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">2.1 Account Information</h3>
                        <p class="mb-4">When you create an account, we collect:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Email address</li>
                            <li>Display name/username</li>
                            <li>Password (encrypted)</li>
                            <li>Account creation date</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">2.2 Game Data</h3>
                        <p class="mb-4">During gameplay, we collect:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Game statistics (wins, losses, ranking)</li>
                            <li>Card collection and deck information</li>
                            <li>Rox Chips balance and transaction history</li>
                            <li>Achievement and mission progress</li>
                            <li>In-game purchases and spending patterns</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">2.3 Payment Information</h3>
                        <p class="mb-4">For Rox Chips purchases:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Payment processing is handled by Stripe (third-party processor)</li>
                            <li>We do NOT store your credit card information</li>
                            <li>We receive transaction confirmations from Stripe</li>
                            <li>Purchases appear as "KAAI TECH LLC" on your statements</li>
                            <li>We store purchase amounts, dates, and Rox Chips delivered</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">2.4 Technical Information</h3>
                        <p class="mb-4">We automatically collect:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>IP address and location (general)</li>
                            <li>Device type and browser information</li>
                            <li>Game performance and error logs</li>
                            <li>Session duration and frequency</li>
                            <li>Feature usage analytics</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">3. How We Use Your Information</h2>
                        
                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">3.1 Game Operations</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Provide and maintain the Game service</li>
                            <li>Process Rox Chips purchases and transactions</li>
                            <li>Save your game progress and preferences</li>
                            <li>Enable multiplayer features and matchmaking</li>
                            <li>Prevent cheating and maintain fair play</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">3.2 Communication</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Send important account and service updates</li>
                            <li>Respond to customer support requests</li>
                            <li>Notify about new features or events (with consent)</li>
                            <li>Send security alerts if needed</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">3.3 Improvement and Analytics</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Analyze game usage to improve features</li>
                            <li>Monitor game performance and fix bugs</li>
                            <li>Understand player preferences and behavior</li>
                            <li>Develop new content and features</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">4. Information Sharing</h2>
                        <p class="mb-4">We do NOT sell your personal information. We may share information in these limited circumstances:</p>
                        
                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">4.1 Service Providers</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li><strong>Firebase (Google):</strong> Database and authentication services</li>
                            <li><strong>Stripe:</strong> Payment processing for Rox Chips purchases</li>
                            <li><strong>OpenAI:</strong> AI-powered card generation features</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">4.2 Legal Requirements</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Comply with legal obligations</li>
                            <li>Protect our rights and property</li>
                            <li>Investigate potential violations</li>
                            <li>Ensure user and public safety</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">5. Data Security</h2>
                        <p class="mb-4">We implement industry-standard security measures:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Encryption of data in transit and at rest</li>
                            <li>Secure authentication systems</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to personal information</li>
                            <li>Firebase security rules for data protection</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">6. Your Rights and Choices</h2>
                        
                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">6.1 Account Management</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Update your account information anytime</li>
                            <li>Change your display name and preferences</li>
                            <li>Delete your account (contact support)</li>
                        </ul>

                        <h3 class="text-xl font-semibold text-neon-cyan mt-6 mb-3">6.2 Data Rights</h3>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Request a copy of your personal data</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your data (subject to legal requirements)</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">7. Children's Privacy</h2>
                        <p class="mb-4">
                            Technorox is not intended for children under 13 years of age. We do not knowingly collect 
                            personal information from children under 13. If we discover we have collected such information, 
                            we will delete it immediately.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">8. International Users</h2>
                        <p class="mb-4">
                            If you are located outside the United States, please note that we transfer and process 
                            your information in the United States, where KAAI TECH LLC is based.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">9. Cookies and Tracking</h2>
                        <p class="mb-4">We use cookies and similar technologies to:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>Keep you logged in to your account</li>
                            <li>Remember your game preferences</li>
                            <li>Analyze game usage and performance</li>
                            <li>Provide personalized experiences</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">10. Third-Party Services</h2>
                        <p class="mb-4">Our Game integrates with third-party services that have their own privacy policies:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li><strong>Google Firebase:</strong> <a href="https://policies.google.com/privacy" target="_blank" class="text-neon-cyan hover:underline">Google Privacy Policy</a></li>
                            <li><strong>Stripe:</strong> <a href="https://stripe.com/privacy" target="_blank" class="text-neon-cyan hover:underline">Stripe Privacy Policy</a></li>
                            <li><strong>OpenAI:</strong> <a href="https://openai.com/privacy" target="_blank" class="text-neon-cyan hover:underline">OpenAI Privacy Policy</a></li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">11. Data Retention</h2>
                        <p class="mb-4">We retain your information:</p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>As long as your account is active</li>
                            <li>As needed to provide our services</li>
                            <li>To comply with legal obligations</li>
                            <li>To resolve disputes and enforce agreements</li>
                        </ul>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">12. Changes to This Policy</h2>
                        <p class="mb-4">
                            We may update this Privacy Policy from time to time. We will notify you of any material changes 
                            by posting the new policy on this page and updating the "Last Updated" date.
                        </p>

                        <h2 class="text-2xl font-bold text-neon-cyan mt-8 mb-4">13. Contact Us</h2>
                        <p class="mb-4">
                            If you have questions about this Privacy Policy or your personal information, please contact us:
                        </p>
                        <div class="bg-dark-800 p-4 rounded-lg border border-neon-cyan/20">
                            <p><strong>KAAI TECH LLC</strong></p>
                            <p>Privacy Officer - Technorox</p>
                            <p>Email: privacy@technorox.com</p>
                            <p>Support: support@technorox.com</p>
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
