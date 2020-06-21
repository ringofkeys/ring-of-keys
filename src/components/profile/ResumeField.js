import React from 'react'
import FieldEditForm from '../FieldEditForm'
import profileIcons from '../../images/profile-icons/profileIcons.js'

const ResumeField = ({ field, setSubmitted, isSubmitting, setSubmitting, isEditable, urlRegExpStr, userId }) => {
    return (!isEditable
        ? <a className='btn btn_resume' href={ field.data ? field.data : '' } rel='noopener noreferrer' target='_blank'>
            View Resume
          </a>
        : !field.isEditing
            ? <div className='profile_field_group file'>
                <a className={`btn btn_resume ${ field.data ? '' : 'btn-link_ghost' }`}
                    href={ field.data ? field.data : '' } rel='noopener noreferrer' target='_blank'>
                        { field.data ? 'View Resume' : 'No Resume Link' }
                </a>
                <button className='btn_edit edit_field' onClick={() => field.setEditing(true)}>
                    <img src={ profileIcons.pencil } className='icon_edit' alt={`edit field`} />
                    <span className='tooltip'>Change { field.label }</span>
                </button>
            </div>
            : <>
                <h3>Resume</h3>
                <FieldEditForm type='link' key={field.fieldName+'-form'} userId={ userId } handleClose={() => field.setEditing(false)}
                field={field.fieldName} val={field.data} handleUpdate={(newVal) => {
                    field.setFieldValue(newVal)
                    setSubmitted(true)
                }} pattern={ urlRegExpStr }
                isSubmitting={ isSubmitting } setSubmitting={ setSubmitting }/>
            </>
    )
}

export default ResumeField
