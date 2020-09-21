import React, { useState, useEffect } from 'react'
import { graphql } from "gatsby"
import Fuse from 'fuse.js'
import { useFormik } from 'formik';
import Layout from "../components/layout"
import Filters from '../components/filters'
import ArtistCard from '../components/artistcard'
import './directory.css' 

const SearchButton = () => (
  <button className='btn bg_slate btn_search' onClick={() => window.scrollTo(
    {
      top: document.getElementById('key__grid').getBoundingClientRect().top - 100,
      behavior: 'smooth',
    })} >Search</button>
)

const Directory = ({ data }) => {
  let searchList = data.allDatoCmsKey.edges.filter(({ node }) => node.showInDirectory)
  searchList = searchList.sort((a,b) => {
    const aNameToken = a.node.name.trim().toLowerCase().split(' ')
    const bNameToken = b.node.name.trim().toLowerCase().split(' ')

    if (aNameToken[aNameToken.length-1] < bNameToken[bNameToken.length-1]) { return -1; }
    if (aNameToken[aNameToken.length-1] > bNameToken[bNameToken.length-1]) { return 1; }
    return 0;
  })
  // Filter out artist whose showInDirectory

  const [filtersAreVisible, setFilterVisibility] = useState(false)

  // add firstName and lastName props by splitting name at first ' '
  searchList.forEach(({ node }) => {
    node.firstName = node.name.substr(0, node.name.indexOf(' '))
    node.lastName = node.name.substr(node.name.indexOf(' ')+1, node.name.length)
  })

  // create state of results
  const [searchResults, setSearchResults] = useState(searchList)

  // get filter object from function below
  const filters = getFilters()
  filters.forEach(filter => {
    filter.results = []
    if (filter.type === 'dropdown') {
      filter.values = searchList.map(({node}) => node[filter.field])
                                .filter((val, i) => val)
      filter.values = [...new Set(filter.values)]                                
                                .sort()
    } else if (filter.type === 'fuzzy') {
      const fuseConfig = getFuseConfig(filter.threshold)
      fuseConfig.keys = [`node.${ filter.field }`]
      filter.fuse = new Fuse(searchList, fuseConfig)
    }
  })

  // get default fuzejs config from function below
  const globalSearchConfig = getFuseConfig()

  // mutate config to have filters from above as 'keys' property
  globalSearchConfig.keys = Object.keys(searchList[0].node).map(key => `node.${key}`)
  
  // try to get any saved filters
  const localStorageFilters = (typeof window !== "undefined") ? localStorage.getItem('latestFilters') : undefined
  console.log('local Storage filters = ', localStorageFilters)

  // build formik config from filters
  const formik = useFormik({
    initialValues: localStorageFilters ? JSON.parse(localStorageFilters) : buildFormikVals('fuzzy', filters),
    isInitialValid: true,
    onSubmit: values => console.log(values),
  })  

  // Set filters' results arrays when formik.values changes
  useEffect(() => {
    
    async function updateSearchResults() {
      // create a blank search results array
      let finalResults = []
  
      // iterate over results list for each filter (there should be one for each),
      // and merge or cull the final results array based on that filter's 'logic' property
      const orFilters = filters.filter(f => f.logic === 'or')
      const andFilters = filters.filter(f => f.logic === 'and')
  
      // OR filters widen the search, adding any results they have that the final list doesn't
      orFilters.forEach(filter => {
        if (!filter || filter.results.length === 0) return
        filter.results.forEach(filterRes => {
          if (!finalResults.find(finalRes => finalRes.node.name === filterRes.node.name)) {
            finalResults.push(filterRes)
          }
        })
      })

      if (finalResults.length === 0) {
        finalResults = searchList // if there are no OR filters set, use the whole searchable array for AND filtering
      }
    
      // AND filters narrow the search from a larger set
      andFilters.forEach(filter => {
        if (!filter || filter.results.length === 0) return
        finalResults = finalResults.filter(finalRes => filter.results.find(filterRes => finalRes.node.name === filterRes.node.name))
      })
  
      // Apply fuzzy search if there is one, over the final results
      if (formik.values.fuzzy && formik.values.fuzzy.trim().length > 0) {
        const globalSearch = new Fuse(finalResults, globalSearchConfig)
        finalResults = globalSearch.search(formik.values.fuzzy)
      }

      const filtersAreActive = Object.keys(formik.values).some(field => {
        if (formik.values[field] instanceof Array) {
          return formik.values[field].some(v => v)
        }
        return formik.values[field].length > 0
      })

      if (finalResults.length === searchList.length && filtersAreActive) {
        finalResults = []
      }

      setSearchResults(finalResults)
    }

    for (const filter of filters) {
      if (formik.values[filter.field]) {
        if (filter.type === 'checkbox') {
          const trueVals = filter.values.filter((val, i) => formik.values[filter.field][i])

          filter.results = searchList.filter(({ node }) => node[filter.field] && trueVals[0] &&
            trueVals.some(val => node[filter.field].toLowerCase().includes(val.toLowerCase())))
        } else if (filter.type === 'fuzzy') {
          filter.results = filter.fuse.search(formik.values[filter.field]).map(result => result.item) 
        } else {
          filter.results = searchList.filter(({ node }) => node[filter.field] &&
            node[filter.field].toLowerCase().includes(formik.values[filter.field].trim().toLowerCase()))
        }
      } else {
        filter.results = []
      }
    }

    updateSearchResults()
  }, [formik.values])

  const activeFilters = filters.filter(f => (f.type !== 'checkbox') ? formik.values[f.field] : formik.values[f.field].some(val => val)).length

  return (
    <Layout classNames={['fullwidth', 'directory']} title='Keys Directory'
    description='Ring of Keys has curated a directory of theatremakers that identify as queer women, trans, or gender non-conforming
    artists.' footerQuoteText={<blockquote>"You have to see it to be it."</blockquote>}
    footerQuoteAttribution='Jeanine Tesori' footerQuoteBgColor='var(--rok-pale-green-1_hex)'>
      <section className='section_intro'>
        <h1>Directory</h1>
        <p>
          We have curated a directory of actors, directors, dancers, singers, stage managers, lighting designers, 
          dramaturgs, artistic directors, producers, casting directors, librettists, lyricists, composers, props designers, 
          scenic designers, sound designers, choreographers, costume designers, and production managers who self-identify 
          as lesbian, bisexual, trans, queer, femme, masc, non-binary, and the diversity of genders that queerness contains.
        </p>
      </section>
      <section className='section_search'>
        <div className='input__group text'>
          <label htmlFor='fuzzy'>Search any keywords here or use the advanced search feature to narrow your results.</label>
          <input type='text' name='fuzzy' onChange={formik.handleChange} value={formik.values.fuzzy} placeholder='Keyword'/>
        </div>
        <SearchButton />
        <span class='results'><strong>{ searchResults.length }</strong> artists</span>
        <button onClick={() => setFilterVisibility(!filtersAreVisible)} className={'advanced-btn ' + ((activeFilters) ? 'active' : '') } style={{'--active': `'${activeFilters} filter${ (activeFilters === 1) ? '' : 's' }'` }}>
          Advanced Search
          <svg className='advanced-arrow' style={{transform: `rotate(${filtersAreVisible ? 180 : 0}deg)`}} viewBox='0 0 4 4'>
            <path d='M .5 2 l 1.5 -1.5 l 1.5 1.5'></path>
          </svg> 
        </button>
      </section>
      <section className={`section_filters ${filtersAreVisible ? 'active' : ''}`}>
        <div className='filters'>
          <button className='visually-hidden' onClick={() => document.querySelector('a.key__card').focus()}>click to skip past filters to Artists' Cards</button>
          <Filters formik={formik} filters={filters} />
        </div>
        <div className='btn-row'>
          <button className='btn btn-link_ghost btn_filters' onClick={ () => resetFilters(formik, filters, () => setSearchResults(searchList)) }>Clear Advanced Search</button>
          <SearchButton />
        </div>
      </section>
      <section id='key__grid' className='key__grid'>
          {searchResults[0] ? searchResults.map((obj, i, arr) => 
          <ArtistCard obj={obj} index={i} />) : ( <p>No results found!</p> )
        }
      </section>
        {/* <Popup closed={false} /> */}
    </Layout> 
)}

