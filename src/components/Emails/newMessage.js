const newMessage = (submission, artistName) => `
    <h1>New message submission intended for ${artistName}</h1>
    <p>The following message was sent to an artist who has their messages set to be screened by the admin team.</p>
    <p>To review the draft message in DatoCMS, <a href="https://ringofkeys.admin.datocms.com/editor/item_types/177050/items/${submission.id}">visit this link.</a></p>
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
    </table>`

export default newMessage