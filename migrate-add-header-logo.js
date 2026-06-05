require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

// Get database path from environment or use default
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

console.log(`Migrating database: ${dbPath}`);

try {
  const db = new Database(dbPath);

  // Check if columns already exist
  const tableInfo = db.prepare("PRAGMA table_info(reports)").all();
  const hasHeader = tableInfo.some(col => col.name === 'header');
  const hasLogo = tableInfo.some(col => col.name === 'logo');

  if (hasHeader && hasLogo) {
    console.log('✅ Migration already completed. Columns already exist.');
    db.close();
    process.exit(0);
  }

  // Add header column if it doesn't exist
  if (!hasHeader) {
    db.exec('ALTER TABLE reports ADD COLUMN header TEXT');
    console.log('✅ Added header column');
  }

  // Add logo column if it doesn't exist
  if (!hasLogo) {
    db.exec('ALTER TABLE reports ADD COLUMN logo BLOB');
    console.log('✅ Added logo column');
  }

  console.log('✅ Migration completed successfully');
  db.close();

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
