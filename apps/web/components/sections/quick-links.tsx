import { Button } from '@dpin-uptime/ui/components/button';
import { Card, CardContent } from '@dpin-uptime/ui/components/card';
import { ArrowRight, Shield, Wallet, BarChart3, Globe } from 'lucide-react';
import Link from 'next/link';

export function QuickLinks() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Quick Access</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jump right into what you need
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Become Validator */}
          <Link href="/become-validator">
            <Card className="group hover:border-primary transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Become a Validator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join the network and earn rewards by running a validator node
                </p>
                <div className="flex items-center text-sm text-primary group-hover:gap-2 transition-all">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Validator Dashboard */}
          <Link href="/validator">
            <Card className="group hover:border-primary transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-blue-500/10 p-3 w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Validator Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View your earnings, manage withdrawals, and track validations
                </p>
                <div className="flex items-center text-sm text-blue-600 group-hover:gap-2 transition-all">
                  <span>View Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Panel */}
          <Link href="/dashboard/admin/validators">
            <Card className="group hover:border-primary transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-purple-500/10 p-3 w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Admin Panel</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage validator approvals and network administration
                </p>
                <div className="flex items-center text-sm text-purple-600 group-hover:gap-2 transition-all">
                  <span>Access Admin</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Dashboard */}
          <Link href="/dashboard">
            <Card className="group hover:border-primary transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-green-500/10 p-3 w-fit mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Monitoring Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor your websites and view uptime statistics
                </p>
                <div className="flex items-center text-sm text-green-600 group-hover:gap-2 transition-all">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
