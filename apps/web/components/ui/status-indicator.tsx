import { cn } from '@dpin-uptime/ui/lib/utils';
import type { MonitorStatus } from '@/lib/types';

interface StatusIndicatorProps {
  status: MonitorStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const statusConfig = {
  up: {
    color: 'bg-emerald-500',
    text: 'Operational',
    textColor: 'text-emerald-600',
  },
  down: {
    color: 'bg-red-500',
    text: 'Down',
    textColor: 'text-red-600',
  },
  degraded: {
    color: 'bg-amber-500',
    text: 'Degraded',
    textColor: 'text-amber-600',
  },
  paused: {
    color: 'bg-gray-400',
    text: 'Paused',
    textColor: 'text-gray-600',
  },
} as const;

const sizeConfig = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
} as const;

export function StatusIndicator({ 
  status, 
  size = 'md', 
  showText = false, 
  className 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full',
          config.color,
          sizeClass,
          status === 'up' && 'animate-pulse'
        )}
        aria-label={`Status: ${config.text}`}
      />
      {showText && (
        <span className={cn('text-sm font-medium', config.textColor)}>
          {config.text}
        </span>
      )}
    </div>
  );
}
