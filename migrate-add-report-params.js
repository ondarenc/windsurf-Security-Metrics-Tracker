const Database = require('better-sqlite3');
const path = require('path');

// Initialize database connection
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log(`Migrating database: ${dbPath}`);

try {
  // Check if client_name column exists
  const tableInfo = db.prepare('PRAGMA table_info(reports)').all();
  const hasClientName = tableInfo.some(col => col.name === 'client_name');
  const hasReportDate = tableInfo.some(col => col.name === 'report_date');
  const hasDocumentVersion = tableInfo.some(col => col.name === 'document_version');

  if (!hasClientName) {
    db.prepare('ALTER TABLE reports ADD COLUMN client_name TEXT').run();
    console.log('✅ Added client_name column');
  } else {
    console.log('ℹ️  client_name column already exists');
  }

  if (!hasReportDate) {
    db.prepare('ALTER TABLE reports ADD COLUMN report_date TEXT').run();
    console.log('✅ Added report_date column');
  } else {
    console.log('ℹ️  report_date column already exists');
  }

  if (!hasDocumentVersion) {
    db.prepare('ALTER TABLE reports ADD COLUMN document_version TEXT').run();
    console.log('✅ Added document_version column');
  } else {
    console.log('ℹ️  document_version column already exists');
  }

  console.log('✅ Migration completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}
