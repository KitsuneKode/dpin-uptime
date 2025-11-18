'use client'

import * as React from 'react'
import { useUptimeStats } from '@/hooks/api'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'

interface UptimeStatsTableProps {
  monitorId: string
}

export function UptimeStatsTable({ monitorId }: UptimeStatsTableProps) {
  const todayStats = useUptimeStats(monitorId, 'day')
  const weekStats = useUptimeStats(monitorId, 'week')
  const monthStats = useUptimeStats(monitorId, 'month')

  const queries = [todayStats, weekStats, monthStats]
  const isLoading = queries.some((q) => q.isLoading)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uptime Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4 py-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const statsData = [
    { period: 'Today', stats: todayStats.data?.data },
    { period: 'Last 7 days', stats: weekStats.data?.data },
    { period: 'Last 30 days', stats: monthStats.data?.data },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uptime Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Header */}
          <div className="text-muted-foreground grid grid-cols-6 gap-4 border-b pb-3 text-xs font-medium">
            <div>Time period</div>
            <div>Availability</div>
            <div>Downtime</div>
            <div>Incidents</div>
            <div>Longest incident</div>
            <div>Avg. incident</div>
          </div>

          {/* Data rows */}
          {statsData.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 border-b py-3 text-sm last:border-b-0"
            >
              <div className="font-medium">{row.period}</div>
              <div className="font-mono">
                {row.stats ? `${row.stats.availability.toFixed(4)}%` : '—'}
              </div>
              <div className="text-muted-foreground">
                {row.stats?.downtime || 'none'}
              </div>
              <div className="text-center">{row.stats?.incidents || 0}</div>
              <div className="text-muted-foreground">
                {row.stats?.longestIncident || 'none'}
              </div>
              <div className="text-muted-foreground">
                {row.stats?.avgIncident || 'none'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
