'use client';

import * as React from 'react';
import { MetricsCards } from './metrics-cards';
import { ResponseTimeAreaChart } from './response-time-area-chart';
import { RecentIncidents } from './recent-incidents';
import { MonitorTable } from './monitor-table';
import { SystemStatusBanner } from './system-status-banner';
import { MonitorForm } from '@/components/monitors';
import { Button } from '@dpin-uptime/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@dpin-uptime/ui/components/dialog';
import { Plus, ArrowUpRight, AlertTriangle, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIncidents, useStatusPages } from '@/hooks/api';

export function DashboardOverview() {
  const router = useRouter();
  const [createMonitorOpen, setCreateMonitorOpen] = React.useState(false);
  
  const { data: incidentsResponse } = useIncidents({ limit: 3 });
  const { data: statusPagesResponse } = useStatusPages();
  
  const activeIncidents = incidentsResponse?.data?.filter(i => i.status !== 'resolved') || [];
  const statusPages = statusPagesResponse?.data || [];

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
            <Globe className="h-4 w-4 mr-2" />
            Status Pages
          </Button>
          <Button onClick={() => setCreateMonitorOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
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
                <div key={incident.id} className="flex items-center justify-between">
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
                  className="w-full mt-2"
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
      <MonitorTable limit={8} />

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
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setCreateMonitorOpen(true)}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Create Monitor</h3>
                <p className="text-sm text-muted-foreground">Add a new service to monitor</p>
              </div>
              <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/dashboard/status-pages')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Status Page</h3>
                <p className="text-sm text-muted-foreground">
                  {statusPages.length > 0 ? `Manage ${statusPages.length} page${statusPages.length > 1 ? 's' : ''}` : 'Create public status page'}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/dashboard/incidents')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Incidents</h3>
                <p className="text-sm text-muted-foreground">
                  {activeIncidents.length > 0 ? `${activeIncidents.length} active` : 'View incident history'}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
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
  );
}
