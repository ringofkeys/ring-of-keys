export default function DirectorySearch() {
    return (<>
        <section className="section_search">
            <div className="input__group text">
            <label htmlFor="fuzzy">
                Search any keywords here or use the advanced search feature to
                narrow your results.
            </label>
            <input
                type="text"
                name="fuzzy"
                onChange={formik.handleChange}
                value={formik.values.fuzzy}
                placeholder="Keyword"
            />
            </div>
            <SearchButton />
            <span class="results">
            <strong>{searchResults.length}</strong> artists
            </span>
            <button
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
            </button>
        </section>
        <section
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
        </section>
    </>)
}

function getFilters() {
    return [
    {
      field: "firstName",
      label: "First Name",
      placeholder: "First Name",
      type: "text",
      logic: "or",
    },
    {
      field: "lastName",
      label: "Last Name",
      placeholder: "Last Name",
      type: "text",
      logic: "or",
    },
    {
      field: "discipline",
      label: "Discipline",
      placeholder: "ie: Actor, Stage Manager, Music Director",
      type: "text",
      logic: "or",
    },
    {
      field: "vocalRange",
      label: "Vocal Range",
      placeholder: "ie: Soprano, Tenor",
      type: "fuzzy",
      threshold: 0.25,
      logic: "and",
    },
    {
      field: "danceExperience",
      label: "Dance Experience",
      placeholder: "ie: Ballet, Tap, Jazz",
      type: "fuzzy",
      threshold: 0.25,
      logic: "and",
    },
    {
      field: "pronouns",
      label: "Pronouns",
      placeholder: "ie: They / Them or She / Her",
      type: "fuzzy",
      threshold: 0.25,
      logic: "and",
      helpText: `When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else).`,
    },
    {
      field: "genderIdentity",
      label: "Gender Identity",
      placeholder: "ie: Non-Binary, Cis, Gender Fluid",
      type: "fuzzy",
      threshold: 0.38,
      logic: "and",
      helpText: `One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others.`,
    },
    {
      field: "sexualIdentity",
      label: "Sexual Orientation",
      placeholder: "ie: Bisexual, Queer, Lesbian",
      type: "fuzzy",
      threshold: 0.3,
      logic: "and",
      helpText: `Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person.`,
    },
    {
      field: "raceEthnicity",
      label: "Race / Ethnicity",
      placeholder: "ie: Black, Indigenous, Latinx, etc.",
      type: "fuzzy",
      threshold: 0.3,
      logic: "and",
      helpText: `Racial identity is the qualitative meaning one ascribes to one’s racial group, whereas ethnic identity is a concept that refers to one’s sense of self as a member of an ethnic group. At their core, both constructs reflect an individual’s sense of self as a member of a group; however, racial identity integrates the impact of race and related factors, while ethnic identity is focused on ethnic and cultural factors. We celebrate our Keys’ intersectionality and understand that creating one’s racial/ethnic identity is a fluid and nonlinear process that varies for every person. Many folks will identify with more than one background while others will identify with a single group more broadly.`,
    },
    {
      field: "locations",
      label: "Region",
      helpText: "(check as many that apply)",
      type: "checkbox",
      values: [
        "New York City",
        "Chicago",
        "Los Angeles",
        "Philadelphia",
        "San Francisco / Oakland",
        "Minneapolis / St. Paul",
        "Denver",
        "Boulder",
        "Orlando",
        "Sarasota",
        "Louisville",
        "Baltimore",
        "Boston",
        "St. Louis",
        "Las Vegas",
        "Raleigh",
        "Cleveland",
        "Ashland",
        "Portland, OR",
        "Pittsburgh",
        "Austin",
        "Salt Lake City",
        "Washington, D.C.",
        "Seattle",
        "Toronto",
        "Ontario",
        "London",
      ],
      logic: "and",
    },
    {
      field: "affiliations",
      label: "Unions & Affiliations",
      helpText: "(check as many that apply)",
      type: "checkbox",
      values: [
        "AEA",
        "AFM",
        "AGMA",
        "AGVA",
        "ASCAP",
        "BMI",
        "CSA",
        "EMC",
        "IATSE",
        "LMDA",
        "SAFD",
        "SAG/AFTRA",
        "SDC",
        "USA",
        "Non-union",
      ],
      logic: "and",
    },
  ]
}