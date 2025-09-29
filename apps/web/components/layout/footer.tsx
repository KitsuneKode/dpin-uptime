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
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">DPin Uptime</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Monitor your services with confidence. Get instant alerts when your websites and APIs go down.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 DPin Uptime. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
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
