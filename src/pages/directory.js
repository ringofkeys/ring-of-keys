import React, { useState, useEffect } from 'react'
import { Link, graphql } from "gatsby"
import Fuse from 'fuse.js'
import Layout from "../components/layout"
import Popup from '../components/popup'
import './directory.css' 

const Artists = ({ data }) => {
  const { edges: searchList } = data.allDatoCmsKey
  const [searchResults, setSearchResults] = useState(searchList )

  const filterableFields = Object.keys(searchList[0].node).filter(field => field !== 'slug' && field !== 'headshot')
  const [filterResults, setFilterResults] = useState([])


  const searchOptions = {
    includeScore: true,
    shouldSort: true,
    includeMatches: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: filterableFields.map(field => `node.${field}`),
  }  

  const fuseSearch = new Fuse(searchList, searchOptions); // "list" is the item array
  const [currFilter, setCurrFilter] = useState('')
  const [filters, setFilters] = useState([])
  const [mergedResults, setMergedResults] = useState(searchList)

  function updateSearchResults(e) {
    setSearchResults(e.target.value.length > 0 ? fuseSearch.search(e.target.value) : searchList)
    // mergeAllResults()
  }

  function updateFilters(e) {
    setCurrFilter(e.target.value)
    if (!e.target.value || filters.some(f => f.name === e.target.value)) return

    const filterOptions = { ...searchOptions }
    filterOptions.keys = [`node.${e.target.value}`]
    const newFilter = { name: e.target.value, filter: new Fuse(searchList, filterOptions), }
    // if there are no filters, create my first one
    if (filters.length === 0) setFilters([ newFilter ]) 
    // if there are filters and none are the one I have selected (covered by first if statement in fn), add it
    else setFilters([...filters, newFilter])

    //add array to active filters
    setFilterResults([...filterResults, []])
  }

  function updateFilterResults(e) {
    if (!currFilter) return
    const toUpdate = filters.findIndex(f => f.name === currFilter)
    const resultsCopy = [...filterResults]
    resultsCopy[toUpdate] = e.target.value.trim().length > 0 ? filters[toUpdate].filter.search(e.target.value) : []
    setFilterResults(resultsCopy)
    // mergeAllResults()
  }

  function mergeAllResults() { // POSSIBLE TODO: FINISH THIS SOPHISTICATED FILTERING SETUP. FOR NOW, GOING WITH CLEANER TAGS
    const resultsArrays = [searchResults, ...filterResults].flat()
    const merged = []

    resultsArrays.forEach(elem => {
      if (merged.length === 0) { merged.push(elem) }
      else {
        const foundItem = merged.find(mergedElem => mergedElem.item.node.name === elem.item.node.name)
        if (!foundItem) { merged.push(elem) }
        else {
          foundItem.score += elem.score
          foundItem.matches.push(elem.matches)
        }
      }
    })

    setMergedResults(merged.sort((a, b) => b.score - a.score))
  }

  function fieldHasMatch(obj, fieldName) {
    return obj.matches && obj.matches.some(match => match.key.includes(fieldName))
  }

  return (
    <Layout>
        <h1>Directory</h1>
        <p>
          We have curated a directory of actors, directors, dancers, singers, stage managers, lighting designers, 
          dramaturgs, artistic directors, producers, casting directors, librettists, lyricists, composers, props designers, 
          scenic designers, sound designers, choreographers, costume designers, and production managers who self-identify 
          as lesbian, bisexual, trans, queer, femme, masc, non-binary, and the diversity of genders that queerness contains.
        </p>
        <div className='section_search'>
          <label>Search: 
            <input type='text' onChange={e => updateSearchResults(e) } />
          </label>
          {/* <label>Filter: 
            <select onBlur={updateFilters}>
              <option value=''>Select a field</option>
              {filterableFields.map(field => (
                <option value={field}>{ field }</option>
              ))}
            </select>
            <input type='text' onChange={ e => updateFilterResults(e) }/>
          </label> */}
        </div>
        {/* <pre>{ JSON.stringify(searchResults, null, 2) }</pre> */}
        <section className='key__grid'>
            {searchResults[0] ? searchResults.map((obj, i, arr) => {
              const key = obj.item ? obj.item.node : obj.node
              return (
                <Link to={`/keys/${key.slug}`} className='key__card' key={'key-'+i}
                style={{'--grad-rotate': Math.random()*360+'deg'}}>
                    <figure>
                        <div className='card__img'>
                            <img src={ key.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=130&h=130&'} alt={ key.name +' headshot' } />
                        </div>
                        <figcaption>
                            <h3 className={`card__title ${ fieldHasMatch(obj, 'name') ? 'search_match' : '' }`}
                              style={{ '--match-opacity': fieldHasMatch(obj, 'name') && obj.score ? 1 - obj.score : 0 }}>
                              { key.name }
                            </h3>
                            <div className='card__divider'></div>
                            <div className='card__meta'>
                              <span className={`card__location ${ fieldHasMatch(obj, 'location') ? 'search_match' : '' }`}
                                style={{ '--match-opacity': fieldHasMatch(obj, 'location') && obj.score ? 1 - obj.score : 0 }}>
                                { key.location }
                              </span>
                              <span className={`card__pronouns ${ fieldHasMatch(obj, 'pronouns') ? 'search_match' : '' }`}
                                style={{ '--match-opacity': fieldHasMatch(obj, 'pronouns') && obj.score ? 1 - obj.score : 0 }}>
                                { key.pronouns }
                              </span>
                            </div>
                        </figcaption>
                    </figure>
                </Link>   
            )}) : ( <p>No results found!</p> )
          }
        </section>
        {/* <Popup closed={false} /> */}
    </Layout> 
)}

export default Artists


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
          locations
          pronouns
        }
      }
    }
  }
`