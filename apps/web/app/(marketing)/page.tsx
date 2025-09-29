import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/hero/hero'
import { Metrics } from '@/components/sections/metrics'
import { DashboardVisual } from '@/components/sections/dashboard-visual'
import { Features } from '@/components/sections/features'
import { Security } from '@/components/sections/security'
import { Testimonials } from '@/components/sections/testimonials'
import { FAQ } from '@/components/sections/faq'
import { CTABanner } from '@/components/sections/cta-banner'

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Metrics />
        <DashboardVisual />
        <Features />
        <Security />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
