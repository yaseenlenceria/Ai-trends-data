import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Make DATABASE_URL optional for development
// When not set, the app will use in-memory fallback data
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
  console.log('✅ Database connected');
} else {
  console.warn('⚠️  DATABASE_URL not set - using fallback data');
}

export { pool, db };
export const hasDatabase = !!process.env.DATABASE_URL;
