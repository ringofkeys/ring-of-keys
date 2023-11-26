const applicationUnderReview = (submission) => `
    <h1>Hi ${submission.name || 'there'}! Thanks for applying to Ring of Keys</h1>
    <p>Our team will be reviewing your application in the coming days. Here's what you submitted in your application:</p>
    <table style="border-collapse: collapse;">
        <tbody>
            ${Object.keys(submission).map(
                (key) => `
                <tr style="padding: .4rem 1rem;">
                    <th style="border: solid 1px #ddd; padding: .3rem .75rem; text-align: left; text-transform: capitalize">${
                        key
                    }</th>
                    <td style="border: solid 1px #ddd; padding: .3rem .75rem">${
                        (submission[key] instanceof Object) 
                            ? JSON.stringify(submission[key], null, 2) 
                            : submission[key]
                    }</td>
                </tr>`
            ).join('')}
        </tbody>
    </table>
    <p>We'll be in touch soon!</p>
    <br />
    <p>🧡 – The Ring of Keys Team</p>
`

export default applicationUnderReview