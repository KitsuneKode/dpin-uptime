'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { MetricsCards } from './metrics-cards'
import { MonitorTable } from './monitor-table'
import { MonitorForm } from '@/components/monitors'
import { RecentIncidents } from './recent-incidents'
import { useIncidents, useStatusPages } from '@/hooks/api'
import { Button } from '@dpin-uptime/ui/components/button'
import { SystemStatusBanner } from './system-status-banner'
import { ResponseTimeAreaChart } from './response-time-area-chart'
import { Plus, ArrowUpRight, AlertTriangle, Globe } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@dpin-uptime/ui/components/dialog'

export function DashboardOverview() {
  const router = useRouter()
  const [createMonitorOpen, setCreateMonitorOpen] = React.useState(false)

  const { data: incidentsResponse } = useIncidents({ limit: 3 })
  const { data: statusPagesResponse } = useStatusPages()

  const activeIncidents =
    incidentsResponse?.data?.filter((i) => i.status !== 'RESOLVED') || []
  const statusPages = statusPagesResponse?.data || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your services and track uptime performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/status-pages')}
          >
            <Globe className="mr-2 h-4 w-4" />
            Status Pages
          </Button>
          <Button onClick={() => setCreateMonitorOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Monitor
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <SystemStatusBanner />

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Active Incidents Alert */}
      {activeIncidents.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-900 dark:text-red-100">
                Active Incidents ({activeIncidents.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeIncidents.slice(0, 2).map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-red-800 dark:text-red-200">
                    {incident.title}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/dashboard/incidents')}
                  >
                    View Details
                  </Button>
                </div>
              ))}
              {activeIncidents.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => router.push('/dashboard/incidents')}
                >
                  View All {activeIncidents.length} Incidents
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monitor Status Table */}
      <MonitorTable
        limit={8}
        onCreateMonitor={() => setCreateMonitorOpen(true)}
      />

      {/* Charts and Incidents Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Response Time Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ResponseTimeAreaChart />
        </div>

        {/* Recent Incidents - Takes 1 column */}
        <div className="lg:col-span-1">
          <RecentIncidents />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => setCreateMonitorOpen(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Plus className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Create Monitor</h3>
                <p className="text-muted-foreground text-sm">
                  Add a new service to monitor
                </p>
              </div>
              <ArrowUpRight className="text-muted-foreground ml-auto h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => router.push('/dashboard/status-pages')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Status Page</h3>
                <p className="text-muted-foreground text-sm">
                  {statusPages.length > 0
                    ? `Manage ${statusPages.length} page${statusPages.length > 1 ? 's' : ''}`
                    : 'Create public status page'}
                </p>
              </div>
              <ArrowUpRight className="text-muted-foreground ml-auto h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => router.push('/dashboard/incidents')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Incidents</h3>
                <p className="text-muted-foreground text-sm">
                  {activeIncidents.length > 0
                    ? `${activeIncidents.length} active`
                    : 'View incident history'}
                </p>
              </div>
              <ArrowUpRight className="text-muted-foreground ml-auto h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Monitor Modal */}
      <Dialog open={createMonitorOpen} onOpenChange={setCreateMonitorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Monitor</DialogTitle>
          </DialogHeader>
          <MonitorForm
            onSuccess={() => setCreateMonitorOpen(false)}
            onCancel={() => setCreateMonitorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
