const { withSentryConfig } = require("@sentry/nextjs")

const sentryPluginOptions = {
    org: "ring-of-keys",
    project: "ringofkeys-site",
    silent: true,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    sentry: {
        hideSourceMaps: true,
    },
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    reactStrictMode: true,
    async redirects() {
        return []
    },
}

module.exports = withSentryConfig(nextConfig, sentryPluginOptions)
