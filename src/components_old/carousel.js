import React, { useRef } from 'react'
import PropTypes from "prop-types"
import CarouselCard from './carouselcard'
import './carousel.css'



const Carousel = ({ heading, recordType, itemList, classNames = [], style, children }) => {
    const carousel = useRef(null)

    function advanceCarousel(amount) {
        if (!carousel || !carousel.current) return
        console.log('scrollLeft', carousel.current.scrollLeft)
        carousel.current.scrollLeft += carousel.current.getBoundingClientRect().width / 100 * amount
    }

    return (<section className='carousel-section' style={Object.assign({position: 'relative', paddingBlockStart: '1.5rem'}, (style) ? style : {})}>
        <div className='carousel-title'>
            { heading && (
                <h2>{ heading }</h2>
            )}
            <ul className='carousel_advance_btns' style={{top: (!heading) ? '0': '2.4rem' }}>
                <li>
                    <button onClick={() => advanceCarousel(-100)}>
                        <span className="visually-hidden">Back</span>
                        <svg viewBox='0 0 10 10'><path d='M 8 1 L 2 5 L 8 9' /></svg>
                    </button>
                </li>
                <li>
                    <button onClick={() => advanceCarousel(100)}>
                        <span className="visually-hidden"></span>
                        <svg viewBox='0 0 10 10'><path d='M 2 1 L 8 5 L 2 9' /></svg>
                    </button>
                </li>
            </ul>
        </div>
        <div ref={ carousel } tabIndex='0' className={`carousel ${ classNames.length > 0 ? classNames.join(' ') : '' }`}>
            <ul className='carousel_inner'>
            {itemList &&
                itemList.map(({ node }, i) => (
                    <CarouselCard node={ node } recordType={ recordType } key={`carousel-${ classNames[0] }-${ i }`}/>
                ))
            }
            {
                children && children
            }
            </ul>
        </div> 
    </section>)
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