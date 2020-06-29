import React from 'react'
import CheckboxGrid from './checkboxgrid'
import { Field } from './formfields'
import { handleUpdateSubmit } from '../utils/profileEditor'
import icon_close from '../images/icon_close.svg'


const FieldEditForm = ({ id, field, handleClose, isSubmitting, label, pattern, handleUpdate,
    type, helpText, initialVals, initialOther }) => (
    <div id={id} className={'profile_field_group ' + type}>
    <form onSubmit={e => {
        e.persist()
        e.preventDefault()

        const isFile = !!e.target.elements[0].files
        let dataVal = ''
        if (isFile) {
            dataVal = e.target.elements[0].files[0]
        } else if (type === 'checkbox') {
            dataVal = ([]).slice.call(e.target.elements)
                .filter(el => !el.classList.contains('visually-hidden'))
                .map((el,i) => el.checked ? field.data[i] : el.value)
                .filter(value => value)
                .join(', ')
        } else if (type === 'link') {
            dataVal = e.target.elements[0].value.startsWith('http')
                ? e.target.elements[0].value
                : 'https://' + e.target.elements[0].value
        } else {
            dataVal = e.target.elements[0].value
        }

        // handleUpdate(dataVal)
        handleUpdateSubmit(dataVal, {userId, field, handleClose, setSubmitting, handleUpdate}, isFile)
    }}>
        { type === 'textarea' &&
            <textarea placeholder={ field.data } defaultValue={ field.data } required />
        }
        { type === 'checkbox' &&
            <CheckboxGrid label={ label } helpText={ helpText }
            fieldData={ field.data }>
                {field.data.map((f,i) => (
                    <Field type='checkbox' name={`${ field.fieldName }[${i}]`} label={ f } key={ f } defaultChecked={ initialVals[i] } />
                ))}
                <Field type='text' name={ `${ field.fieldName }Other` } label='Other' 
                    defaultValue={ initialOther }/>
            </CheckboxGrid>
        }
        { (type !== 'textarea' && type !== 'checkbox') &&
            <input type={ type } defaultValue={ field.data } pattern={ pattern ? pattern : '.*' } required />
        }
        <button className='btn bg_slate btn_submit' type='submit' className={`btn ${isSubmitting ? 'submitting' : ''}`}>
            { isSubmitting ? 'Loading...' : 'Update' }
        </button>
    </form>
    <button className='btn_edit edit_field' onClick={handleClose}>
        <img src={ icon_close } className='icon_edit' alt={`close`} />
        <span className='tooltip'>Cancel Edit</span>
    </button>
</div>)

export default FieldEditForm