import { GraphQLClient } from "graphql-request"
import { SiteClient } from "datocms-client"
import { buildClient } from "@datocms/cma-client-browser"
import { useSession } from "next-auth/react"
import { NAV_MENU_QUERY } from "queries/nav"

export function request({ query, variables, preview }) {
    const endpoint = `https://graphql.datocms.com/${preview ? "preview" : ""}`
    const gqlClient = new GraphQLClient(endpoint, {
        headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_DATO_READ_ONLY_TOKEN}`,
        },
    })
    
    return gqlClient.request(query, variables)
}

export function getDatoWriteClient(artistId, tokenId) {
    if (!artistId == tokenId) {
        throw new Error('You are not authorized to make this request!')
    }

    return new SiteClient(process.env.NEXT_PUBLIC_DATO_READ_WRITE_TOKEN);
}

export function requestLayoutProps({ preview } = { preview: false }) {
    return request({
        query: NAV_MENU_QUERY,
        variables: {},
        preview,
    })
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
            preview,
        })

        const resultsSubArray = Object.values(data)[0]
        results = results.concat(resultsSubArray)

        skip += variables.limit || 20
        // keepQuerying = false  // for dev purposes, remove in PROD

        if (resultsSubArray.length < (variables.limit || 20)) {
            keepQuerying = false
        } else if (skip > 2000) {
            keepsQuerying = false
            console.error("Too many loops")
        }
    }

    return results
}

const uploadClient = buildClient({ apiToken: process.env.NEXT_CONTENT_API_TOKEN })

export function uploadFile(file, options) {
    const filename = options?.filename || file.name
    console.log({ filename })

    return uploadClient.uploads.createFromFileOrBlob({
        fileOrBlob: file,
        filename,
        author: options?.author,
        onProgress: (info) => {
            console.log({
                phase: info.type,
                details: info.payload,
            })
        },
        default_field_metadata: {
            en: {
                alt: options?.alt || '',
                title: options?.title || '',
            }
        }
    })
}
