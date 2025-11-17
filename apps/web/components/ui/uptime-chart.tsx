import { cn } from '@dpin-uptime/ui/lib/utils'
import type { ResponseTimeData } from '@/lib/types'
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@dpin-uptime/ui/components/chart'

interface UptimeChartProps {
  data: ResponseTimeData[]
  title?: string
  height?: number
  showGrid?: boolean
  down?: boolean
  className?: string
  isLoading?: boolean
}

const chartConfig = {
  responseTime: {
    label: 'Response Time',
    color: '#10b981', // emerald-500 - vibrant green
  },
} satisfies ChartConfig

export function UptimeChart({
  data,
  title,
  down = false,
  height = 300,
  showGrid = true,
  className,
  isLoading = false,
}: UptimeChartProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div
            className="text-muted-foreground flex items-center justify-center"
            style={{ height }}
          >
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((item) => ({
    timestamp: item.timestamp,
    responseTime: item.value,
    location: item.location,
  }))

  console.log(
    '[UptimeChart] Rendering chart with',
    chartData.length,
    'data points',
  )
  if (chartData.length > 0) {
    console.log('[UptimeChart] First data point:', chartData[0])
    console.log(
      '[UptimeChart] Last data point:',
      chartData[chartData.length - 1],
    )
  }

  const content = (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
          )}
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) =>
              new Date(value).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            }
            stroke="#9CA3AF"
          />
          <YAxis tickFormatter={(value) => `${value}ms`} stroke="#9CA3AF" />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value) => [`${value}ms`, 'Response Time']}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="responseTime"
            stroke={down ? 'red' : '#10b981'}
            strokeWidth={2.5}
            fill="url(#colorResponseTime)"
            fillOpacity={1}
            connectNulls={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )

  if (title) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    )
  }

  return <div className={cn('w-full', className)}>{content}</div>
}
