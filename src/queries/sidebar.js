export const sidebarQuery = `query SidebarQuery {
    events: allEvents(
        first: 4
        orderBy: startTime_DESC
        filter: { includeInCarousels: { eq: true } }
    ) {
        title
        startTime
        slug
    }
    team: allKeys(filter: { keyTeamMember: { eq: true } }) {
                name
                slug
                keyTeamPosition
                keyTeamOrder
                pronouns
                headshot {
                    url
                }
    }
    ambassadors: allKeys(
        first: 8
        filter: { isMeetupAmbassador: { eq: true } }
        ) {
                name
                pronouns
                locations
                mainLocation
                meetupAmbassadorOrder
                slug
    }
}`
