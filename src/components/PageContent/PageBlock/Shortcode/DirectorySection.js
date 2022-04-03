import DirectoryGrid from "components/Directory/DirectoryGrid";

export default function DirectorySection(props) {
    return <>
        <DirectoryGrid artists={props.pageSpecificData} />
    </>
}