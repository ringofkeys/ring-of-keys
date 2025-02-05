import { DashboardUserData } from "pages/dashboard"

const basicUser: DashboardUserData = {
    name: "Jayce Doe",
    headshot: {
        url: "https://example.com/headshot.jpg",
    },
    id: "123",
    hideMessageButton: false,
    keyTeamMember: false,
    memberSince: "2020",
    pronouns: "they/them",
    moderateMessages: false,
    slug: "jayce-doe",
    stripeId: "cus_123",
}

export const getBrokenUser = (
    fieldsToDelete: (keyof DashboardUserData)[] = []
): DashboardUserData => {
    const user = { ...basicUser }
    fieldsToDelete.forEach((field) => {
        delete user[field]
    })
    return user
}

export const brokenProfileUser = {
    id: "Qq-VoWg2S0uteFufIe0-Dw",
    name: "Mason Pilevsky",
    pronouns: "Xie",
    email: "music2mason@gmail.com",
    website: "http://mrp-sound.com/",
    memberSince: "2024",
    hideMessageButton: false,
    moderateMessages: true,
    socialMedia: [],                    // Maybe?
    genderIdentity: "Agender",
    isGenderConsultant: false,
    sexualIdentity: "Pansexual",
    raceEthnicity: "White",
    mainLocation: "New York City",
    locations: "New York City",
    affiliations: "",                   // Maybe?   
    vocalRange: "Tenor",
    danceExperience: "",                // Maybe?
    discipline: "Sound Design/Music Composition/Audio Mixing/Violist",
    bio: "",                            // Maybe?
    resume: "",                         // Maybe?
    headshot: {
        responsiveImage: {
            srcSet: "https://www.datocms-assets.com/20110/1587958514-rokbadgeweb.png?auto=format&dpr=0.25&facepad=50&fit=facearea&h=300&w=300 75w,https://www.datocms-assets.com/20110/1587958514-rokbadgeweb.png?auto=format&dpr=0.5&facepad=50&fit=facearea&h=300&w=300 150w,https://www.datocms-assets.com/20110/1587958514-rokbadgeweb.png?auto=format&dpr=0.75&facepad=50&fit=facearea&h=300&w=300 225w,https://www.datocms-assets.com/20110/1587958514-rokbadgeweb.png?auto=format&facepad=50&fit=facearea&h=300&w=300 300w",
            webpSrcSet: "",
            sizes: "(max-width: 300px) 100vw, 300px",
            src: "https://www.datocms-assets.com/20110/1587958514-rokbadgeweb.png?auto=format&facepad=50&fit=facearea&h=300&w=300",
            width: 300,
            height: 300,
            aspectRatio: 1,
            alt: 'a badge graphic reading "Proud Member Ring of Keys"',
            title: null,
            base64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBg8TEQ8SEQ8NFg0ODg0NGRIJEA0QFx8aGBYTFiEaHysvJh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHAoOHDsdFh0vLy8vLzUvLy8vLy8vLy8vLy8vLy8vLy8vLzUvLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABgAGAMBIgACEQEDEQH/xAAZAAEAAgMAAAAAAAAAAAAAAAAAAwQBAgf/xAAaEAACAgMAAAAAAAAAAAAAAAAABAIDAQUU/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwIA/8QAGREAAwEBAQAAAAAAAAAAAAAAAAECEQQD/9oADAMBAAIRAxEAPwDpqaFEUyxwUZoKtMZ8hNjM8KhX0VpalGmwQp4QGZSkkBp6KwhwjCeyokkT52K/OYAl+c6ZNkLmyXikABZ85wltn//Z",
        },
        fullRes: {
            src: "https://www.datocms-assets.com/20110/1587958514-rokbadgeweb.png?auto=format&w=960",
            alt: 'a badge graphic reading "Proud Member Ring of Keys"',
        },
    },
    featuredImage: null,
}
