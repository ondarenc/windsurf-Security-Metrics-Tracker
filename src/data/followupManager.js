import { followupApi } from '../lib/api';

class FollowupManager {
  constructor() {
    this.storageKey = 'followup_items'
    this.useApi = true // Set to false to fallback to localStorage
    this.items = []
    this.loadItems()
  }

  async loadItems() {
    if (this.useApi) {
      try {
        const apiData = await followupApi.getAll()
        // Transform API data to match local format
        this.items = apiData.map(item => ({
          id: item.id,
          level: item.level,
          vulnerability: item.vulnerability,
          serviceIp: item.service_ip,
          source: item.source,
          remediationTask: item.remediation_task,
          ticket: item.ticket,
          status: item.status,
          hidden: item.hidden === 1,
          createdAt: item.created_at
        }))
      } catch (error) {
        console.error('Error loading follow-up items from API:', error)
        console.log('Falling back to localStorage')
        this.useApi = false
        this.loadItems()
      }
    } else {
      try {
        const stored = localStorage.getItem(this.storageKey)
        this.items = stored ? JSON.parse(stored) : []
      } catch (e) {
        console.error('Error loading follow-up items:', e)
        this.items = []
      }
    }
  }

  saveItems() {
    if (this.useApi) return
    localStorage.setItem(this.storageKey, JSON.stringify(this.items))
  }

  async addItem(item) {
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

    if (this.useApi) {
      try {
        const result = await followupApi.add({
          level: item.level,
          vulnerability: item.vulnerability,
          service_ip: item.serviceIp,
          source: item.source,
          remediation_task: item.remediationTask,
          ticket: item.ticket,
          status: item.status
        })
        newItem.id = result.id
      } catch (error) {
        console.error('Error adding follow-up item via API:', error)
        this.useApi = false
        this.items.push(newItem)
        this.saveItems()
        return newItem
      }
    }

    this.items.push(newItem)
    return newItem
  }

  async updateItem(id, updates) {
    const index = this.items.findIndex(item => item.id === id)
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates }

      if (this.useApi) {
        try {
          await followupApi.update(id, {
            level: this.items[index].level,
            vulnerability: this.items[index].vulnerability,
            service_ip: this.items[index].serviceIp,
            source: this.items[index].source,
            remediation_task: this.items[index].remediationTask,
            ticket: this.items[index].ticket,
            status: this.items[index].status,
            hidden: this.items[index].hidden ? 1 : 0
          })
          // Reload from API to ensure local state matches database
          await this.loadItems()
        } catch (error) {
          console.error('Error updating follow-up item via API:', error)
          this.useApi = false
          this.saveItems()
        }
      } else {
        this.saveItems()
      }
    }
  }

  async deleteItem(id) {
    this.items = this.items.filter(item => item.id !== id)

    if (this.useApi) {
      try {
        await followupApi.delete(id)
      } catch (error) {
        console.error('Error deleting follow-up item via API:', error)
        this.useApi = false
        this.saveItems()
      }
    } else {
      this.saveItems()
    }
  }

  async getAllItems() {
    // Reload from API to get fresh data
    await this.loadItems()
    return [...this.items]
  }

  async getVisibleItems() {
    if (this.useApi) {
      try {
        const apiData = await followupApi.getAll(true)
        return apiData.map(item => ({
          id: item.id,
          level: item.level,
          vulnerability: item.vulnerability,
          serviceIp: item.service_ip,
          source: item.source,
          remediationTask: item.remediation_task,
          ticket: item.ticket,
          status: item.status,
          hidden: item.hidden === 1,
          createdAt: item.created_at
        }))
      } catch (error) {
        console.error('Error getting visible items from API:', error)
        this.useApi = false
        return this.items.filter(item => !item.hidden)
      }
    }
    return this.items.filter(item => !item.hidden)
  }

  async toggleHidden(id) {
    const item = this.items.find(item => item.id === id)
    if (item) {
      item.hidden = !item.hidden

      if (this.useApi) {
        try {
          await followupApi.update(id, {
            level: item.level,
            vulnerability: item.vulnerability,
            service_ip: item.serviceIp,
            source: item.source,
            remediation_task: item.remediationTask,
            ticket: item.ticket,
            status: item.status,
            hidden: item.hidden ? 1 : 0
          })
        } catch (error) {
          console.error('Error toggling hidden via API:', error)
          this.useApi = false
          this.saveItems()
        }
      } else {
        this.saveItems()
      }
    }
  }
}

const followupManager = new FollowupManager()
export default followupManager
