import { GraphQLClient } from "graphql-request"

export function request({ query, variables, preview }) {
  const endpoint = `https://graphql.datocms.com/${preview ? "preview" : ""}`

  console.log('process.env.NEXT_PUBLIC_DATO_READ_ONLY_TOKEN', process.env.NEXT_PUBLIC_DATO_READ_ONLY_TOKEN)

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_DATO_READ_ONLY_TOKEN}`,
    },
  })

  return client.request(query, variables)
}
