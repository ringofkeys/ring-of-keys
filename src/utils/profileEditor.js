import { uploadFile } from '../utils/datoUploads'

export const publishDato = async function(id) {
    const publishRes = await fetch(process.env.FUNCTIONS_HOST || '' + '/.netlify/functions/publishDeployDato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id
        }),
    }).catch(err => console.error(err))

    return publishRes
}

export async function updateFields(id, name, data) {
    id = id.match(/-(\d+)-/)[1]

    const fieldEditRes = await fetch(process.env.FUNCTIONS_HOST || '' + '/.netlify/functions/updateDatoFields', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            id,
            name,
            data,
        }),
    }).catch(err => console.error(err))

    const publishRes = await publishDato(id)
        .catch(err => console.error(err))

    return [fieldEditRes, publishRes]
}

export async function handleFileSubmit(event, field, editorState) {
    event.preventDefault()
    event.persist()

    editorState.setSubmitting(true)
    try {
        const file = event.target.elements[0].files[0]
        const uploadRes = await uploadFile(file).catch(err => console.error(err))

        field.setFieldValue({ url: URL.createObjectURL(file), alt: 'newly uploaded image'})
        field.updateField(field.fieldName, uploadRes[0].id)
    } catch(err) {
        console.error(err)
    }
    editorState.setSubmitting(false)
    field.setEditing(false)
}

export function fieldArrayToString(field) {
    return field.data
        .map((val, i, arr) => (val && i < arr.length - 1) ? field.refArray[i] : val)
        .filter(val => val).join(', ')
}

export function decodeHTMLEntities(htmlString) {
    const txtArea = document.createElement('textarea')
    txtArea.innerHTML = htmlString
    const decodedHTML = txtArea.value
    txtArea.remove()
    return decodedHTML
}