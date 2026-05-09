class DataManager {
  constructor() {
    this.data = this.loadData();
    this.referenceValue = 50; // Reference parameter for comparison
    this.metricTypes = ['Identity', 'Data', 'Device', 'Apps'];
  }

  loadData() {
    const stored = localStorage.getItem('metricsData');
    return stored ? JSON.parse(stored) : [];
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
      timestamp: new Date().toISOString()
    };
    this.data.push(newEntry);
    this.saveData();
    return newEntry;
  }

  getAllEntries() {
    return this.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getEntriesByName(name) {
    return this.data
      .filter(entry => entry.name === name)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getLastEntryByName(name) {
    const entries = this.getEntriesByName(name);
    return entries.length > 0 ? entries[0] : null;
  }

  setReferenceValue(value) {
    this.referenceValue = parseFloat(value);
  }

  getReferenceValue() {
    return this.referenceValue;
  }

  getIndicator(entry) {
    const value = entry.value;
    const reference = this.referenceValue;
    
    // Get all entries for this metric type, sorted by date (newest first)
    const allEntries = this.getEntriesByMetricType(entry.name, 100);
    
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

  getEntriesByMetricType(metricType, limit = 3) {
    return this.data
      .filter(entry => entry.name === metricType)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  getGlobalAverageData() {
    return this.metricTypes.map(metricType => {
      const entries = this.getEntriesByMetricType(metricType, 1);
      const latestValue = entries.length > 0 ? entries[0].value : 0;
      return {
        name: metricType,
        value: latestValue,
        hasData: entries.length > 0
      };
    }).filter(item => item.hasData);
  }

  getMetricTypes() {
    return this.metricTypes;
  }

  clearAllData() {
    this.data = [];
    this.saveData();
  }
}

export default new DataManager();
