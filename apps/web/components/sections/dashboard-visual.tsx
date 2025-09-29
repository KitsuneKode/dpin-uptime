'use client'

import { Card } from '@dpin-uptime/ui/components/card'
import { Button } from '@dpin-uptime/ui/components/button'
import { motion, useReducedMotion, Variants } from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

export function DashboardVisual() {
  const shouldReduceMotion = useReducedMotion()

  const random = Math.random()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const chartVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: 'easeInOut' },
        opacity: { duration: 0.5 },
      },
    },
  }

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold lg:text-4xl">
                Real-time insights at your fingertips
              </h2>
              <p className="text-muted-foreground text-lg">
                Monitor your entire infrastructure from a single dashboard. Get
                detailed analytics, performance metrics, and instant alerts when
                something needs your attention.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                  <CheckCircle className="text-primary h-3 w-3" />
                </div>
                <div>
                  <h3 className="font-semibold">Multi-location monitoring</h3>
                  <p className="text-muted-foreground text-sm">
                    Check your services from 12+ global locations simultaneously
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                  <TrendingUp className="text-primary h-3 w-3" />
                </div>
                <div>
                  <h3 className="font-semibold">Performance analytics</h3>
                  <p className="text-muted-foreground text-sm">
                    Track response times, uptime trends, and error rates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                  <AlertTriangle className="text-primary h-3 w-3" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart alerting</h3>
                  <p className="text-muted-foreground text-sm">
                    Get notified via email, SMS, Slack, or webhook integrations
                  </p>
                </div>
              </div>
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground group">
              Explore dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Dashboard Visual */}
          <motion.div variants={itemVariants} className="relative">
            <Card className="bg-card/80 border-border/50 p-6 shadow-2xl backdrop-blur-sm">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="text-primary h-5 w-5" />
                  <h3 className="font-semibold">Performance Overview</h3>
                </div>
                <div className="text-muted-foreground text-sm">Last 7 days</div>
              </div>

              {/* Chart */}
              <div className="relative mb-6 h-48">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 400 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid lines */}
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        opacity="0.1"
                      />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid)" />

                  {/* Response time line */}
                  <motion.path
                    d="M 20 160 Q 80 140 120 120 T 200 100 T 280 80 T 360 60"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    fill="none"
                    variants={chartVariants}
                    className="drop-shadow-sm"
                  />

                  {/* Uptime bars */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <motion.rect
                      suppressHydrationWarning
                      key={i}
                      x={40 + i * 45}
                      y={180 - (random * 20 + 15)}
                      width="8"
                      height={random * 20 + 15}
                      fill="hsl(var(--primary))"
                      opacity="0.6"
                      initial={{ height: 0, y: 180 }}
                      animate={{
                        height: random * 20 + 15,
                        y: 180 - (random * 20 + 15),
                      }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                    />
                  ))}

                  {/* Data points */}
                  {[
                    { x: 20, y: 160 },
                    { x: 120, y: 120 },
                    { x: 200, y: 100 },
                    { x: 280, y: 80 },
                    { x: 360, y: 60 },
                  ].map((point, i) => (
                    <motion.circle
                      key={i}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="hsl(var(--primary))"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.2 + 1 }}
                      className="drop-shadow-sm"
                    />
                  ))}
                </svg>

                {/* Floating metric */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="bg-primary/10 border-primary/20 absolute top-4 right-4 rounded-lg border p-2 backdrop-blur-sm"
                >
                  <div className="text-muted-foreground text-xs">
                    Avg Response
                  </div>
                  <div className="text-primary text-sm font-semibold">
                    142ms
                  </div>
                </motion.div>
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">99.9%</div>
                  <div className="text-muted-foreground text-xs">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">142ms</div>
                  <div className="text-muted-foreground text-xs">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">0</div>
                  <div className="text-muted-foreground text-xs">Incidents</div>
                </div>
              </div>
            </Card>

            {/* Floating status badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="bg-primary text-primary-foreground absolute -top-3 -right-3 rounded-full px-3 py-1 text-sm font-medium shadow-lg"
            >
              All systems operational
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