export default Directory


export const query = graphql`
  query IndexQuery {
    allDatoCmsKey {
      edges {
        node {
          slug
          name
          headshot {
            url
          }
          showInDirectory
          mainLocation
          locations
          pronouns
          genderIdentity
          sexualIdentity
          discipline
          vocalRange
          danceExperience
          affiliations
        }
      }
    }
  }
`
async function resetFilters(formik, filters, postCallback) {
  Array.from(document.querySelectorAll('.filters [type="checkbox"]'))
    .forEach(input => {
      input.checked = false
    })
  filters.forEach(filter => filter.results = [])
  // formik.values = buildFormikVals('fuzzy', filters)
  Object.keys(formik.values).forEach((key) => {
    if (formik.values[key] instanceof Array) {
      formik.values[key] = formik.values[key].fill(false)
    } else {
      formik.values[key] = ''
    }
  })
  
  // make this async so we don't have to wait for it
  async function setStorageFilters() { 
    if (typeof window !== "undefined") {
      localStorage.setItem('latestFilters', JSON.stringify(formik.values)) 
    }
  }
  await setStorageFilters()

  postCallback()
}

// set up listener to clear localStorage of filters/search settings before ending the browsing session.
if (typeof window !== "undefined") {
  window.onbeforeunload = function() {
    localStorage.removeItem('latestFilters');
    return '';
  };
}

