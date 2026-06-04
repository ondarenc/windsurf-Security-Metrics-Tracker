const fs = require('fs');

// Read the old format file
const oldData = JSON.parse(fs.readFileSync('/home/ondarenc/Desktop/m365-data-2026-06-03 (1).json', 'utf8'));

// Convert to new format
const newData = {
  metrics: oldData.entries.map(entry => ({
    id: entry.id,
    metric_name: entry.name,
    metric_type: entry.category,
    value: entry.value,
    date: entry.date,
    created_at: entry.timestamp || new Date().toISOString()
  })),
  followup: [], // No followup data in old format
  exportedAt: new Date().toISOString(),
  version: '2.0.0'
};

// Write the new format file
fs.writeFileSync('/home/ondarenc/Desktop/m365-data-converted.json', JSON.stringify(newData, null, 2));

console.log('Conversion complete!');
console.log(`Converted ${newData.metrics.length} metrics`);
console.log('Output: /home/ondarenc/Desktop/m365-data-converted.json');
