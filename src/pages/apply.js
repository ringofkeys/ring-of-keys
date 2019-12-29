import React from "react"

const ApplyPage = () => (
    <section>
        <button onClick={submitApplication} >Apply</button>
    </section>
)

export default ApplyPage

function submitApplication(data) {
    fetch('/.netlify/functions/createDatoArtist')
        .then(res => res.text())
        .then(text => console.log('message text is: ', text))
}