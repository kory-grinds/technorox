// Debug script to test Router class
import { Router } from './src/utils/router.js'

console.log('Testing Router class...')

try {
    const router = new Router()
    console.log('Router created:', router)
    console.log('setAuthManager method exists:', typeof router.setAuthManager === 'function')
    console.log('Router methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(router)))
    
    // Test the method
    router.setAuthManager({ test: true })
    console.log('setAuthManager called successfully')
    
} catch (error) {
    console.error('Router test failed:', error)
}
