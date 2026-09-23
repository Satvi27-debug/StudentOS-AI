import { defineConfig } from 'drizzle-kit'

const url = process.env.DATABASE_URL

if (!url) {
  console.warn(
    '[drizzle] DATABASE_URL is not set. Copy .env.example to .env and configure it.'
  )
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: url ?? 'postgresql://localhost:5432/postgres',
  },
  strict: true,
  verbose: true,
})
