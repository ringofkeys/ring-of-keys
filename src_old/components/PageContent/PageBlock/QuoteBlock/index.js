import styles from './QuoteBlock.module.css'

export default function QuoteBlock(props) {
    return (
        <div
            className={styles.quote}
            style={{ background: props.backgroundColor.hex }}
        >
            <img src="/img/icon_key.svg" alt="key icon" />
            <div style={{ color: props.textColor.hex }}>
                <blockquote>{props.quoteText}</blockquote>
                <p style={{ color: "white" }}>— {props.quoteAttribution}</p>
            </div>
        </div>
    )
}