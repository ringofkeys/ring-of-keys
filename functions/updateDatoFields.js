const { SiteClient, buildModularBlock } = require('datocms-client')
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
const fileFields = ['headshot', 'featuredImage']
const acceptedOrigins = ['https://ringofkeys.org', 'http://localhost:8000', 'http://localhost:8888']

exports.handler = async (event, context, callback) => {
    if (event.httpMethod === 'OPTIONS') {
        if (acceptedOrigins.some(origin => origin === event.headers.origin)) {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': event.headers.origin,
                    'Access-Control-Allow-Headers': ['Content-Type'],
                },
            })
        } else {
            callback(new Error('Unauthorized origin: called from ', event.headers.origin), {
                statusCode: 403,
                headers: {
                    'Access-Control-Allow-Origin': 'localhost',
                    'Access-Control-Allow-Headers': ['Content-Type'],
                },
            })
        }
    } else {
        try {
            const { id, name, data, newName } = JSON.parse(event.body)
            let nameChangeSuccessful = false

            if (newName) {
                const authToken = await getAuth0Token()
                console.log('auth0 token', authToken)
                const auth0ID = await getAuth0UserID(authToken, id)
                console.log('authID', auth0ID)
                let userID
                if (auth0ID instanceof Array) {
                    userID = auth0ID[0].user_id
                }
                const nameResponse = await updateAuth0Name(authToken, userID, data.name)
                console.log('name change response:', nameResponse)
                nameChangeSuccessful = true
            }

            const fileFildePromises = await Promise.all(fileFields.map(async fileField => {
                if (!data[fileField]) return

                return await client.uploads.create({
                    path:   data[fileField],
                    author: `${ name ? name : id } via profile editor`,
                    defaultFieldMetadata: {
                        en: {
                            alt: `editor-uploaded image of ${ name ? name : id}`,
                            title: `${ name ? name : id }, ${ fileField } via Editor, ${ new Date().toLocaleTimeString() +' '+ new Date().toLocaleDateString() }`,
                            customData: {
                                watermark: false,
                            }
                        }
                    }
                }).then(uploadRes => {
                    console.log('uploadRes', uploadRes)
                    data[fileField] = { uploadId: uploadRes.id }
                }).catch(err => console.error(err))
            }))

            if (data.socialMedia) {
                data.socialMedia = data.socialMedia.map(({ socialMediaLink }) => buildModularBlock({
                    socialMediaLink,
                    itemType: '181488',
                }))
            }

            const updateRes = await client.items.update(id, data).catch(err => console.error(err))

            console.log('updateRes', JSON.stringify(updateRes, null, 2))

            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify((newName && nameChangeSuccessful) ? { nameChangeSuccessful, updateRes } : updateRes),
            })
        } catch (err) {
            callback(err, {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err),
            })
        }
    }
}

async function getAuth0Token() {
    const options = { 
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
        client_id: `${process.env.GATSBY_AUTH0_CLIENTID}`,
        client_secret: `${process.env.AUTH_SECRET}`,
        audience: `https://${ process.env.GATSBY_AUTH0_DOMAIN }/api/v2/`,
        grant_type: "client_credentials",
        scope: 'create:users read:users update:users',
        }),
    }

    return await fetch(`https://${ process.env.GATSBY_AUTH0_DOMAIN }/oauth/token`, options)
        .then(res => res.json()).catch(err => console.error(err))
}

async function getAuth0UserID(auth, id) {
    const options = {
        method: 'GET',
        headers: {
            authorization: `${auth['token_type']} ${auth['access_token']}`,
        },
    }

    return await fetch(`https://${ process.env.GATSBY_AUTH0_DOMAIN }/api/v2/users?q=user_metadata.entity_id%3A%22${ id }%22&fields=user_id&include_fields=true&search_engine=v3`, options)
        .then(res => res.json()).catch(err => console.error(err))
}

async function updateAuth0Name(auth, id, name) {
    const options = {
        method: 'PATCH',
        headers: {
            authorization: `${auth['token_type']} ${auth['access_token']}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name
        })
    }

    return await fetch(`https://${ process.env.GATSBY_AUTH0_DOMAIN }/api/v2/users/${ id }`, options)
        .then(res => res.json()).catch(err => console.error(err))
  }