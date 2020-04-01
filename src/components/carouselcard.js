import React, { useState, useEffect} from 'react'
import { Link } from 'gatsby'
import { useIntersect } from '../hooks/useIntersect'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'

const buildThresholdArray = (size) => Array.from(Array(size).keys(), i => i / size)

const CarouselCardInner = ({ node, recordType, ratio, className }) => {
    function wrapLink(node, className, children) {
        return node.externalUrl 
            ? <a href={node.externalUrl} rel='noopener noreferrer' target='_blank' className={className} tabIndex='-1'>{ children }</a>
            : <Link to={(recordType ? '/'+recordType : '') + '/' + (node.slug ? node.slug : '#')} className={className} tabIndex='-1'>{ children }</Link>
    }

    return (
    <div className={'carousel_card hover_scale ' + className} style={{ opacity: ratio ? ratio : 1 }}>
            { wrapLink(node, 'img_wrapper fullwidth', node.featuredImage 
                ? <img src={node.featuredImage.url} alt={node.featuredImage.alt} />
                : <div className='img_replacement fullwidth' style={{'--grad-rotate': Math.random()*360+'deg'}}></div>
                )
            }
            { wrapLink(node, 'header_link', node.title && 
                <h3>{ node.title.length > 70 ? node.title.substr(0, 70)+'...' : node.title }</h3>
            )}
            <div>
                { (node.startDate || node.publishDate) && <><p><em>
                    { node.startDate ? node.startDate : node.publishDate}
                </em></p></>}
                { node.bodyNode ? renderHtmlToReact(node.bodyNode.childMarkdownRemark.excerptAst) : '' }
            </div>
            { node.externalUrl 
            ? <a href={ node.externalUrl } className='btn btn-link_ghost' rel='noopener noreferrer' target='_blank'>Read More</a>
            : <Link to={ (recordType ? '/'+recordType : '') + '/' + (node.slug ? node.slug : '#') } className='btn btn-link_ghost'>
                Read More</Link> }
        </div>
    )
}

const CarouselCard = props => {
    // const [ref, entry] = useIntersect({
    //     threshold: buildThresholdArray(70)
    // })

    function wrapButton(node, isFirst, children) {
        return <button className={`carousel_btn carousel_btn_${ isFirst ? 'prev' : 'next'}`}>{ children }</button>
    }

    return (
        <CarouselCardInner {...props}/>
    )
}
export default CarouselCard