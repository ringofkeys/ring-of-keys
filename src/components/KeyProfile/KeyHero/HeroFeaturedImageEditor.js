import { useContext, useState } from "react"
import { ProfileContext } from "pages/keys/[slug]"
import Popup from "components/Popup"
import popupStyles from 'components/Popup/Popup.module.css'
import FileDrop from "components/FileDrop"
import { getDatoWriteClient } from "lib/datocms"
import { useSession } from "next-auth/react"
import { toKebabCase } from "lib/utils"

function HeroFeaturedImageEditor({
    isOpen = false,
    onClose=() => { console.log('closing featured image editor!') }
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
                title: artist?.name + ' Featured Image',
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
                featuredImage: { uploadId: upload.id },
            }),
            Headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(data => {
                artistDispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                        featuredImage: buildFeaturedImageObj(upload),
                    }
                })
            })


        onClose()
    }

    return (<Popup isOpen={isOpen} onClose={onClose}>
        <h2>Change Cover Photo</h2>
        <form
            id="edit-featured-image"
            onSubmit={handleSubmit}
        >
            {(!isSubmitting)
                ? <FileDrop helpText="For best results, use a 3:1 aspect ratio and keep file size below 2Mb" />
                : <>
                    <label>
                        Upload Progress
                        <progress id="file" max="100" value={uploadProgress} />
                    </label>
                  </>
            }
            <div className={popupStyles.buttonRow}>
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

export default HeroFeaturedImageEditor

function buildFeaturedImageObj(featuredImage) {
    return {
        responsiveImage: {
            src: featuredImage.url + '?auto',
            altText: featuredImage.altText,
        },
    }
}
