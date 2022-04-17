import { uploadFile } from "../utils/datoUploads"
const fnDomain = process.env.FUNCTIONS_HOST ? process.env.FUNCTIONS_HOST : ""

export const publishDato = async function (id) {
    const publishRes = await fetch(
        fnDomain + "/.netlify/functions/publishDeployDato",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        }
    ).catch((err) => console.error(err))

    return publishRes
}

export async function updateFields(id, name, data, newName) {
    id =
        typeof id === "string" && id.includes("-") ? id.match(/-(\d+)-/)[1] : id

    const fieldEditRes = await fetch(
        fnDomain + "/.netlify/functions/updateDatoFields",
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                id,
                name,
                data,
                newName,
            }),
        }
    )
        .then((res) => res.json())
        .catch((err) => console.error(err))

    const publishRes = await publishDato(id)
        .then((res) => res.json())
        .catch((err) => console.error(err))

    return [fieldEditRes, publishRes]
}

export async function handleFileSubmit(event, field, editorState) {
    event.preventDefault()
    event.persist()

    editorState.setSubmitting(true)
    try {
        const file = event.target.elements[0].files[0]
        const uploadRes = await uploadFile(file).catch((err) =>
            console.error(err)
        )

        field.setFieldValue({
            url: URL.createObjectURL(file),
            alt: "newly uploaded image",
        })
        field.updateField(field.fieldName, uploadRes[0].id)
    } catch (err) {
        console.error(err)
    }
    editorState.setSubmitting(false)
    field.setEditing(false)
}

export function fieldArrayToString(field, joinChar = ", ") {
    return field.data
        .map((val, i, arr) =>
            val && i < arr.length - 1 ? field.refArray[i] : val
        )
        .filter((val) => val)
        .join(joinChar)
}

export function decodeHTMLEntities(htmlString) {
    const txtArea = document.createElement("textarea")
    txtArea.innerHTML = htmlString
    const decodedHTML = txtArea.value
    txtArea.remove()
    return decodedHTML
}
