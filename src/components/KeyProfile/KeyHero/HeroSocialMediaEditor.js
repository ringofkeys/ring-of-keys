import FormField from "components/FormField"
import Popup from "components/Popup/Popup.js"
import popupStyles from 'components/Popup/Popup.module.css'
import { ProfileContext } from "pages/keys/[slug].js"
import { useContext, useState } from "react"
import { socialIcons } from 'lib/constants'

const HeroSocialMediaEditor = ({ isOpen = false,
    onClose=() => { console.log('closing hero editor!') }
}) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const {
        artist: {
            id,
            socialMedia,
        },
        artistDispatch,
    } = useContext(ProfileContext)

    function handleSubmit(e){
        e.preventDefault()
        e.persist()
        setSubmitting(true)

        const processedNewSocialMedia = Array.from(e.target.elements)
            .filter((el) => el.value)
            .map((el) => {
                return {
                    socialMediaLink: el.value.startsWith("http")
                        ? el.value
                        : "https://" + el.value,
                }
            })

        fetch('/api/updateKey', {
            method: 'POST',
            body: JSON.stringify({
                id,
                socialMedia: processedNewSocialMedia,
            }),
            Headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(responseData => {
                console.log({ responseData })
                setSubmitting(false)
            })


        artistDispatch({
            type: 'UPDATE_FIELD',
            payload: { socialMedia: processedNewSocialMedia }
        })

        onClose()
    }

    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <h2>Set Social Media Links</h2>
            <p>
                Go to your social media profile and copy &amp; paste the URL from
                the browser in the appropriate field
            </p>
            <form
                id="edit-social-media"
                onSubmit={handleSubmit}
            >
                {Object.keys(socialIcons).map((key) => {
                    const hasLink =
                        socialMedia.find(
                            (socialObj) =>
                                socialObj.socialMediaLink.includes(
                                    key
                                )
                        )
                    return (
                        <FormField
                            name={key}
                            label={key.slice(0, 1).toUpperCase() + key.slice(1) + ' Link'}
                            type="url"
                            key={key}
                            defaultValue={(hasLink) ? hasLink.socialMediaLink : ''}
                        />
                    )
                })}
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
        </Popup>
    )
}

export default HeroSocialMediaEditor
