'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@dpin-uptime/ui/lib/utils'
import { motion, useReducedMotion, Variants } from 'motion/react'

interface FeatureItemProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function FeatureItem({
  icon: Icon,
  title,
  description,
  className,
}: FeatureItemProps) {
  const shouldReduceMotion = useReducedMotion()

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
        'bg-card/50 border-border/50 hover:bg-card/80 flex items-start space-x-3 rounded-lg border p-4 transition-colors',
        className,
      )}
    >
      <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </motion.div>
  )
}
