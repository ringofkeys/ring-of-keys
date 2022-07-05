export const RESOURCES_QUERY = `
query AllResourcesQuery($limit: IntType!, $skip: IntType!) {
    allResources(
        orderBy: resourceType_DESC
        first: $limit
        skip: $skip
    ) {
        id
        title
        description
        link
        resourceType
    }
}`
