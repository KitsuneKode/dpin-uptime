import { ConfigLoader } from '@dpin-uptime/common/config-loader'

const clientConfigSchema = {
  frontendUrl: () => process.env.NEXT_PUBLIC_APP_URL || '',
  apiBaseUrl: () => process.env.NEXT_PUBLIC_API_URL || '',
  databaseUrl: () => process.env.DATABASE_URL || '',
  nodeEnv: () => process.env.NODE_ENV || 'development',
}

const config = ConfigLoader.getInstance(clientConfigSchema, 'client')

config.validate(['frontendUrl', 'apiBaseUrl', 'databaseUrl', 'nodeEnv'])

console.log('Configuration loaded:', config.getConfig('apiBaseUrl'))

export default config

export const API_BASE_URL = config.getConfig('apiBaseUrl')
export const BASE_URL = config.getConfig('frontendUrl')
export const NODE_ENV = config.getConfig('nodeEnv')
