'use client'

import { cn } from '@dpin-uptime/ui/lib/utils'
import { motion, useReducedMotion, Variants } from 'motion/react'

interface AnimatedBadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  animate?: boolean
}

export function AnimatedBadge({
  children,
  className,
  variant = 'default',
  animate = true,
}: AnimatedBadgeProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-600 border-red-500/20',
  }

  const pulseVariants: Variants = {
    animate:
      shouldReduceMotion || !animate
        ? {}
        : {
            scale: [1, 1.05, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
  }

  return (
    <motion.div
      variants={pulseVariants}
      animate="animate"
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
