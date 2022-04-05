import { useState, useEffect } from "react"

export default function DirectorySearch({
  searcher,
  searchResults,
  setSearchResults,
  resetSearchResults,
}) {
  function handleSearchChange(e) {
    const searchTerm = e.target.value

    if (!searchTerm || searchTerm.length <= 2) {
      resetSearchResults()
    } else {
      const results = searcher.search(searchTerm)
      console.log({ searchTerm, results })
      setSearchResults(results)
    }
  }


  return (
    <>
      <section className="section_search">
        <div className="input__group text">
          <label htmlFor="fuzzy">
            Search any keywords here or use the advanced search feature to
            narrow your results.
          </label>
          <input
            type="text"
            name="fuzzy"
            onChange={handleSearchChange}
            placeholder="Keyword"
          />
        </div>
        {/* <SearchButton /> */}
        <span className="results">
          <strong>{searchResults.length}</strong> artists
        </span>
        {/* <button
            onClick={() => setFilterVisibility(!filtersAreVisible)}
            className={"advanced-btn " + (activeFilters ? "active" : "")}
            style={{
                "--active": `'${activeFilters} filter${
                activeFilters === 1 ? "" : "s"
                }'`,
            }}
            >
            Advanced Search
            <svg
                className="advanced-arrow"
                style={{ transform: `rotate(${filtersAreVisible ? 180 : 0}deg)` }}
                viewBox="0 0 4 4"
            >
                <path d="M .5 2 l 1.5 -1.5 l 1.5 1.5"></path>
            </svg>
            </button> */}
      </section>
      {/* <section
            className={`section_filters ${filtersAreVisible ? "active" : ""}`}
        >
            <div className="filters">
            <button
                className="visually-hidden"
                onClick={() => document.querySelector("a.key__card").focus()}
            >
                click to skip past filters to Artists' Cards
            </button>
            <Filters formik={formik} filters={filters} />
            </div>
            <div className="btn-row">
            <button
                className="btn btn-link_ghost btn_filters"
                onClick={() =>
                resetFilters(formik, filters, () => setSearchResults(searchList))
                }
            >
                Clear Advanced Search
            </button>
            <SearchButton />
            </div>
        </section> */}
    </>
  )
}
