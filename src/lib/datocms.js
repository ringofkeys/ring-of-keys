import { GraphQLClient } from "graphql-request"

export function request({ query, variables, preview }) {
  const endpoint = `https://graphql.datocms.com/${preview ? "preview" : ""}`

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${process.env.DATO_CONTENT_TOKEN}`,
    },
  })

  return client.request(query, variables)
}

export async function requestAll({ query, variables, preview }) {
  let skip = 0
  let keepQuerying = true
  let results = []

  while (keepQuerying) {
    const data = await request({
      query,
      variables: {
        ...variables,
        skip,
      },
      preview
    })

    const resultsSubArray = Object.values(data)[0]
    results = results.concat(resultsSubArray)

    skip += variables.limit || 20
    // keepQuerying = false  // for dev purposes, remove in PROD

    if (resultsSubArray.length < (variables.limit || 20)) {
      keepQuerying = false
    } else if (skip > 2000) {
      keepsQuerying = false
      console.error('Too many loops')
    }
  }

  return results
}