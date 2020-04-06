import { uploadFile } from '../utils/datoUploads'

export const publishDato = async function(id) {
    const publishRes = await fetch('/.netlify/functions/publishDeployDato', {
        method: 'POST',
        body: JSON.stringify({
            id
        }),
    }).catch(err => console.error(err))

    return publishRes
}

export const updateField = async function(id, data, isFile) {
    const fieldEditRes = await fetch('/.netlify/functions/updateDatoField', {
        method: 'POST',
        body: JSON.stringify({
            id,
            data,
            isFile
        }),
    }).catch(err => console.error(err))

    return fieldEditRes
}

export const handleUpdateSubmit = async function(dataValue, { userId, field, setSubmitting, handleUpdate, handleClose }, isFile) {
    setSubmitting(true)
    
    let updateRes = {status: 500}

    try {
        let file = {}
        if (isFile) {
            file = dataValue
            const uploadRes = await uploadFile(dataValue).catch(err => console.error(err))
            dataValue = uploadRes[0].id
        }

        const itemId = userId.match(/-(\d+)-/)[1]

        updateRes = await updateField(itemId, { [field]: dataValue }, isFile)
        console.log('updateRes = ', updateRes)
        
        if (updateRes.status === 200) {
            if (isFile) {
                const newUrl = URL.createObjectURL(file)
                console.log('new URL = ', newUrl)
                handleUpdate(newUrl)
            } else if (field === 'socialMedia') {
                handleUpdate(dataValue.map(link => { return { socialMediaLink: link }})) // transform back into the format of the API
            } else {
                handleUpdate(dataValue)
            }
            handleClose()
            publishDato(itemId).then(res => console.log('publishRes = ', res))
        } else {
            console.log('bad response!')
        }
    } catch (err) {
        console.error(err, 'response body = ', JSON.parse(err.body))
    }

    setSubmitting(false)    
}