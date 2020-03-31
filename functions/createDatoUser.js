require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

const otherFields = [
    'genderconsultantbio','isGenderConsultant','genderConsultantOrder',
    'mainLocation','locations',
    'socialMedia','featuredImage','headshot','resume','discipline','vocalRange',
    'danceExperience','sexualIdentity','genderIdentity','name','website',
    'showInDirectory','isMeetupAmbassador','meetupAmbassadorOrder','keyTeamPosition',
    'slug','quickBio','bio','keyTeamMember','keyTeamOrder','email','pronouns','memberSince'
]
const blankUser = {}
otherFields.forEach(field => blankUser[field] = field.substr(0, 2) === 'is' ? false : '')
blankUser.keyTeamMember = false
blankUser.showInDirectory = true
blankUser.hasLoginAccess = true
blankUser.socialMedia = []
blankUser.featuredImage = { uploadId: '1213483' }
// blankUser.resume = { uploadId: '1213541' }
blankUser.keyTeamOrder = 5
blankUser.meetupAmbassadorOrder = 8
blankUser.genderConsultantOrder = 8
blankUser.itemType = '177050'

exports.handler = async (event) => {
    console.log('function is called!', event.body)

    const newUser = JSON.parse(event.body)
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