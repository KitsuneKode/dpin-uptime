import { config } from '@dpin-uptime/eslint-config/base'

/** @type {import("eslint").Linter.Config} */
const apiConfig = [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...config,
]

export default apiConfig
