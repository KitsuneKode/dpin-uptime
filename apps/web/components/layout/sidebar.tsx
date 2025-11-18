'use client'

import Link from 'next/link'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@dpin-uptime/ui/lib/utils'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { useIncidents, useDashboardMetrics } from '@/hooks/api'
import {
  LayoutDashboard,
  Monitor,
  AlertTriangle,
  Globe,
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  Zap,
  Wallet,
  Shield,
} from 'lucide-react'

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
    name: 'Validator',
    href: '/validator',
    icon: Wallet,
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
]

const bottomNavigation = [
  {
    name: 'Admin',
    href: '/dashboard/admin/validators',
    icon: Shield,
  },
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
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: metricsResponse } = useDashboardMetrics()
  const { data: incidentsResponse } = useIncidents({ status: 'OPEN' })

  const metrics = metricsResponse?.data
  const activeIncidents = incidentsResponse?.data?.length || 0

  const getBadgeValue = (badgeType: string) => {
    switch (badgeType) {
      case 'activeIncidents':
        return activeIncidents > 0 ? activeIncidents : null
      default:
        return null
    }
  }

  return (
    <div className="bg-background flex h-full w-64 flex-col border-r">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="group flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
            <Zap className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="text-lg font-semibold transition-colors group-hover:text-primary">
            Uptime
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const badgeValue = item.badge ? getBadgeValue(item.badge) : null

            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : item.disabled
                      ? 'text-muted-foreground cursor-not-allowed opacity-60'
                      : 'text-foreground hover:bg-muted hover:text-foreground hover:translate-x-1',
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
            )
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
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : item.disabled
                    ? 'text-muted-foreground cursor-not-allowed opacity-60'
                    : 'text-foreground hover:bg-muted hover:text-foreground hover:translate-x-1',
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
        <div className="bg-muted rounded-lg p-3 transition-all duration-200 hover:shadow-md hover:bg-muted/80">
          <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            System Status
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground">Monitors:</span>
              <span className="font-semibold tabular-nums">{metrics?.totalMonitors || 0}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-semibold tabular-nums">
                {metrics ? `${metrics.overallUptime.toFixed(2)}%` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground">Incidents:</span>
              <span
                className={cn(
                  'font-semibold tabular-nums flex items-center gap-1',
                  activeIncidents > 0 ? 'text-red-600' : 'text-green-600',
                )}
              >
                <span className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  activeIncidents > 0 ? 'bg-red-600 animate-pulse' : 'bg-green-600'
                )}/>
                {activeIncidents}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
