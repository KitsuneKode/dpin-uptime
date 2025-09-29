# Uptime Monitoring Dashboard Components

A comprehensive set of React components for building a Better Uptime-inspired dashboard using Next.js 15, Tailwind v4, shadcn/ui, and React Query.

## 🏗️ Architecture

```
components/
├── dashboard/          # Main dashboard components
├── monitors/          # Monitor management components  
├── status-pages/      # Public status page components
└── ui/               # Shared UI components
```

## 📦 Core Components

### Dashboard Components (`/dashboard`)

- **`DashboardOverview`** - Main dashboard layout with metrics and charts
- **`MetricsCards`** - Key performance indicators (KPIs) cards
- **`ResponseTimeChart`** - Interactive response time visualization with period/location filters
- **`RecentIncidents`** - List of recent incidents with status indicators

### Monitor Management (`/monitors`)

- **`MonitorsList`** - Searchable table of all monitors with actions
- **`MonitorDetails`** - Detailed view with charts and statistics
- **`MonitorForm`** - Create/edit monitor form with validation

### Status Pages (`/status-pages`)

- **`StatusPageForm`** - Create/edit public status pages
- **`StatusPagePreview`** - Live preview of public status page

### Shared UI (`/ui`)

- **`StatusIndicator`** - Colored status dots with optional text
- **`UptimeChart`** - Reusable chart component using shadcn/ui charts
- **`MetricCard`** - Standardized metric display cards

## 🎨 Design System

### Status Colors
- **Up/Operational**: `emerald-500` (green)
- **Down**: `red-500` 
- **Degraded**: `amber-500` (yellow)
- **Paused**: `gray-400`

### Chart Colors
Uses CSS variables from `globals.css`:
- `--chart-1` through `--chart-5` for multi-series charts
- Automatic dark/light theme support

## 🔧 Technical Features

### React Query Integration
- Automatic caching and background updates
- Optimistic updates for mutations
- Error handling and retry logic
- Real-time data with configurable refetch intervals

### Form Validation
- Zod schemas for type-safe validation
- react-hook-form integration
- Real-time validation feedback
- Proper TypeScript typing

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Proper breakpoints for all screen sizes
- Touch-friendly interactions

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## 🚀 Usage Examples

### Basic Dashboard
```tsx
import { DashboardOverview } from '@/components/dashboard';

export default function DashboardPage() {
  return <DashboardOverview />;
}
```

### Monitor Management
```tsx
import { MonitorsList, MonitorForm } from '@/components/monitors';
import { useState } from 'react';

export default function MonitorsPage() {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      <MonitorsList 
        onCreateMonitor={() => setShowForm(true)}
      />
      {showForm && (
        <MonitorForm 
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}
```

### Custom Chart
```tsx
import { UptimeChart } from '@/components/ui';
import { useResponseTimeData } from '@/hooks/api';

export function CustomChart({ monitorId }: { monitorId: string }) {
  const { data, isLoading } = useResponseTimeData(monitorId, 'day');
  
  return (
    <UptimeChart
      data={data?.data || []}
      title="Response Time Trend"
      height={300}
      isLoading={isLoading}
    />
  );
}
```

## 🔌 API Integration

### Required Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### API Endpoints Expected
- `GET /dashboard/metrics` - Dashboard KPIs
- `GET /monitors` - List monitors with pagination/filtering
- `GET /monitors/:id` - Single monitor details
- `POST /monitors` - Create new monitor
- `PATCH /monitors/:id` - Update monitor
- `DELETE /monitors/:id` - Delete monitor
- `GET /monitors/:id/response-time` - Response time data
- `GET /incidents` - List incidents
- `GET /status-pages` - List status pages

## 🎯 Key Features Implemented

### Real-time Updates
- Dashboard metrics refresh every 60 seconds
- Monitor status updates every 30 seconds
- Live response time charts

### Advanced Filtering
- Search monitors by name/URL
- Filter by status (up/down/degraded/paused)
- Time period selection for charts
- Location-based response time data

### Error Handling
- Graceful loading states with skeletons
- Error boundaries with retry functionality
- Toast notifications for user actions
- Offline state handling

### Performance Optimizations
- React Query caching strategies
- Memoized chart configurations
- Optimized re-renders with useMemo
- Lazy loading for large datasets

## 🔄 State Management

Uses React Query for all server state:
- Automatic background synchronization
- Optimistic updates for better UX
- Intelligent cache invalidation
- Built-in loading and error states

## 🎨 Styling

- **Framework**: Tailwind CSS v4
- **Components**: shadcn/ui with custom theme
- **Charts**: Recharts via shadcn/ui chart components
- **Icons**: Lucide React
- **Animations**: Tailwind transitions + tw-animate-css

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px` - Stacked layouts, simplified navigation
- **Tablet**: `768px - 1024px` - 2-column grids, condensed tables  
- **Desktop**: `> 1024px` - Full multi-column layouts, detailed views

## 🧪 Testing Considerations

Components are built with testing in mind:
- Predictable data-testid attributes
- Separated business logic from UI
- Mockable API hooks
- Accessible DOM structure

## 🔮 Future Enhancements

- WebSocket integration for real-time updates
- Advanced alerting and notification system
- Custom dashboard builder
- Multi-tenant support
- Advanced analytics and reporting
- Mobile app companion

---

Built with ❤️ using modern React patterns and best practices.
