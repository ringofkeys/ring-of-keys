module.exports = {
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    async redirects() {
        return [
          {
            source: '/directory',
            destination: '/directory-2',
            permanent: true,
          },
        ]
    },
}