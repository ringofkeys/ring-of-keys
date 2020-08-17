import React from 'react'
import FieldEditForm from '../FieldEditForm'
import profileIcons from '../../images/profile-icons/profileIcons.js'

const BioField = ({ userId, field, editorState }) => (
    <div className='my_story'>
        <h2>My Story</h2>
        <div>
            { !editorState.isEditable
                ? <p>{ field.data }</p>
                :  (!field.isEditing)
                    ? <div className='profile_field_group'>
                        <p>{ field.data
                            ? field.data
                            : <span className='unfilled-field'>
                                Here is where you can add your bio so people know your background, your interests,
                                and all your strengths. Tell us your story!
                                </span>
                        }</p>
                        <button className='btn_edit edit_field' onClick={() => field.setEditing(true)}>
                            <img src={ profileIcons.pencil } className='icon_edit' alt={`edit field`} />
                            <span className='tooltip'>Change { field.label }</span>
                        </button>
                    </div>
                    : <FieldEditForm type='textarea'
                        key={field.fieldName+'-form'}
                        userId={ userId }
                        handleClose={() => field.setEditing(false)}
                        field={field}
                        val={field.data}
                        initialVals={ field.initialVals }
                        handleUpdate={(newVal) => {
                            field.setFieldValue(newVal)
                            field.updateField(field.fieldName, newVal)
                            field.setEditing(false)
                        }}
                        isSubmitting={editorState.isSubmitting}
                        setSubmitting={editorState.setSubmitting}/>
            }
        </div>
    </div>
)

export default BioField