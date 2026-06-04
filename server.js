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

  console.log('Database initialized successfully');
};

// Initialize database on startup
initDatabase();

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
      INSERT INTO followup (level, vulnerability, service_ip, source, remediation_task, ticket, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
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
    const stmt = db.prepare(`
      UPDATE followup
      SET level = ?, vulnerability = ?, service_ip = ?, source = ?, 
          remediation_task = ?, ticket = ?, status = ?, hidden = ?
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
