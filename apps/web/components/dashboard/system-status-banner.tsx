'use client';

import * as React from 'react';
import { Card, CardContent } from '@dpin-uptime/ui/components/card';
import { useDashboardMetrics, useIncidents } from '@/hooks/api';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export function SystemStatusBanner() {
  const { data: metricsResponse } = useDashboardMetrics();
  const { data: incidentsResponse } = useIncidents({ limit: 5 });
  
  const metrics = metricsResponse?.data;
  const activeIncidents = incidentsResponse?.data?.filter(i => i.status !== 'resolved') || [];
  
  const systemStatus = activeIncidents.length === 0 ? 'operational' : 
    activeIncidents.some(i => i.severity === 'critical') ? 'major-outage' :
    activeIncidents.some(i => i.severity === 'major') ? 'partial-outage' : 'degraded';

  const statusConfig = {
    operational: {
      icon: CheckCircle,
      text: 'All Systems Operational',
      description: 'All services are running smoothly',
      className: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
      textColor: 'text-emerald-800 dark:text-emerald-200',
      iconColor: 'text-emerald-600',
    },
    degraded: {
      icon: Clock,
      text: 'Degraded Performance',
      description: 'Some services may be slower than usual',
      className: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      iconColor: 'text-yellow-600',
    },
    'partial-outage': {
      icon: AlertTriangle,
      text: 'Partial System Outage',
      description: 'Some services are experiencing issues',
      className: 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800',
      textColor: 'text-orange-800 dark:text-orange-200',
      iconColor: 'text-orange-600',
    },
    'major-outage': {
      icon: AlertTriangle,
      text: 'Major System Outage',
      description: 'Multiple services are affected',
      className: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600',
    },
  };

  const config = statusConfig[systemStatus];
  const StatusIcon = config.icon;

  return (
    <Card className={`${config.className} border-2`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-6 w-6 ${config.iconColor}`} />
            <div>
              <h3 className={`font-semibold ${config.textColor}`}>
                {config.text}
              </h3>
              <p className={`text-sm ${config.textColor} opacity-80`}>
                {config.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            {metrics && (
              <>
                <div className="text-center">
                  <div className={`font-semibold ${config.textColor}`}>
                    {metrics.overallUptime.toFixed(4)}%
                  </div>
                  <div className={`text-xs ${config.textColor} opacity-70`}>
                    Uptime
                  </div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${config.textColor}`}>
                    {metrics.avgResponseTime}ms
                  </div>
                  <div className={`text-xs ${config.textColor} opacity-70`}>
                    Avg Response
                  </div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${config.textColor}`}>
                    {activeIncidents.length}
                  </div>
                  <div className={`text-xs ${config.textColor} opacity-70`}>
                    Active Issues
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
