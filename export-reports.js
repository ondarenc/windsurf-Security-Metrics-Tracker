require('dotenv').config();
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Initialize database connection
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log(`Exporting reports from: ${dbPath}`);

try {
  // Export all reports
  const reports = db.prepare('SELECT * FROM reports ORDER BY section, id').all();
  
  if (reports.length === 0) {
    console.log('No reports found in the database.');
    process.exit(0);
  }

  // Create export data structure
  const exportData = {
    reports: reports,
    exportedAt: new Date().toISOString(),
    sourceDatabase: dbPath,
    version: '1.0'
  };

  // Write to JSON file
  const exportFilePath = path.join(__dirname, 'reports-export.json');
  fs.writeFileSync(exportFilePath, JSON.stringify(exportData, null, 2), 'utf8');

  console.log(`✅ Successfully exported ${reports.length} reports to: ${exportFilePath}`);
  console.log('\nExported sections:');
  reports.forEach(report => {
    console.log(`  - ${report.section}${report.title ? `: ${report.title}` : ''} (ID: ${report.id})`);
  });

} catch (error) {
  console.error('❌ Export failed:', error.message);
  process.exit(1);
} finally {
  db.close();
}
