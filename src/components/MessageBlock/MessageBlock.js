import React, { useState } from "react"
import Popup from "components/Popup"
import styles from "components/MessageBlock/MessageBlock.module.css"
import { DAY_IN_MS } from "lib/constants"
import dateFormat from 'date-format'

function daysSince(referenceTime) {
    return parseInt((new Date().getTime() - new Date(referenceTime).getTime()) / DAY_IN_MS)
}

const MessageBlock = ({ messages = [] }) => {
    const messagePreviewLength = 45
    const [isPopupOpen, setPopupOpen] = useState(false)
    const [popupIndex, setPopupIndex] = useState(0)

    return (
        <>
            <h2>Messages</h2>
            {messages.length > 0 ? (
                messages.map((message, i) => (
                    <div
                        ariaRole="button"
                        className={
                            styles.message +' '+
                            (daysSince(message._firstPublishedAt) < 5
                                ? styles.recent
                                : '')
                        }
                        onClick={() => {
                            setPopupIndex(i)
                            setPopupOpen(true)
                        }}
                        style={{ "--time-string": dateFormat('mm/dd/yy', new Date(message._firstPublishedAt)) }}
                    >
                        <div className={styles.messageLabels}>
                            <h3>{message.fromName}</h3>
                            <p>
                                <em>{ dateFormat('mm/dd/yy', new Date(message._firstPublishedAt)) }</em>
                            </p>
                        </div>
                        <p>
                            {message.message.length > messagePreviewLength
                                ? message.message.substr(
                                        0,
                                        messagePreviewLength
                                    ) +
                                    (message.message[messagePreviewLength] ===
                                    "."
                                        ? ""
                                        : "...")
                                : message.message}
                        </p>
                        <button className="btn btn-link_ghost has-arrow">
                            View Message
                        </button>
                    </div>
                ))
            ) : (
                <p>No messages yet!</p>
            )}
            {messages.length > 0 && (
                <Popup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)}>
                    <h2>{messages[popupIndex].fromName}</h2>
                    <a
                        href={`mailto:${messages[popupIndex].fromEmail}`}
                        style={{ marginBlockEnd: "1em" }}
                    >
                        {messages[popupIndex].fromEmail}
                    </a>
                    <p>Sent {dateFormat('mm/dd/yy', new Date(messages[popupIndex]._firstPublishedAt))}</p>
                    <p class={styles.messageBody}>{messages[popupIndex].message}</p>
                    <a
                        className="btn bg_slate"
                        href={"mailto:" + messages[popupIndex].fromEmail}
                        rel="noopener noreferrer"
                    >
                        Reply
                    </a>
                </Popup>
            )}
        </>
    )
}

export default MessageBlock
