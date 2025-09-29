'use client'

import { Variants, motion, useReducedMotion } from 'motion/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@dpin-uptime/ui/components/accordion'

const faqs = [
  {
    question: 'How does DPin Uptime monitor my services?',
    answer:
      "We monitor your services from 12+ global locations every 30 seconds. Our monitoring infrastructure checks HTTP/HTTPS endpoints, APIs, SSL certificates, and more. When an issue is detected, you'll receive instant notifications through your preferred channels.",
  },
  {
    question: 'What types of monitoring do you support?',
    answer:
      'We support HTTP/HTTPS monitoring, API endpoint monitoring, SSL certificate monitoring, DNS monitoring, ping monitoring, and port monitoring. You can also set up custom headers, authentication, and specific response validation rules.',
  },
  {
    question: 'How quickly will I be notified of downtime?',
    answer:
      "You'll receive notifications within 30 seconds of detecting an issue. We verify the problem from multiple locations before sending alerts to prevent false positives. Notifications can be sent via email, SMS, Slack, webhooks, and mobile push notifications.",
  },
  {
    question: 'Can I customize the monitoring intervals?',
    answer:
      'Yes, you can set monitoring intervals from 30 seconds to 24 hours depending on your plan. Higher frequency monitoring is available on our Pro and Enterprise plans. You can also set different intervals for different services based on their criticality.',
  },
  {
    question: 'Do you offer team collaboration features?',
    answer:
      'Absolutely! You can invite team members, set different permission levels, create shared dashboards, and manage escalation policies. Team members can collaborate on incident response and share monitoring insights across your organization.',
  },
]

export function FAQ() {
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
        duration: 0.5,
        ease: 'easeOut',
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
          className="mx-auto max-w-3xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about DPin Uptime monitoring
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div variants={itemVariants}>
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border/50 bg-card/30 hover:bg-card/50 rounded-lg border px-6 backdrop-blur-sm transition-colors"
                >
                  <AccordionTrigger className="py-6 text-left hover:no-underline">
                    <span className="pr-4 text-lg font-semibold">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="text-primary font-medium hover:underline"
              >
                Contact our support team
              </a>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <a
                href="/docs"
                className="text-primary font-medium hover:underline"
              >
                Browse documentation
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
