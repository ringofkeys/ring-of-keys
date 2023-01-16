const newContactSubmission = (data) => `
    <h1>New submission to Ring of Keys contact form</h1>
    <p>The following submission was just placed in the <a href="https://ringofkeys.org/contact">RoK Contact Form</a>:</p>
    <table style="border-collapse: collapse;">
        <tbody>
            ${Object.keys(data).map(
                (key) => `
                <tr style="padding: .4rem 1rem;">
                    <th style="border: solid 1px #ddd; padding: .3rem .75rem; text-align: left; text-transform: capitalize">${key}</th>
                    <td style="border: solid 1px #ddd; padding: .3rem .75rem">${data[key]}</td>
                </tr>`
            ).join('')}
        </tbody>
    </table>`

export default newContactSubmission