export const VIEWER_BY_EMAIL = `
query VIEWER_BY_EMAIL($email: String!){
  viewer(filter: { email: { eq: $email}}) {
    email,
    id,
    optedIntoNewsletter
  }
}
`
