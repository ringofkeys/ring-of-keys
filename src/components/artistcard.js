import React from 'react'
import { Link } from 'gatsby'
import { fieldHasMatch } from '../pages/directory'

const ArtistCard = ({ key, obj, index }) => (
    <Link to={`/keys/${key.slug}`} className='key__card' key={'key-'+index}
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
            
)
export default ArtistCard