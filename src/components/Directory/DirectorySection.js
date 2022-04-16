import DirectoryFilters from "components/Directory/DirectoryFilters"
import DirectoryGrid from "components/Directory/DirectoryGrid"
import DirectorySearch from "components/Directory/DirectorySearch"
import { getDirectorySearch, prepareMemberList } from "lib/directory"
import { useEffect, useState, useMemo } from "react"
import debounce from 'lodash.debounce'

const fuzzySearchKeys = [
  'firstName',
  'lastName',
  'discipline',
  'vocalRange',
  'danceExperience',
  'pronouns',
  'genderIdentity',
  'sexualIdentity',
  'raceEthnicity',
]

export default function DirectorySection(props) {
  // Filter artists that are marked de-listed in DatoCMS
  let fullMemberList = prepareMemberList(props.pageSpecificData)
  const [filtersAreVisible, setFilterVisibility] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState([])

  const [searchResults, setSearchResults] = useState(fullMemberList)
  const searcher = getDirectorySearch(fullMemberList, fuzzySearchKeys)

  const debouncedFilterHandler = useMemo(() => debounce(filterSearchResults, 200), [appliedFilters])

    useEffect(() => console.log({ filtersAreVisible }), [filtersAreVisible])

    // Set up a listener to remove appliedFilters from localStorage when the tab is closed.
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.onbeforeunload = function (e) {
                localStorage.removeItem("latestFilters")
                return undefined
            }
        }
        return () => {
          debouncedChangeHandler.cancel();
        }
    }, [])

    useEffect(() => {
      debouncedFilterHandler()
    }, [appliedFilters])

    function filterSearchResults() {
        if (typeof window !== "undefined") {
          // Listener to push the latest filters to local storage whenever they're updated
          localStorage.setItem("latestFilters", JSON.stringify(appliedFilters))
        }

        if (!appliedFilters.length) {
          setSearchResults(fullMemberList)
          return
        }

        let generalFilter = ''
        const checkboxFilters = [], otherFuzzyFilters = []

        appliedFilters.forEach(([key, val]) => {
          if (key === "general") {
            generalFilter = val
          } else if (Array.isArray(val)) {
            checkboxFilters.push([key, val])
          } else {
            otherFuzzyFilters.push([key, val])
          }
        })

        const preparedFuzzyFilters = {}
        
        if (generalFilter) {
          preparedFuzzyFilters.$or = fuzzySearchKeys.map(key => ({ [key]: generalFilter }))
        }
        
        if (otherFuzzyFilters.length) {
          preparedFuzzyFilters.$and = otherFuzzyFilters.map(([key, value]) => ({ [key]: value }))
        }
        
        console.log({ generalFilter, preparedFuzzyFilters, checkboxFilters })
        let results = fullMemberList

        if (preparedFuzzyFilters.$and || preparedFuzzyFilters.$or) {
          results = searcher.search(preparedFuzzyFilters)
        }

        if (checkboxFilters.length) {
          results = results.filter(member => {
            return checkboxFilters.every(([filterKey, filterValues]) => filterValues.some(value => {
              try {
                return ((!(generalFilter || otherFuzzyFilters.length))
                  ? member[filterKey]
                  : member.item[filterKey]
                ).includes(value)
              } catch(e) {
                console.warn('member does not have key', { member, filterKey, e})
                return false
              }
            }))
          })
        }

        setSearchResults(results)
    }

  return (
    <>
      <DirectorySearch
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        setFilterVisibility={setFilterVisibility}
        filtersAreVisible={filtersAreVisible}
        numResults={searchResults.length}
      />
      <DirectoryFilters
        filtersAreVisible={filtersAreVisible}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
      <DirectoryGrid artists={searchResults} />
    </>
  )
}
