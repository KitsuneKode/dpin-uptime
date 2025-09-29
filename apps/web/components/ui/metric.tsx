'use client'

import { cn } from '@dpin-uptime/ui/lib/utils'
import { motion, useReducedMotion, Variants } from 'motion/react'

interface MetricProps {
  value: string | number
  label: string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function Metric({
  value,
  label,
  description,
  trend,
  className,
}: MetricProps) {
  const shouldReduceMotion = useReducedMotion()

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              scale: 1.02,
              transition: { duration: 0.2 },
            }
      }
      className={cn(
        'bg-card rounded-lg border p-4 text-center shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className={cn('text-2xl font-bold', trend && trendColors[trend])}>
        {value}
      </div>
      <div className="text-foreground text-sm font-medium">{label}</div>
      {description && (
        <div className="text-muted-foreground mt-1 text-xs">{description}</div>
      )}
    </motion.div>
  )
}
