import React, { useState, useEffect} from 'react'
import { Link } from 'gatsby'
import useIntersect from '../hooks/useIntersect'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'


const CarouselCard = ({ node, recordType }) => {
    function wrapLink(node, classNames, children) {
        return node.isExternalNews 
            ? <a href={node.externalUrl} rel='noopener noreferrer' target='_blank' className={classNames} tabIndex='-1'>{ children }</a>
            : <Link to={(recordType ? '/'+recordType : '') + '/' + (node.slug ? node.slug : '#')} className={classNames} tabIndex='-1'>{ children }</Link>
    }

    return (
        <div className='carousel_card hover_scale'>
            { wrapLink(node, 'img_wrapper fullwidth', node.featuredImage 
                ? <img src={node.featuredImage.url} alt={node.featuredImage.alt} />
                : <div className='img_replacement fullwidth' style={{'--grad-rotate': Math.random()*360+'deg'}}></div>
                )
            }
            { wrapLink(node, 'header_link', node.title && 
                <h3>{ node.title.length > 70 ? node.title.substr(0, 70)+'...' : node.title }</h3>
            )}
            <p>
                { (node.startDate || node.publishDate) && <><p><em>
                    { node.startDate ? node.startDate : node.publishDate}
                    {/* { entry && entry.intersectionRatio } */}
                </em></p></>}
                { node.bodyNode ? renderHtmlToReact(node.bodyNode.childMarkdownRemark.excerptAst) : '' }
            </p>
            { node.isExternalNews 
            ? <a href={ node.externalUrl } className='btn btn-link_ghost' rel='noopener noreferrer' target='_blank'>Read More</a>
            : <Link to={ (recordType ? '/'+recordType : '') + '/' + (node.slug ? node.slug : '#') } className='btn btn-link_ghost'>
                Read More</Link> }
        </div>
    )
}
export default CarouselCard