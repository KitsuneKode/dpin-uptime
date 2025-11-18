import { Hero } from '@/components/hero/hero'
import { FAQ } from '@/components/sections/faq'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { Metrics } from '@/components/sections/metrics'
import { Features } from '@/components/sections/features'
import { Security } from '@/components/sections/security'
import { CTABanner } from '@/components/sections/cta-banner'
import { QuickLinks } from '@/components/sections/quick-links'
import { Testimonials } from '@/components/sections/testimonials'
import { DashboardVisual } from '@/components/sections/dashboard-visual'

export default function MarketingPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <QuickLinks />
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
