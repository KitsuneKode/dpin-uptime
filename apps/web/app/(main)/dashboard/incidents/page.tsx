'use client'

import * as React from 'react'
import { useIncidents } from '@/hooks/api'
import type { Incident } from '@/lib/types'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { Button } from '@dpin-uptime/ui/components/button'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import { StatusIndicator } from '@/components/ui/status-indicator'
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from 'date-fns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  ExternalLink,
  TrendingDown,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@dpin-uptime/ui/components/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@dpin-uptime/ui/components/select'

const severityConfig = {
  INFO: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: Clock,
  },
  WARNING: {
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: AlertTriangle,
  },
  CRITICAL: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: AlertTriangle,
  },
} as const

const statusConfig = {
  OPEN: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    label: 'Open',
    icon: AlertTriangle,
  },
  ACKNOWLEDGED: {
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Acknowledged',
    icon: Clock,
  },
  RESOLVED: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    label: 'Resolved',
    icon: CheckCircle,
  },
} as const

export default function IncidentsPage() {
  const [status, setStatus] = React.useState<
    'all' | 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'
  >('all')
  const [selected, setSelected] = React.useState<Incident | null>(null)

  const { data: incidentsResponse, isLoading } = useIncidents({
    status: status !== 'all' ? status : undefined,
    limit: 100,
  })

  const incidents = incidentsResponse?.data || []
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor and track system incidents and outages
            {activeIncidents.length > 0 &&
              ` • ${activeIncidents.length} active ${activeIncidents.length === 1 ? 'incident' : 'incidents'}`}
          </p>
        </div>
        <Select
          value={status}
          onValueChange={(v: typeof status) => setStatus(v)}
        >
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
              <AlertTriangle className="text-destructive h-5 w-5" />
              <CardTitle className="text-destructive">
                Active Incidents
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeIncidents.map((incident) => {
                const SeverityIcon = severityConfig[incident.severity].icon
                const StatusIcon = statusConfig[incident.status].icon
                const duration = intervalToDuration({
                  start: new Date(incident.startedAt),
                  end: new Date(),
                })
                return (
                  <div
                    key={incident.id}
                    className="bg-background flex items-start justify-between rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-1 items-start gap-3">
                      <StatusIndicator
                        status="down"
                        size="sm"
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-foreground font-semibold">
                            {incident.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={severityConfig[incident.severity].color}
                          >
                            <SeverityIcon className="mr-1 h-3 w-3" />
                            {incident.severity}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={statusConfig[incident.status].color}
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[incident.status].label}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              Started{' '}
                              {formatDistanceToNow(
                                new Date(incident.startedAt),
                                { addSuffix: true, includeSeconds: true },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            <span>
                              Duration:{' '}
                              {formatDuration(duration, {
                                format: ['hours', 'minutes'],
                              })}
                            </span>
                          </div>
                        </div>
                        {incident.monitor && (
                          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate">
                              {incident.monitor.name || incident.monitor.url}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(incident)}
                    >
                      Details
                    </Button>
                  </div>
                )
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
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">No incidents recorded</p>
              <p className="mt-1 text-sm">All systems are operational</p>
            </div>
          ) : (
            <div className="space-y-2">
              {incidents.map((incident) => {
                const isResolved = incident.status === 'RESOLVED'
                const duration = incident.resolvedAt
                  ? intervalToDuration({
                      start: new Date(incident.startedAt),
                      end: new Date(incident.resolvedAt),
                    })
                  : intervalToDuration({
                      start: new Date(incident.startedAt),
                      end: new Date(),
                    })
                return (
                  <div
                    key={incident.id}
                    className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-lg border p-3 transition-colors"
                    onClick={() => setSelected(incident)}
                  >
                    <StatusIndicator
                      status={isResolved ? 'up' : 'down'}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {incident.title}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(incident.startedAt), {
                          addSuffix: true,
                          includeSeconds: true,
                        })}
                        {' • '}
                        {formatDuration(duration, {
                          format: ['hours', 'minutes'],
                        }) || 'Less than a minute'}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={severityConfig[incident.severity].color}
                    >
                      {incident.severity}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={statusConfig[incident.status].color}
                    >
                      {statusConfig[incident.status].label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="mb-3 text-xl font-semibold">{selected.title}</h3>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className={severityConfig[selected.severity].color}
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {selected.severity}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={statusConfig[selected.status].color}
                  >
                    {React.createElement(statusConfig[selected.status].icon, {
                      className: 'mr-1 h-3 w-3',
                    })}
                    {statusConfig[selected.status].label}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg border p-4">
                  <div className="text-muted-foreground mb-1 text-sm font-medium">
                    Started
                  </div>
                  <div className="text-sm font-semibold">
                    {new Date(selected.startedAt).toLocaleString()}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {formatDistanceToNow(new Date(selected.startedAt), {
                      addSuffix: true,
                      includeSeconds: true,
                    })}
                  </div>
                </div>

                {selected.resolvedAt ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <div className="text-muted-foreground mb-1 text-sm font-medium">
                      Resolved
                    </div>
                    <div className="text-sm font-semibold">
                      {new Date(selected.resolvedAt).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {formatDistanceToNow(new Date(selected.resolvedAt), {
                        addSuffix: true,
                        includeSeconds: true,
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <div className="text-muted-foreground mb-1 text-sm font-medium">
                      Status
                    </div>
                    <div className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Still Ongoing
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      Not yet resolved
                    </div>
                  </div>
                )}
              </div>

              {/* Duration */}
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground mb-2 text-sm font-medium">
                  Incident Duration
                </div>
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
                        })
                    return (
                      formatDuration(duration, {
                        format: ['days', 'hours', 'minutes'],
                      }) || 'Less than a minute'
                    )
                  })()}
                </div>
              </div>

              {/* Affected Monitor */}
              {selected.monitor && (
                <div className="bg-muted/30 rounded-lg border p-4">
                  <div className="text-muted-foreground mb-2 text-sm font-medium">
                    Affected Monitor
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {selected.monitor.name || 'Unnamed Monitor'}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <ExternalLink className="h-3 w-3" />
                      <a
                        href={selected.monitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:underline"
                      >
                        {selected.monitor.url}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Note about error details */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950">
                <div className="flex gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      Incident Type:{' '}
                      {selected.status === 'RESOLVED'
                        ? 'Service Disruption'
                        : 'Active Outage'}
                    </div>
                    <div className="mt-1 text-blue-700 dark:text-blue-300">
                      The monitor was unreachable or returned an unexpected
                      response during this period.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
