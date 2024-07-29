import { DashboardUserData } from "pages/dashboard";

const basicUser: DashboardUserData = {
    name: 'Jayce Doe',
    headshot: {
        url: 'https://example.com/headshot.jpg'
    },
    id: '123',
    hideMessageButton: false,
    keyTeamMember: false,
    memberSince: '2020',
    pronouns: 'they/them',
    moderateMessages: false,
    slug: 'jayce-doe',
    stripeId: 'cus_123',
}

export const getBrokenUser = (fieldsToDelete: (keyof DashboardUserData)[] = []): DashboardUserData => {
    const user = { ...basicUser }
    fieldsToDelete.forEach(field => {
        delete user[field]
    })
    return user
}