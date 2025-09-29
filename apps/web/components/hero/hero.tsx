'use client'

import { HeroVisual } from './hero-visual'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@dpin-uptime/ui/components/button'
import { Variants, motion, useReducedMotion } from 'motion/react'

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.6,
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
    <section className="bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="from-primary/5 via-background to-background absolute inset-0 bg-gradient-to-br" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                Monitor with <span className="text-primary">confidence</span>
                <br />
                Alert with <span className="text-primary">precision</span>
              </h1>
              <p className="text-muted-foreground max-w-lg text-xl">
                Get instant notifications when your websites and APIs go down.
                Monitor from multiple locations worldwide with 30-second checks.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground group"
              >
                Start monitoring for free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="group">
                <Play className="mr-2 h-4 w-4" />
                Watch demo
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-muted-foreground flex items-center space-x-8 text-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="bg-primary h-2 w-2 rounded-full" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-primary h-2 w-2 rounded-full" />
                <span>No credit card required</span>
              </div>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div variants={itemVariants} className="relative">
            <HeroVisual />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
