'use client'

import { Variants, motion, useReducedMotion } from 'motion/react'
import {
  Shield,
  Lock,
  Eye,
  Server,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
} from 'lucide-react'

const platforms = [
  { icon: Monitor, label: 'Web', position: { x: -60, y: -40 } },
  { icon: Smartphone, label: 'Mobile', position: { x: 60, y: -40 } },
  { icon: Laptop, label: 'Desktop', position: { x: -60, y: 40 } },
  { icon: Server, label: 'API', position: { x: 60, y: 40 } },
]

export function Security() {
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

  const cubeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: -20, rotateY: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  }

  const ringVariants: Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          rotate: 360,
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
        },
  }

  const platformVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.2 + 0.5,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <section className="bg-background relative overflow-hidden py-16 lg:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Effortless monitoring across all platforms
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Monitor your services from web, mobile, desktop, and API
              endpoints. Our unified platform provides consistent monitoring
              across all your infrastructure.
            </p>
          </motion.div>

          {/* 3D Visual */}
          <motion.div
            variants={itemVariants}
            className="mb-16 flex justify-center"
          >
            <div className="relative flex h-80 w-80 items-center justify-center">
              {/* Central cube stack */}
              <motion.div
                variants={cubeVariants}
                className="relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Main cube */}
                <div className="relative h-24 w-24 transform-gpu">
                  <div className="from-primary/20 to-primary/40 border-primary/30 absolute inset-0 rounded-lg border bg-gradient-to-br backdrop-blur-sm" />
                  <div className="from-primary/10 to-primary/20 border-primary/20 absolute inset-2 rounded border bg-gradient-to-br" />
                  <div className="bg-primary/30 absolute inset-4 flex items-center justify-center rounded">
                    <Shield className="text-primary h-6 w-6" />
                  </div>
                </div>

                {/* Stacked cubes */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: -8 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="from-primary/10 to-primary/20 border-primary/20 absolute inset-0 h-24 w-24 -translate-x-2 translate-y-2 transform rounded-lg border bg-gradient-to-br backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.5, y: -16 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="from-primary/5 to-primary/15 border-primary/10 absolute inset-0 h-24 w-24 -translate-x-4 translate-y-4 transform rounded-lg border bg-gradient-to-br backdrop-blur-sm"
                />
              </motion.div>

              {/* Rotating ring */}
              <motion.div
                variants={ringVariants}
                animate="animate"
                className="border-primary/20 absolute inset-0 h-80 w-80 rounded-full border-2 border-dashed"
              />

              {/* Platform icons */}
              {platforms.map((platform, index) => {
                const Icon = platform.icon
                return (
                  <motion.div
                    key={platform.label}
                    custom={index}
                    variants={platformVariants}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: 1.1,
                            transition: { duration: 0.2 },
                          }
                    }
                    className="bg-card/80 border-border/50 absolute flex h-16 w-16 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm"
                    style={{
                      left: `calc(50% + ${platform.position.x}px)`,
                      top: `calc(50% + ${platform.position.y}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Icon className="text-primary h-6 w-6" />
                  </motion.div>
                )
              })}

              {/* Connecting lines */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full">
                {platforms.map((platform, index) => (
                  <motion.line
                    key={index}
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${platform.position.x}px)`}
                    y2={`calc(50% + ${platform.position.y}px)`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.2 + 1 }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Features grid */}
          <motion.div
            variants={itemVariants}
            className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3"
          >
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
                <Lock className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Enterprise Security</h3>
              <p className="text-muted-foreground">
                SOC 2 Type II compliant with end-to-end encryption and secure
                data handling
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
                <Eye className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Complete Visibility</h3>
              <p className="text-muted-foreground">
                Monitor all your services from a single dashboard with real-time
                insights
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
                <Server className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Global Infrastructure</h3>
              <p className="text-muted-foreground">
                Distributed monitoring from 12+ global locations for accurate
                results
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
