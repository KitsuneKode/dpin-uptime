'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Badge } from '@dpin-uptime/ui/components/badge';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { useMonitor, useUptimeStats, useResponseTimeData } from '@/hooks/api';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { UptimeChart } from '@/components/ui/uptime-chart';
import { MetricCard } from '@/components/ui/metric-card';
import { formatDistanceToNow } from 'date-fns';
import { 
  ExternalLink, 
  Settings, 
  Clock, 
  Activity, 
  TrendingUp,
  AlertTriangle 
} from 'lucide-react';
import type { TimePeriod } from '@/lib/types';

interface MonitorDetailsProps {
  monitorId: string;
  onEdit?: () => void;
}

const periodOptions: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Last 24 Hours' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
];

export function MonitorDetails({ monitorId, onEdit }: MonitorDetailsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');

  const { data: monitorResponse, isLoading: monitorLoading } = useMonitor(monitorId);
  const { data: uptimeStatsResponse, isLoading: statsLoading } = useUptimeStats(monitorId, selectedPeriod);
  const { data: responseTimeResponse, isLoading: chartLoading } = useResponseTimeData(monitorId, selectedPeriod);

  const monitor = monitorResponse?.data;
  const uptimeStats = uptimeStatsResponse?.data;
  const responseTimeData = responseTimeResponse?.data || [];

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
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!monitor) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Monitor not found
          </div>
        </CardContent>
      </Card>
    );
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
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{monitor.url}</span>
                    <ExternalLink 
                      className="h-4 w-4 cursor-pointer hover:text-foreground"
                      onClick={() => window.open(monitor.url, '_blank')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Every {monitor.interval}
                </Badge>
                <span className="text-muted-foreground">
                  Last checked {formatDistanceToNow(new Date(monitor.lastChecked), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <Button onClick={onEdit}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Current Status"
          value={monitor.status.charAt(0).toUpperCase() + monitor.status.slice(1)}
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
          description={selectedPeriod === 'day' ? 'Last 24 hours' : selectedPeriod === 'week' ? 'Last 7 days' : 'Last 30 days'}
          trend={monitor.uptime.percentage >= 99.9 ? 'up' : monitor.uptime.percentage >= 99 ? 'neutral' : 'down'}
          icon={<Activity className="h-4 w-4" />}
          isLoading={statsLoading}
        />
        
        <MetricCard
          title="Incidents"
          value={uptimeStats?.incidents ?? monitor.incidents}
          description={selectedPeriod === 'day' ? 'Last 24 hours' : selectedPeriod === 'week' ? 'Last 7 days' : 'Last 30 days'}
          trend={monitor.incidents === 0 ? 'up' : 'down'}
          icon={<AlertTriangle className="h-4 w-4" />}
          isLoading={statsLoading}
        />
      </div>

      {/* Period Selector */}
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

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Response Time Chart */}
        <UptimeChart
          data={responseTimeData}
          title="Response Time"
          height={300}
          isLoading={chartLoading}
        />

        {/* Uptime Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Uptime Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : uptimeStats ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">{uptimeStats.availability.toFixed(4)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Downtime</span>
                  <span className="font-medium">{uptimeStats.downtime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incidents</span>
                  <span className="font-medium">{uptimeStats.incidents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longest Incident</span>
                  <span className="font-medium">{uptimeStats.longestIncident}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Incident Duration</span>
                  <span className="font-medium">{uptimeStats.avgIncident}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No statistics available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
