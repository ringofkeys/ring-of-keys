export const RESOURCES_QUERY = `
query ResourcesQuery {
    allResources {
        id
        title
        description
        link
        resourceType
    }
}`