'use client'

import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@dpin-uptime/ui/components/button'
import { Variants, motion, useReducedMotion } from 'motion/react'

export function CTABanner() {
  const shouldReduceMotion = useReducedMotion()

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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
        >
          <motion.div
            variants={itemVariants}
            className="from-primary/10 via-background to-primary/5 border-primary/20 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 lg:p-12"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="absolute inset-0">
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
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-3xl font-bold lg:text-5xl">
                  Start monitoring your services today
                </h2>
                <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                  Join thousands of developers and teams who trust DPin Uptime
                  to keep their services running smoothly. Get started in
                  minutes.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground group px-8 py-4 text-lg"
                >
                  Get started for free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5 px-8 py-4 text-lg"
                >
                  Schedule a demo
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-muted-foreground mt-8 flex flex-col items-center justify-center gap-6 text-sm sm:flex-row"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary h-4 w-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary h-4 w-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary h-4 w-4" />
                  <span>Cancel anytime</span>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-primary/10 border-primary/20 absolute top-4 left-4 flex h-16 w-16 items-center justify-center rounded-full border backdrop-blur-sm"
              >
                <CheckCircle className="text-primary h-8 w-8" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="bg-primary/10 border-primary/20 absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-sm"
              >
                <div className="bg-primary h-3 w-3 rounded-full" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="bg-primary/10 border-primary/20 absolute bottom-6 left-8 h-8 w-8 rounded-full border backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="bg-primary/10 border-primary/20 absolute right-12 bottom-4 h-6 w-6 rounded-full border backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
