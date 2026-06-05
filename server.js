require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());

// Initialize database
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
const initDatabase = () => {
  // Create metrics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_name TEXT NOT NULL,
      metric_type TEXT NOT NULL,
      value REAL NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create followup table
  db.exec(`
    CREATE TABLE IF NOT EXISTS followup (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT NOT NULL,
      vulnerability TEXT NOT NULL,
      service_ip TEXT,
      source TEXT NOT NULL,
      remediation_task TEXT,
      ticket TEXT,
      status TEXT NOT NULL,
      hidden INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create reports table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      title TEXT,
      content TEXT NOT NULL,
      header TEXT,
      logo BLOB,
      client_name TEXT,
      report_date TEXT,
      document_version TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
};

// Initialize database on startup
initDatabase();

// Auto-hide function to hide items based on status and time
const autoHideItems = () => {
  try {
    // Hide items with status 'Fixed' after 60 days
    const hideFixed = db.prepare(`
      UPDATE followup
      SET hidden = 1
      WHERE status = 'Fixed' 
        AND hidden = 0
        AND status_updated_at < datetime('now', '-60 days')
    `);
    const fixedCount = hideFixed.run();
    
    // Hide items with status 'Accepted risk' after 90 days
    const hideAcceptedRisk = db.prepare(`
      UPDATE followup
      SET hidden = 1
      WHERE status = 'Accepted risk' 
        AND hidden = 0
        AND status_updated_at < datetime('now', '-90 days')
    `);
    const acceptedRiskCount = hideAcceptedRisk.run();
    
    if (fixedCount.changes > 0 || acceptedRiskCount.changes > 0) {
      console.log(`Auto-hide: ${fixedCount.changes} Fixed items hidden (60 days), ${acceptedRiskCount.changes} Accepted risk items hidden (90 days)`);
    }
  } catch (error) {
    console.error('Error in auto-hide function:', error);
  }
};

// Run auto-hide on startup
autoHideItems();

// Schedule auto-hide to run every hour
setInterval(autoHideItems, 60 * 60 * 1000);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// API Routes for Metrics
app.get('/api/metrics', (req, res) => {
  try {
    const metrics = db.prepare('SELECT * FROM metrics ORDER BY date DESC').all();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/metrics', (req, res) => {
  try {
    const { metric_name, metric_type, value, date } = req.body;
    const stmt = db.prepare(`
      INSERT INTO metrics (metric_name, metric_type, value, date)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(metric_name, metric_type, value, date);
    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/metrics/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM metrics WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes for Followup
app.get('/api/followup', (req, res) => {
  try {
    const { visible_only } = req.query;
    let query = 'SELECT * FROM followup ORDER BY created_at DESC';
    const params = [];
    
    if (visible_only === 'true') {
      query = 'SELECT * FROM followup WHERE hidden = 0 ORDER BY created_at DESC';
    }
    
    const items = db.prepare(query).all(...params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/followup', (req, res) => {
  try {
    const { level, vulnerability, service_ip, source, remediation_task, ticket, status } = req.body;
    const stmt = db.prepare(`
      INSERT INTO followup (level, vulnerability, service_ip, source, remediation_task, ticket, status, status_updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    const result = stmt.run(level, vulnerability, service_ip, source, remediation_task, ticket, status);
    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/followup/:id', (req, res) => {
  try {
    const { level, vulnerability, service_ip, source, remediation_task, ticket, status, hidden } = req.body;
    
    // Check if status is changing
    const current = db.prepare('SELECT status FROM followup WHERE id = ?').get(req.params.id);
    const statusChanged = current && current.status !== status;
    
    const stmt = db.prepare(`
      UPDATE followup
      SET level = ?, vulnerability = ?, service_ip = ?, source = ?, 
          remediation_task = ?, ticket = ?, status = ?, hidden = ?,
          status_updated_at = ${statusChanged ? 'CURRENT_TIMESTAMP' : 'status_updated_at'}
      WHERE id = ?
    `);
    stmt.run(level, vulnerability, service_ip, source, remediation_task, ticket, status, hidden, req.params.id);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/followup/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM followup WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('Database connection closed');
  process.exit(0);
});

app.get('/api/export', (req, res) => {
  try {
	const metrics = db.prepare('SELECT * FROM metrics').all();
	const followup = db.prepare('SELECT * FROM followup').all();

	res.json({
  	metrics,
  	followup,
  	exportedAt: new Date().toISOString()
	});
  } catch (error) {
	console.error(error);
	res.status(500).json({ error: 'Export failed' });
  }
});

app.post('/api/import', (req, res) => {
  try {
	const { metrics, followup } = req.body;

	const insertMetric = db.prepare(`
  	INSERT INTO metrics (metric_name, metric_type, value, date)
  	VALUES (?, ?, ?, ?)
	`);

	const insertFollowup = db.prepare(`
  	INSERT INTO followup (level, vulnerability, service_ip, source, remediation_task, ticket, status, hidden)
  	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`);

	const transaction = db.transaction(() => {
  	// Clear DB before import
  	db.prepare('DELETE FROM metrics').run();
  	db.prepare('DELETE FROM followup').run();

  	if (metrics && Array.isArray(metrics)) {
    	metrics.forEach(m => {
      	insertMetric.run(
        	m.metric_name || m.name,
        	m.metric_type || m.source || 'M365',
        	m.value,
        	m.date
      	);
    	});
  	}

  	if (followup && Array.isArray(followup)) {
    	followup.forEach(f => {
      	insertFollowup.run(
        	f.level,
        	f.vulnerability,
        	f.service_ip || f.serviceIp || '',
        	f.source,
        	f.remediation_task || f.remediationTask || '',
        	f.ticket,
        	f.status,
        	f.hidden ? 1 : 0
      	);
    	});
  	}
	});

	transaction();

	res.json({ success: true });

  } catch (error) {
	console.error(error);
	res.status(500).json({ error: error.message || 'Import failed' });
  }
});

// API Routes for Reports
app.get('/api/reports', (req, res) => {
  try {
    const { section } = req.query;
    let query = 'SELECT * FROM reports ORDER BY updated_at DESC';
    const params = [];
    
    if (section) {
      query = 'SELECT * FROM reports WHERE section = ? ORDER BY updated_at DESC';
      params.push(section);
    }
    
    const reports = db.prepare(query).all(...params);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/:id', (req, res) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports', (req, res) => {
  try {
    const { section, title, content, header, logo, client_name, report_date, document_version } = req.body;
    
    if (!section || !content) {
      return res.status(400).json({ error: 'Section and content are required' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO reports (section, title, content, header, logo, client_name, report_date, document_version)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(section, title || null, content, header || null, logo || null, client_name || null, report_date || null, document_version || null);
    
    // Get the inserted report
    const insertedReport = db.prepare('SELECT * FROM reports WHERE id = ?').get(result.lastInsertRowid);
    
    res.json(insertedReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reports/:id', (req, res) => {
  try {
    const { section, title, content, header, logo, client_name, report_date, document_version } = req.body;
    
    const stmt = db.prepare(`
      UPDATE reports
      SET section = ?, title = ?, content = ?, header = ?, logo = ?, client_name = ?, report_date = ?, document_version = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(section, title || null, content, header || null, logo || null, client_name || null, report_date || null, document_version || null, req.params.id);
    
    // Get the updated report
    const updatedReport = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
    
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reports/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM reports WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
