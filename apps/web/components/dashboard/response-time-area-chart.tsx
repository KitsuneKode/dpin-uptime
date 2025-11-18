'use client'

import * as React from 'react'
import { api } from '@/lib/api'
import { cn } from '@dpin-uptime/ui/lib/utils'
import { useQueries } from '@tanstack/react-query'
import { useMonitors, monitorKeys } from '@/hooks/api'
import type { TimePeriod, Location } from '@/lib/types'
import { Button } from '@dpin-uptime/ui/components/button'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@dpin-uptime/ui/components/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@dpin-uptime/ui/components/chart'

const periodOptions: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const locationOptions: { value: Location; label: string }[] = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-west', label: 'Europe' },
  { value: 'asia-southeast', label: 'Asia' },
]

const chartColors = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
]

export function ResponseTimeAreaChart() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>('day')
  const [selectedLocation, setSelectedLocation] =
    React.useState<Location>('us-east')

  // Fetch up to 10 monitors to show in the chart
  const { data: monitorsResponse, isLoading: monitorsLoading } = useMonitors({
    limit: 10,
  })
  const monitors = React.useMemo(
    () => monitorsResponse?.websites || [],
    [monitorsResponse?.websites],
  )

  // Create chart config based on monitors
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {}
    monitors.forEach((monitor, index) => {
      const safeName = monitor.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
      config[safeName] = {
        label: monitor.name,
        color: chartColors[index % chartColors.length],
      }
    })
    return config
  }, [monitors])

  // Use useQueries for efficient parallel data fetching
  const queries = useQueries({
    queries: monitors.slice(0, 10).map((monitor) => ({
      queryKey: monitorKeys.responseTime(
        monitor.id,
        selectedPeriod,
        selectedLocation,
      ),
      queryFn: async () => {
        try {
          const res = await api.getResponseTimeData({
            period: selectedPeriod,
            monitorIds: [monitor.id],
          })
          if (!res?.data?.length) {
            return { data: [], success: true }
          }

          // Transform backend data to frontend format
          const transformedData = res.data.map((item: any) => ({
            timestamp:
              typeof item.timestamp === 'string'
                ? item.timestamp
                : item.timestamp.toISOString(),
            value: item.avgLatency || item.value || 0,
            monitorId: item.monitorId,
            location: selectedLocation || 'unknown',
            status: (item.status || 'Good') as any,
          }))

          return { data: transformedData, success: true }
        } catch (error) {
          console.error(
            '[ResponseTimeAreaChart] Error fetching data for',
            monitor.id,
            error,
          )
          return { data: [], success: false }
        }
      },
      staleTime: 30 * 1000,
      refetchInterval: 30 * 1000,
      retry: 1,
    })),
  })

  // Pair monitors with their queries
  const series = React.useMemo(() => {
    return monitors.slice(0, 10).map((monitor, index) => ({
      monitor,
      query: queries[index]!,
    }))
  }, [monitors, queries])

  // Loading only if we have no data for any series yet
  const isLoading =
    monitorsLoading ||
    (series.length > 0 &&
      series.every((s) => s.query.isLoading && !s.query.data))

  // Combine data from all monitors
  const { chartData, monitorsWithData } = React.useMemo(() => {
    if (!series.length) {
      return { chartData: [], monitorsWithData: [] as typeof monitors }
    }

    const timeMap = new Map<string, Record<string, unknown>>()
    const withData: typeof monitors = []

    series.forEach(({ monitor, query }) => {
      const points = query.data?.data || []
      if (!monitor || points.length === 0) return
      withData.push(monitor)
      const safeName = monitor.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

      points.forEach((point) => {
        const timestamp = point.timestamp
        if (!timeMap.has(timestamp)) {
          timeMap.set(timestamp, { timestamp })
        }
        timeMap.get(timestamp)![safeName] = point.value
      })
    })

    const combined = Array.from(timeMap.values()).sort(
      (a, b) =>
        new Date(a.timestamp as string).getTime() -
        new Date(b.timestamp as string).getTime(),
    )

    console.log(
      '[ResponseTimeAreaChart] Showing data for',
      withData.length,
      'monitors',
    )

    return { chartData: combined, monitorsWithData: withData }
  }, [series])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Response Times</CardTitle>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Response Times</CardTitle>
          <div className="flex gap-2">
            <Select
              value={selectedLocation}
              onValueChange={(value: Location) => setSelectedLocation(value)}
            >
              <SelectTrigger className="w-32">
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
            <div className="flex rounded-md border">
              {periodOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    selectedPeriod === option.value ? 'default' : 'ghost'
                  }
                  size="sm"
                  className={cn(
                    'rounded-none border-0',
                    selectedPeriod === option.value &&
                      'bg-primary text-primary-foreground',
                  )}
                  onClick={() => setSelectedPeriod(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-muted-foreground flex h-[400px] items-center justify-center">
            No data available for the selected period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  {monitorsWithData.map((monitor, index) => {
                    const safeName = monitor.name
                      .replace(/[^a-zA-Z0-9]/g, '-')
                      .toLowerCase()
                    const colorIndex = monitors.findIndex(
                      (m) => m.id === monitor.id,
                    )
                    return (
                      <linearGradient
                        key={safeName}
                        id={`gradient-${safeName}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={
                            chartColors[colorIndex % chartColors.length]
                          }
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={
                            chartColors[colorIndex % chartColors.length]
                          }
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    )
                  })}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return selectedPeriod === 'day'
                      ? date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : date.toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })
                  }}
                  stroke="#9CA3AF"
                />
                <YAxis
                  tickFormatter={(value) => `${value}ms`}
                  stroke="#9CA3AF"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString()
                      }
                      formatter={(value, name) => [`${value}ms`, name]}
                    />
                  }
                />
                {monitorsWithData.map((monitor) => {
                  const safeName = monitor.name
                    .replace(/[^a-zA-Z0-9]/g, '-')
                    .toLowerCase()
                  const colorIndex = monitors.findIndex(
                    (m) => m.id === monitor.id,
                  )
                  return (
                    <Area
                      key={monitor.id}
                      type="monotone"
                      dataKey={safeName}
                      stroke={chartColors[colorIndex % chartColors.length]}
                      strokeWidth={2.5}
                      fill={`url(#gradient-${safeName})`}
                      connectNulls={true}
                    />
                  )
                })}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}

        {/* Legend showing all monitors with colors */}
        {monitorsWithData.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {monitorsWithData.map((monitor) => {
              const colorIndex = monitors.findIndex((m) => m.id === monitor.id)
              return (
                <div key={monitor.id} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        chartColors[colorIndex % chartColors.length],
                    }}
                  />
                  <span className="text-muted-foreground text-xs">
                    {monitor.name}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
