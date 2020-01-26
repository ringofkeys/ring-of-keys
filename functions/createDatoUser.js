require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

const otherFields = ['genderconsultantbio','isGenderConsultant','mainLocation','locations','socialMedia','featuredImage','headshot','resume','discipline','vocalRange','sexualIdentity','genderIdentity','name','isemailpublic','website','isMeetupAmbassador','keyTeamPosition','slug','quickBio','bio','keyTeamMember','email','pronouns']
const blankUser = {}
otherFields.forEach(field => blankUser[field] = field.substr(0, 2) === 'is' ? false : '')
blankUser.keyTeamMember = false
blankUser.socialMedia = []
blankUser.featuredImage = { uploadId: '1213483' }
blankUser.resume = { uploadId: '1213541' }

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

        if (newUser.resume && !newUser.resume.uploadId) {
            console.log('attempting resume upload!', newUser.resume)
            let resumeUpload = ''
            resumeUpload = await client.uploads.create({
                path:   data.resume,
                author: data.name,
                copyright: data.name +' '+ new Date().getFullYear(),
                defaultFieldMetadata: {
                    en: {
                        alt: data.name + " resume",
                        title: data.name+' '+Date.now(),
                        customData: {
                            watermark: false,
                        }
                    }
                }
            }).catch(err => {
                console.error('the issue is the Resume Upload!')
                return err
            })
            data.resume = { uploadId: resumeUpload.id }
        }

        const newUser = await client.items.create({
            ...data,
            itemType: '177050'
        }).catch(err => {
            console.error('the issue is the User Upload!'. data)
            return err
        })

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(newUser),
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: err.message,
        }
    }
}