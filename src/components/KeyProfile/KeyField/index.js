import { camelCaseToLabel } from "lib/utils"
import { ProfileContext } from "pages/keys/[slug]"
import Icon from "components/Icon"
import { useContext, useState } from "react"
import styles from "styles/key.module.css"
import iconStyles from "components/FormField/InfoIcon.module.css"

export default function KeyField({
    heading,
    fieldName,
    editFormFields,
    processDataCallback = defaultProcessCallback,
    children,
}) {
    const {
        artist,
        artistDispatch,
        isEditing: isEditingProfile,
    } = useContext(ProfileContext)
    const [fieldStatus, setFieldStatus] = useState("viewing")
    const [isSubmitting, setSubmitting] = useState(false)
    const fieldValue = artist && artist !== null ? artist[fieldName] : undefined
    const EmptyState = () => (
        <p>
            {["resume", "website"].findIndex((f) => f === fieldName) >= 0
                ? "Add a URL here!"
                : "Add some info here!"}
        </p>
    )

    function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setFieldStatus("loading")

        const dataToSubmit = {
            id: artist.id,
            ...processDataCallback(fieldName, e),
        }

        fetch("/api/updateKey", {
            method: "POST",
            body: JSON.stringify(dataToSubmit),
            Headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .catch((err) => console.error("error updating key", err))
            .then((data) => {
                console.log("got some data!", data)

                artistDispatch({
                    type: "UPDATE_FIELD",
                    payload: { [fieldName]: data[fieldName] },
                })
                setSubmitting(false)
                setFieldStatus("viewing")
            })
            .catch((err) => {
                console.error("error updating key", err)
                setSubmitting(false)
                setFieldStatus("viewing")
            })
    }

    // Public view of field: hide fields without data
    if (!isEditingProfile) {
        if (fieldValue) {
            return (
                <>
                    {heading}
                    {fieldValue ? children : <EmptyState />}
                </>
            )
        } else {
            return <></>
        }
    }

    // Edit Mode view: show empty states, show edit toggle
    if (fieldStatus === "viewing") {
        return (
            <>
                {heading}
                <div className={styles["profile_field_group"]}>
                    <div className={isSubmitting ? "loading" : ""}>
                        {fieldValue ? children : <EmptyState />}
                    </div>
                    <button
                        className={
                            styles["btn_edit"] + " " + styles["edit_field"]
                        }
                        onClick={() => setFieldStatus(true)}
                        disabled={isSubmitting || fieldStatus === "loading"}
                    >
                        <Icon
                            type="pencil"
                            className={styles["icon_edit"]}
                            fill="white"
                        />
                        <span className={iconStyles["tooltip"]}>
                            Change {camelCaseToLabel(fieldName)}
                        </span>
                    </button>
                </div>
            </>
        )
    }

    // Field editing view: show edit form
    return (
        <>
            {heading}
            <form onSubmit={handleSubmit}>
                <div className={styles["profile_field_group"]}>
                    {editFormFields ? (
                        editFormFields
                    ) : (
                        <input
                            autoFocus
                            defaultValue={fieldValue}
                            type="text"
                        />
                    )}
                    <button
                        type="button"
                        className={
                            styles["btn_edit"] + " " + styles["edit_field"]
                        }
                        onClick={() => setFieldStatus("viewing")}
                    >
                        <Icon
                            type="close"
                            className={styles["icon_edit"]}
                            fill="white"
                        />
                        <span className={iconStyles["tooltip"]}>
                            Cancel Edit
                        </span>
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn bg_slate"
                    style={{ margin: "1rem 0" }}
                >
                    {fieldStatus === "loading" ? `Submitting...` : `Update`}
                </button>
            </form>
        </>
    )
}

function defaultProcessCallback(fieldName, formSubmitEvent) {
    const formValues = Array.from(formSubmitEvent.currentTarget.elements)
        .map((el) => el.value)
        .filter((v) => v)

    return {
        [fieldName]: formValues.join(","),
    }
}
