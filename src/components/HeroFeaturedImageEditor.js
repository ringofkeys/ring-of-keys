import React from 'react'
import { handleUpdateSubmit } from '../utils/profileEditor'
import Popup from './popup'
import FileDrop from './filedrop'

const HeroFeaturedImageEditor = ({ userId, field, editorState}) => (
    <Popup isOpen={ field.isEditing } onClose={ () => field.setEditing(false) } >
        <h2 className='file-drop_h2'>Change Cover Photo</h2>
        <form id='edit-featured-image' onSubmit={ e => {
            e.preventDefault()
            e.persist()

            handleUpdateSubmit(e.target.elements[0].files[0], {
                userId,
                field: 'featuredImage',
                setSubmitting: editorState.setSubmitting,
                handleUpdate: (newVal) => {
                    field.setFieldValue({ url: newVal, alt: 'newly uploaded image'})
                    editorState.setSubmitted(true)
                },
                handleClose: () => field.setEditing(false),
            }, true)
        }}>
            <FileDrop helpText='For best results, use a 3:1 aspect ratio and keep file size below 2Mb'/>
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

export default HeroFeaturedImageEditor