class DataManager {
  constructor() {
    this.data = [];
    this.referenceValues = {
      'M365': { 'Secure Score': 65, 'Identity': 65, 'Data': 65, 'Device': 65, 'Apps': 65 }, // Reference parameter for M365 metrics
      'Purple Knight AD': { 'Note': 80, 'IOEs Found': 15, 'Critical IOEs': 0 }, // Reference values for Purple Knight AD
      'Purple Knight Entra-ID': { 'Note': 80, 'IOEs Found': 15, 'Critical IOEs': 0 }, // Reference values for Purple Knight Entra-ID
      'Securityscorecard': { 'My Score': 80, 'High breach risk issues': 0, 'Medium breach risk issues': 5, 'Low breach risk issues': 10 },
      'ProjectDiscovery': { 'Security Score': 80, 'Critical': 0, 'High': 2, 'Medium': 5, 'Low': 10 }
    };
    this.metricTypes = {
      'M365': ['Identity', 'Data', 'Device', 'Apps', 'Secure Score'],
      'Purple Knight AD': ['Note', 'IOEs Found', 'Critical IOEs'],
      'Purple Knight Entra-ID': ['Note', 'IOEs Found', 'Critical IOEs'],
      'Securityscorecard': ['My Score', 'High breach risk issues', 'Medium breach risk issues', 'Low breach risk issues'],
      'ProjectDiscovery': ['Security Score', 'Critical', 'High', 'Medium', 'Low']
    };
    this.dataFile = '/data/sample-data.json'; // Default to sample data
    this.initializeData();
  }

