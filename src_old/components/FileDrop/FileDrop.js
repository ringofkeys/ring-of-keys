import React, { useState } from "react"
import styles from "./FileDrop.module.css"
import popupStyles from "components/Popup/Popup.module.css"

export default function FileDrop({ helpText }) {
    const [currFile, setFile] = useState("")

    return (
        <div className={styles["drop-target"]}>
            <label className={styles["file-drop"]}>
                <input
                    type="file"
                    name="file"
                    className={styles["file-input"]}
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                {!currFile ? (
                    <>
                        <p>Drag and drop your image here.</p>
                        <span>{currFile}</span>
                        <span className={styles["help-text"]}>or</span>
                        <span className="btn bg_slate">Browse Files</span>
                        {helpText && (
                            <span className={styles["help-text"]}>{helpText}</span>
                        )}
                    </>
                ) : (
                    <>
                        <img
                            src={URL.createObjectURL(currFile)}
                            alt="uploaded image"
                        />
                        <button
                            className={popupStyles["btn_close"]}
                            onClick={() => setFile("")}
                        >
                            <span className="visually-hidden">Close</span>
                            <svg viewBox="0 0 5 5">
                                <path d="M 1 1 l 3 3" />
                                <path d="M 1 4 l 3 -3" />
                            </svg>
                        </button>
                    </>
                )}
            </label>
        </div>
    )
}

function handleDragOver(e) {
    e.preventDefault()
    e.target.classList.add("drag-over")
}

function handleDragLeave(e) {
    e.preventDefault()
    e.target.classList.remove("drag-over")
}
