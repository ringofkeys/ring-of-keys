const { SiteClient, buildModularBlock } = require("datocms-client")
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
const NETLIFY_TRIGGER_ID = "8003"

async function handler(req, res) {
    const { id, ...fields } = JSON.parse(req.body)

    if (fields.name) {
        const authToken = await getAuth0Token()
        const auth0ID = await getAuth0UserID(authToken, id)

        let userID
        if (auth0ID instanceof Array) {
            userID = auth0ID[0].user_id
        }
        const nameResponse = await updateAuth0Name(
            authToken,
            userID,
            fields.name
        )
    }

    try {
        if (fields.socialMedia) {
            fields.socialMedia = fields.socialMedia.map(({ socialMediaLink }) =>
                buildModularBlock({
                    socialMediaLink,
                    itemType: "181488",
                })
            )
        }

        await client.items.update(id, fields)
        const item = await client.item.publish(id, {
            content_in_locales: [
                ''
            ],
            non_localized_content: true
        })
    
        if (Object.keys(fields).includes('isGenderConsultant')) {
            await triggerDatoBuildHook(NETLIFY_TRIGGER_ID)
        }
    
        res.status(200).json(item)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

export default handler

async function getAuth0Token() {
    const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            client_id: `${process.env.GATSBY_AUTH0_CLIENTID}`,
            client_secret: `${process.env.AUTH_SECRET}`,
            audience: `${process.env.AUTH0_NEXT_ISSUER}/api/v2/`,
            grant_type: "client_credentials",
            scope: "create:users read:users update:users",
        }),
    }

    return await fetch(
        `${process.env.AUTH0_NEXT_ISSUER}/oauth/token`,
        options
    )
        .then((res) => res.json())
        .catch((err) => console.error(err))
}

async function getAuth0UserID(auth, id) {
    const options = {
        method: "GET",
        headers: {
            authorization: `${auth["token_type"]} ${auth["access_token"]}`,
        },
    }

    return await fetch(
        `${process.env.AUTH0_NEXT_ISSUER}/api/v2/users?q=user_metadata.entity_id%3A%22${id}%22&fields=user_id&include_fields=true&search_engine=v3`,
        options
    )
        .then((res) => res.json())
        .catch((err) => console.error(err))
}

async function updateAuth0Name(auth, id, name) {
    const options = {
        method: "PATCH",
        headers: {
            authorization: `${auth["token_type"]} ${auth["access_token"]}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
        }),
    }

    return await fetch(
        `${process.env.AUTH0_NEXT_ISSUER}/api/v2/users/${id}`,
        options
    )
        .then((res) => res.json())
        .catch((err) => console.error(err))
}

async function triggerDatoBuildHook(buildTriggerId) {
    client.buildTriggers
        .trigger(buildTriggerId)
        .then(() => {
            console.log(`Done triggering build hook ${buildTriggerId}!`)
        })
        .catch((error) => {
            console.error(error)
        })
}