function getFuseConfig(thresh = 0.33) {
  return {
    includeScore: true,
    shouldSort: true,
    includeMatches: true,
    threshold: thresh,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
  }    
}

function buildFormikVals(fuzzyVal, filters) {
  const formikInitialVals = {}

  formikInitialVals[fuzzyVal] = ''

  for (const filter of filters) {
    if (filter.type === 'checkbox') {
      formikInitialVals[filter.field] = [...filter.values.map(val => false)]
    } else {
      formikInitialVals[filter.field] = ''
    }
  }

  return formikInitialVals
}

function getFilters() {
  return [
    {
      field: 'firstName',
      label: 'First Name',
      placeholder: 'First Name',
      type: 'text',
      logic: 'or',
    },
    {
      field: 'lastName',
      label: 'Last Name',
      placeholder: 'Last Name',
      type: 'text',
      logic: 'or',
    },
    {
      field: 'discipline',
      label: 'Discipline',
      placeholder: 'ie: Actor, Stage Manager, Music Director',
      type: 'text',
      logic: 'or',
    },
    {
      field: 'vocalRange',
      label: 'Vocal Range',
      placeholder: 'ie: Soprano, Tenor',
      type: 'fuzzy',
      threshold: .25,
      logic: 'and',
    },
    {
      field: 'danceExperience',
      label: 'Dance Experience',
      placeholder: 'ie: Ballet, Tap, Jazz',
      type: 'fuzzy',
      threshold: .25,
      logic: 'and',
    },
    {
      field: 'pronouns',
      label: 'Pronouns',
      placeholder: 'ie: They / Them or She / Her',
      type: 'fuzzy',
      threshold: .25,
      logic: 'and',
      helpText: `When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else).`,
    },
    {
      field: 'genderIdentity',
      label: 'Gender Identity',
      placeholder: 'ie: Non-Binary, Cis, Gender Fluid',
      type: 'fuzzy',
      threshold: .38,
      logic: 'and',
      helpText: `One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others.`,
    },
    {
      field: 'sexualIdentity',
      label: 'Sexual Orientation',
      placeholder: 'ie: Bisexual, Queer, Lesbian',
      type: 'fuzzy',
      threshold: .3,
      logic: 'and',
      helpText: `Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person.`,
    },
    {
      field: 'locations',
      label: 'Region',
      helpText: '(check as many that apply)',
      type: 'checkbox',
      values: [
        "New York City", "Chicago", "Los Angeles", "Philadelphia", "San Francisco / Oakland", "Minneapolis / St. Paul", "Denver",
        "Boulder", "Orlando", "Sarasota", "Louisville", "Baltimore", "Boston", "St. Louis", "Las Vegas", "Raleigh", "Cleveland",
        "Ashland", "Portland, OR", "Pittsburgh", "Austin", "Salt Lake City", "Washington, D.C.", "Seattle", "Toronto", "Ontario",
        "London",
      ],
      logic: 'and',
    },
    {
      field: 'affiliations',
      label: 'Unions & Affiliations',
      helpText: '(check as many that apply)',
      type: 'checkbox',
      values: [
        "AEA", "AFM", "AGMA", "AGVA", "ASCAP", "BMI", "CSA", "EMC", "IATSE",  "LMDA", "SAFD", "SAG/AFTRA", "SDC", "USA", "Non-union",
      ],
      logic: 'and',
    }
  ]
}
