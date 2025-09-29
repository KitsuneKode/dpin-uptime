'use client'

import { Card } from '@dpin-uptime/ui/components/card'
import { motion, useReducedMotion, Variants } from 'motion/react'
import {
  Globe,
  Zap,
  Shield,
  Bell,
  BarChart3,
  Smartphone,
  Clock,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'Global Monitoring',
    description:
      'Monitor from 12+ locations worldwide with 30-second intervals',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get alerts within seconds of downtime detection',
  },
  {
    icon: Shield,
    title: 'SSL Monitoring',
    description: 'Track SSL certificate expiration and security issues',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Email, SMS, Slack, webhook, and mobile push notifications',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description:
      'Response time trends, uptime reports, and performance insights',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description:
      'Native mobile apps for iOS and Android with full functionality',
  },
  {
    icon: Clock,
    title: '24/7 Monitoring',
    description: 'Round-the-clock monitoring with 99.9% uptime guarantee',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Share dashboards, manage team access, and collaborate effectively',
  },
]

export function Features() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
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

  const tabletVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, rotateY: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-3xl font-bold lg:text-4xl">
                Everything you need to monitor with confidence
              </h2>
              <p className="text-muted-foreground text-lg">
                Comprehensive monitoring tools designed for modern applications.
                From simple website checks to complex API monitoring.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }
                    }
                    className="bg-background/50 border-border/50 hover:bg-background/80 flex items-start space-x-3 rounded-lg border p-4 transition-colors"
                  >
                    <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <Icon className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Tablet Visual */}
          <motion.div
            variants={tabletVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    scale: 1.02,
                    rotateY: 2,
                    transition: { duration: 0.3 },
                  }
            }
            className="relative"
          >
            <Card className="bg-card/80 border-border/50 perspective-1000 rotate-y-2 transform p-8 shadow-2xl backdrop-blur-sm">
              {/* Tablet frame */}
              <div className="bg-muted/20 border-border/30 rounded-lg border p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-muted-foreground text-xs">
                    monitoring.app
                  </div>
                </div>

                {/* Sidebar */}
                <div className="flex space-x-4">
                  <div className="w-16 space-y-2">
                    <div className="bg-primary/20 h-8 rounded" />
                    <div className="bg-muted/50 h-6 rounded" />
                    <div className="bg-muted/50 h-6 rounded" />
                    <div className="bg-muted/50 h-6 rounded" />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 space-y-4">
                    {/* Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-primary/10 border-primary/20 h-16 rounded border p-2"
                      >
                        <div className="bg-primary mb-1 h-4 w-4 rounded" />
                        <div className="bg-primary/50 h-2 w-3/4 rounded" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-muted/50 h-16 rounded p-2"
                      >
                        <div className="bg-muted mb-1 h-4 w-4 rounded" />
                        <div className="bg-muted h-2 w-2/3 rounded" />
                      </motion.div>
                    </div>

                    {/* Chart area */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      className="bg-muted/30 relative h-20 overflow-hidden rounded"
                    >
                      <svg className="h-full w-full" viewBox="0 0 200 80">
                        <motion.path
                          d="M 10 60 Q 50 40 100 30 T 190 20"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 1.2 }}
                        />
                      </svg>
                    </motion.div>

                    {/* Status list */}
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="bg-primary h-2 w-2 rounded-full" />
                          <div className="bg-muted/50 h-2 flex-1 rounded" />
                          <div className="bg-primary/30 h-2 w-8 rounded" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating notification */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="bg-primary text-primary-foreground absolute -right-4 -bottom-4 max-w-xs rounded-lg p-3 shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Service restored</div>
                  <div className="text-xs opacity-90">
                    api.example.com is back online
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
