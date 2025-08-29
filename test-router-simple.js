// Simple test to check if Router class works
console.log('Testing Router import...')

try {
    // Test import
    const module = await import('./src/utils/router.js')
    console.log('✅ Router module imported:', module)
    
    // Test Router class
    const { Router } = module
    console.log('✅ Router class extracted:', Router)
    
    // Test Router creation
    const router = new Router()
    console.log('✅ Router instance created:', router)
    
    // Test methods
    console.log('✅ Router methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(router)))
    
    // Test setAuthManager specifically
    console.log('✅ setAuthManager method:', typeof router.setAuthManager)
    console.log('✅ setAuthManager function:', router.setAuthManager.toString().substring(0, 100) + '...')
    
    // Test calling it
    router.setAuthManager({ test: true })
    console.log('✅ setAuthManager called successfully')
    
} catch (error) {
    console.error('❌ Router test failed:', error)
    console.error('Stack:', error.stack)
}
