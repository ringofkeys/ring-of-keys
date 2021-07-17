import { StructuredText } from "react-datocms";
import styles from './IconHeadingLabel.module.css'

export default function IconHeadingLabel(props) {
    return (
        <div className={styles.content}>
            <img src={ props.icon.url } alt={ props.icon.alt} />
            <StructuredText data={ props.contentRich } />
        </div>
    )
}