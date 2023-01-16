const newApplicationSubmission = (submission) => `
    <h1>New application submission from ${submission.name}</h1>
    <p>The following submission was just placed in the <a href="https://ringofkeys.org/apply">Keyship Application Form.</a>:</p>
    <p>To review the draft profile in DatoCMS, <a href="https://ringofkeys.admin.datocms.com/editor/item_types/177050/items/${submission.id}">visit this link.</a></p>
    <table style="border-collapse: collapse;">
        <tbody>
            ${Object.keys(submission).map(
                (key) => `
                <tr style="padding: .4rem 1rem;">
                    <th style="border: solid 1px #ddd; padding: .3rem .75rem; text-align: left; text-transform: capitalize">${key}</th>
                    <td style="border: solid 1px #ddd; padding: .3rem .75rem">${submission[key]}</td>
                </tr>`
            ).join('')}
        </tbody>
    </table>`

export default newApplicationSubmission