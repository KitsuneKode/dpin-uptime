'use client'

import { Card } from '@dpin-uptime/ui/components/card'
import { CheckCircle, Clock, Globe } from 'lucide-react'
import { Variants, motion, useReducedMotion } from 'motion/react'

export function HeroVisual() {
  const shouldReduceMotion = useReducedMotion()

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const floatingVariants: Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          y: [-5, 5, -5],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
  }

  const pulseVariants: Variants = {
    animate: shouldReduceMotion
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
    <div className="relative">
      {/* Main dashboard card */}
      <motion.div
        variants={cardVariants}
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                rotateY: 2,
                rotateX: 2,
                transition: { duration: 0.3 },
              }
        }
        className="relative z-10"
      >
        <Card className="bg-card/80 border-border/50 p-6 shadow-2xl backdrop-blur-sm">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">System Status</h3>
              <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Last updated: 2s ago</span>
              </div>
            </div>

            {/* Status indicators */}
            <div className="space-y-3">
              <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <motion.div variants={pulseVariants} animate="animate">
                    <CheckCircle className="text-primary h-5 w-5" />
                  </motion.div>
                  <div>
                    <p className="font-medium">API Gateway</p>
                    <p className="text-muted-foreground text-sm">
                      api.example.com
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-medium">99.9%</p>
                  <p className="text-muted-foreground text-sm">24h uptime</p>
                </div>
              </div>

              <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-primary h-5 w-5" />
                  <div>
                    <p className="font-medium">Web Application</p>
                    <p className="text-muted-foreground text-sm">
                      app.example.com
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-medium">100%</p>
                  <p className="text-muted-foreground text-sm">24h uptime</p>
                </div>
              </div>

              <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-primary h-5 w-5" />
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-muted-foreground text-sm">
                      db.example.com
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-medium">99.8%</p>
                  <p className="text-muted-foreground text-sm">24h uptime</p>
                </div>
              </div>
            </div>

            {/* Response time chart placeholder */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">Response Time</p>
                <p className="text-muted-foreground text-sm">Last 24 hours</p>
              </div>
              <div className="bg-muted/30 relative h-20 overflow-hidden rounded-lg">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="from-primary/20 to-primary/40 absolute bottom-0 left-0 h-full rounded-lg bg-gradient-to-r"
                />
                <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 60 + 20}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 1 }}
                      className="bg-primary w-1 rounded-t"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Floating metric chips */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute -top-4 -right-4 z-20"
      >
        <Card className="bg-card/90 border-border/50 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Globe className="text-primary h-4 w-4" />
            <div>
              <p className="text-sm font-medium">12 Locations</p>
              <p className="text-muted-foreground text-xs">Monitoring</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '1s' }}
        className="absolute -bottom-6 -left-4 z-20"
      >
        <Card className="bg-card/90 border-border/50 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-primary h-4 w-4" />
            <div>
              <p className="text-sm font-medium">99.9% SLA</p>
              <p className="text-muted-foreground text-xs">Guaranteed</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Background glow */}
      <div className="from-primary/10 absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br via-transparent to-transparent blur-3xl" />
    </div>
  )
}
