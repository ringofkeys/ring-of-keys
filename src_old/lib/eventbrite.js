const BASE_URL = 'https://www.eventbriteapi.com/v3'
/**
 *  NOTE: This Organization ID is hard-coded to save on fetch requests.
 *  If it ever changes, use getOrganizationId() to get a new one, or wire that function
 *  up to get the true ID on each request if necessary.
 */
const ORGANIZATION_ID = '454257230738'

export function getOrganizationId(privateToken) {
    return fetch (`${BASE_URL}/users/me/organizations/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${privateToken}`
        },
    })
}

export function getEvents(privateToken) {
    return fetch(`${BASE_URL}/organizations/${ORGANIZATION_ID}/events/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${privateToken}`
        },
    })
}
