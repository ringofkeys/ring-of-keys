import { KEYS_DIRECTORY_QUERY } from "./keys"
import { RESOURCES_QUERY } from "./resources"

export function getPageSpecificQueries(slug) {
    switch (slug) {
        case "directory-2":
            return [KEYS_DIRECTORY_QUERY, { limit: 15 }, true]
        case "resources":
            return [RESOURCES_QUERY, { limit: 50 }, true]
        default:
            return []
    }
}
