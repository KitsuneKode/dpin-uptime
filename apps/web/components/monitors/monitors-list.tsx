'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Input } from '@dpin-uptime/ui/components/input';
import { Badge } from '@dpin-uptime/ui/components/badge';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@dpin-uptime/ui/components/dropdown-menu';
import { useMonitors, usePauseMonitor, useResumeMonitor, useDeleteMonitor } from '@/hooks/api';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { formatDistanceToNow } from 'date-fns';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Pause, 
  Play, 
  Settings, 
  Trash2,
  ExternalLink 
} from 'lucide-react';
import type { Monitor } from '@/lib/types';

interface MonitorsListProps {
  onCreateMonitor?: () => void;
  onEditMonitor?: (monitor: Monitor) => void;
  onViewDetails?: (monitor: Monitor) => void;
}

export function MonitorsList({ 
  onCreateMonitor, 
  onEditMonitor, 
  onViewDetails 
}: MonitorsListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: monitorsResponse, isLoading } = useMonitors({
    search: search || undefined,
    status: statusFilter || undefined,
    limit: 50,
  });

  const pauseMonitor = usePauseMonitor();
  const resumeMonitor = useResumeMonitor();
  const deleteMonitor = useDeleteMonitor();

  const monitors = monitorsResponse?.data || [];

  const handlePauseResume = async (monitor: Monitor) => {
    try {
      if (monitor.status === 'paused') {
        await resumeMonitor.mutateAsync(monitor.id);
      } else {
        await pauseMonitor.mutateAsync(monitor.id);
      }
    } catch (error) {
      console.error('Failed to pause/resume monitor:', error);
    }
  };

  const handleDelete = async (monitor: Monitor) => {
    if (window.confirm(`Are you sure you want to delete "${monitor.name}"?`)) {
      try {
        await deleteMonitor.mutateAsync(monitor.id);
      } catch (error) {
        console.error('Failed to delete monitor:', error);
      }
    }
  };

  const getUptimeColor = (percentage: number) => {
    if (percentage >= 99.9) return 'text-green-600';
    if (percentage >= 99) return 'text-yellow-600';
    return 'text-red-600';
  };

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
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monitors</CardTitle>
          <Button onClick={onCreateMonitor}>
            <Plus className="h-4 w-4 mr-2" />
            Create Monitor
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
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
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              {search || statusFilter ? 'No monitors match your filters' : 'No monitors created yet'}
            </div>
            {!search && !statusFilter && (
              <Button onClick={onCreateMonitor}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first monitor
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <StatusIndicator status={monitor.status} size="md" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 
                        className="font-medium text-foreground cursor-pointer hover:text-primary"
                        onClick={() => onViewDetails?.(monitor)}
                      >
                        {monitor.name}
                      </h3>
                      <ExternalLink 
                        className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => window.open(monitor.url, '_blank')}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {monitor.url}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {monitor.responseTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(monitor.lastChecked), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getUptimeColor(monitor.uptime.percentage)}`}>
                      {monitor.uptime.percentage.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
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
                      <DropdownMenuItem onClick={() => onViewDetails?.(monitor)}>
                        <Settings className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditMonitor?.(monitor)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePauseResume(monitor)}>
                        {monitor.status === 'paused' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(monitor)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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
  );
}
