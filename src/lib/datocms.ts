import { GraphQLClient } from "graphql-request"
import { buildClient } from "@datocms/cma-client-browser"
import type { CreateUploadFromFileOrBlobSchema } from "@datocms/cma-client-browser/dist/types/resources/Upload"

interface RequestProps {
    query: string
    variables: Record<string, unknown>
    preview?: boolean
}

export const datoClient = buildClient({ apiToken: import.meta.env.VITE_DATO_READ_WRITE_TOKEN || null })

export function request({ query, variables, preview }: RequestProps) {
    const endpoint = `https://graphql.datocms.com/${preview ? "preview" : ""}`
    const gqlClient = new GraphQLClient(endpoint, {
        headers: {
            authorization: `Bearer ${import.meta.env.VITE_DATO_READ_ONLY_TOKEN}`,
        },
    })
    
    return gqlClient.request(query, variables)
}

export function getDatoWriteClient(artistId: string, tokenId: string) {
    if (artistId !== tokenId) {
        throw new Error('You are not authorized to make this request!')
    }

    return datoClient
}


export async function requestAll({ query, variables, preview }: RequestProps) {
    let skip = 0
    let keepQuerying = true
    let results: Record<string, unknown>[] = []

    while (keepQuerying) {
        const data = await request({
            query,
            variables: {
                ...variables,
                skip,
            },
            preview,
        })

        if (!(data instanceof Object)) return results

        const resultsSubArray = Object.values(data)[0]
        results = results.concat(resultsSubArray)

        skip = skip + (typeof variables.limit === 'number' ? variables.limit : 20)
        // keepQuerying = false  // for dev purposes, remove in PROD

        if (resultsSubArray.length < (variables.limit || 20)) {
            keepQuerying = false
        } else if (skip > 2000) {
            keepQuerying = false
            console.error("Too many loops")
        }
    }

    return results
}

export function uploadFile(file: File | Blob, options: Omit<CreateUploadFromFileOrBlobSchema, 'file'> & { alt?: string, title?: string }) {
    const filename = options?.filename || ('name' in file ? file.name : ('upload ' + Date.now()))

    return datoClient.uploads.createFromFileOrBlob({
        fileOrBlob: file,
        filename,
        author: options?.author,
        onProgress: (info) => {
            if (options?.onProgress) {
                options.onProgress(info)
            } else {
                console.log({
                    phase: info.type,
                })
            }
        },
        default_field_metadata: {
            en: {
                alt: options?.alt || '',
                title: options?.title || '',
            }
        }
    })
}
