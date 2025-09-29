import { ConfigLoader } from '@dpin-uptime/common/config-loader'

const apiConfigSchema = {
  port: () => Number(process.env.PORT) || 8080,
  frontendUrl: () => process.env.FRONTEND_URL || '',
  databaseUrl: () => process.env.DATABASE_URL || '',
  nodeEnv: () => process.env.NODE_ENV || 'development',
  betterAuthUrl: () => process.env.BETTER_AUTH_URL || '',
  betterAuthSecret: () => process.env.BETTER_AUTH_SECRET || '',
}

const config = ConfigLoader.getInstance(apiConfigSchema, 'api')

export default config
