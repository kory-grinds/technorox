import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

/**
 * Security middleware for Technorox TCG servers
 * Protects against common vulnerabilities and attacks
 */

// Rate limiting configuration
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs, // 15 minutes default
        max, // limit each IP to 100 requests per windowMs
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
        // Skip successful requests for certain endpoints
        skipSuccessfulRequests: false,
        // Skip failed requests
        skipFailedRequests: false
    })
}

// Strict rate limiting for sensitive endpoints
export const strictRateLimit = createRateLimit(15 * 60 * 1000, 10) // 10 requests per 15 minutes
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5)    // 5 auth attempts per 15 minutes
export const emailRateLimit = createRateLimit(60 * 60 * 1000, 3)   // 3 emails per hour

// Security headers configuration
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Required for Vite dev mode
                "'unsafe-eval'",   // Required for Vite dev mode
                "https://apis.google.com",
                "https://www.gstatic.com",
                "https://js.stripe.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:"
            ],
            connectSrc: [
                "'self'",
                "https://*.firebaseio.com",
                "https://*.googleapis.com",
                "https://api.stripe.com",
                "wss://*.firebaseio.com",
                process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : null
            ].filter(Boolean),
            frameSrc: [
                "https://js.stripe.com",
                "https://hooks.stripe.com"
            ]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
})

// API key validation middleware
export const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    const validApiKey = process.env.API_KEY
    
    if (!validApiKey) {
        console.warn('API_KEY not configured in environment variables')
        return next()
    }
    
    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({
            error: 'Invalid or missing API key',
            code: 'INVALID_API_KEY'
        })
    }
    
    next()
}

// Environment variable validation
export const validateEnvironment = () => {
    const requiredVars = [
        'NODE_ENV',
        'PORT'
    ]
    
    const missingVars = requiredVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingVars)
        process.exit(1)
    }
    
    // Warn about missing optional but important vars
    const optionalVars = [
        'API_KEY',
        'STRIPE_SECRET_KEY',
        'AWS_ACCESS_KEY_ID',
        'SES_FROM_EMAIL'
    ]
    
    const missingOptional = optionalVars.filter(varName => !process.env[varName])
    
    if (missingOptional.length > 0) {
        console.warn('⚠️  Missing optional environment variables:', missingOptional)
    }
}

// Sanitize request data
export const sanitizeInput = (req, res, next) => {
    // Remove potentially dangerous characters from string inputs
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.replace(/[<>'"]/g, '')
        }
        if (typeof obj === 'object' && obj !== null) {
            const sanitized = {}
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitize(value)
            }
            return sanitized
        }
        return obj
    }
    
    if (req.body) {
        req.body = sanitize(req.body)
    }
    
    if (req.query) {
        req.query = sanitize(req.query)
    }
    
    next()
}

// Request logging for security monitoring
export const securityLogger = (req, res, next) => {
    const startTime = Date.now()
    
    // Log suspicious patterns
    const suspiciousPatterns = [
        /\.\./,           // Directory traversal
        /<script/i,       // XSS attempts
        /union.*select/i, // SQL injection
        /javascript:/i,   // JavaScript injection
        /data:.*base64/i  // Base64 data URLs
    ]
    
    const url = req.url
    const userAgent = req.get('User-Agent') || ''
    const ip = req.ip || req.connection.remoteAddress
    
    // Check for suspicious patterns
    const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(url) || pattern.test(userAgent)
    )
    
    if (isSuspicious) {
        console.warn(`🚨 Suspicious request detected:`, {
            ip,
            method: req.method,
            url,
            userAgent,
            timestamp: new Date().toISOString()
        })
    }
    
    // Log completion
    res.on('finish', () => {
        const duration = Date.now() - startTime
        const statusCode = res.statusCode
        
        // Log slow or failed requests
        if (duration > 5000 || statusCode >= 400) {
            console.log(`📊 Request completed:`, {
                method: req.method,
                url,
                statusCode,
                duration: `${duration}ms`,
                ip
            })
        }
    })
    
    next()
}

// CORS configuration for production
export const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true)
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://technorox.com',
            'https://www.technorox.com',
            process.env.CLIENT_URL
        ].filter(Boolean)
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            console.warn(`🚫 CORS blocked origin: ${origin}`)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}
