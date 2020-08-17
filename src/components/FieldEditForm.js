import React from 'react'
import CheckboxGrid from './checkboxgrid'
import { Field } from './formfields'
import icon_close from '../images/icon_close.svg'


const FieldEditForm = ({ id, field, handleClose, isSubmitting, label, pattern, handleUpdate,
    type, helpText }) => (
    <div id={id} className={'profile_field_group ' + type}>
    <form onSubmit={e => {
        e.persist()
        e.preventDefault()

        const dataVal = getFieldValues(e, field)

        handleUpdate(dataVal)
    }}>
        { type === 'textarea' &&
            <textarea placeholder={ field.data } defaultValue={ field.data } required />
        }
        { type === 'checkbox' &&
            <CheckboxGrid label={ label } helpText={ helpText }
            fieldData={ field.data }>
                {field.refArray.map((f,i) => (
                    <Field type='checkbox' name={`${ field.fieldName }[${i}]`} label={ f } key={ f } defaultChecked={ field.data[i] } />
                ))}
                <Field type='text' name={ `${ field.fieldName }-Other` } label='Other' 
                    defaultValue={ field.data[field.data.length-1] || ''  }/>
            </CheckboxGrid>
        }
        { (type !== 'textarea' && type !== 'checkbox') &&
            <input type={ type } defaultValue={ field.data } pattern={ pattern ? pattern : '.*' } required />
        }
        <button type='submit' className={`btn bg_slate btn_submit ${isSubmitting ? 'submitting' : ''}`}>
            { isSubmitting ? 'Loading...' : 'Update' }
        </button>
    </form>
    <button className='btn_edit edit_field' onClick={handleClose}>
        <img src={ icon_close } className='icon_edit' alt={`close`} />
        <span className='tooltip'>Cancel Edit</span>
    </button>
</div>)

export default FieldEditForm

function getFieldValues(e, field) {
    if (!!e.target.elements[0].files) {
        return e.target.elements[0].files[0]
    } else if (field.type === 'checkbox') {
        const elArray = ([]).slice.call(e.target.elements)
            .filter(el => !el.classList.contains('visually-hidden'))

        const checkboxes = elArray.filter(el => el.type === 'checkbox')
            .map(el => el.checked)

        const otherVal = elArray.filter(el => el.type === 'text')[0].value

        console.log('otherVal', otherVal)

        return [...checkboxes, otherVal]
    } else if (field.type === 'link') {
        return e.target.elements[0].value.startsWith('http')
            ? e.target.elements[0].value
            : 'https://' + e.target.elements[0].value
    } else {
        return e.target.elements[0].value
    }
}