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

export const RESOURCE_TYPE_QUERY = `
query ResourcesByTypeQuery($type: String!) {
    allResources(
        orderBy: title_DESC
        filter: { resourceType: { eq: $type }}
    ) {
        id
        title
        description
        link
    }
}`
