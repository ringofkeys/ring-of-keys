import React from 'react'
import socialIcons from '../../images/social-icons/socialIcons.js'
import { handleUpdateSubmit } from '../../utils/profileEditor'
import Popup from '../popup'
const urlRegExpStr = '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'


const HeroSocialMediaEditor = ({ userId, field, editorState }) => (
    <Popup isOpen={ field.isEditing } onClose={ () => field.setEditing(false) } >
        <h2 className=''>Set Social Media Links</h2>
        <p>
            Go to your social media profile and copy &amp; paste the URL from the browser in the appropriate field 
        </p>
        <form id='edit-social-media' onSubmit={e => {
            e.preventDefault()
            e.persist()

            const data = ([]).slice.call(e.target.elements).filter(el => el.value)
                .map(el => (el.value.startsWith('http')) ? el.value : 'https://' + el.value)

            handleUpdateSubmit(data, {
                userId,
                field: 'socialMedia',
                setSubmitting: editorState.setSubmitting,
                handleUpdate: (newVal) => {
                    field.setFieldValue(newVal)
                    field.updateField(field.fieldName, newVal)
                    editorState.setSubmitted(true)
                },
                handleClose: () => field.setEditing(false)
            }, false)
        }}>
            { Object.keys(socialIcons).map(key => {
                const s = field.data.find(socialObj => socialObj.socialMediaLink.includes(key))
                return (
            <div className='icon-field'>
                <img src={ socialIcons[key] } alt={`${ key }`} />
                <label>{ key + ' Link' }
                    <input type='text' name={ key } defaultValue={ s ? s.socialMediaLink : '' }
                    pattern={ urlRegExpStr }/>
                </label>
            </div>
            )})}
            <div className='file-drop_btns'>
                <button className='btn btn-link_ghost' onClick={() => field.setEditing(false)}>
                    Cancel
                </button>
                <button type='submit' disabled={ editorState.isSubmitting } className={`btn ${editorState.isSubmitting ? 'submitting' : ''}`}>
                    { editorState.isSubmitting ? 'Loading...' : 'Save' }
                </button>
            </div>
        </form>
    </Popup>
)

export default HeroSocialMediaEditor