import { format, subDays } from 'date-fns'

export const generateTimeSeriesData = (days = 30, baseValue = 1000, variance = 200) => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - i - 1)
    const value = baseValue + Math.random() * variance - variance / 2
    return {
      date: format(date, 'MMM dd'),
      value: Math.round(value),
      timestamp: date.getTime()
    }
  })
}

export const metricsData = {
  sessions: {
    current: 1247,
    previous: 1156,
    change: 7.9,
    trend: 'up',
    timeSeries: generateTimeSeriesData(30, 1200, 300)
  },
  users: {
    current: 892,
    previous: 834,
    change: 6.9,
    trend: 'up',
    timeSeries: generateTimeSeriesData(30, 850, 150)
  },
  performance: {
    current: 94.2,
    previous: 91.8,
    change: 2.6,
    trend: 'up',
    timeSeries: generateTimeSeriesData(30, 92, 8)
  },
  errors: {
    current: 23,
    previous: 31,
    change: -25.8,
    trend: 'down',
    timeSeries: generateTimeSeriesData(30, 25, 15)
  },
  loadTime: {
    current: 1.2,
    previous: 1.8,
    change: -33.3,
    trend: 'down',
    timeSeries: generateTimeSeriesData(30, 1.5, 0.8)
  },
  throughput: {
    current: 4567,
    previous: 4234,
    change: 7.9,
    trend: 'up',
    timeSeries: generateTimeSeriesData(30, 4400, 800)
  }
}

export const activityData = [
  { time: '00:00', activity: 45 },
  { time: '04:00', activity: 23 },
  { time: '08:00', activity: 156 },
  { time: '12:00', activity: 234 },
  { time: '16:00', activity: 189 },
  { time: '20:00', activity: 98 },
  { time: '23:59', activity: 67 }
]

export const deviceData = [
  { device: 'Desktop', users: 4567, percentage: 52.3 },
  { device: 'Mobile', users: 3234, percentage: 37.0 },
  { device: 'Tablet', users: 945, percentage: 10.7 }
]

export const regionData = [
  { region: 'North America', users: 3456, percentage: 39.6 },
  { region: 'Europe', users: 2890, percentage: 33.1 },
  { region: 'Asia', users: 1678, percentage: 19.2 },
  { region: 'Other', users: 722, percentage: 8.1 }
]

export const recentEvents = [
  {
    id: 1,
    type: 'success',
    title: 'System Update Completed',
    description: 'Windsurf v2.1.0 deployed successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Memory Usage',
    description: 'Server memory usage at 87%',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 3,
    type: 'error',
    title: 'API Timeout',
    description: 'External API response timeout detected',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 4,
    type: 'info',
    title: 'New User Milestone',
    description: 'Reached 1000 active users',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
]
