'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { TimePeriod, Location } from '@/lib/types'
import { MetricCard } from '@/components/ui/metric-card'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { UptimeChart } from '@/components/ui/uptime-chart'
import { Button } from '@dpin-uptime/ui/components/button'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { UptimeStatusBar } from '@/components/ui/uptime-status-bar'
import { UptimeStatsTable } from '@/components/dashboard/uptime-stats-table'
import { Card, CardContent, CardHeader } from '@dpin-uptime/ui/components/card'
import {
  useMonitor,
  useUptimeStats,
  useResponseTimeData,
  useMonitorTicks,
} from '@/hooks/api'
import {
  ExternalLink,
  Settings,
  Clock,
  Activity,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@dpin-uptime/ui/components/select'

interface MonitorDetailsProps {
  monitorId: string
  onEdit?: () => void
}

const periodOptions: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Last 24 Hours' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
]

const locationOptions: { value: Location; label: string }[] = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-west', label: 'Europe' },
  { value: 'asia-southeast', label: 'Asia' },
]

export function MonitorDetails({ monitorId, onEdit }: MonitorDetailsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day')
  const [selectedLocation, setSelectedLocation] = useState<Location>('us-east')

  const { data: monitorResponse, isLoading: monitorLoading } =
    useMonitor(monitorId)
  const { data: uptimeStatsResponse, isLoading: statsLoading } = useUptimeStats(
    monitorId,
    selectedPeriod,
  )
  const { data: responseTimeResponse, isLoading: chartLoading } =
    useResponseTimeData(monitorId, selectedPeriod)
  const { data: ticksResponse, isLoading: ticksLoading } =
    useMonitorTicks(monitorId)

  const monitor = monitorResponse?.data
  const uptimeStats = uptimeStatsResponse?.data
  const ticks = ticksResponse?.data || []

  // For individual monitor pages, prefer using raw ticks directly
  // since hourly aggregation may not have enough data points
  const responseTimeData = React.useMemo(() => {
    const aggregatedData = responseTimeResponse?.data || []

    // If we have ticks, use them directly
    if (ticks.length > 0) {
      const now = new Date()
      const periodInMs =
        selectedPeriod === 'day'
          ? 24 * 60 * 60 * 1000
          : selectedPeriod === 'week'
            ? 7 * 24 * 60 * 60 * 1000
            : 30 * 24 * 60 * 60 * 1000
      const cutoff = new Date(now.getTime() - periodInMs)

      const filteredTicks = ticks.filter(
        (tick: any) => new Date(tick.createdAt) >= cutoff,
      )

      const tickData = filteredTicks
        .map((tick: any) => ({
          timestamp: tick.createdAt,
          value: tick.latency,
          monitorId: tick.websiteId,
          location: 'validator',
          status: tick.status,
        }))
        .sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )

      console.log(
        '[MonitorDetails] Using raw ticks for chart:',
        tickData.length,
        'filtered from',
        ticks.length,
        'total ticks',
      )

      return tickData
    }

    // Fallback to aggregated data if available
    if (aggregatedData.length > 0) {
      console.log(
        '[MonitorDetails] Using aggregated data:',
        aggregatedData.length,
        'points',
      )
      return aggregatedData
    }

    console.log('[MonitorDetails] No data available')
    return []
  }, [ticks, selectedPeriod, responseTimeResponse])

  // Debug logging
  useEffect(() => {
    console.log('[MonitorDetails] ===== DEBUG INFO =====')
    console.log('[MonitorDetails] Monitor ID:', monitorId)
    console.log('[MonitorDetails] Period:', selectedPeriod)
    console.log('[MonitorDetails] API Response:', responseTimeResponse)
    console.log(
      '[MonitorDetails] Raw API data length:',
      responseTimeResponse?.data?.length || 0,
    )
    console.log(
      '[MonitorDetails] Response time data points:',
      responseTimeData.length,
    )
    console.log('[MonitorDetails] Ticks available:', ticks.length)
    console.log('[MonitorDetails] Chart loading:', chartLoading)
    console.log('[MonitorDetails] Ticks loading:', ticksLoading)
    if (responseTimeData.length > 0) {
      console.log(
        '[MonitorDetails] First 3 data points:',
        responseTimeData.slice(0, 3),
      )
    }
    if (ticks.length > 0) {
      console.log('[MonitorDetails] First 3 ticks:', ticks.slice(0, 3))
    }
    console.log('[MonitorDetails] =====================')
  }, [
    monitorId,
    selectedPeriod,
    responseTimeData,
    ticks,
    responseTimeResponse,
    chartLoading,
    ticksLoading,
  ])

  if (monitorLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!monitor) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-muted-foreground text-center">
            Monitor not found
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Monitor Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <StatusIndicator status={monitor.status} size="lg" />
                <div>
                  <h1 className="text-2xl font-bold">{monitor.name}</h1>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span>{monitor.url}</span>
                    <ExternalLink
                      className="hover:text-foreground h-4 w-4 cursor-pointer"
                      onClick={() => window.open(monitor.url, '_blank')}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  Every {monitor.interval}
                </Badge>
                <span className="text-muted-foreground">
                  Last checked{' '}
                  {formatDistanceToNow(new Date(monitor.lastChecked), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </span>
              </div>
            </div>

            <Button onClick={onEdit}>
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Current Status"
          value={
            monitor.status.charAt(0).toUpperCase() + monitor.status.slice(1)
          }
          icon={<Activity className="h-4 w-4" />}
          isLoading={statsLoading}
        />

        <MetricCard
          title="Response Time"
          value={`${monitor.responseTime}ms`}
          description="Latest check"
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={statsLoading}
        />

        <MetricCard
          title="Uptime"
          value={`${monitor.uptime.percentage.toFixed(2)}%`}
          description={
            selectedPeriod === 'day'
              ? 'Last 24 hours'
              : selectedPeriod === 'week'
                ? 'Last 7 days'
                : 'Last 30 days'
          }
          trend={
            monitor.uptime.percentage >= 99.9
              ? 'up'
              : monitor.uptime.percentage >= 99
                ? 'neutral'
                : 'down'
          }
          icon={<Activity className="h-4 w-4" />}
          isLoading={statsLoading}
        />

        <MetricCard
          title="Incidents"
          value={uptimeStats?.incidents ?? monitor.incidents}
          description={
            selectedPeriod === 'day'
              ? 'Last 24 hours'
              : selectedPeriod === 'week'
                ? 'Last 7 days'
                : 'Last 30 days'
          }
          trend={monitor.incidents === 0 ? 'up' : 'down'}
          icon={<AlertTriangle className="h-4 w-4" />}
          isLoading={statsLoading}
        />
      </div>

      {/* Period and Location Selectors */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedPeriod === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Select
          value={selectedLocation}
          onValueChange={(value: Location) => setSelectedLocation(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Response Time Chart */}
        <UptimeChart
          data={responseTimeData}
          title={`Response Time (${responseTimeData.length} data points)`}
          height={300}
          down={monitor.status === 'down' || monitor.status === 'degraded'}
          isLoading={chartLoading || ticksLoading}
        />

        {/* Uptime Statistics Table */}
        <UptimeStatsTable monitorId={monitorId} />
      </div>

      {/* 90-Day Uptime History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">90-Day Uptime History</h3>
              <p className="text-muted-foreground text-sm">
                Each bar represents one day
              </p>
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-8 w-2 rounded-sm bg-green-500" />
                <span>100% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-2 rounded-sm bg-yellow-500" />
                <span>Partial outage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-2 rounded-sm bg-red-500" />
                <span>Major outage</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ticksLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <UptimeStatusBar ticks={ticks} days={90} showLabels={true} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
