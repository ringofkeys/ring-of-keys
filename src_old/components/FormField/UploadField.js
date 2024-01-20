import React, { useState } from "react"
import InfoIcon from "./InfoIcon"
import styles from "./FormField.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { buildClient } from "@datocms/cma-client-browser"
import { slugify } from "lib/utils"

export default function FormField({
    name,
    label,
    placeholder,
    className = "",
    inputClasses,
    helpText,
    onUploadComplete,
    required = true,
    author,
    ...rest
}) {
    const client = buildClient({ apiToken: process.env.NEXT_PUBLIC_DATO_READ_WRITE_TOKEN })
    const [state, setState] = useState('initial')
    const [uploadProgress, setUploadProgress] = useState(0)

    function validateFileSize(e) {
        if (e.target.files[0]) {
            const file = e.target.files[0]

            // Error if file is larger than 4Mb
            if (file.size > 4000000) {
                e.target.required = true
                const errMessage = `This file is ${(file.size / 1_000_000).toFixed(1)}Mb, please upload one smaller than 4Mb.`
                e.target.setCustomValidity(errMessage)
                return false
            } else {
                e.target.setCustomValidity('')
                return true
            }
        }
    }

    function handleUploadChange(e) {
        const isValid = validateFileSize(e)
        if (!isValid) return
        
        const file = e.target.files[0]
        setState('loading')

        const now = new Date()

        const fileName = author + " " + name

        return client.uploads.createFromFileOrBlob({
            // File object to upload
            fileOrBlob: file,
            filename: slugify(fileName) + '.png',
            skipCreationIfAlreadyExists: true,
            onProgress: (info) => {
                if (info.type === 'UPLOADING_FILE') {
                    setUploadProgress(info.payload.progress)
                }
            },
            copyright: `${author} ${now.getFullYear()}`,
            author,
            default_field_metadata: {
                en: {
                    alt: fileName,
                    title: fileName + " " + now.toLocaleString(),
                    custom_data: {
                        watermark: false,
                    },
                },
            },
        }).catch(e => {
            console.error(e)
            setState('error')
        }).then(res => {
            console.log(res)
            setState('success')
            onUploadComplete(name, res)
        })
      }

    function getStateIcon(state) {
        switch (state) {
            case 'initial':
                return null
            case 'loading':
                return <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
            case 'success':
                return <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />
            case 'error':
                return <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-red-500" />
            default:
                return null
        }
    }

    return (
        <div
            className={
                styles.field + ' file ' + 
                (className ? className : "")
            }
        >
            {label && (
                <label
                    htmlFor={name}
                    className={`${required ? styles["is-required"] : ""}`}
                >
                    {label}
                    {helpText && <InfoIcon infoText={helpText} />}
                </label>
            )}
            <div className="flex gap-2 items-center">
                <input
                    id={name}
                    name={name}
                    type='file'
                    className={inputClasses}
                    onChange={handleUploadChange}
                    {...rest}
                />
                {getStateIcon(state)}
            </div>
            <progress className={styles.progress + ((state === 'loading' && uploadProgress > 0) ? '' : ' opacity-0')} value={uploadProgress / 100} />
        </div>
    )
}
