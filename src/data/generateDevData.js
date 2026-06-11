import dataManager from './dataManager.js';

const categories = {
  'M365': {
    metrics: ['Identity', 'Data', 'Device', 'Apps', 'Secure Score'],
    valueRanges: { min: 40, max: 90 }
  },
  'Purple Knight AD': {
    metrics: ['Note', 'IOEs Found', 'Critical IOEs'],
    valueRanges: { note: { min: 60, max: 95 }, ioes: { min: 5, max: 30 }, critical: { min: 0, max: 5 } }
  },
  'Purple Knight Entra-ID': {
    metrics: ['Note', 'IOEs Found', 'Critical IOEs'],
    valueRanges: { note: { min: 60, max: 95 }, ioes: { min: 5, max: 30 }, critical: { min: 0, max: 5 } }
  },
  'Securityscorecard': {
    metrics: ['My Score', 'High breach risk issues', 'Medium breach risk issues', 'Low breach risk issues'],
    valueRanges: { score: { min: 60, max: 95 }, high: { min: 0, max: 8 }, medium: { min: 3, max: 15 }, low: { min: 5, max: 20 } }
  },
  'ProjectDiscovery': {
    metrics: ['Security Score', 'Critical', 'High', 'Medium', 'Low'],
    valueRanges: { score: { min: 60, max: 95 }, critical: { min: 0, max: 5 }, high: { min: 1, max: 10 }, medium: { min: 3, max: 12 }, low: { min: 5, max: 18 } }
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString().split('T')[0];
}

async function generateRandomEntries(entriesPerMetric = 10) {
  console.log('Generating random vulnerability data...');

  for (const [category, config] of Object.entries(categories)) {
    console.log(`\nGenerating data for ${category}...`);

    for (const metric of config.metrics) {
      console.log(`  Adding entries for ${metric}...`);

      for (let i = 0; i < entriesPerMetric; i++) {
        let value;
        const daysBack = i * 3; // Spread entries every 3 days

        // Determine value based on metric type and category
        if (category === 'M365') {
          value = getRandomInt(config.valueRanges.min, config.valueRanges.max);
        } else if (category === 'Purple Knight AD' || category === 'Purple Knight Entra-ID') {
          if (metric === 'Note') {
            value = getRandomInt(config.valueRanges.note.min, config.valueRanges.note.max);
          } else if (metric === 'IOEs Found') {
            value = getRandomInt(config.valueRanges.ioes.min, config.valueRanges.ioes.max);
          } else if (metric === 'Critical IOEs') {
            value = getRandomInt(config.valueRanges.critical.min, config.valueRanges.critical.max);
          }
        } else if (category === 'Securityscorecard') {
          if (metric === 'My Score') {
            value = getRandomInt(config.valueRanges.score.min, config.valueRanges.score.max);
          } else if (metric === 'High breach risk issues') {
            value = getRandomInt(config.valueRanges.high.min, config.valueRanges.high.max);
          } else if (metric === 'Medium breach risk issues') {
            value = getRandomInt(config.valueRanges.medium.min, config.valueRanges.medium.max);
          } else if (metric === 'Low breach risk issues') {
            value = getRandomInt(config.valueRanges.low.min, config.valueRanges.low.max);
          }
        } else if (category === 'ProjectDiscovery') {
          if (metric === 'Security Score') {
            value = getRandomInt(config.valueRanges.score.min, config.valueRanges.score.max);
          } else if (metric === 'Critical') {
            value = getRandomInt(config.valueRanges.critical.min, config.valueRanges.critical.max);
          } else if (metric === 'High') {
            value = getRandomInt(config.valueRanges.high.min, config.valueRanges.high.max);
          } else if (metric === 'Medium') {
            value = getRandomInt(config.valueRanges.medium.min, config.valueRanges.medium.max);
          } else if (metric === 'Low') {
            value = getRandomInt(config.valueRanges.low.min, config.valueRanges.low.max);
          }
        }

        const entry = {
          name: metric,
          value: value,
          date: getRandomDate(daysBack),
          category: category
        };

        await dataManager.addEntry(entry);
      }
    }
  }

  console.log('\n✅ Random vulnerability data generation complete!');
  console.log(`Total entries in database: ${dataManager.getAllEntries().length}`);
}

// Export function to be called from browser console or other scripts
export { generateRandomEntries };

// Auto-run if this file is imported in a development context
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.generateDevData = generateRandomEntries;
  console.log('🔧 Dev data generator loaded. Call window.generateDevData() to generate random data.');
}
