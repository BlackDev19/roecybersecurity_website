import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const config: NextConfig = {
  reactStrictMode: true, // Bonne pratique
  swcMinify: true,       // Optimisation du build
}

// ⚡ On applique directement le plugin next-intl
export default withNextIntl('./src/i18n/request.ts')(config)
