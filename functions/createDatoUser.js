require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})
const SiteClient = require("datocms-client").SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

const otherFields = [
    "genderconsultantbio",
    "isGenderConsultant",
    "genderConsultantOrder",
    "mainLocation",
    "locations",
    "socialMedia",
    "featuredImage",
    "headshot",
    "resume",
    "resumeFile",
    "discipline",
    "vocalRange",
    "danceExperience",
    "sexualIdentity",
    "genderIdentity",
    "raceEthnicity",
    "name",
    "website",
    "showInDirectory",
    "isMeetupAmbassador",
    "meetupAmbassadorOrder",
    "keyTeamPosition",
    "slug",
    "quickBio",
    "bio",
    "keyTeamMember",
    "keyTeamOrder",
    "email",
    "pronouns",
    "memberSince",
    "isBetaUser",
]
const blankUser = {}
otherFields.forEach(
    (field) => (blankUser[field] = field.substr(0, 2) === "is" ? false : "")
)
blankUser.keyTeamMember = false
blankUser.showInDirectory = true
blankUser.hasLoginAccess = true
blankUser.isBetaUser = false
blankUser.socialMedia = []
blankUser.featuredImage = { uploadId: "1213483" }
blankUser.resume = "No resume"
blankUser.resumeFile = { uploadId: "5669087" }
blankUser.keyTeamOrder = 5
blankUser.meetupAmbassadorOrder = 8
blankUser.genderConsultantOrder = 8
blankUser.stripeId = ""
blankUser.itemType = "177050"

exports.handler = async (event) => {
    console.log("function is called!", event.body)

    const newUser = JSON.parse(event.body)
    const data = Object.assign(blankUser, newUser)
    const uploadPromises = []
    console.log("data = ", data)

    try {
        uploadPromises.push(
            client.uploads
                .create({
                    path: data.headshot,
                    author: data.name,
                    copyright: data.name + " " + new Date().getFullYear(),
                    defaultFieldMetadata: {
                        en: {
                            alt: data.name,
                            title: data.name + " " + Date.now(),
                            customData: {
                                watermark: false,
                            },
                        },
                    },
                })
                .catch((err) => err)
        )
        if (data.resumeFile && !data.resumeFile.uploadId) {
            uploadPromises.push(
                client.uploads
                    .create({
                        path: data.resumeFile,
                        author: data.name,
                        copyright: data.name + " " + new Date().getFullYear(),
                        defaultFieldMetadata: {
                            en: {
                                alt: data.name + " Resume",
                                title: data.name + " Resume " + Date.now(),
                                customData: {
                                    watermark: false,
                                },
                            },
                        },
                    })
                    .catch((err) => err)
            )
        }

        const uploadResponses = await Promise.all(uploadPromises)

        data.headshot = { uploadId: uploadResponses[0].id }

        if (data.resumeFile && uploadResponses[1]) {
            data.resumeFile = { uploadId: uploadResponses[1].id }
        }

        console.log("data.headshot = ", data.headshot)

        const newUserRes = await client.items.create(data).catch((err) => {
            console.log("the issue is the User Upload!", data)
            return err
        })

        console.log("newUser = ", newUserRes)

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(newUserRes),
        }
    } catch (err) {
        console.log("An error was found!", err)

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(err),
        }
    }
}
