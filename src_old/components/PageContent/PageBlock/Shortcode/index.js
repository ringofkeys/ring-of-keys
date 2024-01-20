// import ConsultantBios from "./ConsultantBios"
import ConsultancyForm from "components/forms/ConsultancyForm"
// import KeyshipButton from "./KeyshipButton"
import DonorBoxWidget from "components/DonorBoxWidget"
// import VimeoEmbed from "./VimeoEmbed"
import ApplyForm from "components/forms/ApplyForm"
import DirectorySection from "components/Directory/DirectorySection"
import ResourceSection from "components/ResourceSection"
import ConsultantGrid from "components/ConsultantGrid"
import GiveButterForm from "components/GiveButterWidget"
import DonorBoxGalaEmbed from "components/DonorBoxGalaEmbed"

const shortcodes = {
    "directory-section": DirectorySection,
    "apply-form": ApplyForm,
    "resources-section": ResourceSection,
    "consultancy-form": ConsultancyForm,
    "consultant-bios": ConsultantGrid,
    // "keyship-button": <KeyshipButton />,
    donorbox: DonorBoxWidget,
    // vimeo: VimeoEmbed,
    "donorbox-gala": <DonorBoxGalaEmbed />,
    "give-butter-form": <GiveButterForm />,
}

export default function Shortcode(props) {
    // remove the quotes from each prop's value
    Object.keys(props).forEach((key) => {
        if (
            typeof props[key] == "string" &&
            props[key].startsWith('"') &&
            props[key].endsWith('"')
        ) {
            props[key] = props[key].slice(1, props[key].length - 1)
        }
    })
    // console.log("a shortcode!", props)
    if (!shortcodes[props.name]) {
        console.error("Unsupported shortcode in use", props)
        return null
    }
    return typeof shortcodes[props.name] === "function"
        ? shortcodes[props.name](props)
        : shortcodes[props.name]
}
