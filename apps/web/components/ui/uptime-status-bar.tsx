'use client';

import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@dpin-uptime/ui/components/tooltip';
import type { WebsiteTick } from '@/lib/types';

interface UptimeStatusBarProps {
  ticks: WebsiteTick[];
  days?: number;
  showLabels?: boolean;
}

interface DayStatus {
  date: Date;
  status: 'up' | 'down' | 'degraded' | 'no-data';
  uptime: number;
  incidents: number;
}

/**
 * Uptime status bar component showing daily uptime status like BetterUptime
 * Shows colored bars for each day indicating uptime status
 */
export function UptimeStatusBar({ ticks, days = 90, showLabels = true }: UptimeStatusBarProps) {
  // Group ticks by day and calculate uptime
  const dayStatuses = useMemo(() => {
    const statuses: DayStatus[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      // Get ticks for this day
      const dayTicks = ticks.filter(tick => {
        const tickDate = new Date(tick.createdAt);
        return tickDate >= date && tickDate < nextDay;
      });

      if (dayTicks.length === 0) {
        statuses.push({
          date,
          status: 'no-data',
          uptime: 0,
          incidents: 0,
        });
        continue;
      }

      // Calculate uptime percentage
      const goodTicks = dayTicks.filter(t => t.status === 'Good').length;
      const uptime = (goodTicks / dayTicks.length) * 100;

      // Count status changes (potential incidents)
      let incidents = 0;
      for (let j = 1; j < dayTicks.length; j++) {
        const currentTick = dayTicks[j];
        const previousTick = dayTicks[j - 1];
        if (currentTick && previousTick && currentTick.status === 'Bad' && previousTick.status === 'Good') {
          incidents++;
        }
      }

      // Determine overall status
      let status: 'up' | 'down' | 'degraded' | 'no-data';
      if (uptime === 100) {
        status = 'up';
      } else if (uptime >= 80) {
        status = 'degraded';
      } else {
        status = 'down';
      }

      statuses.push({
        date,
        status,
        uptime,
        incidents,
      });
    }

    return statuses;
  }, [ticks, days]);

  // Calculate overall uptime
  const overallUptime = useMemo(() => {
    const daysWithData = dayStatuses.filter(d => d.status !== 'no-data');
    if (daysWithData.length === 0) return 0;

    const totalUptime = daysWithData.reduce((sum, day) => sum + day.uptime, 0);
    return totalUptime / daysWithData.length;
  }, [dayStatuses]);

  const getBarColor = (status: DayStatus['status']) => {
    switch (status) {
      case 'up':
        return 'bg-green-500 hover:bg-green-600';
      case 'degraded':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'down':
        return 'bg-red-500 hover:bg-red-600';
      case 'no-data':
        return 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        {showLabels && (
          <>
            <div className="text-muted-foreground">
              {days} days ago
            </div>
            <div className="font-medium">
              {overallUptime.toFixed(2)}% uptime
            </div>
            <div className="text-muted-foreground">
              Today
            </div>
          </>
        )}
      </div>

      <TooltipProvider>
        <div className="flex gap-[2px]">
          {dayStatuses.map((day, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={`flex-1 h-8 rounded-sm cursor-pointer transition-colors ${getBarColor(day.status)}`}
                  style={{ minWidth: '2px' }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div className="font-medium">{formatDate(day.date)}</div>
                  {day.status === 'no-data' ? (
                    <div className="text-sm text-muted-foreground">No data</div>
                  ) : (
                    <>
                      <div className="text-sm">
                        Uptime: <span className="font-medium">{day.uptime.toFixed(2)}%</span>
                      </div>
                      {day.incidents > 0 && (
                        <div className="text-sm text-red-400">
                          {day.incidents} incident{day.incidents > 1 ? 's' : ''}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
