import React, { useState } from "react"
import Popup from "./popup"
import "./MessageBlock.css"

const MessageBlock = ({ messages }) => {
  const messagePreviewLength = 45
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [popupIndex, setPopupIndex] = useState(0)

  return (
    <>
      <section className="block block_messages">
        <h2>Messages</h2>
        {messages.length > 0 ? (
          messages.map((message, i) => (
            <div
              ariaRole="button"
              className={
                "message " +
                (parseInt(message.meta.timeDiff) < 5 ? "recent" : "")
              }
              onClick={() => {
                setPopupIndex(i)
                setPopupOpen(true)
              }}
              style={{ "--time-string": message.meta.timeString }}
            >
              <div className="message_labels">
                <h3>{message.fromName}</h3>
                <p>
                  <em>{message.meta.timeString}</em>
                </p>
              </div>
              <p>
                {message.message.length > messagePreviewLength
                  ? message.message.substr(0, messagePreviewLength) +
                    (message.message[messagePreviewLength] === "." ? "" : "...")
                  : message.message}
              </p>
              <p className="btn btn-link_ghost has-arrow">View Message</p>
            </div>
          ))
        ) : (
          <p>No messages yet!</p>
        )}
      </section>
      {messages.length > 0 && (
        <Popup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)}>
          <h2>{messages[popupIndex].fromName}</h2>
          <a
            href={`mailto:${messages[popupIndex].fromEmail}`}
            style={{ marginBlockEnd: "1em" }}
          >
            {messages[popupIndex].fromEmail}
          </a>
          <p>Sent {messages[popupIndex].meta.timeSince}</p>
          <p class="message_body">{messages[popupIndex].message}</p>
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
