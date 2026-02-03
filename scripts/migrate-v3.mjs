#!/usr/bin/env node
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dns from 'dns';

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_PROJECT_REF = 'hvrtuyfhcwilkidzjdxp';
const SUPABASE_DB_PASSWORD = 'sb_secret_Ec2SuWwTqWY3Bl1LbgZFag_V4ygSYBQ';

async function runMigration() {
  const migrationPath = join(__dirname, '../supabase/migrations/001_initial_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');
  
  // Direct connection
  const url = `postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_REF}.supabase.co:5432/postgres`;
  
  console.log('Connecting to Supabase PostgreSQL...');
  try {
    const db = postgres(url, {
      ssl: { rejectUnauthorized: false },
      connect_timeout: 30,
      idle_timeout: 5,
    });
    
    const result = await db`SELECT version()`;
    console.log('Connected! PostgreSQL version:', result[0].version.split(',')[0]);
    
    console.log('Running migration...');
    await db.unsafe(sql);
    console.log('Migration completed successfully!');
    
    await db.end();
    return true;
  } catch (err) {
    console.log('Connection failed:', err.message);
    console.log('\nFull error:', err);
  }
  
  return false;
}

runMigration().catch(console.error);
