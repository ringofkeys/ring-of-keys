import React from 'react'
import { Link } from 'gatsby'

const ArtistCard = ({ obj, index }) => {
    const artist = obj.item ? obj.item.node : obj.node
    return (
      <Link to={`/keys/${artist.slug}`} className='key__card' key={'key-'+index}
        style={{'--grad-rotate': Math.random()*360+'deg'}}>
          <figure>
              <div className='card__img'>
                  <img src={ artist.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&'} alt={ artist.name +' headshot' } />
              </div>
              <figcaption>
                  <h3 className={`card__title ${ fieldHasMatch(obj, 'name') ? 'search_match' : '' }`}
                      style={{ '--match-opacity': fieldHasMatch(obj, 'name') && obj.score ? 1 - obj.score : 0 }}>
                      { artist.name }
                  </h3>
                  <div className='card__meta'>
                      <span className={`card__pronouns ${ fieldHasMatch(obj, 'pronouns') ? 'search_match' : '' }`}
                      style={{ '--match-opacity': fieldHasMatch(obj, 'pronouns') && obj.score ? 1 - obj.score : 0 }}>
                      { (artist.pronouns.indexOf(',') >= 0) ? artist.pronouns.slice(0, artist.pronouns.indexOf(',')) : artist.pronouns }
                      </span>
                      <span className={`card__location ${ fieldHasMatch(obj, 'location') ? 'search_match' : '' }`}
                      style={{ '--match-opacity': fieldHasMatch(obj, 'location') && obj.score ? 1 - obj.score : 0 }}>
                      {  (artist.locations.indexOf(',') >= 0) ? artist.locations.slice(0, artist.locations.indexOf(',')) : artist.locations }
                      </span>
                  </div>
                <Link to={`/keys/${artist.slug}`} className='btn btn-link_ghost bg_copper has-arrow' >View Profile</Link>
              </figcaption>
          </figure>
      </Link>   
    )
}
export default ArtistCard

function fieldHasMatch(obj, fieldName) {
    return obj.matches && obj.matches.some(match => match.key.includes(fieldName))
}