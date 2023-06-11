const { withSentryConfig } = require("@sentry/nextjs");

const sentryPluginOptions = {
    org: 'ring-of-keys',
    project: 'ringofkeys-site',
    silent: true,
}

const nextConfig = {
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    sentry: {
        hideSourceMaps: true,
    },
    async redirects() {
        return []
    },
}

module.exports = withSentryConfig(nextConfig, sentryPluginOptions)