  async initializeData() {
    try {
      // Try to load from localStorage first (for existing data)
      const stored = localStorage.getItem('metricsData');
      if (stored) {
        this.data = JSON.parse(stored);
        // Migrate legacy entries that don't have a category field
        const needsMigration = this.data.some(entry => !entry.category);
        if (needsMigration) {
          this.data = this.data.map(entry => {
            if (entry.category) return entry;
            // Assign category based on metric name
            const name = entry.name;
            if (this.metricTypes['M365'].includes(name)) {
              return { ...entry, category: 'M365' };
            }
            if (this.metricTypes['Securityscorecard'].includes(name)) {
              return { ...entry, category: 'Securityscorecard' };
            }
            if (this.metricTypes['ProjectDiscovery'].includes(name)) {
              return { ...entry, category: 'ProjectDiscovery' };
            }
            // For shared Purple Knight metrics, default to AD (the original category)
            return { ...entry, category: 'Purple Knight AD' };
          });
          this.saveData();
          console.log('Migrated existing entries to include category field');
        }
      } else {
        // Load from JSON file
        await this.loadFromFile();
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      this.data = [];
    }
  }

  async loadFromFile() {
    try {
      const response = await fetch(this.dataFile);
      const fileData = await response.json();
      this.data = fileData.entries || [];
      this.referenceValue = fileData.referenceValue || 50;
      // Also save to localStorage for persistence
      this.saveData();
    } catch (error) {
      console.error('Error loading from file:', error);
      this.data = [];
    }
  }

  async switchDataFile(filename) {
    this.dataFile = `/data/${filename}`;
    await this.loadFromFile();
  }

  saveData() {
    localStorage.setItem('metricsData', JSON.stringify(this.data));
  }

  addEntry(entry) {
    const newEntry = {
      id: Date.now(),
      date: entry.date,
      name: entry.name,
      value: parseFloat(entry.value),
      category: entry.category || 'M365',
      timestamp: new Date().toISOString()
    };
    this.data.push(newEntry);
    this.saveData();
    return newEntry;
  }

  getAllEntries() {
    return this.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getEntriesByName(name, category = null) {
    return this.data
      .filter(entry => {
        if (entry.name !== name) return false;
        if (!category) return true;
        // If entry has a stored category, match exactly
        if (entry.category) return entry.category === category;
        // Legacy entries without category: infer from metric name
        if (this.metricTypes['M365'].includes(name)) return category === 'M365';
        if (this.metricTypes['Securityscorecard'].includes(name)) return category === 'Securityscorecard';
        if (this.metricTypes['ProjectDiscovery'].includes(name)) return category === 'ProjectDiscovery';
        // For shared Purple Knight metrics, default to 'Purple Knight AD' for legacy entries
        return category === 'Purple Knight AD';
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getEntriesByCategory(category) {
    return this.data
      .filter(entry => {
        // If entry has a stored category, match exactly
        if (entry.category) {
          return entry.category === category;
        }
        // Legacy entries without category: infer from metric name
        if (!this.metricTypes[category].includes(entry.name)) return false;
        if (this.metricTypes['M365'].includes(entry.name)) return category === 'M365';
        if (this.metricTypes['Securityscorecard'].includes(entry.name)) return category === 'Securityscorecard';
        if (this.metricTypes['ProjectDiscovery'].includes(entry.name)) return category === 'ProjectDiscovery';
        // For shared Purple Knight metrics, default to 'Purple Knight AD' for legacy entries
        return category === 'Purple Knight AD';
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getLastEntryByName(name, category = null) {
    const entries = this.getEntriesByName(name, category);
    return entries.length > 0 ? entries[0] : null;
  }

  setReferenceValue(category, metricName, value) {
    if (!this.referenceValues[category]) {
      this.referenceValues[category] = {};
    }
    this.referenceValues[category][metricName] = parseFloat(value);
  }

  getReferenceValue(category = 'M365', metricName = null) {
    if (metricName && this.referenceValues[category] && this.referenceValues[category][metricName] !== undefined) {
      return this.referenceValues[category][metricName];
    }
    // Return default reference for category if no specific metric
    return this.referenceValues[category] && Object.values(this.referenceValues[category])[0] || 0;
  }

  getIndicator(entry, category = 'M365') {
    const value = entry.value;
    const reference = this.getReferenceValue(category, entry.name);

    // Get all entries for this metric type in this category, sorted by date (newest first)
    const allEntries = this.getEntriesByMetricType(entry.name, 100, category);

    // Find the current entry's position
    const currentIndex = allEntries.findIndex(e => e.id === entry.id);

    // Get the previous entry (one position below in the sorted list)
    const previousEntry = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;
    const previousValue = previousEntry ? previousEntry.value : null;

    if (value > reference) {
      if (previousValue !== null && value > previousValue) {
        return { type: 'improving', icon: 'arrow-up', color: 'green' };
      } else {
        return { type: 'good', icon: 'check', color: 'green' };
      }
    } else {
      return { type: 'poor', icon: 'arrow-down', color: 'red' };
    }
  }

  getEntriesByMetricType(metricType, limit = 3, category = null) {
    return this.data
      .filter(entry => {
        if (entry.name !== metricType) return false;
        if (!category) return true;
        // If entry has a stored category, match exactly
        if (entry.category) return entry.category === category;
        // Legacy entries without category: infer from metric name
        if (this.metricTypes['M365'].includes(metricType)) return category === 'M365';
        if (this.metricTypes['Securityscorecard'].includes(metricType)) return category === 'Securityscorecard';
        if (this.metricTypes['ProjectDiscovery'].includes(metricType)) return category === 'ProjectDiscovery';
        // For shared Purple Knight metrics, default to 'Purple Knight AD' for legacy entries
        return category === 'Purple Knight AD';
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  getGlobalAverageData(category = 'M365') {
    const metricTypes = this.getMetricTypes(category);
    return metricTypes.map(metricType => {
      const entries = this.getEntriesByMetricType(metricType, 1, category);
      const latestValue = entries.length > 0 ? entries[0].value : 0;
      return {
        name: metricType,
        value: latestValue,
        hasData: entries.length > 0
      };
    }).filter(item => item.hasData);
  }

  getMetricTypes(category = null) {
    if (category) {
      return this.metricTypes[category] || [];
    }
    return this.metricTypes;
  }

  clearAllData() {
    this.data = [];
    this.saveData();
  }

  exportData() {
    const exportData = {
      entries: this.data,
      referenceValue: this.referenceValue,
      lastUpdated: new Date().toISOString(),
      version: "1.0.0"
    };
    return exportData;
  }

  importData(importData) {
    try {
      this.data = importData.entries || [];
      this.referenceValue = importData.referenceValue || 50;
      this.saveData();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export default new DataManager();
