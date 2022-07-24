export default function button(props) {
    const linkIsExternal = url =>
      !url.startsWith("#") &&
      !(url.includes("ringofkeys") || url.includes("localhost"))
    return (
      <a
        href={props.url}
        target={linkIsExternal(props.url) ? "_blank" : ""}
        rel={linkIsExternal(props.url) ? "noopener noreferrer" : ""}
        className={"btn my-4" + (!props.solid ? " btn-link_ghost" : "")}
        style={{ background: props.color.hex }}
      >
        {props.text}
      </a>
    )
  }