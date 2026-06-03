class FollowupManager {
  constructor() {
    this.storageKey = 'followup_items'
    this.items = this.loadItems()
  }

  loadItems() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Error loading follow-up items:', e)
      return []
    }
  }

  saveItems() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items))
  }

  addItem(item) {
    const newItem = {
      id: Date.now(),
      level: item.level,
      vulnerability: item.vulnerability,
      serviceIp: item.serviceIp,
      source: item.source,
      remediationTask: item.remediationTask,
      ticket: item.ticket,
      status: item.status,
      hidden: false,
      createdAt: new Date().toISOString()
    }
    this.items.push(newItem)
    this.saveItems()
    return newItem
  }

  updateItem(id, updates) {
    const index = this.items.findIndex(item => item.id === id)
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates }
      this.saveItems()
    }
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item.id !== id)
    this.saveItems()
  }

  getAllItems() {
    return [...this.items]
  }

  getVisibleItems() {
    return this.items.filter(item => !item.hidden)
  }

  toggleHidden(id) {
    const item = this.items.find(item => item.id === id)
    if (item) {
      item.hidden = !item.hidden
      this.saveItems()
    }
  }
}

const followupManager = new FollowupManager()
export default followupManager
