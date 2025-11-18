'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Badge } from '@dpin-uptime/ui/components/badge';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@dpin-uptime/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@dpin-uptime/ui/components/dialog';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useIncidents } from '@/hooks/api';
import type { Incident } from '@/lib/types';
import { formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle, Search, ExternalLink, TrendingDown } from 'lucide-react';

const severityConfig = {
  INFO: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: Clock },
  WARNING: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: AlertTriangle },
  CRITICAL: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: AlertTriangle },
} as const;

const statusConfig = {
  OPEN: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Open', icon: AlertTriangle },
  ACKNOWLEDGED: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Acknowledged', icon: Clock },
  RESOLVED: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Resolved', icon: CheckCircle },
} as const;

export default function IncidentsPage() {
  const [status, setStatus] = React.useState<'all' | 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'>('all');
  const [selected, setSelected] = React.useState<Incident | null>(null);

  const { data: incidentsResponse, isLoading } = useIncidents({
    status: status !== 'all' ? status : undefined,
    limit: 100,
  });

  const incidents = incidentsResponse?.data || [];
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and track system incidents and outages
            {activeIncidents.length > 0 && ` • ${activeIncidents.length} active ${activeIncidents.length === 1 ? 'incident' : 'incidents'}`}
          </p>
        </div>
        <Select value={status} onValueChange={(v: typeof status) => setStatus(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeIncidents.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Active Incidents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeIncidents.map((incident) => {
                const SeverityIcon = severityConfig[incident.severity].icon;
                const StatusIcon = statusConfig[incident.status].icon;
                const duration = intervalToDuration({
                  start: new Date(incident.startedAt),
                  end: new Date(),
                });
                return (
                  <div
                    key={incident.id}
                    className="flex items-start justify-between p-4 border rounded-lg bg-background hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <StatusIndicator status="down" size="sm" className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{incident.title}</h3>
                          <Badge variant="secondary" className={severityConfig[incident.severity].color}>
                            <SeverityIcon className="mr-1 h-3 w-3" />
                            {incident.severity}
                          </Badge>
                          <Badge variant="outline" className={statusConfig[incident.status].color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[incident.status].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Started {formatDistanceToNow(new Date(incident.startedAt), { addSuffix: true, includeSeconds: true })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            <span>
                              Duration: {formatDuration(duration, { format: ['hours', 'minutes'] })}
                            </span>
                          </div>
                        </div>
                        {incident.monitor && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate">{incident.monitor.name || incident.monitor.url}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelected(incident)}>
                      Details
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Incident History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-lg font-medium">No incidents recorded</p>
              <p className="text-sm mt-1">All systems are operational</p>
            </div>
          ) : (
            <div className="space-y-2">
              {incidents.map((incident) => {
                const isResolved = incident.status === 'RESOLVED';
                const duration = incident.resolvedAt
                  ? intervalToDuration({
                      start: new Date(incident.startedAt),
                      end: new Date(incident.resolvedAt),
                    })
                  : intervalToDuration({
                      start: new Date(incident.startedAt),
                      end: new Date(),
                    });
                return (
                  <div
                    key={incident.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(incident)}
                  >
                    <StatusIndicator
                      status={isResolved ? 'up' : 'down'}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{incident.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(incident.startedAt), { addSuffix: true, includeSeconds: true })}
                        {' • '}
                        {formatDuration(duration, { format: ['hours', 'minutes'] }) || 'Less than a minute'}
                      </div>
                    </div>
                    <Badge variant="secondary" className={severityConfig[incident.severity].color}>
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline" className={statusConfig[incident.status].color}>
                      {statusConfig[incident.status].label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-xl font-semibold mb-3">{selected.title}</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={severityConfig[selected.severity].color}>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {selected.severity}
                  </Badge>
                  <Badge variant="outline" className={statusConfig[selected.status].color}>
                    {React.createElement(statusConfig[selected.status].icon, { className: "mr-1 h-3 w-3" })}
                    {statusConfig[selected.status].label}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Started</div>
                  <div className="text-sm font-semibold">
                    {new Date(selected.startedAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(selected.startedAt), { addSuffix: true, includeSeconds: true })}
                  </div>
                </div>

                {selected.resolvedAt ? (
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Resolved</div>
                    <div className="text-sm font-semibold">
                      {new Date(selected.resolvedAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(selected.resolvedAt), { addSuffix: true, includeSeconds: true })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                    <div className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Still Ongoing
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Not yet resolved
                    </div>
                  </div>
                )}
              </div>

              {/* Duration */}
              <div className="p-4 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">Incident Duration</div>
                <div className="text-2xl font-bold">
                  {(() => {
                    const duration = selected.resolvedAt
                      ? intervalToDuration({
                          start: new Date(selected.startedAt),
                          end: new Date(selected.resolvedAt),
                        })
                      : intervalToDuration({
                          start: new Date(selected.startedAt),
                          end: new Date(),
                        });
                    return formatDuration(duration, {
                      format: ['days', 'hours', 'minutes'],
                    }) || 'Less than a minute';
                  })()}
                </div>
              </div>

              {/* Affected Monitor */}
              {selected.monitor && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Affected Monitor</div>
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {selected.monitor.name || 'Unnamed Monitor'}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <a
                        href={selected.monitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline truncate"
                      >
                        {selected.monitor.url}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Note about error details */}
              <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-sm">
                <div className="flex gap-2">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      Incident Type: {selected.status === 'RESOLVED' ? 'Service Disruption' : 'Active Outage'}
                    </div>
                    <div className="text-blue-700 dark:text-blue-300 mt-1">
                      The monitor was unreachable or returned an unexpected response during this period.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
