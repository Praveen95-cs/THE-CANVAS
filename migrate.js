const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const sql = neon(process.env.DATABASE_URL);
  
  // Read the migration SQL file
  const migrationSQL = fs.readFileSync(
    path.join(__dirname, 'drizzle', '0000_groovy_doctor_faustus.sql'),
    'utf8'
  );

  // Split SQL by statement breakpoints and filter empty statements
  const statements = migrationSQL
    .split('--> statement-breakpoint')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  try {
    console.log('Running migration...');
    console.log(`Found ${statements.length} statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        try {
          await sql(statement);
        } catch (err) {
          // Ignore "already exists" errors
          if (err.message.includes('already exists') || err.message.includes('duplicate')) {
            console.log(`  ⚠️  Skipped (already exists)`);
          } else {
            throw err;
          }
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
