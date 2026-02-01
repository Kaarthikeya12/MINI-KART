// payload.config.ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import Products from './collections/Products'
import Categories from './collections/Categories'
import Carts from './collections/Carts'
import Discounts from './collections/Discounts'
import Notifications from './collections/Notifications'

import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Initialize libsql client (web version for edge compatibility)
const libsqlClient = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

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
    client: libsqlClient,
    drizzle: drizzle(libsqlClient),
  }),
  sharp,
  plugins: [],
})   