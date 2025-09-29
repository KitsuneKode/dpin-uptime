'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Badge } from '@dpin-uptime/ui/components/badge';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useMonitors } from '@/hooks/api';
import { formatDistanceToNow } from 'date-fns';
import type { StatusPage } from '@/lib/types';

interface StatusPagePreviewProps {
  statusPage: StatusPage;
}

export function StatusPagePreview({ statusPage }: StatusPagePreviewProps) {
  const { data: monitorsResponse } = useMonitors({ limit: 100 });
  const allMonitors = monitorsResponse?.data || [];
  
  // Filter monitors that are included in this status page
  const selectedMonitors = allMonitors.filter(monitor => 
    statusPage.monitors.includes(monitor.id)
  );

  const overallStatus = selectedMonitors.every(m => m.status === 'up') 
    ? 'operational' 
    : selectedMonitors.some(m => m.status === 'down') 
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
    <div className={`min-h-screen p-6 ${statusPage.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          {statusPage.logoUrl && (
            <img 
              src={statusPage.logoUrl} 
              alt={`${statusPage.companyName} logo`}
              className="h-12 mx-auto"
            />
          )}
          <h1 className="text-3xl font-bold text-foreground">
            {statusPage.companyName} Status
          </h1>
          <div className="flex items-center justify-center gap-3">
            <StatusIndicator status={currentStatus.indicator} size="lg" />
            <Badge className={currentStatus.color}>
              {currentStatus.text}
            </Badge>
          </div>
        </div>

        {/* Services Status */}
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedMonitors.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No services configured for this status page
                </div>
              ) : (
                selectedMonitors.map((monitor) => (
                  <div 
                    key={monitor.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIndicator status={monitor.status} size="md" />
                      <div>
                        <h3 className="font-medium text-foreground">
                          {monitor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
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
                        {monitor.responseTime}ms • {formatDistanceToNow(new Date(monitor.lastChecked), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Status page powered by {statusPage.companyName}</p>
          <p className="mt-1">
            Last updated {formatDistanceToNow(new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
