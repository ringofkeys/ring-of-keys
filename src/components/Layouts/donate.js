import React from 'react'
import { renderHtmlToReact } from '../../utils/renderHtmlToReact'
import './donate.css'
import DonorBoxWidget from '../DonorBoxWidget'

const Donate = ({ quote, rightCol }) => {

    return (<>
        <h1>Donate</h1>
        { quote }
        <section style={{display: 'flex', flexWrap:'wrap-reverse', gap: '2rem'}}>
            <DonorBoxWidget />
            <div style={{flex: '30%'}}>
                { rightCol }
            </div>
        </section>
    </>)
}
export default Donate