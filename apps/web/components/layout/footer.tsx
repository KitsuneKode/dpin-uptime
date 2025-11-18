import Link from 'next/link'
import { Activity, Github, Twitter, Linkedin } from 'lucide-react'

const footerLinks = {
  product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/integrations', label: 'Integrations' },
    { href: '/api', label: 'API' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ],
  resources: [
    { href: '/docs', label: 'Documentation' },
    { href: '/help', label: 'Help Center' },
    { href: '/status', label: 'Status Page' },
    { href: '/changelog', label: 'Changelog' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/security', label: 'Security' },
    { href: '/compliance', label: 'Compliance' },
  ],
}

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="group mb-4 flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
                <Activity className="h-4 w-4" />
              </div>
              <span className="group-hover:text-primary text-lg font-bold transition-colors">
                DPin Uptime
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm">
              Monitor your services with confidence. Get instant alerts when
              your websites and APIs go down.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2024 DPin Uptime. All rights reserved.
          </p>
          <div className="mt-4 flex items-center space-x-4 sm:mt-0">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <Link
                  key={social.href}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
