# Windsurf Metric Tracking Dashboard

A comprehensive, modern metrics tracking dashboard built with React, Vite, and TailwindCSS. This dashboard provides real-time visualization of key performance metrics with interactive charts and a responsive design.

## Features

- **Real-time Metrics**: Track active sessions, users, performance scores, error rates, and more
- **Interactive Charts**: Multiple chart types (line, area, bar, pie) using Recharts
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Modern UI**: Clean, professional interface with TailwindCSS
- **Activity Feed**: Real-time event monitoring with color-coded alerts
- **Time Range Selection**: Filter data by different time periods
- **Auto-refresh**: Automatic data updates with manual refresh option

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Lucide React** - Beautiful icon library
- **Date-fns** - Date manipulation utilities
- **CLSX** - Utility for constructing className strings

## Getting Started

### Prerequisites

- Node.js 24.16.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd windsurf-metric-tracking-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/
│   ├── MetricCard.jsx      # Individual metric display cards
│   ├── ChartContainer.jsx  # Reusable chart wrapper
│   └── ActivityFeed.jsx    # Real-time activity feed
├── data/
│   └── mockData.js         # Mock data generation
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles and Tailwind
```

## Dashboard Components

### Metrics Cards
- **Active Sessions**: Current user sessions with trend indicators
- **Active Users**: Number of active users
- **Performance Score**: System performance percentage
- **Error Rate**: Error count and trends
- **Load Time**: Average page load time
- **Throughput**: System throughput metrics

### Charts
- **Sessions Over Time**: Area chart showing session trends
- **Performance Score Trend**: Line chart for performance metrics
- **Activity by Time of Day**: Bar chart for hourly activity
- **Device Distribution**: Pie chart for device types
- **System Throughput**: Line chart for throughput metrics

### Activity Feed
Real-time event monitoring with:
- Success notifications (green)
- Warning alerts (yellow)
- Error notifications (red)
- Information updates (blue)

## Customization

### Adding New Metrics

1. Update `src/data/mockData.js` to include your new metric
2. Add a new `MetricCard` component in `src/App.jsx`
3. Configure chart data as needed

### Styling

The project uses TailwindCSS with custom configuration in `tailwind.config.js`. You can:
- Modify colors in the theme extension
- Add custom animations
- Adjust responsive breakpoints

### Data Integration

Replace the mock data in `src/data/mockData.js` with your actual API calls. The current structure supports:
- Time series data
- Categorical data
- Real-time events

## Performance

- Optimized with React 18 features
- Lazy loading for charts
- Efficient re-rendering with proper memoization
- Responsive images and assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on the GitHub repository.
