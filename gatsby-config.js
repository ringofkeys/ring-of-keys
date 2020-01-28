require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

module.exports = {
  siteMetadata: {
    title: `Ring of Keys`,
    description: `Ring of Keys is a musical theatre advocacy program for queer women, transgender,
    and gender non-conforming artists.`,
    author: `@ringofkeysorg`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // CommonMark mode (default: true)
        commonmark: true,
        // Footnotes mode (default: true)
        footnotes: true,
        // Pedantic mode (default: true)
        pedantic: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ring of Keys`,
        short_name: `RoK`,
        start_url: `/`,
        background_color: `#263e64`,
        theme_color: `#e9bfb2`,
        display: `minimal-ui`,
        icon: `src/images/rok_favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-source-datocms',
      options: {
        apiToken: process.env.DATO_READ_ONLY_TOKEN,
        preview: false,
        disableLiveReload: false,
        apiUrl: 'https://site-api.datocms.com',
      },
    },
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
          endpoint: 'https://ringofkeys.us17.list-manage.com/subscribe/post?u=8f1dc9a8a5caac3214e2997fe&amp;id=b8eb5db676',
      },
    },
  ],
}
