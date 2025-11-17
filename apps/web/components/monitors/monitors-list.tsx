'use client'

import { useState } from 'react'
import type { Monitor } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { Input } from '@dpin-uptime/ui/components/input'
import { Button } from '@dpin-uptime/ui/components/button'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import { StatusIndicator } from '@/components/ui/status-indicator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'
import {
  useMonitors,
  usePauseMonitor,
  useResumeMonitor,
  useDeleteMonitor,
} from '@/hooks/api'
import {
  Search,
  Plus,
  MoreHorizontal,
  Pause,
  Play,
  Settings,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@dpin-uptime/ui/components/dropdown-menu'

interface MonitorsListProps {
  onCreateMonitor?: () => void
  onEditMonitor?: (monitor: Monitor) => void
  onViewDetails?: (monitor: Monitor) => void
}

export function MonitorsList({
  onCreateMonitor,
  onEditMonitor,
  onViewDetails,
}: MonitorsListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: monitorsResponse, isLoading } = useMonitors({
    search: search || undefined,
    status: statusFilter || undefined,
    limit: 50,
  })

  const pauseMonitor = usePauseMonitor()
  const resumeMonitor = useResumeMonitor()
  const deleteMonitor = useDeleteMonitor()

  const monitors = monitorsResponse?.websites || []

  const handlePauseResume = async (monitor: Monitor) => {
    try {
      if (monitor.status === 'paused') {
        await resumeMonitor.mutateAsync(monitor.id)
      } else {
        await pauseMonitor.mutateAsync(monitor.id)
      }
    } catch (error) {
      console.error('Failed to pause/resume monitor:', error)
    }
  }

  const handleDelete = async (monitor: Monitor) => {
    if (window.confirm(`Are you sure you want to delete "${monitor.name}"?`)) {
      try {
        await deleteMonitor.mutateAsync(monitor.id)
      } catch (error) {
        console.error('Failed to delete monitor:', error)
      }
    }
  }

  const getUptimeColor = (percentage: number) => {
    if (percentage >= 99.9) return 'text-green-600'
    if (percentage >= 99) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monitors</CardTitle>
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8" />
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
          <CardTitle>Monitors</CardTitle>
          <Button onClick={onCreateMonitor}>
            <Plus className="mr-2 h-4 w-4" />
            Create Monitor
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search monitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="degraded">Degraded</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {monitors.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-muted-foreground mb-4">
              {search || statusFilter
                ? 'No monitors match your filters'
                : 'No monitors created yet'}
            </div>
            {!search && !statusFilter && (
              <Button onClick={onCreateMonitor}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first monitor
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {monitors.map((monitor) => (
              <div
                onClick={() => onViewDetails?.(monitor)}
                key={monitor.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <StatusIndicator status={monitor.status} size="md" />

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3
                        className="text-foreground hover:text-primary cursor-pointer font-medium"
                        onClick={() => onViewDetails?.(monitor)}
                      >
                        {monitor.name}
                      </h3>
                      <ExternalLink
                        className="text-muted-foreground hover:text-foreground h-3 w-3 cursor-pointer"
                        onClick={() => window.open(monitor.url, '_blank')}
                      />
                    </div>
                    <p className="text-muted-foreground truncate text-sm">
                      {monitor.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
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
                    <div
                      className={`text-sm font-medium ${getUptimeColor(monitor.uptime.percentage)}`}
                    >
                      {monitor.uptime.percentage.toFixed(2)}%
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {monitor.uptime.current}
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {monitor.interval}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onViewDetails?.(monitor)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEditMonitor?.(monitor)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePauseResume(monitor)}
                      >
                        {monitor.status === 'paused' ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(monitor)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
