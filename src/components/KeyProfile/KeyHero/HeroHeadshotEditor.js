import React, { useContext, useState } from "react"
// import { handleFileSubmit } from "../../utils/profileEditor"
// import FileDrop from "../filedrop"
import { ProfileContext } from "pages/keys/[slug]"
import Popup from "components/Popup"
import FileDrop from "components/FileDrop"
import { getDatoWriteClient } from "lib/datocms"
import { useSession } from "next-auth/react"
import { toKebabCase } from "lib/utils"

function HeroHeadshotEditor({
    isOpen = false,
    onClose=() => { console.log('closing hero editor!') }
}) {
    const { 
        artist,
        artistDispatch,
    } = useContext(ProfileContext)
    const { data: session } = useSession()
    const [isSubmitting, setSubmitting] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        
        const file = e.currentTarget.elements.file?.files[0]
        const client = getDatoWriteClient(artist?.id, session?.token.datoId)
        console.log('from profile form', {
            file: e.currentTarget.elements.file?.files[0],
            client,
            artist,
        })

        // upload File object
        const path = await client.createUploadPath(file, {
            filename: toKebabCase(artist?.name) + file.type.replace('image/', ''),
            onProgress: (event) => {
                const { type, payload } = event;
                switch (type) {
                // fired before starting upload
                case 'uploadRequestComplete':
                    console.log(payload.id, payload.url);
                    break;
                // fired during upload
                case 'upload':
                    console.log(payload.percent);
                    setUploadProgress(payload.percent)
                    break;
                // (Node.js only) fired during download of a remote file
                case 'download':
                    console.log(payload.percent);
                    break;
                default:
                    break;
                }
            },
        });
        // you can then use the returned path to create a new upload:
        const upload = await client.uploads.create({
            path,
            author: artist?.name,
            copyright: artist?.name,
            defaultFieldMetadata: {
            en: {
                alt: artist?.name,
                title: artist?.name + ' Headshot',
                customData: {
                    watermark: true,
                },
            },
            },
        });

        console.log({ upload })
        setSubmitting(false)

        fetch('/api/updateKey', {
            method: 'POST',
            body: JSON.stringify({
                id: artist.id,
                headshot: { uploadId: upload.id },
            }),
            Headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(data => {
                console.log('got some data!', data)

                artistDispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                        headshot: buildHeadshotObj(upload),
                    }
                })
            })


        onClose()
    }

    return (<Popup isOpen={isOpen}>
        <h2 className="file-drop_h2">Change Profile Photo</h2>
        <form
            id="edit-headshot"
            onSubmit={handleSubmit}
        >
            {(!isSubmitting)
                ? <FileDrop helpText="For best results, keep file size below 2Mb" />
                : <>
                    <label>
                        Upload Progress
                        <progress id="file" max="100" value={uploadProgress} />
                    </label>
                  </>
            }
            <div className="file-drop_btns">
                <button
                    className="btn btn-link_ghost"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn ${
                        isSubmitting ? "submitting" : ""
                    }`}
                >
                    {isSubmitting ? "Loading..." : "Save"}
                </button>
            </div>
        </form>
    </Popup>)
}

export default HeroHeadshotEditor

function buildHeadshotObj(headshot) {
    return {
        responsiveImage: {
            src: headshot.url + '?auto=format&facepad=50&fit=facearea&h=300&w=300',
            width: 300,
            height: 300,
            aspectRatio: 1,
            altText: headshot.altText,
        },
        fullRes: {
            src: headshot.url + '?auto=format&w=960',
            altText: headshot.altText,
        }
    }
}
