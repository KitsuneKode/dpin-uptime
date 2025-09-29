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
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle, Search } from 'lucide-react';

const severityConfig = {
  minor: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: Clock },
  major: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300', icon: AlertTriangle },
  critical: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: AlertTriangle },
} as const;

const statusConfig = {
  investigating: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: Search },
  identified: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', icon: AlertTriangle },
  monitoring: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: Clock },
  resolved: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: CheckCircle },
} as const;

export default function IncidentsPage() {
  const [status, setStatus] = React.useState<'all' | 'investigating' | 'identified' | 'monitoring' | 'resolved'>('all');
  const [selected, setSelected] = React.useState<Incident | null>(null);

  const { data: incidentsResponse, isLoading } = useIncidents({
    status: status !== 'all' ? status : undefined,
    limit: 100,
  });

  const incidents = incidentsResponse?.data || [];
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Incidents</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={(v: typeof status) => setStatus(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="identified">Identified</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Skeleton className="mt-1 h-4 w-4 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : activeIncidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              No active incidents
            </div>
          ) : (
            <div className="space-y-3">
              {activeIncidents.map((incident) => {
                const SeverityIcon = severityConfig[incident.severity].icon;
                const StatusIcon = statusConfig[incident.status].icon;
                return (
                  <div
                    key={incident.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <StatusIndicator status={incident.status === 'resolved' ? 'up' : 'down'} size="sm" className="mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{incident.title}</h3>
                          <Badge variant="secondary" className={severityConfig[incident.severity].color}>
                            <SeverityIcon className="mr-1 h-3 w-3" />
                            {incident.severity}
                          </Badge>
                          <Badge variant="outline" className={statusConfig[incident.status].color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Started {formatDistanceToNow(new Date(incident.startedAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setSelected(incident)}>
                      View
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No incidents found</div>
          ) : (
            <div className="divide-y rounded-md border">
              {incidents.map((incident) => (
                <div key={incident.id} className="grid grid-cols-5 items-center gap-2 p-3 hover:bg-muted/50">
                  <div className="col-span-2 truncate">
                    <div className="font-medium">{incident.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.startedAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={severityConfig[incident.severity].color}>
                      {incident.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusConfig[incident.status].color}>
                      {incident.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(incident)}>
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selected.title}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  Started {formatDistanceToNow(new Date(selected.startedAt), { addSuffix: true })}
                  {selected.resolvedAt && (
                    <> • Resolved {formatDistanceToNow(new Date(selected.resolvedAt), { addSuffix: true })}</>
                  )}
                </div>
              </div>
              {selected.description && (
                <p className="text-sm">{selected.description}</p>
              )}
              {selected.updates && selected.updates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Timeline</h4>
                  <div className="space-y-2">
                    {selected.updates.map(update => (
                      <div key={update.id} className="flex items-start gap-3 p-3 rounded-md border">
                        <Badge variant="outline" className={statusConfig[update.status].color}>
                          {update.status}
                        </Badge>
                        <div className="flex-1">
                          <div className="text-sm">{update.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
