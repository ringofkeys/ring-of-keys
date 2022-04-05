import DirectoryGrid from "components/Directory/DirectoryGrid"
import DirectorySearch from "components/Directory/DirectorySearch"
import { getDirectorySearch, prepareMemberList } from "lib/directory"
import { useEffect, useState } from "react"

export default function DirectorySection(props) {
  // Filter artists that are marked de-listed in DatoCMS
  let fullMemberList = prepareMemberList(props.pageSpecificData)
  const [filtersAreVisible, setFilterVisibility] = useState(false)

  const [searchResults, setSearchResults] = useState(fullMemberList)
  const resetSearchResults = () => setSearchResults(fullMemberList)
  const searcher = getDirectorySearch(fullMemberList, ["firstName", "lastName"])

  useEffect(() => console.log({ searchResults }), [searchResults])

  return (
    <>
      <DirectorySearch
        searcher={searcher}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        resetSearchResults={resetSearchResults}
      />
      <DirectoryGrid artists={searchResults} />
    </>
  )
}
