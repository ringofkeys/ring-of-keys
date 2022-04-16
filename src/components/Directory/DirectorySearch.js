import styles from 'styles/directory.module.css'

export default function DirectorySearch({
  appliedFilters = [],
  setAppliedFilters,
  setFilterVisibility,
  filtersAreVisible,
  numResults,
}) {

  function handleSearchChange(e) {
    e.preventDefault()
    const searchTerm = e.target.value
    const foundIndex = appliedFilters.findIndex(filter => filter[0] === e.target.name)

    if (!searchTerm || searchTerm.length <= 2) {
      setAppliedFilters([...appliedFilters.slice(0, foundIndex), ...appliedFilters.slice(foundIndex + 1)])
    } else {
      if (foundIndex >= 0) {
        const newFilters = [...appliedFilters]
        newFilters[foundIndex][1] = e.target.value
        setAppliedFilters(newFilters)
      } else {
          setAppliedFilters([...appliedFilters, [e.target.name, e.target.value]])
      }
    }
  }


  return (
    <>
      <section className={styles["section_search"]}>
        <div className={styles["input__group"] + " text"}>
          <label htmlFor="general">
            Search any keywords here or use the advanced search feature to
            narrow your results.
          </label>
          <input
            type="text"
            name="general"
            onChange={handleSearchChange}
            placeholder="Keyword"
          />
        </div>
        <button
          className={"btn bg_slate " + styles["btn_search"]}
          onClick={() =>
            window.scrollTo({
              top:
                document.getElementById("key__grid").getBoundingClientRect().top -
                100,
              behavior: "smooth",
            })
          }
        >
          Search
        </button>
        <span className={styles["results"]}>
          <strong>{numResults}</strong> artists
        </span>
        <button
            onClick={() => setFilterVisibility(!filtersAreVisible)}
            className={styles["advanced-btn"] + (appliedFilters.length ? " active" : "")}
            style={{
                "--active": `'${appliedFilters.length} filter${
                appliedFilters.length === 1 ? "" : "s"
                }'`,
            }}
            >
            Advanced Search
            <svg
                className={styles["advanced-arrow"]}
                style={{ transform: `rotate(${filtersAreVisible ? 180 : 0}deg)` }}
                viewBox="0 0 4 4"
            >
                <path d="M .5 2 l 1.5 -1.5 l 1.5 1.5"></path>
            </svg>
            </button>
      </section>
    </>
  )
}