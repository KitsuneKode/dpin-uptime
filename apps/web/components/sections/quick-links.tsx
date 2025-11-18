import Link from 'next/link'
import { Button } from '@dpin-uptime/ui/components/button'
import { Card, CardContent } from '@dpin-uptime/ui/components/card'
import { ArrowRight, Shield, Wallet, BarChart3, Globe } from 'lucide-react'

export function QuickLinks() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Quick Access</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Jump right into what you need
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Become Validator */}
          <Link href="/become-validator">
            <Card className="group hover:border-primary h-full cursor-pointer transition-all">
              <CardContent className="pt-6">
                <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 w-fit rounded-lg p-3 transition-colors">
                  <Wallet className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">Become a Validator</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Join the network and earn rewards by running a validator node
                </p>
                <div className="text-primary flex items-center text-sm transition-all group-hover:gap-2">
                  <span>Get Started</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Validator Dashboard */}
          <Link href="/validator">
            <Card className="group hover:border-primary h-full cursor-pointer transition-all">
              <CardContent className="pt-6">
                <div className="mb-4 w-fit rounded-lg bg-blue-500/10 p-3 transition-colors group-hover:bg-blue-500/20">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold">Validator Dashboard</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  View your earnings, manage withdrawals, and track validations
                </p>
                <div className="flex items-center text-sm text-blue-600 transition-all group-hover:gap-2">
                  <span>View Dashboard</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Panel */}
          <Link href="/dashboard/admin/validators">
            <Card className="group hover:border-primary h-full cursor-pointer transition-all">
              <CardContent className="pt-6">
                <div className="mb-4 w-fit rounded-lg bg-purple-500/10 p-3 transition-colors group-hover:bg-purple-500/20">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 font-semibold">Admin Panel</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Manage validator approvals and network administration
                </p>
                <div className="flex items-center text-sm text-purple-600 transition-all group-hover:gap-2">
                  <span>Access Admin</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Dashboard */}
          <Link href="/dashboard">
            <Card className="group hover:border-primary h-full cursor-pointer transition-all">
              <CardContent className="pt-6">
                <div className="mb-4 w-fit rounded-lg bg-green-500/10 p-3 transition-colors group-hover:bg-green-500/20">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 font-semibold">Monitoring Dashboard</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Monitor your websites and view uptime statistics
                </p>
                <div className="flex items-center text-sm text-green-600 transition-all group-hover:gap-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  )
}
