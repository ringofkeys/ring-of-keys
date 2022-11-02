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

    const uploadPromises = Object.entries(user)
        .map(([fieldName, fieldValue]) => {
            console.log(fieldName, fieldValue)
            if (typeof fieldValue === "object" && fieldValue.path) {
                return client.uploads.create(fieldValue)
            }
            return false
        })

    const uploads = await Promise.all(uploadPromises)

    console.log({ uploads })

    uploads.forEach((responseData, i) => {
        if (!responseData) return

        const userObjKey = Object.keys(user)[i]
        console.log({ userObjKey, id: responseData.id })

        user[userObjKey] = {
            uploadId: responseData.id
        }
    })

    console.log('after uploads', user)

    const newUserRes = await client.items.create(user).catch((err) => {
        console.log("the issue is the User Upload!", user)
        return err
    })

    console.log({newUserRes})

    res.status(200).json(newUserRes)
}

export default handler
