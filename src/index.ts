import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Get port from environment variable or default to 3000
const port = parseInt(process.env.PORT || '3000')
const name = process.env.NAME;

// Enable CORS for load balancer testing
app.use('*', cors())

// Middleware to add server info to response headers
app.use('*', async (c, next) => {
    await next()
    c.header('X-Server-Port', port.toString())
    c.header('X-Server-Instance', `server-${name}`)
})

// Health check endpoint
app.get('/health', (c) => {
    return c.json({
        status: 'healthy',
        port,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

// Basic info endpoint
app.get('/', (c) => {
    return c.json({
        message: 'Load Balancer Test Server',
        port,
        instance: `server-${name}`,
        timestamp: new Date().toISOString()
    })
})

// Endpoint to simulate different response times
app.get('/delay/:ms', async (c) => {
    const delayMs = parseInt(c.req.param('ms')) || 0

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, delayMs))

    return c.json({
        message: `Response delayed by ${delayMs}ms`,
        port,
        timestamp: new Date().toISOString(),
        delay: delayMs
    })
})

// Endpoint to test load distribution
app.get('/test', (c) => {
    return c.json({
        message: 'Test endpoint response',
        port,
        instance: `server-${port}`,
        requestId: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
    })
})

// Catch-all route
app.notFound((c) => {
    return c.json({
        error: 'Not found',
        path: c.req.path,
        port,
        timestamp: new Date().toISOString()
    }, 404)
})

console.log(`🚀 Server starting on port ${port}`)

export default {
    port,
    fetch: app.fetch,
}
