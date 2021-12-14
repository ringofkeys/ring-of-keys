export const pageQuery = `
query SinglePageQuery($slug: String!) {
    page(filter: { slug: { eq: $slug }}) {
      content {
        ... on IconHeadingLabelRecord {
          id
          icon {
            blurhash
            url
          }
          heading
          label
          centered
          columns
        }
        ... on QuoteRecord {
          id
          quoteText
          quoteAttribution
          backgroundColor {
            hex
          }
          textColor {
            hex
          }
        }
        ... on BasicBlockRecord {
          idHref
          content
          area
        }
        ... on ButtonRecord {
          id
          url
          text
          solid
          color {
            hex
          }
        }
        ... on ShortcodeRecord {
          id
          name
        }
        ... on HeroRecord {
          id
          heroType
          description
          linkText
          linkUrl
        }
        ... on TeammateItemRecord {
          name
          content
          linkUrl
        }
        ... on ImageArrayRecord {
          images {
            url
            customData
          }
          columns
        }
      }
      hasSidebar
      usesQueries
      noindexNofollow
      id
      title
      slug
      seo {
        title
        description
        image {
          url
        }
      }
    }
}`