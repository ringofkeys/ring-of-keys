import React from 'react'
import PropTypes from "prop-types"
import CarouselCard from './carouselcard'
import './carousel.css'



const Carousel = ({ recordType, itemList, classNames = [], children }) => {

    return (
        <div ariaRole='region' tabIndex='0' className={`carousel ${ classNames.length > 0 ? classNames.join(' ') : '' }`}>
            <div className='carousel_inner'>
            {itemList &&
                itemList.map(({ node }, i) => (
                    <CarouselCard node={ node } recordType={ recordType } key={`carousel-${ classNames[0] }-${ i }`}/>
                ))
            }
            {
                children && children
            }
            </div>
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