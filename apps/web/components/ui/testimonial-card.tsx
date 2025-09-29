'use client'

import { Star } from 'lucide-react'
import { Card } from '@dpin-uptime/ui/components/card'
import { motion, useReducedMotion, Variants } from 'motion/react'

interface TestimonialCardProps {
  content: string
  author: string
  role: string
  company: string
  avatar: string
  rating: number
  className?: string
}

export function TestimonialCard({
  content,
  author,
  role,
  company,
  avatar,
  rating,
  className,
}: TestimonialCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              scale: 1.02,
              transition: { duration: 0.2 },
            }
      }
      className={className}
    >
      <Card className="bg-card/80 border-border/50 h-full p-6 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
        <div className="space-y-4">
          <div className="flex space-x-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="fill-primary text-primary h-4 w-4" />
            ))}
          </div>
          <blockquote className="text-muted-foreground leading-relaxed">
            "{content}"
          </blockquote>
          <div className="flex items-center space-x-3">
            <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
              {avatar}
            </div>
            <div>
              <p className="text-sm font-medium">{author}</p>
              <p className="text-muted-foreground text-xs">
                {role} at {company}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
