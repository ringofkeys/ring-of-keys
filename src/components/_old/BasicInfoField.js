import React from "react"
import FieldEditForm from "../components/FieldEditForm"
import InfoIcon from "../components/infoicon"
import profileIcons from "../images/profile-icons/profileIcons.js"

const BasicInfoField = ({
    field,
    index,
    isEditable,
    setSubmitted,
    isSubmitting,
    setSubmitting,
    userId,
}) => {
    return (
        <>
            {isEditable && !(field.type === "checkbox" && field.isEditing) && (
                <h3>
                    {field.label}
                    {field.infoText && <InfoIcon infoText={field.infoText} />}
                </h3>
            )}
            {isEditable &&
                (!field.isEditing ? (
                    <div className={"profile_field_group"}>
                        <p>
                            {!field.data.includes("http") ? (
                                field.data ? (
                                    field.data
                                ) : (
                                    <span className="unfilled-field">
                                        Add some info here!
                                    </span>
                                )
                            ) : (
                                <a
                                    href={field.data ? field.data : ""}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {field.data ? (
                                        field.data
                                    ) : (
                                        <span className="unfilled-field">
                                            Add a URL here!
                                        </span>
                                    )}
                                </a>
                            )}
                        </p>
                        <button
                            className="btn_edit edit_field"
                            onClick={() => field.setEditing(true)}
                        >
                            <img
                                src={profileIcons.pencil}
                                className="icon_edit"
                                alt={`edit field`}
                            />
                            <span className="tooltip">
                                Change {field.label}
                            </span>
                        </button>
                    </div>
                ) : (
                    <FieldEditForm
                        type={field.type}
                        key={field.fieldName + "-form-" + index}
                        userId={userId}
                        handleClose={() => field.setEditing(false)}
                        field={field.fieldName}
                        val={field.refArray ? field.refArray : field.data}
                        label={field.label}
                        helpText={field.helpText}
                        initialVals={field.initialVals}
                        initialOther={field.initialOther}
                        handleUpdate={(newVal) => {
                            if (newVal instanceof Array) {
                                field.setFieldValue(newVal.join(", "))
                            } else {
                                field.setFieldValue(newVal)
                            }
                            setSubmitted(true)
                        }}
                        isSubmitting={isSubmitting}
                        setSubmitting={setSubmitting}
                    />
                ))}
        </>
    )
}

export default BasicInfoField
