export const pageQuery = `
query SinglePageQuery($slug: String!) {
    page(filter: { slug: { eq: $slug }}) {
      content {
        ... on IconHeadingLabelRecord {
          __typename
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
          __typename
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
          __typename
          idHref
          content
          area
        }
        ... on ButtonRecord {
          __typename
          id
          url
          text
          solid
          color {
            hex
          }
        }
        ... on ShortcodeRecord {
          __typename
          id
          name
        }
        ... on HeroRecord {
          __typename
          id
          heroType
          description
          linkText
          linkUrl
        }
        ... on TeammateItemRecord {
          __typename
          name
          content
          linkUrl
        }
        ... on ImageArrayRecord {
          __typename
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