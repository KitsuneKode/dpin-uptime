'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@dpin-uptime/ui/lib/utils';
import { Badge } from '@dpin-uptime/ui/components/badge';
import { useIncidents, useDashboardMetrics } from '@/hooks/api';
import { 
  LayoutDashboard, 
  Monitor, 
  AlertTriangle, 
  Globe, 
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  Zap
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Monitors',
    href: '/dashboard/monitors',
    icon: Monitor,
  },
  {
    name: 'Incidents',
    href: '/dashboard/incidents',
    icon: AlertTriangle,
    badge: 'activeIncidents',
  },
  {
    name: 'Status Pages',
    href: '/dashboard/status-pages',
    icon: Globe,
  },
  {
    name: 'Heartbeats',
    href: '/dashboard/heartbeats',
    icon: Activity,
    disabled: true,
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    disabled: true,
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    disabled: true,
  },
  {
    name: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
    disabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: metricsResponse } = useDashboardMetrics();
  const { data: incidentsResponse } = useIncidents({ status: 'investigating' });
  
  const metrics = metricsResponse?.data;
  const activeIncidents = incidentsResponse?.data?.length || 0;

  const getBadgeValue = (badgeType: string) => {
    switch (badgeType) {
      case 'activeIncidents':
        return activeIncidents > 0 ? activeIncidents : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">Uptime</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const badgeValue = item.badge ? getBadgeValue(item.badge) : null;

            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : item.disabled
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {badgeValue && (
                  <Badge 
                    variant={isActive ? 'secondary' : 'destructive'} 
                    className="h-5 px-1.5 text-xs"
                  >
                    {badgeValue}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t p-4">
        <div className="space-y-1">
          {bottomNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                item.disabled
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-foreground hover:bg-muted hover:text-foreground'
              )}
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            System Status
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Monitors:</span>
              <span className="font-medium">{metrics?.totalMonitors || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="font-medium">
                {metrics ? `${metrics.overallUptime.toFixed(2)}%` : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Incidents:</span>
              <span className={cn(
                'font-medium',
                activeIncidents > 0 ? 'text-red-600' : 'text-green-600'
              )}>
                {activeIncidents}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
