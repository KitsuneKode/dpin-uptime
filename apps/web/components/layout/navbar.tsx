'use client'

import Link from 'next/link'
import { UserNav } from './user-nav'
import { motion } from 'motion/react'
import { Activity, Loader2 } from 'lucide-react'
import { authClient } from '@dpin-uptime/auth/client'
import { Button } from '@dpin-uptime/ui/components/button'
const navItems = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/status', label: 'Status' },
]

export function Navbar() {
  const { data, isPending } = authClient.useSession()
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">DPin Uptime</span>
          </Link>
        </div>

        <nav className="hidden items-center space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground group relative text-sm font-medium transition-colors"
            >
              {item.label}
              <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          {isPending ? (
            <Button variant="ghost" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
          ) : data?.user ? (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserNav user={data.user} />
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
