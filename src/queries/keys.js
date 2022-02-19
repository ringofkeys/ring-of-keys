export const KEYS_DIRECTORY_QUERY = `
query AllKeysQuery($limit: IntType!, $skip: IntType!) {
    allKeys(
        filter: { showInDirectory: { eq: true }}
        orderBy: name_ASC
        first: $limit
        skip: $skip
    ) {
        slug
        name
        headshot {
            url
        }
        mainLocation
        locations
        pronouns
        genderIdentity
        sexualIdentity
        raceEthnicity
        discipline
        vocalRange
        danceExperience
        affiliations
    }
}`