export const NAV_QUERY = `
    query DASHBOARD($id: ItemId) {
      user: key(filter: { id: { eq: $id}}) {
        id
        name
        headshot {
            url
        }
      }
    }`