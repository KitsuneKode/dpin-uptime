'use client';

import { Badge } from '@dpin-uptime/ui/components/badge';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { UptimeStatusBar } from '@/components/ui/uptime-status-bar';
import { useMonitors } from '@/hooks/api';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import type { StatusPage, WebsiteTick } from '@/lib/types';

interface StatusPagePreviewProps {
  statusPage: StatusPage;
}

export function StatusPagePreview({ statusPage }: StatusPagePreviewProps) {
  const { data: monitorsResponse } = useMonitors({ limit: 100 });
  const allMonitors = monitorsResponse?.websites || [];

  // Filter monitors that are included in this status page
  const selectedMonitors = allMonitors.filter((monitor) =>
    statusPage.monitors.includes(monitor.id)
  );

  const overallStatus = selectedMonitors.every((m) => m.status === 'up')
    ? 'operational'
    : selectedMonitors.some((m) => m.status === 'down')
    ? 'major-outage'
    : 'partial-outage';

  const statusConfig = {
    operational: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      text: 'All Systems Operational',
      indicator: 'up' as const,
    },
    'partial-outage': {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      text: 'Partial System Outage',
      indicator: 'degraded' as const,
    },
    'major-outage': {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      text: 'Major System Outage',
      indicator: 'down' as const,
    },
  };

  const currentStatus = statusConfig[overallStatus];

  return (
    <div className={`p-8 ${statusPage.theme === 'dark' ? 'dark bg-gray-900' : 'bg-background'}`}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {statusPage.logoUrl && (
            <img
              src={statusPage.logoUrl}
              alt={`${statusPage.companyName} logo`}
              className="h-12 mx-auto"
            />
          )}
          <h1 className="text-3xl font-bold">
            {statusPage.companyName} Status
          </h1>
          <div className="flex items-center justify-center gap-2">
            <StatusIndicator status={currentStatus.indicator} size="md" />
            <Badge className={currentStatus.color}>
              {currentStatus.text}
            </Badge>
          </div>
        </div>

        {/* Services Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Services</h2>
          {selectedMonitors.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border rounded-lg">
              <p>No services configured for this status page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedMonitors.map((monitor) => (
                <MonitorStatusRow key={monitor.id} monitor={monitor} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t text-sm text-muted-foreground">
          <p>Last updated {formatDistanceToNow(new Date(), { addSuffix: true, includeSeconds: true })}</p>
        </div>
      </div>
    </div>
  );
}

// Monitor status row component with uptime bar
function MonitorStatusRow({ monitor }: { monitor: any }) {
  // Fetch ticks for this monitor
  const { data: ticksResponse } = useQuery({
    queryKey: ['monitor-ticks', monitor.id],
    queryFn: async () => {
      const response = await api.getMonitorTicks(monitor.id);
      return response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const ticks: WebsiteTick[] = ticksResponse?.data || [];

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <StatusIndicator status={monitor.status} size="sm" />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate">
              {monitor.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {monitor.url}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">
            {monitor.status === 'up' ? 'Operational' :
             monitor.status === 'down' ? 'Down' :
             monitor.status === 'degraded' ? 'Degraded' : 'Paused'}
          </div>
          <div className="text-xs text-muted-foreground">
            {monitor.responseTime}ms
          </div>
        </div>
      </div>

      {/* Uptime bar */}
      {ticks.length > 0 && (
        <UptimeStatusBar ticks={ticks} days={90} />
      )}
    </div>
  );
}
