import React, { useState, useEffect} from 'react'
import PropTypes from "prop-types"
import { Link } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import './carousel.css'


const CarouselBtn = ({ classNames, callback }) => (
    <div className={`carousel_btn ${ classNames.join(' ')}` } tabIndex='0' aria-role='button'
        onClick={ callback } 
        onKeyPress={e => { if (e.key === 'Enter' || e.key === 'Spacebar') { callback() }}}>
        <div className='visually-hidden'>Previous</div>
        <div className='carousel_btn_img'></div>
        <div className='carousel_btn_heading'></div>
        <div className='carousel_btn_paragraph'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div className='carousel_btn_btn'></div>
    </div>
)

const Carousel = ({ recordType, itemList, classNames }) => {
    const [currIndex, setIndex] = useState(0)
    const [numCardsVisible, setNumCardsVisible] = useState(3)

    useEffect(() => window.addEventListener('resize', resize), [])

    function resize() {
        setNumCardsVisible((window.innerWidth < 700) ? 1 : 3)
    } 

    function wrapLink(node, classNames, children) {
        return node.isExternalNews 
            ? <a href={node.externalUrl} rel='noopener noreferrer' target='_blank' className={classNames} tabIndex='-1'>{ children }</a>
            : <Link to={(recordType ? '/'+recordType : '') + '/' + (node.slug ? node.slug : '#')} className={classNames} tabIndex='-1'>{ children }</Link>
    }

    return (
        <div className={`carousel ${ classNames.length > 0 ? classNames.join(' ') : '' }`}>
            <CarouselBtn classNames={['carousel_btn_prev', currIndex === 0 ? 'disabled' : '']} 
                callback={() => { if (currIndex > 0) { setIndex(currIndex - 1) }}} />
          {
            itemList.slice(currIndex, currIndex + numCardsVisible).map(({ node }) => (
              <div className='carousel_card hover_scale'>
                { wrapLink(node, 'img_wrapper fullwidth', node.featuredImage 
                    ? <img src={node.featuredImage.url} alt={node.featuredImage.alt} />
                    : <div className='img_replacement fullwidth' style={{'--grad-rotate': Math.random()*360+'deg'}}></div>
                    )
                }
                { wrapLink(node, 'header_link', node.title && 
                    <h3>{ node.title.length > 70 ? node.title.substr(0, 70)+'...' : node.title }</h3>
                    )
                }
                <p>{ node.bodyNode ? renderHtmlToReact(node.bodyNode.childMarkdownRemark.excerptAst) : '' }</p>
                { node.isExternalNews 
                ? <a href={ node.externalUrl } className='btn btn-link_ghost' rel='noopener noreferrer' target='_blank'>Read More</a>
                : <Link to={ (recordType ? '/'+recordType : '') + '/' + (node.slug ? node.slug : '#') } className='btn btn-link_ghost'>
                  Read More</Link> }
              </div>
            ))
          }
          <CarouselBtn classNames={['carousel_btn_next', currIndex === itemList.length - numCardsVisible ? 'disabled' : '']} 
                callback={() => { if (currIndex < itemList.length - numCardsVisible) { setIndex(currIndex + 1)}}} />
        </div>
    )
}

Carousel.propTypes = {
    itemList: PropTypes.array,
    classNames: PropTypes.array,
    recordType: PropTypes.string,
}

Carousel.defaultProps = {
    itemList: [],
    classNames: [],
    recordType: '',
}

export default Carousel