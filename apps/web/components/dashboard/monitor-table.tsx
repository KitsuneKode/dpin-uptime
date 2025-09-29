'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { useMonitors } from '@/hooks/api';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ArrowUpRight, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MonitorTableProps {
  limit?: number;
  showActions?: boolean;
}

export function MonitorTable({ limit = 5, showActions = true }: MonitorTableProps) {
  const router = useRouter();
  const { data: monitorsResponse, isLoading } = useMonitors({ 
    limit,
    refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
  });
  const monitors = monitorsResponse?.data || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monitor Status</CardTitle>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monitor Status</CardTitle>
          {showActions && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/monitors')}
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
              <Button 
                size="sm"
                onClick={() => router.push('/dashboard/monitors')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Monitor
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {monitors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-4">No monitors configured yet</div>
            <Button onClick={() => router.push('/dashboard/monitors')}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first monitor
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/monitors/${monitor.id}`)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {monitor.name}
                      </h4>
                      <ExternalLink 
                        className="h-3 w-3 text-muted-foreground hover:text-foreground flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(monitor.url, '_blank');
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {monitor.url}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {monitor.responseTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(monitor.lastChecked), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {monitor.uptime.percentage.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      uptime
                    </div>
                  </div>
                  
                  <StatusBadge status={monitor.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
