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
    }
`

export type NavMenuData = {
    menu: {
        id: string
        children: NavMenuItem[]
    }
}

export type NavMenuItem = {
    id: string
    label: string
    link: string
    position: number
    children: NavMenuItem[]
    image?: {
        url: string
        alt: string
    }
    description?: string
    ctaText?: string
}