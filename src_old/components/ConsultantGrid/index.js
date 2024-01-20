import DirectoryGrid from "components/Directory/DirectoryGrid";

export default function ConsultantGrid({ pageSpecificData: { allConsultants }}) {
    if (!allConsultants.allKeys) return <></>

    return (
        <DirectoryGrid artists={allConsultants.allKeys} className="flex flex-wrap justify-between" />
    )
}