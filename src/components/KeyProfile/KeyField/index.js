import { camelCaseToLabel } from "lib/utils"
import { ProfileContext } from "pages/keys/[slug]"
import Icon from "components/Icon"
import { useContext, useState } from "react"
import styles from "styles/key.module.css"


export default function KeyField({ heading, fieldName, children }) {
    const { artist,
        isEditing: isEditingProfile
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
                    <Icon type="pencil" className={styles['icon_edit']} fill="black" />
                    <span className={styles["tooltip"]}>Change {camelCaseToLabel(fieldName)}</span>
                </button>
            </div>
        </>
    }

    // Field editing view: show edit form
    return <>
        <p>TODO: put a field editing form for { camelCaseToLabel(fieldName) } here!</p>
        <button onClick={() => setEditingField(false)}>Cancel</button>
    </>
}