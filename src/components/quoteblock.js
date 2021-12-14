import React from "react"
import icon_key from "../images/icon_key.svg"

const QuoteBlock = ({
  quoteText,
  quoteAttribution,
  quoteBgColor,
  quoteTextColor,
}) => (
  <div
    className="section_quote-block"
    style={{ background: quoteBgColor ? quoteBgColor : "" }}
  >
    <img className="icon_key" src={icon_key} alt="key icon" />
    <div style={{ color: quoteTextColor }}>
      {quoteText}
      <p style={{ color: "white" }}>— {quoteAttribution}</p>
    </div>
  </div>
)
export default QuoteBlock
