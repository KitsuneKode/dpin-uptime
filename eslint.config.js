import { config } from '@dpin-uptime/eslint-config/base'

/** @type {import("eslint").Linter.Config} */
const rootConfig = [{ ignores: ['apps/**', 'packages/**', 'tooling/**', 'tests/**'] }, ...config]

export default rootConfig
