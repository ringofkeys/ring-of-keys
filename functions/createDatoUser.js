require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

const otherFields = [
    'bio',
    'danceExperience',
    'discipline',
    'email',
    'featuredImage',
    'genderconsultantbio',
    'genderIdentity',
    'headshot',
    'isGenderConsultant', 
    'isMeetupAmbassador',
    'keyTeamPosition',
    'locations',
    'mainLocation',
    'name',
    'pronouns',
    'quickBio',
    'sexualIdentity',
    'slug',
    'resume',
    'vocalRange',
    'website',
]
const blankUser = {
    featuredImage: { uploadId: '1213483' },
    genderConsultantOrder: 8,
    hasLoginAccess: true,
    keyTeamMember: false,
    keyTeamOrder: 5,
    meetupAmbassadorOrder: 8,
    memberSince: new Date().getFullYear().toString(),
    showInDirectory: true,
    socialMedia: [],
    itemType: '177050',
}
otherFields.forEach(field => blankUser[field] = field.startsWith('is') ? false : '')

exports.handler = async (event) => {
    console.log('function is called!', event.body)

    const newUser = JSON.parse(event.body)

    // overwrite default user object with any existing fields from newUser
    const data = Object.assign(blankUser, newUser)

    console.log('data = ', data)

    try {
        const headshotUpload = await client.uploads.create({
            path:   data.headshot,
            author: data.name,
            copyright: data.name +' '+ new Date().getFullYear(),
            defaultFieldMetadata: {
                en: {
                    alt: data.name,
                    title: data.name+' '+Date.now(),
                    customData: {
                        watermark: false,
                    }
                }
            }
        }).catch(err => err)
        data.headshot = { uploadId: headshotUpload.id }

        console.log('data.headshot = ', data.headshot)

        
        const newUserRes = await client.items.create(data).catch(err => {
            console.log('the issue is the User Upload!', data)
            return err
        })

        console.log('newUser = ', newUserRes)


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(newUserRes),
        }
    } catch (err) {
        console.log('An error was found!', err)

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err),
        }
    }
}