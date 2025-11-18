'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { Input } from '@dpin-uptime/ui/components/input'
import { Label } from '@dpin-uptime/ui/components/label'
import { Button } from '@dpin-uptime/ui/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'
import {
  Server,
  DollarSign,
  Zap,
  Shield,
  Download,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Coins,
  Send,
} from 'lucide-react'

export default function BecomeValidatorPage() {
  const [publicKey, setPublicKey] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [ip, setIp] = React.useState('')

  const registerMutation = useMutation({
    mutationFn: async (data: {
      publicKey: string
      location: string
      ip: string
    }) => {
      return await api.registerValidator(data)
    },
    onSuccess: () => {
      toast.success(
        'Registration submitted successfully! Please wait for admin approval.',
      )
      setPublicKey('')
      setLocation('')
      setIp('')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit registration')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !location || !ip) {
      toast.error('Please fill in all fields')
      return
    }
    registerMutation.mutate({ publicKey, location, ip })
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <Badge className="mb-4" variant="outline">
          <Zap className="mr-1 h-3 w-3" />
          Join the Network
        </Badge>
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Become a Validator
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Run a validator node and earn rewards by helping monitor uptime across
          our decentralized network
        </p>
      </div>

      {/* Registration Form */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Register Your Validator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="publicKey">Solana Public Key *</Label>
                <Input
                  id="publicKey"
                  placeholder="e.g., 7xKXtg2CW87d97TXJSDpbD..."
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  required
                />
                <p className="text-muted-foreground text-xs">
                  Your validator's Solana wallet public key
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., us-east-1, eu-west-1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <p className="text-muted-foreground text-xs">
                  Geographic location or region
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">IP Address *</Label>
                <Input
                  id="ip"
                  placeholder="e.g., 203.0.113.0"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  required
                />
                <p className="text-muted-foreground text-xs">
                  Your validator's public IP address
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending
                  ? 'Submitting...'
                  : 'Submit Registration'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Benefits Grid */}
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="bg-primary/10 mb-4 w-fit rounded-lg p-3">
              <DollarSign className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold">Earn Rewards</h3>
            <p className="text-muted-foreground text-sm">
              Earn 0.0001 SOL for every website check you perform. Payments
              processed automatically every hour.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="bg-primary/10 mb-4 w-fit rounded-lg p-3">
              <Server className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold">Low Requirements</h3>
            <p className="text-muted-foreground text-sm">
              Minimal hardware needed. Run on any modern server with internet
              connectivity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="bg-primary/10 mb-4 w-fit rounded-lg p-3">
              <Shield className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold">Secure & Trustless</h3>
            <p className="text-muted-foreground text-sm">
              All validations are cryptographically signed and verified
              on-chain.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requirements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold">Minimum Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>1 CPU core</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>512 MB RAM</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>10 GB storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Stable internet connection (100 Mbps+)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Static IP address or dynamic DNS</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Software Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Bun runtime v1.0+</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Linux/macOS/Windows</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Solana wallet with keypair</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Port 8080 (or custom) for WebSocket</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                1
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <Download className="h-4 w-4" />
                Clone the Repository
              </h4>
              <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
                git clone https://github.com/your-org/dpin-uptime.git{'\n'}
                cd dpin-uptime
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                2
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <Terminal className="h-4 w-4" />
                Install Dependencies
              </h4>
              <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
                bun install
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                3
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <Shield className="h-4 w-4" />
                Generate Validator Keypair
              </h4>
              <p className="text-muted-foreground mb-2 text-sm">
                Create a new Solana keypair for your validator:
              </p>
              <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
                solana-keygen new --outfile
                ~/.config/solana/validator-keypair.json
              </pre>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                4
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 font-semibold">Configure Environment</h4>
              <p className="text-muted-foreground mb-2 text-sm">
                Create a <code className="bg-muted rounded px-1">.env</code>{' '}
                file in{' '}
                <code className="bg-muted rounded px-1">apps/validator</code>:
              </p>
              <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
                {`HUB_URL=ws://hub.example.com:3001
VALIDATOR_PRIVATE_KEY_PATH=~/.config/solana/validator-keypair.json
VALIDATOR_LOCATION=us-east-1
VALIDATOR_IP=your.public.ip.address`}
              </pre>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                5
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <Zap className="h-4 w-4" />
                Start Validator
              </h4>
              <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
                cd apps/validator{'\n'}
                bun run start
              </pre>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                6
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Verify Registration
              </h4>
              <p className="text-muted-foreground text-sm">
                Check the console output to confirm your validator connected to
                the hub successfully. You should see validation tasks being
                assigned and earnings accumulating.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Earnings & Withdrawals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">How Earnings Work</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  You earn <strong>0.0001 SOL</strong> for every website check
                  you perform
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Earnings are tracked in real-time and displayed in your
                  validator dashboard
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Your balance accumulates until you request a withdrawal
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Withdrawal Process</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Connect your Solana wallet to the validator dashboard
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Request a withdrawal specifying amount and destination address
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Withdrawals are automatically processed every hour</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Track withdrawal status and transaction history in your
                  dashboard
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 pb-6">
            <h3 className="mb-2 text-2xl font-bold">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90">
              Follow the setup guide above and start earning rewards today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <a href="/validator">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <a
                  href="https://github.com/your-org/dpin-uptime"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Code
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
