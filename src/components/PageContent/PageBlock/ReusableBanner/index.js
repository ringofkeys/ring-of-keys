import styles from "./ReusableBanner.module.css"

export default function ReusableBanner({ title, subtitle, backgroundColor, image }) {
  return (
    <section
      className={styles.banner}
      style={{ backgroundColor: backgroundColor?.hex || "#f4f4f4" }}
    >
      {image?.url && (
        <img src={image.url} alt={image.alt || ""} />
      )}
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
    </section>
  )
}