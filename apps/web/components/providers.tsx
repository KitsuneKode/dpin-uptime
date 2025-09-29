'use client'

import * as React from 'react'
import { Toaster } from '@dpin-uptime/ui/components/sonner'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }))
  
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster richColors />
    </NextThemesProvider>
  )
}
