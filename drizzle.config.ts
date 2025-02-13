import { type Config } from 'drizzle-kit'

import { env } from '@/env'

export default {
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migration',
  dialect: 'mysql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
