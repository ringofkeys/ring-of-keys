import React from 'react'
import FieldEditForm from './FieldEditForm.js'
import InfoIcon from './infoicon.js'
import profileIcons from '../images/profile-icons/profileIcons.js'


const BodyInfoField = ({ field, index, isEditable, setSubmitted, userId }) => {

    return (<>
    { (field.data || isEditable) 
        && <h3>
            { field.label }
            { field.infoText && <InfoIcon infoText={ field.infoText } /> }
           </h3> }
    { !isEditable
        ? field.data && (<p>{ !field.data.includes('http') ? field.data
            : <a href={ field.data } rel='noopener noreferrer' target='_blank'>{ field.data }</a> }</p>)
        : (!field.isEditing) 
            ? (<div className='profile_field_group'>
                <p>{ (!field.data.includes('http')) ? (field.data ? field.data : <span className='unfilled-field'>Add some info here!</span>)
                    : <a href={ field.data ? field.data : ''} rel='noopener noreferrer' target='_blank'>{
                        field.data ? field.data : <span className='unfilled-field'>'Add a URL here!'</span>
                }</a> }</p>
                <button className='btn_edit edit_field' onClick={() => field.setEditing(true)}>
                    <img src={ profileIcons.pencil } className='icon_edit' alt={`edit field`} />
                    <span className='tooltip'>Change { field.label }</span>
                </button>
              </div>)
            : <FieldEditForm type={ field.type } key={ field.fieldName+'-form-'+index} userId={ userId } handleClose={() => field.setEditing(false)}
            field={ field.fieldName } val={ field.refArray ? field.refArray : field.data} label={ field.label } helpText={ field.helpText }
            initialVals={ field.initialVals } initialOther={ field.initialOther }
            handleUpdate={(newVal) => {
                if (newVal instanceof Array) { field.setFieldValue(newVal.join(', ')) }
                else { field.setFieldValue(newVal) }
                setSubmitted(true)
            }}
            isSubmitting={ field.isSubmitting } setSubmitting={ field.setSubmitting }/>
    }</>)
}

export default BodyInfoField