import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { cn } from '@dpin-uptime/ui/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  down: {
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950',
  },
  neutral: {
    icon: Minus,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
  },
} as const;

export function MetricCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
  className,
  isLoading = false,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  const trendIcon = trend ? trendConfig[trend].icon : null;
  const TrendIcon = trendIcon;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {trend && TrendIcon && (
              <div className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded-full',
                trendConfig[trend].bgColor
              )}>
                <TrendIcon className={cn('h-3 w-3', trendConfig[trend].color)} />
                {trendValue && (
                  <span className={trendConfig[trend].color}>
                    {trendValue}
                  </span>
                )}
              </div>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
