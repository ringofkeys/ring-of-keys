import styles from "./Popup.module.css"

const Popup = ({ isOpen, onClose = () => {}, children, canClose = true }) => {
    return (
        <div className={styles.popup + " " + (isOpen ? styles.open : "")}>
            <div className={styles["popup__card"]}>
                {children}
                {canClose && (
                    <button className={styles["btn_close"]} onClick={(e) => onClose(e)}>
                        <span className="visually-hidden">Close</span>
                        <svg viewBox="0 0 5 5">
                            <path d="M 1 1 l 3 3" stroke="black" />
                            <path d="M 1 4 l 3 -3" stroke="black" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}
export default Popup
