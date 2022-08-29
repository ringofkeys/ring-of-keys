export const DASHBOARD_NAV_QUERY = `
    query DASHBOARD($id: ItemId) {
        user: key(filter: { id: { eq: $id}}) {
            id
            name
            headshot {
                url
            }
        }
    }`

export const NAV_MENU_QUERY = `
    query NAV {
        menu: menu(filter: { label: { eq: "Top Nav" }}) {
            id
            children {
                id
                label
                link
                position
                children {
                    id
                    label
                    link
                    position
                    image {
                      url
                      alt
                    }
                    description
                    ctaText
                }
            }
        }
    }`
