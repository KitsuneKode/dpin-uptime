import { passwordSchema } from '@dpin-uptime/common'
import { prisma } from '@dpin-uptime/store'
import { betterAuth } from 'better-auth'
export { fromNodeHeaders, toNodeHandler } from 'better-auth/node'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
export type { InferSession, InferUser } from 'better-auth'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      verify: async ({ hash, password }) => {
        return passwordSchema.safeParse(password).success
      },
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
