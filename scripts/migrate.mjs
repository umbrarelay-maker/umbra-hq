#!/usr/bin/env node
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Supabase connection via pooler - uses service_role key as password
// Format: postgresql://postgres.[PROJECT-REF]:[SERVICE-KEY]@aws-0-[REGION].pooler.supabase.com:6543/postgres
const SUPABASE_PROJECT_REF = 'hvrtuyfhcwilkidzjdxp';
const SUPABASE_SERVICE_KEY = 'sb_secret_Ec2SuWwTqWY3Bl1LbgZFag_V4ygSYBQ';

// Try different connection methods
async function runMigration() {
  // Read the migration SQL
  const migrationPath = join(__dirname, '../supabase/migrations/001_initial_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');
  
  // Connection options to try
  const connectionUrls = [
    // Transaction pooler (port 6543)
    `postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_SERVICE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
    // Session pooler (port 5432)
    `postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
  ];

  for (const url of connectionUrls) {
    console.log('Trying connection...');
    try {
      const db = postgres(url, {
        ssl: 'require',
        connect_timeout: 10,
        idle_timeout: 5,
      });
      
      // Test connection
      const result = await db`SELECT version()`;
      console.log('Connected! PostgreSQL version:', result[0].version.split(',')[0]);
      
      // Run migration
      console.log('Running migration...');
      await db.unsafe(sql);
      console.log('Migration completed successfully!');
      
      await db.end();
      return true;
    } catch (err) {
      console.log('Connection failed:', err.message?.slice(0, 100));
    }
  }
  
  console.log('\nAll connection attempts failed.');
  console.log('Please run the migration SQL manually in Supabase SQL Editor:');
  console.log('supabase/migrations/001_initial_schema.sql');
  return false;
}

runMigration().catch(console.error);
