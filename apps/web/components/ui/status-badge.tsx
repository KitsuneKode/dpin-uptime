import { Badge } from '@dpin-uptime/ui/components/badge';
import { StatusIndicator } from './status-indicator';
import { cn } from '@dpin-uptime/ui/lib/utils';
import type { MonitorStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: MonitorStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

const statusConfig = {
  up: {
    variant: 'default' as const,
    text: 'Operational',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200',
  },
  down: {
    variant: 'destructive' as const,
    text: 'Down',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200',
  },
  degraded: {
    variant: 'secondary' as const,
    text: 'Degraded',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200',
  },
  paused: {
    variant: 'outline' as const,
    text: 'Paused',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200',
  },
} as const;

export function StatusBadge({ 
  status, 
  size = 'md', 
  showDot = true, 
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'flex items-center gap-1.5 font-medium',
        config.className,
        className
      )}
    >
      {showDot && <StatusIndicator status={status} size="sm" />}
      <span>{config.text}</span>
    </Badge>
  );
}
