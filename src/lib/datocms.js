import { GraphQLClient } from "graphql-request"

export function request({ query, variables, preview }) {
  const endpoint = `https://graphql.datocms.com/${preview ? "preview" : ""}`

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${process.env.NEXT_DATO_API_TOKEN}`,
    },
  })

  return client.request(query, variables)
}
