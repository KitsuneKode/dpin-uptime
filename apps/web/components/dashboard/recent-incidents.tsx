'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'

import { useIncidents } from '@/hooks/api'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react'

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

export function RecentIncidents() {
  const { data: incidentsResponse, isLoading } = useIncidents({
    limit: 5,
    // Show recent incidents (both active and recently resolved)
  })

  const incidents = incidentsResponse?.data || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="mt-1 h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (incidents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
            <h3 className="text-foreground mb-2 text-lg font-medium">
              All systems operational
            </h3>
            <p className="text-muted-foreground text-sm">
              No recent incidents to report
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incidents.map((incident) => {
          const SeverityIcon = severityConfig[incident.severity].icon
          const StatusIcon = statusConfig[incident.status].icon

          return (
            <div
              key={incident.id}
              className="border-border flex items-start space-x-3 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <StatusIndicator
                status={incident.status === 'RESOLVED' ? 'up' : 'down'}
                size="sm"
                className="mt-1"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-foreground line-clamp-2 text-sm font-medium">
                    {incident.title}
                  </h4>
                  <div className="flex flex-shrink-0 gap-1">
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
                </div>

                {incident.monitor && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {incident.monitor.name || incident.monitor.url}
                  </p>
                )}

                <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                  <span>
                    Started{' '}
                    {formatDistanceToNow(new Date(incident.startedAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {incident.resolvedAt && (
                    <span>
                      Resolved{' '}
                      {formatDistanceToNow(new Date(incident.resolvedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
