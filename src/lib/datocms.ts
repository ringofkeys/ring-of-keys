import { GraphQLClient, RequestDocument, RequestOptions } from "graphql-request"
import { buildClient } from "@datocms/cma-client-browser"
import { NAV_MENU_QUERY, NavMenuData } from "queries/nav"

interface RequestProps {
    query: RequestDocument,
    variables: RequestOptions["variables"],
    preview: boolean,
}

export function request<T extends {}>({ query, variables, preview }: RequestProps) {
    const endpoint = `https://graphql.datocms.com/${preview ? "preview" : ""}`
    const gqlClient = new GraphQLClient(endpoint, {
        headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_DATO_READ_ONLY_TOKEN}`,
        },
    })
    
    return gqlClient.request<T>(query, variables)
}

export function getDatoWriteClient(artistId: string, tokenId: string) {
    if (artistId !== tokenId) {
        throw new Error('You are not authorized to make this request!')
    }

    return buildClient({ apiToken: process.env.NEXT_PUBLIC_DATO_READ_WRITE_TOKEN! });
}

export function requestLayoutProps({ preview } = { preview: false }) {
    return request<NavMenuData>({
        query: NAV_MENU_QUERY,
        variables: {},
        preview,
    })
}


export async function requestAll<T extends {}>({ query, variables, preview }: RequestProps) {
    let skip = 0
    let keepQuerying = true
    let results: T[] = []

    while (keepQuerying) {
        const data = await request({
            query,
            variables: {
                ...variables,
                skip,
            },
            preview,
        })

        const resultsSubArray = Object.values(data)[0] as T[]
        results = results.concat(resultsSubArray)

        skip += variables?.limit || 20
        // keepQuerying = false  // for dev purposes, remove in PROD

        if (resultsSubArray.length < (variables?.limit || 20)) {
            keepQuerying = false
        } else if (skip > 2000) {
            keepQuerying = false
            console.error("Too many loops")
        }
    }

    return results
}