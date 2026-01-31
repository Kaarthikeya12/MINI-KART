import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import Products from './collections/Products'
import Categories from './collections/Categories'
import Carts from './collections/Carts'
import Discounts from './collections/Discounts'
import Notifications from './collections/Notifications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log('Connecting to database:', process.env.DATABASE_URL ? 'URL exists' : 'URL IS MISSING')
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Orders, Products, Categories, Carts, Discounts, Notifications],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    // Google OAuth configuration
    // To enable Google OAuth:
    // 1. Go to https://console.cloud.google.com/
    // 2. Create a new project or select an existing one
    // 3. Enable Google+ API
    // 4. Create OAuth 2.0 credentials
    // 5. Add authorized redirect URIs: http://localhost:3000/api/users/oauth/google/callback
    // 6. Add the following to your .env file:
    //    GOOGLE_CLIENT_ID=your_client_id
    //    GOOGLE_CLIENT_SECRET=your_client_secret
    //    NEXT_PUBLIC_SERVER_URL=http://localhost:3000
  ],
})
