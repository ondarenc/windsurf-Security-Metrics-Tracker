require('dotenv').config();
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Get production database path from environment or use default
const prodDbPath = process.env.PROD_DB_PATH || process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const exportFilePath = process.env.EXPORT_FILE || path.join(__dirname, 'reports-export.json');

console.log(`Importing reports to: ${prodDbPath}`);
console.log(`From export file: ${exportFilePath}`);

// Check if export file exists
if (!fs.existsSync(exportFilePath)) {
  console.error(`❌ Export file not found: ${exportFilePath}`);
  console.log('Please run export-reports.js first to create the export file.');
  process.exit(1);
}

try {
  // Read export file
  const exportData = JSON.parse(fs.readFileSync(exportFilePath, 'utf8'));
  
  if (!exportData.reports || !Array.isArray(exportData.reports)) {
    console.error('❌ Invalid export file format');
    process.exit(1);
  }

  console.log(`Found ${exportData.reports.length} reports in export file`);
  console.log(`Exported at: ${exportData.exportedAt}`);

  // Initialize database connection
  const db = new Database(prodDbPath);

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  // Create reports table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      title TEXT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ask user for import mode
  const args = process.argv.slice(2);
  const mode = args.includes('--replace') ? 'replace' : 'merge';
  
  console.log(`\nImport mode: ${mode.toUpperCase()}`);
  if (mode === 'replace') {
    console.log('⚠️  WARNING: This will DELETE all existing reports and replace them with the export.');
  } else {
    console.log('Merging reports with existing data (updates matching sections, adds new ones)');
  }

  // Transaction for import
  const importTransaction = db.transaction(() => {
    if (mode === 'replace') {
      // Delete all existing reports
      const deleteCount = db.prepare('DELETE FROM reports').run();
      console.log(`Deleted ${deleteCount.changes} existing reports`);
    }

    let updatedCount = 0;
    let insertedCount = 0;

    // Import each report
    exportData.reports.forEach(report => {
      // Check if report with same section exists
      const existing = db.prepare('SELECT id FROM reports WHERE section = ?').get(report.section);
      
      if (existing && mode === 'merge') {
        // Update existing report
        db.prepare(`
          UPDATE reports
          SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
          WHERE section = ?
        `).run(report.title || null, report.content, report.section);
        updatedCount++;
      } else {
        // Insert new report
        db.prepare(`
          INSERT INTO reports (section, title, content)
          VALUES (?, ?, ?)
        `).run(report.section, report.title || null, report.content);
        insertedCount++;
      }
    });

    return { updatedCount, insertedCount };
  });

  const result = importTransaction();

  console.log(`\n✅ Import completed successfully:`);
  console.log(`   - Updated: ${result.updatedCount} reports`);
  console.log(`   - Inserted: ${result.insertedCount} reports`);
  console.log(`   - Total: ${exportData.reports.length} reports`);

  db.close();

} catch (error) {
  console.error('❌ Import failed:', error.message);
  process.exit(1);
}
