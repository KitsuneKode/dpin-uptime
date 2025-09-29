import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@dpin-uptime/ui/components/chart';
import { cn } from '@dpin-uptime/ui/lib/utils';
import type { ResponseTimeData } from '@/lib/types';

interface UptimeChartProps {
  data: ResponseTimeData[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  className?: string;
  isLoading?: boolean;
}

const chartConfig = {
  responseTime: {
    label: "Response Time",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function UptimeChart({
  data,
  title,
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
          <Skeleton className={`w-full h-[${height}px]`} />
        </CardContent>
      </Card>
    );
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
            className="flex items-center justify-center text-muted-foreground"
            style={{ height }}
          >
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    timestamp: item.timestamp,
    responseTime: item.value,
    location: item.location,
  }));

  const content = (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" />
        )}
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <YAxis
          tickFormatter={(value) => `${value}ms`}
        />
        <ChartTooltip 
          content={
            <ChartTooltipContent 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value) => [`${value}ms`, "Response Time"]}
            />
          } 
        />
        <Line
          type="monotone"
          dataKey="responseTime"
          stroke="var(--color-responseTime)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );

  if (title) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {content}
    </div>
  );
}
