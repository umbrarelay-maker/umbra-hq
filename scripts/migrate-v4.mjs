#!/usr/bin/env node
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_PROJECT_REF = 'hvrtuyfhcwilkidzjdxp';
const SUPABASE_DB_PASSWORD = 'sb_secret_Ec2SuWwTqWY3Bl1LbgZFag_V4ygSYBQ';

async function runMigration() {
  const migrationPath = join(__dirname, '../supabase/migrations/001_initial_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');
  
  // Different connection string formats to try
  const connectionUrls = [
    // Session mode (port 5432) - full database access
    `postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    // Transaction mode (port 6543) 
    `postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  ];

  for (const url of connectionUrls) {
    console.log('Trying:', url.replace(SUPABASE_DB_PASSWORD, '***'));
    try {
      const db = postgres(url, {
        ssl: { rejectUnauthorized: false },
        connect_timeout: 30,
        idle_timeout: 5,
      });
      
      const result = await db`SELECT version()`;
      console.log('Connected! PostgreSQL:', result[0].version.split(',')[0]);
      
      console.log('Running migration...');
      await db.unsafe(sql);
      console.log('Migration completed successfully!');
      
      await db.end();
      return true;
    } catch (err) {
      console.log('Failed:', err.message?.slice(0, 100));
      console.log('');
    }
  }
  
  console.log('All connection attempts failed.');
  return false;
}

runMigration().catch(console.error);
