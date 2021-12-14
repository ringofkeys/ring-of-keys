export const ALL_KEY_SLUGS_QUERY = `
query AllKeySlugsQuery {
  allKeys {
    slug
  }
}
`

export const KEY_QUERY = `
query KeyQuery($slug: String!) {
    key(filter: { slug: { eq: $slug } }) {
      id
      name
      pronouns
      email
      website
      memberSince
      socialMedia { socialMediaLink }
      genderIdentity
      sexualIdentity
      raceEthnicity
      mainLocation
      locations
      affiliations
      vocalRange
      danceExperience
      discipline
      bio
      resume
      headshot {
        responsiveImage(imgixParams: { fit: facearea, facepad: 50, w: 300, h: 300, auto: format }) {
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          base64
        }
      }
      featuredImage {
        responsiveImage(imgixParams: { fit: crop, w: 300, h: 300, auto: format }) {
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          base64
        }
      }
    }
  }
`
