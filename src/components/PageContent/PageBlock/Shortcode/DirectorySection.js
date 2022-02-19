import DirectoryGrid from "components/Directory/DirectoryGrid";

export default function DirectorySection(props) {
    console.log("from within DirectorySection", props)

    return <>
        <DirectoryGrid artists={props.pageSpecificData} />
    </>
}