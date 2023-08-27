import { SiteClient } from "datocms-client"
const DATO_KEY_ITEM_TYPE = "177050"
const client = new SiteClient(process.env.NEXT_DATO_API_TOKEN);

const fillerData = {
    itemType: DATO_KEY_ITEM_TYPE,
    memberSince: new Date().getFullYear().toString(),
}

async function handler(req, res) {
    const user = Object.assign(JSON.parse(req.body), fillerData)
    console.log({ user })

    return client.items.create(user).catch((err) => {
        console.log("the issue is the User Upload!", user)
        return res.status(500).json(err)
    }).then(newUserRes => {
        console.log({newUserRes})
    
        return res.status(200).json(newUserRes)
    })

}

export default handler
