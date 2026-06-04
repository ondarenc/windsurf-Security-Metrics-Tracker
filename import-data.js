const fs = require('fs');
const http = require('http');

const API_BASE = 'http://localhost:3001/api';

// Read sample data
const sampleData = JSON.parse(fs.readFileSync('./public/data/sample-data.json', 'utf8'));

// Function to make HTTP POST request
function postData(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Import metrics
async function importMetrics() {
  console.log('Importing metrics...');
  
  for (const entry of sampleData.entries) {
    try {
      await postData('/metrics', {
        metric_name: entry.name,
        metric_type: entry.category,
        value: entry.value,
        date: entry.date
      });
      console.log(`✓ Imported: ${entry.name} (${entry.category}) - ${entry.value}`);
    } catch (error) {
      console.error(`✗ Failed to import: ${entry.name}`, error.message);
    }
  }
  
  console.log('\nImport complete!');
}

// Run import
importMetrics().catch(console.error);
