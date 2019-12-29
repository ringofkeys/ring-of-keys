import React from "react"

const ApplyPage = () => (
    <section>
        <button onClick={submitApplication} >Apply</button>
    </section>
)

export default ApplyPage

function submitApplication(data) {
    fetch('/.netlify/functions/createDatoArtist')
        .then(res => console.log('the response is: ', res))
}