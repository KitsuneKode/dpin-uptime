'use client'

import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion, Variants } from 'motion/react'

interface MetricProps {
  value: string
  label: string
  description: string
  delay?: number
}

function AnimatedCounter({
  value,
  delay = 0,
}: {
  value: string
  delay?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isInView) return

    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''))
    if (isNaN(numericValue)) return

    const timer = setTimeout(() => {
      let start = 0
      const duration = shouldReduceMotion ? 100 : 2000
      const increment = numericValue / (duration / 16)

      const counter = setInterval(() => {
        start += increment
        if (start >= numericValue) {
          setCount(numericValue)
          clearInterval(counter)
        } else {
          setCount(start)
        }
      }, 16)

      return () => clearInterval(counter)
    }, delay)

    return () => clearTimeout(timer)
  }, [isInView, value, delay, shouldReduceMotion])

  const formatValue = (num: number) => {
    if (value.includes('%')) {
      return `${num.toFixed(1)}%`
    }
    if (value.includes('ms')) {
      return `${Math.round(num)}ms`
    }
    if (value.includes('M')) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (value.includes('K')) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return Math.round(num).toLocaleString()
  }

  return <span ref={ref}>{formatValue(count)}</span>
}

function Metric({ value, label, description, delay = 0 }: MetricProps) {
  const shouldReduceMotion = useReducedMotion()

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay,
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
      className="bg-card/50 border-border/50 hover:bg-card/70 space-y-2 rounded-lg border p-6 text-center backdrop-blur-sm transition-colors"
    >
      <div className="text-primary text-3xl font-bold lg:text-4xl">
        <AnimatedCounter value={value} delay={delay} />
      </div>
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-muted-foreground mx-auto max-w-xs text-sm">
        {description}
      </div>
    </motion.div>
  )
}

const metrics = [
  {
    value: '99.9%',
    label: 'Uptime',
    description: 'Average uptime across all monitored services',
  },
  {
    value: '50K',
    label: 'Checks',
    description: 'Monitoring checks performed daily',
  },
  {
    value: '120ms',
    label: 'Response Time',
    description: 'Average response time globally',
  },
  {
    value: '10K',
    label: 'Subscribers',
    description: 'Active monitoring subscribers',
  },
]

export function Metrics() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
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
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Trusted by thousands worldwide
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Our monitoring infrastructure delivers reliable insights across
              the globe
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Metric
                key={metric.label}
                {...metric}
                delay={shouldReduceMotion ? 0 : index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
