import React from "react"
import FieldEditForm from "../FieldEditForm"
import profileIcons from "../../images/profile-icons/profileIcons.js"
const urlRegExpStr =
  "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"

const ResumeField = ({ field, userId, editorState }) => {
  return !editorState.isEditable ? (
    <a
      className="btn btn_resume"
      href={field.data ? field.data : ""}
      rel="noopener noreferrer"
      target="_blank"
    >
      View Resume
    </a>
  ) : !field.isEditing ? (
    <div className="profile_field_group file">
      <a
        className={`btn btn_resume ${field.data ? "" : "btn-link_ghost"}`}
        href={field.data ? field.data : ""}
        rel="noopener noreferrer"
        target="_blank"
      >
        {field.data ? "View Resume" : "No Resume Link"}
      </a>
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
    <>
      <h3>Resume</h3>
      <FieldEditForm
        type="link"
        key={field.fieldName + "-form"}
        userId={userId}
        handleClose={() => field.setEditing(false)}
        field={field}
        handleUpdate={newVal => {
          field.setFieldValue(newVal)
          field.updateField(field.fieldName, newVal)
          editorState.setSubmitted(true)
        }}
        pattern={urlRegExpStr}
        isSubmitting={editorState.isSubmitting}
        setSubmitting={editorState.setSubmitting}
      />
    </>
  )
}

export default ResumeField
