import { camelCaseToLabel } from "lib/utils"
import { ProfileContext } from "pages/keys/[slug]"
import Icon from "components/Icon"
import { useContext, useState } from "react"
import styles from "styles/key.module.css"
import iconStyles from "components/FormField/InfoIcon.module.css"



export default function KeyField({ heading, fieldName, editFormFields, processDataCallback = defaultProcessCallback, children }) {
    const { 
        artist,
        artistDispatch,
        isEditing: isEditingProfile,
    } = useContext(ProfileContext)
    const [isEditingField, setEditingField] = useState(false)
    const fieldValue = artist[fieldName]
    const EmptyState = () => (
        <p>
            {(['resume', 'website'].findIndex(f => f === fieldName) >= 0)
                ? 'Add a URL here!'
                : 'Add some info here!'}
        </p>
    )

    // Public view of field: hide fields without data
    if (!isEditingProfile) {
        if (fieldValue) {
            return <>
                {heading}
                {(fieldValue) ? children : <EmptyState />}
            </>
        } else {
            return <></>
        }
    }

    // Edit Mode view: show empty states, show edit toggle
    if (!isEditingField) {
        return <>
            {heading}
            <div className={styles["profile_field_group"]}>
                {(fieldValue) ? children : <EmptyState />}
                <button
                    className={styles["btn_edit"] +' '+ styles["edit_field"]}
                    onClick={() => setEditingField(true)}
                >
                    <Icon type="pencil" className={styles["icon_edit"]} fill="white" />
                    <span className={iconStyles["tooltip"]}>Change {camelCaseToLabel(fieldName)}</span>
                </button>
            </div>
        </>
    }

    // Field editing view: show edit form
    return (<>
        {heading}
        <div className={styles["profile_field_group"]}>
            <form
                onSubmit={async (e) => {
                    e.persist()
                    e.preventDefault()

                    fetch('/api/updateKey', {
                        method: 'POST',
                        body: JSON.stringify({
                            id: artist.id,
                            ...processDataCallback(fieldName, e),
                        }),
                        Headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(res => res.json())
                        .then(data => {
                            console.log('got some data!', data)

                            artistDispatch({
                                type: 'UPDATE_FIELD',
                                payload: { [fieldName]: data[fieldName]
                            }})
                        })

                    setEditingField(false)
                }}
            >
                { (editFormFields)
                    ? editFormFields
                    : <input defaultValue={fieldValue} type="text" />
                }
                <button type="submit">Update</button>
                <button onClick={() => setEditingField(false)}>Cancel</button>
            </form>
        </div>
    </>)
}

function defaultProcessCallback(fieldName, formSubmitEvent) {
    const formValues = Array.from(formSubmitEvent.currentTarget.elements)
        .map(el => el.value).filter(v => v)

    return {
        [fieldName]: formValues.join(','),
    }
}