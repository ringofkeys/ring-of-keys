import React from "react"
import FieldEditForm from "../FieldEditForm.js"
import InfoIcon from "../infoicon.js"
import profileIcons from "../../images/profile-icons/profileIcons.js"
import { fieldArrayToString } from "../../utils/profileEditor.js"

const BodyInfoField = ({ field, index, editorState, userId }) => {
    return (
        <>
            {(field.data || editorState.isEditable) && (
                <h3>
                    {field.label}
                    {field.infoText && <InfoIcon infoText={field.infoText} />}
                </h3>
            )}
            {!editorState.isEditable ? (
                field.data && (
                    <p>
                        {!field.data.includes("http") ? (
                            field.data instanceof Array ? (
                                fieldArrayToString(field)
                            ) : (
                                field.data
                            )
                        ) : (
                            <a
                                href={field.data}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {field.data}
                            </a>
                        )}
                    </p>
                )
            ) : !field.isEditing ? (
                <div className="profile_field_group">
                    <p>
                        {!field.data.includes("http") ? (
                            field.data ? (
                                field.data instanceof Array ? (
                                    fieldArrayToString(field)
                                ) : (
                                    field.data
                                )
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
                                        'Add a URL here!'
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
                        <span className="tooltip">Change {field.label}</span>
                    </button>
                </div>
            ) : (
                <FieldEditForm
                    type={field.type}
                    id={field.fieldName + "-form-" + index}
                    key={field.fieldName + "-form-" + index}
                    userId={userId}
                    handleClose={() => field.setEditing(false)}
                    field={field}
                    val={field.refArray ? field.refArray : field.data}
                    label={field.label}
                    helpText={field.helpText}
                    initialVals={field.initialVals}
                    initialOther={field.initialOther}
                    handleUpdate={(newVal) => {
                        if (newVal instanceof Array) {
                            field.setFieldValue(newVal)
                            field.updateField(
                                field.fieldName,
                                fieldArrayToString(
                                    Object.assign(field, { data: newVal }),
                                    field.joinChar
                                )
                            )
                        } else {
                            field.setFieldValue(newVal)
                            field.updateField(field.fieldName, newVal)
                        }
                        field.setEditing(false)
                    }}
                    isSubmitting={editorState.isSubmitting}
                    setSubmitting={editorState.setSubmitting}
                />
            )}
        </>
    )
}

export default BodyInfoField
