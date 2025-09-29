'use client'

import { useDashboardMetrics } from '@/hooks/api'
import { MetricCard } from '@/components/ui/metric-card'
import { Activity, Clock, AlertTriangle, Zap } from 'lucide-react'

export function MetricsCards() {
  const { data: metricsResponse, isLoading } = useDashboardMetrics()
  const metrics = metricsResponse!.data

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Monitors"
        value={metrics?.totalMonitors ?? 0}
        description="Active monitoring"
        icon={<Activity className="h-4 w-4" />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Overall Uptime"
        value={metrics ? `${metrics.overallUptime.toFixed(2)}%` : '0%'}
        description="Last 30 days"
        trend={
          metrics?.overallUptime >= 99.9
            ? 'up'
            : metrics?.overallUptime >= 99
              ? 'neutral'
              : 'down'
        }
        trendValue={
          metrics ? `${metrics.overallUptime.toFixed(2)}%` : undefined
        }
        icon={<Zap className="h-4 w-4" />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Active Incidents"
        value={metrics?.activeIncidents ?? 0}
        description="Ongoing issues"
        trend={metrics?.activeIncidents === 0 ? 'up' : 'down'}
        icon={<AlertTriangle className="h-4 w-4" />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Avg Response Time"
        value={metrics ? `${metrics.avgResponseTime}ms` : '0ms'}
        description="Last 24 hours"
        trend={
          metrics?.avgResponseTime < 200
            ? 'up'
            : metrics?.avgResponseTime < 500
              ? 'neutral'
              : 'down'
        }
        trendValue={metrics ? `${metrics.avgResponseTime}ms` : undefined}
        icon={<Clock className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  )
}
