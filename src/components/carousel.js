import React from 'react'
import PropTypes from "prop-types"
import CarouselCard from './carouselcard'
import './carousel.css'



const Carousel = ({ recordType, itemList, classNames }) => {
    // const [currIndex, setIndex] = useState(0)
    // const [numCardsVisible, setNumCardsVisible] = useState(3)

    // useEffect(() => window.addEventListener('resize', resize), [])

    // function resize() {
    //     setNumCardsVisible((window.innerWidth < 700) ? 1 : 3)
    // }

    return (
        <div className={`carousel ${ classNames.length > 0 ? classNames.join(' ') : '' }`}>
            <div className='carousel_inner'>
            {
                itemList.map(({ node }) => (
                    <CarouselCard node={ node } recordType={ recordType } />
                ))
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