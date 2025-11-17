'use client'

import * as React from 'react'
import { useMonitors } from '@/hooks/api'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@dpin-uptime/ui/components/button'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import { ExternalLink, ArrowUpRight, Plus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'

interface MonitorTableProps {
  limit?: number
  showActions?: boolean
  onCreateMonitor?: () => void
}

export function MonitorTable({
  limit = 5,
  showActions = true,
  onCreateMonitor,
}: MonitorTableProps) {
  const router = useRouter()
  const { data: monitorsResponse, isLoading } = useMonitors({
    limit,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  })
  const monitors = monitorsResponse?.websites || []

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
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3"
              >
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
    )
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
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  onCreateMonitor
                    ? onCreateMonitor()
                    : router.push('/dashboard/monitors')
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Monitor
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {monitors.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <div className="mb-4">No monitors configured yet</div>
            <Button
              onClick={() =>
                onCreateMonitor
                  ? onCreateMonitor()
                  : router.push('/dashboard/monitors')
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your first monitor
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors"
                onClick={() => router.push(`/dashboard/monitors/${monitor.id}`)}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="text-foreground truncate font-medium">
                        {monitor.name}
                      </h4>
                      <ExternalLink
                        className="text-muted-foreground hover:text-foreground h-3 w-3 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(monitor.url, '_blank')
                        }}
                      />
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {monitor.url}
                    </p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {monitor.responseTime}ms
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(monitor.lastChecked), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {monitor.uptime.percentage.toFixed(2)}%
                    </div>
                    <div className="text-muted-foreground text-xs">uptime</div>
                  </div>

                  <StatusBadge status={monitor.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
