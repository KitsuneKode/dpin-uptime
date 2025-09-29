'use client'

import { useState } from 'react'
import { Card } from '@dpin-uptime/ui/components/card'
import { Button } from '@dpin-uptime/ui/components/button'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Variants, motion, useReducedMotion } from 'motion/react'

const testimonials = [
  {
    id: 1,
    content:
      'DPin Uptime has been a game-changer for our infrastructure monitoring. The instant alerts and detailed analytics help us maintain 99.9% uptime for our critical services.',
    author: 'Sarah Chen',
    role: 'DevOps Engineer',
    company: 'TechFlow Inc.',
    avatar: 'SC',
    rating: 5,
  },
  {
    id: 2,
    content:
      'The global monitoring locations give us confidence that our services are performing well worldwide. The dashboard is intuitive and the alerting is spot-on.',
    author: 'Marcus Rodriguez',
    role: 'CTO',
    company: 'CloudScale',
    avatar: 'MR',
    rating: 5,
  },
  {
    id: 3,
    content:
      "We've tried many monitoring solutions, but DPin Uptime's combination of simplicity and power is unmatched. The team collaboration features are excellent.",
    author: 'Emily Watson',
    role: 'Site Reliability Engineer',
    company: 'DataVault',
    avatar: 'EW',
    rating: 5,
  },
  {
    id: 4,
    content:
      'The SSL monitoring and certificate tracking features saved us from a potential outage. The proactive alerts are incredibly valuable for our e-commerce platform.',
    author: 'David Kim',
    role: 'Infrastructure Lead',
    company: 'ShopStream',
    avatar: 'DK',
    rating: 5,
  },
  {
    id: 5,
    content:
      'Setting up monitoring for our microservices was incredibly easy. The API monitoring catches issues before our customers even notice. Best investment we made this year.',
    author: 'Alex Thompson',
    role: 'Lead Developer',
    company: 'MicroTech Solutions',
    avatar: 'AT',
    rating: 5,
  },
  {
    id: 6,
    content:
      'The mobile app notifications are a lifesaver when I\'m away from my desk. I can respond to incidents immediately and keep our SLA commitments intact.',
    author: 'Jessica Park',
    role: 'Operations Manager',
    company: 'FinanceFlow',
    avatar: 'JP',
    rating: 5,
  },
  {
    id: 7,
    content:
      'DPin Uptime\'s webhook integrations with our Slack and PagerDuty setup work flawlessly. The escalation policies ensure the right person gets notified every time.',
    author: 'Robert Martinez',
    role: 'Platform Engineer',
    company: 'StreamlineOps',
    avatar: 'RM',
    rating: 5,
  },
  {
    id: 8,
    content:
      'As a startup, we needed reliable monitoring without breaking the bank. DPin Uptime delivers enterprise-grade features at a price that works for us.',
    author: 'Lisa Chang',
    role: 'Founder & CEO',
    company: 'StartupLaunch',
    avatar: 'LC',
    rating: 5,
  },
  {
    id: 9,
    content:
      'The detailed performance analytics help us optimize our infrastructure costs. We identified several bottlenecks and improved our response times by 40%.',
    author: 'Michael Foster',
    role: 'Senior Backend Engineer',
    company: 'PerformanceFirst',
    avatar: 'MF',
    rating: 5,
  },
  {
    id: 10,
    content:
      'Customer trust is everything in our business. DPin Uptime helps us maintain transparency with our public status page and keeps our users informed.',
    author: 'Amanda Rodriguez',
    role: 'Customer Success Director',
    company: 'TrustBridge',
    avatar: 'AR',
    rating: 5,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, rotateY: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const backgroundCardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -10 },
    visible: {
      opacity: 0.6,
      scale: 0.95,
      rotateY: -5,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    )
  }

  const currentTestimonial = testimonials[currentIndex]
  const nextTestimonialData =
    testimonials[(currentIndex + 1) % testimonials.length]
  const prevTestimonialData =
    testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length]

  // Ensure we have valid testimonials
  if (!currentTestimonial || !nextTestimonialData || !prevTestimonialData) {
    return null
  }

  return (
    <section className="bg-muted/30 relative overflow-hidden py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Trusted by teams worldwide
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              See what our customers say about their experience with DPin Uptime
            </p>
          </motion.div>

          {/* Testimonial Cards Stack */}
          <div className="relative mx-auto max-w-4xl">
            <div className="relative flex h-80 items-center justify-center">
              {/* Background cards */}
              <motion.div
                key={`bg-next-${nextTestimonialData.id}`}
                initial="hidden"
                animate="visible"
                variants={backgroundCardVariants}
                className="absolute top-4 right-8 w-80 rotate-2 transform"
                style={{ zIndex: 1 }}
              >
                <Card className="bg-card/40 border-border/30 p-6 shadow-lg backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex space-x-1">
                      {Array.from({ length: nextTestimonialData.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="fill-primary text-primary h-4 w-4"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-3">
                      {nextTestimonialData.content}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                        {nextTestimonialData.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {nextTestimonialData.author}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {nextTestimonialData.role} at{' '}
                          {nextTestimonialData.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                key={`bg-prev-${prevTestimonialData.id}`}
                initial="hidden"
                animate="visible"
                variants={backgroundCardVariants}
                className="absolute top-8 left-8 w-80 -rotate-2 transform"
                style={{ zIndex: 1 }}
              >
                <Card className="bg-card/40 border-border/30 p-6 shadow-lg backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex space-x-1">
                      {Array.from({ length: prevTestimonialData.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="fill-primary text-primary h-4 w-4"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-3">
                      {prevTestimonialData.content}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                        {prevTestimonialData.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {prevTestimonialData.author}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {prevTestimonialData.role} at{' '}
                          {prevTestimonialData.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Main card */}
              <motion.div
                key={`main-${currentTestimonial.id}`}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="relative z-10 w-96"
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }
                }
              >
                <Card className="bg-card/90 border-border/50 p-8 shadow-2xl backdrop-blur-sm">
                  <div className="space-y-6">
                    <div className="flex space-x-1">
                      {Array.from({ length: currentTestimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="fill-primary text-primary h-5 w-5"
                          />
                        ),
                      )}
                    </div>
                    <blockquote className="text-lg leading-relaxed">
                      "{currentTestimonial.content}"
                    </blockquote>
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full font-medium">
                        {currentTestimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {currentTestimonial.author}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {currentTestimonial.role} at{' '}
                          {currentTestimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="h-10 w-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Indicators */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentIndex
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="h-10 w-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
