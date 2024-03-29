export const newsItemQuery = `
query NewsPieceQuery($slug: String!) {
  news(filter: { slug: { eq: $slug }}) {
    title
    featuredImage {
      url
      alt
    }
    body
  }
}`

export const eventItemQuery = `
query EventQuery($slug: String!) {
  event(filter: { slug: { eq: $slug }}) {
    title
    featuredImage {
      url
      alt
    }
    description
    startTime
    endTime
  }
}`

export const homeNewsQuery = `
query HomepageNewsQuery {
  allNews(first: 10,  orderBy: publishDate_DESC) {
    title
    externalUrl
    publishDate
    featuredImage {
      url
    }
    body
    slug
  }
}`

export const newsPageQuery = `
query NewsPageQuery {
    industryNews: allNews(
      filter: { newsType: { eq: "industry" } }
      orderBy: publishDate_DESC
    ) {
        externalUrl
        body
        title
        publishDate
        featuredImage {
          url
          alt
        }
    }
    pressReleases: allNews(
      filter: { newsType: { eq: "press" } }
      orderBy: publishDate_DESC
    ) {
        externalUrl
        body
        title
        publishDate
        featuredImage {
          url
          alt
        }
        slug
      }
    newsletters: allNews(
      filter: { newsType: { eq: "newsletter" } }
      orderBy: publishDate_DESC
    ) {
          externalUrl
          body
          title
          featuredImage {
            url
            alt
          }
          slug
    }
    events: allEvents(orderBy: startTime_DESC) {
          description
          featuredImage {
            url
            alt
          }
          title
          startTime
          slug
        }
  }`
