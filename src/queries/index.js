import { ALL_KEYS_CONSULTANTS_QUERY, KEYS_DIRECTORY_QUERY } from "./keys"
import { RESOURCES_QUERY } from "./resources"


export function getPageSpecificQueries(slug) {
    switch (slug) {
        case "directory-2":
            return {
                name: 'allKeys',
                query: KEYS_DIRECTORY_QUERY,
                variables: { limit: 50 },
                isRepeating: true,
            }
        case "resources-2":
            return {
                name: 'allResources',
                query: RESOURCES_QUERY,
                variables: { limit: 50 },
                isRepeating:true,
            }
        default:
            return null
    }
}

export function getComponentSpecificQueries(pageContent) {
    const queries = []

    console.log({ pageContent})

    for (const block of pageContent) {
        switch (block.__typename) {
            case "ShortcodeRecord": 
                switch (block.name) {
                    case "consultant-bios":
                        queries.push({
                            name: 'allConsultants',
                            query: ALL_KEYS_CONSULTANTS_QUERY,
                            variables: {},
                            isRepeating: false
                        })
                }
        }
    }

    return queries
}
