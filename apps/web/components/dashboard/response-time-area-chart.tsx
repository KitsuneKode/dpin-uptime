'use client';

import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@dpin-uptime/ui/components/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@dpin-uptime/ui/components/chart';
import { useMonitors, useResponseTimeData } from '@/hooks/api';
import { cn } from '@dpin-uptime/ui/lib/utils';
import type { TimePeriod, Location } from '@/lib/types';

const periodOptions: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const locationOptions: { value: Location; label: string }[] = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-west', label: 'Europe' },
  { value: 'asia-southeast', label: 'Asia' },
];

const chartColors = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500  
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
];

export function ResponseTimeAreaChart() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>('day');
  const [selectedLocation, setSelectedLocation] = React.useState<Location>('us-east');

  const { data: monitorsResponse, isLoading: monitorsLoading } = useMonitors({ limit: 5 });
  const monitors = React.useMemo(() => monitorsResponse?.data || [], [monitorsResponse?.data]);

  // Create chart config based on monitors
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    monitors.forEach((monitor, index) => {
      const safeName = monitor.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      config[safeName] = {
        label: monitor.name,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [monitors]);

  // Get response time data for each monitor
  const monitor1 = monitors[0];
  const monitor2 = monitors[1];
  const monitor3 = monitors[2];

  const query1 = useResponseTimeData(monitor1?.id || '', selectedPeriod, selectedLocation);
  const query2 = useResponseTimeData(monitor2?.id || '', selectedPeriod, selectedLocation);
  const query3 = useResponseTimeData(monitor3?.id || '', selectedPeriod, selectedLocation);

  const responseTimeQueries = [query1, query2, query3].filter((query, index) => 
    monitors[index] && monitors[index]?.id
  );

  const isLoading = monitorsLoading || responseTimeQueries.some(query => query.isLoading);

  // Combine data from all monitors
  const chartData = React.useMemo(() => {
    if (!responseTimeQueries.length || responseTimeQueries.some(query => !query.data)) {
      return [];
    }

    const timeMap = new Map<string, Record<string, unknown>>();

    responseTimeQueries.forEach((query, index) => {
      const monitor = monitors[index];
      if (!monitor) return;
      
      const data = query.data?.data || [];
      const safeName = monitor.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

      data.forEach(point => {
        const timestamp = point.timestamp;
        if (!timeMap.has(timestamp)) {
          timeMap.set(timestamp, { timestamp });
        }
        timeMap.get(timestamp)![safeName] = point.value;
      });
    });

    return Array.from(timeMap.values()).sort((a, b) => 
      new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime()
    );
  }, [responseTimeQueries, monitors]);

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
          <Skeleton className="w-full h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Response Times</CardTitle>
          <div className="flex gap-2">
            <Select value={selectedLocation} onValueChange={(value: Location) => setSelectedLocation(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map(option => (
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
                  variant={selectedPeriod === option.value ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'rounded-none border-0',
                    selectedPeriod === option.value && 'bg-primary text-primary-foreground'
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
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {monitors.slice(0, 3).map((monitor, index) => {
                    const safeName = monitor.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                    return (
                      <linearGradient key={safeName} id={`gradient-${safeName}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors[index]} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColors[index]} stopOpacity={0.05}/>
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return selectedPeriod === 'day' 
                      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value, name) => [`${value}ms`, name]}
                    />
                  } 
                />
                {monitors.slice(0, 3).map((monitor, index) => {
                  const safeName = monitor.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                  return (
                    <Area
                      key={monitor.id}
                      type="monotone"
                      dataKey={safeName}
                      stroke={chartColors[index]}
                      strokeWidth={2}
                      fill={`url(#gradient-${safeName})`}
                      connectNulls={false}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
