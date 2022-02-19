// import ConsultantBios from "./ConsultantBios"
// import ConsultantForm from "./consultantform"
// import KeyshipButton from "./KeyshipButton"
// import DonorBoxWidget from "./DonorBoxWidget"
// import VimeoEmbed from "./VimeoEmbed"
import DirectorySection from "./DirectorySection"

const shortcodes = {
  "directory-section": DirectorySection,
  // "consultancy-form": <ConsultantForm />,
  // "consultant-bios": <ConsultantBios />,
  // "keyship-button": <KeyshipButton />,
  // donorbox: <DonorBoxWidget />,
  // vimeo: VimeoEmbed,
}

export default function Shortcode(props) {
  // remove the quotes from each prop's value
  Object.keys(props).forEach(key => {
    if (
      typeof props[key] == "string" &&
      props[key].startsWith('"') &&
      props[key].endsWith('"')
    ) {
      props[key] = props[key].slice(1, props[key].length - 1)
    }
  })
  console.log("a shortcode!", props)
  if (!shortcodes[props.name]) {
    console.error('Unsupported shortcode in use', props)
    return null
  }
  return typeof shortcodes[props.name] === "function"
    ? shortcodes[props.name](props)
    : shortcodes[props.name]
}