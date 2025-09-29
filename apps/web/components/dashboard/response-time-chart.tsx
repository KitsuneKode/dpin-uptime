'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@dpin-uptime/ui/components/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig 
} from '@dpin-uptime/ui/components/chart';
import { useMonitors, useResponseTimeData } from '@/hooks/api';
import { cn } from '@dpin-uptime/ui/lib/utils';
import type { TimePeriod, Location } from '@/lib/types';

const periodOptions: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Last 24 Hours' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
];

const locationOptions: { value: Location; label: string }[] = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-west', label: 'Europe' },
  { value: 'asia-southeast', label: 'Asia' },
];

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function ResponseTimeChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');
  const [selectedLocation, setSelectedLocation] = useState<Location>('us-east');

  const { data: monitorsResponse, isLoading: monitorsLoading } = useMonitors({ limit: 5 });
  const monitors = React.useMemo(() => monitorsResponse?.data || [], [monitorsResponse?.data]);

  // Create chart config based on monitors
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    monitors.forEach((monitor, index) => {
      config[monitor.name] = {
        label: monitor.name,
        color: chartColors[index % chartColors.length],
      };
    });
    return config;
  }, [monitors]);

  // Get response time data for each monitor (up to 5 monitors max)
  const monitor1 = monitors[0];
  const monitor2 = monitors[1];
  const monitor3 = monitors[2];
  const monitor4 = monitors[3];
  const monitor5 = monitors[4];

  const query1 = useResponseTimeData(monitor1?.id || '', selectedPeriod, selectedLocation);
  const query2 = useResponseTimeData(monitor2?.id || '', selectedPeriod, selectedLocation);
  const query3 = useResponseTimeData(monitor3?.id || '', selectedPeriod, selectedLocation);
  const query4 = useResponseTimeData(monitor4?.id || '', selectedPeriod, selectedLocation);
  const query5 = useResponseTimeData(monitor5?.id || '', selectedPeriod, selectedLocation);

  const responseTimeQueries = [query1, query2, query3, query4, query5].filter((query, index) => 
    monitors[index] && monitors[index]?.id
  );

  const isLoading = monitorsLoading || responseTimeQueries.some(query => query.isLoading);
  const hasError = responseTimeQueries.some(query => query.error);

  // Combine data from all monitors
  const chartData = React.useMemo(() => {
    if (!responseTimeQueries.length || responseTimeQueries.some(query => !query.data)) {
      return [];
    }

    const timeMap = new Map<string, any>();

    responseTimeQueries.forEach((query, index) => {
      const monitor = monitors[index];
      if (!monitor) return;
      
      const data = query.data?.data || [];

      data.forEach(point => {
        const timestamp = point.timestamp;
        if (!timeMap.has(timestamp)) {
          timeMap.set(timestamp, { timestamp });
        }
        timeMap.get(timestamp)![monitor.name] = point.value;
      });
    });

    return Array.from(timeMap.values()).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [responseTimeQueries, monitors]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Response Time</CardTitle>
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

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Failed to load response time data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Response Time</CardTitle>
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
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return selectedPeriod === 'day' 
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis
                tickFormatter={(value) => `${value}ms`}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value, name) => [`${value}ms`, name]}
                  />
                } 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {monitors.map((monitor, index) => (
                <Line
                  key={monitor.id}
                  type="monotone"
                  dataKey={monitor.name}
                  stroke={`var(--color-${monitor.name})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
