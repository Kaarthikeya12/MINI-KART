import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
    url: process.env.DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN || '',
})

async function testConnection() {
    try {
        const rs = await client.execute('SELECT 1')
        console.log('Connection successful:', rs)
    } catch (e) {
        console.error('Connection failed:', e)
    }
}

testConnection()
