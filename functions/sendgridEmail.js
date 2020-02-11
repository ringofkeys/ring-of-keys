require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)


exports.handler = async (event) => {
    console.log('event.body type = ', typeof event.body)

    const data = JSON.parse(event.body)

    console.log('data = ', data)
    console.log('data instanceof Object', data instanceof Object)
    console.log('typeof data = ', typeof data)
    console.log('data.toArtist = ', data.toArtist)

    try {
        const datoUser = await client.items.find(parseInt(data.toArtist))

        const msg = {
            to: datoUser.email,
            from: 'info@ringofkeys.org',
            subject: `New RoK Message from ${data.fromName}`,
            text: 'You have a new message through Ring of Keys',
            html:  `<table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="m_-7369974005591323765bodyTable" style="border-collapse:collapse;height:100%;margin:0;padding:0;width:100%;background-color:#fafafa"> <tbody><tr> <td align="center" valign="top" id="m_-7369974005591323765bodyCell" style="height:100%;margin:0;padding:10px;width:100%;border-top:0"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-7369974005591323765templateContainer" style="border-collapse:collapse;border:0;max-width:600px!important"> <tbody><tr> <td valign="top" id="m_-7369974005591323765templatePreheader" style="background:#fafafa none no-repeat center/cover;background-color:#fafafa;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse"> <tbody> <tr> <td valign="top" style="padding-top:9px"> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-7369974005591323765mcnTextContentContainer"> <tbody><tr> <td valign="top" class="m_-7369974005591323765mcnTextContent" style="padding:0px 18px 9px;text-align:center;word-break:break-word;color:#656565;font-family:Helvetica;font-size:12px;line-height:150%"> <a href="https://us4.campaign-archive.com/?e=&amp;u=539a4242e28417ba21438bdae&amp;id=3c19b6dde7" style="color:#656565;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://us4.campaign-archive.com/?e%3D%26u%3D539a4242e28417ba21438bdae%26id%3D3c19b6dde7&amp;source=gmail&amp;ust=1581506291813000&amp;usg=AFQjCNFScJ70NRuG1cPo_WeUnx64NzbENA">View this email in your browser</a> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> <tr> <td valign="top" id="m_-7369974005591323765templateHeader" style="background:#ffffff none no-repeat center/cover;background-color:#ffffff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:0"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse"> <tbody> <tr> <td valign="top" style="padding:0px"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse"> <tbody><tr> <td valign="top" style="padding-right:0px;padding-left:0px;padding-top:0;padding-bottom:0;text-align:center"> <a href="https://beta.ringofkeys.org/dashboard" title="" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://beta.ringofkeys.org/dashboard&amp;source=gmail&amp;ust=1581506291813000&amp;usg=AFQjCNGeYW5D-yJ-7VuNNii9oJ5_ZaXExA"> <img align="center" alt="" src="https://ci6.googleusercontent.com/proxy/-bLt5s8kr11uDdEr5YUTki5tbqzpppwxNFLkiRIvnChG3cBZb0zvHHvAmMB2a-l6OZU7vhH2temiElJYaPmepVfwjbN18G5lpjx8IbbQ-tpeTHaIpzeKKR9ZhrXk_d6S_ATywdxx9EA4a9Gb9Irxe4N6zi40Ng=s0-d-e1-ft#https://mcusercontent.com/539a4242e28417ba21438bdae/images/5d2a686c-6390-453f-9cd7-cc801ed3bb8c.png" width="600" style="max-width:1200px;padding-bottom:0px;vertical-align:bottom;display:inline!important;border-radius:0%;border:0;height:auto;outline:none;text-decoration:none" class="m_-7369974005591323765mcnRetinaImage CToWUd"> </a> </td> </tr> </tbody></table> </td> </tr> </tbody> </table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse"> <tbody> <tr> <td valign="top"> <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse" class="m_-7369974005591323765mcnBoxedTextContentContainer"> <tbody><tr> <td style="padding-top:9px;padding-left:18px;padding-bottom:9px;padding-right:18px"> <table border="0" cellspacing="0" class="m_-7369974005591323765mcnTextContentContainer" width="100%" style="min-width:100%!important;border-collapse:collapse"> <tbody><tr> <td valign="top" class="m_-7369974005591323765mcnTextContent" style="padding:18px;font-family:Helvetica;font-size:14px;font-weight:normal;text-align:center;word-break:break-word;color:#202020;line-height:150%"> <font face="lato, helvetica neue, helvetica, arial, sans-serif">Someone sent you a message on <a href="https://www.ringofkeys.org/" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.ringofkeys.org/&amp;source=gmail&amp;ust=1581506291813000&amp;usg=AFQjCNEsL7VCI0NZiE0il4pQwoFdBDbn2g">ringofkeys.org</a><br> Login and go to your inbox located on your dashboard.</font> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody> </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-7369974005591323765mcnDividerBlock" style="min-width:100%;border-collapse:collapse;table-layout:fixed!important"> <tbody> <tr> <td style="min-width:100%;padding:18px"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-top:2px solid #eaeaea;border-collapse:collapse"> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> <tr> <td valign="top" id="m_-7369974005591323765templateBody" style="background:#ffffff none no-repeat center/cover;background-color:#ffffff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:2px solid #eaeaea;padding-top:0;padding-bottom:9px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse"> <tbody> <tr> <td valign="top" style="padding:9px"> <table align="left" border="0" cellpadding="0" cellspacing="0" class="m_-7369974005591323765mcnCaptionBottomContent" width="282" style="border-collapse:collapse"> <tbody><tr> <td align="center" valign="top" style="padding:0 9px 9px 9px"> <img alt="" src="https://ci3.googleusercontent.com/proxy/3VUx8qPgmR_Ax5LYSQHVR11xd1_sGQTYsSmUYb0PDBQoB0nnAjAQNsIN4YhAg4q4YMhyYYgkD8CGbvXnmmQyXUfXWh8UEB2Vea32ZlPH11S3ahmx7eNTWFXUv5o74M7I8DmvRJHCAPkyXCWQHJo9-w7gE8bUUw=s0-d-e1-ft#https://mcusercontent.com/539a4242e28417ba21438bdae/images/45a7c603-acdd-4816-bf5a-63a5a53e3044.png" width="80" style="max-width:80px;border:0;height:auto;outline:none;text-decoration:none;vertical-align:bottom" class="m_-7369974005591323765mcnImage CToWUd"> </td> </tr> <tr> <td class="m_-7369974005591323765mcnTextContent" valign="top" style="padding:0px 9px;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;text-align:center;word-break:break-word" width="282"> <h4 style="text-align:center;display:block;margin:0;padding:0;color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal"><span style="font-size:14px"><span style="color:#263e64"><span style="font-family:georgia,times,times new roman,serif">Meet other Keys</span></span></span></h4> <p dir="ltr" style="text-align:center;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;margin:10px 0;padding:0"><span style="font-size:14px"><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif"><a href="https://beta.ringofkeys.org/directory" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://beta.ringofkeys.org/directory&amp;source=gmail&amp;ust=1581506291813000&amp;usg=AFQjCNGm-9gw0lGE9f9rVLdIfHlR0_mGRw"><u>Use the RoK Directory</u></a> to meet other keys and get more conversations started.</span></span></p> </td> </tr> </tbody></table> <table align="right" border="0" cellpadding="0" cellspacing="0" class="m_-7369974005591323765mcnCaptionBottomContent" width="282" style="border-collapse:collapse"> <tbody><tr> <td align="center" valign="top" style="padding:0 9px 9px 9px"> <img alt="" src="https://ci6.googleusercontent.com/proxy/Sw989prqjF7fM8DrJjh8BhoDMuYqz4AhQovOuCF6MaRwYzYEEcumGVEBxXuH2UqxWrv4RgDFuHaLz89JeMVt9nxCR5uWgSJkgj66uugcM3voptcYNT5I7TV8TeB33rPCF2zoPpzXSs1IF7IM8aLrCZZ_BFYQ6A=s0-d-e1-ft#https://mcusercontent.com/539a4242e28417ba21438bdae/images/59effc80-3683-4358-9bab-687b69c02173.png" width="80" style="max-width:80px;border:0;height:auto;outline:none;text-decoration:none;vertical-align:bottom" class="m_-7369974005591323765mcnImage CToWUd"> </td> </tr> <tr> <td class="m_-7369974005591323765mcnTextContent" valign="top" style="padding:0px 9px;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;text-align:center;word-break:break-word" width="282"> <h4 style="text-align:center;display:block;margin:0;padding:0;color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal"><span style="font-size:14px"><span style="color:#263e64"><span style="font-family:georgia,times,times new roman,serif">Support the Cause</span></span></span></h4> <p dir="ltr" style="text-align:center;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;margin:10px 0;padding:0"><a href="https://beta.ringofkeys.org/donate/" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://beta.ringofkeys.org/donate/&amp;source=gmail&amp;ust=1581506291813000&amp;usg=AFQjCNGIyrWNNUsP-Qwk9OaOpcUIf5Tfgg">Click here to donate</a> and help us change<br> the landscape of musical theatre</p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse"> <tbody> <tr> <td valign="top" style="padding:9px"> <table align="left" border="0" cellpadding="0" cellspacing="0" class="m_-7369974005591323765mcnCaptionBottomContent" width="282" style="border-collapse:collapse"> <tbody><tr> <td align="center" valign="top" style="padding:0 9px 9px 9px"> <img alt="" src="https://ci6.googleusercontent.com/proxy/oYmODhKJ-sCe9cV6AtQi7peUaJuZbte33j7axIloCAC6xSQiJygyISEKY3qfwbFRgs1Qn82_ubLWVrXwjba0P76BlHygLAGp8aDE7QLSki8BK_lqUdYnV67UL8GQ_YeWUW6n20kAL2vS70SrNYWpj7QMJoEbMQ=s0-d-e1-ft#https://mcusercontent.com/539a4242e28417ba21438bdae/images/f018767c-f7a0-4f3e-b351-2ff7e2201b33.png" width="80" style="max-width:80px;border:0;height:auto;outline:none;text-decoration:none;vertical-align:bottom" class="m_-7369974005591323765mcnImage CToWUd"> </td> </tr> <tr> <td class="m_-7369974005591323765mcnTextContent" valign="top" style="padding:0px 9px;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;text-align:center;word-break:break-word" width="282"> <h4 style="text-align:center;display:block;margin:0;padding:0;color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal"><span style="font-size:14px"><span style="color:#263e64"><span style="font-family:georgia,times,times new roman,serif">Wear it Proudly</span></span></span></h4> <p dir="ltr" style="text-align:center;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;margin:10px 0;padding:0"><span style="font-size:14px"><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif"><a href='https://beta.ringofkeys.org/RoKBadge_Web.png' download>Click to download</a> your Ring of Keys badge—optimized to use on your website or digital resume</span></span><br> &nbsp;</p> </td> </tr> </tbody></table> <table align="right" border="0" cellpadding="0" cellspacing="0" class="m_-7369974005591323765mcnCaptionBottomContent" width="282" style="border-collapse:collapse"> <tbody><tr> <td align="center" valign="top" style="padding:0 9px 9px 9px"> <img alt="" src="https://ci3.googleusercontent.com/proxy/RaQ1LLhMalPuLlXaezt2inFXCN-b2z0RxQda0TmGNIyyOyMLl4eiISLIx88zL51uX8TbSCvqjlr_ZljfSKqIbEVzNHPFaSbbgydgVNBGw0r8FnLvqJ4BnpSzTXNGd0-wMQy9cltKJO6gRlxZoiDNYrekXIbOng=s0-d-e1-ft#https://mcusercontent.com/539a4242e28417ba21438bdae/images/75f10e7a-fe63-457c-8c7a-271ec334b061.png" width="80" style="max-width:80px;border:0;height:auto;outline:none;text-decoration:none;vertical-align:bottom" class="m_-7369974005591323765mcnImage CToWUd"> </td> </tr> <tr> <td class="m_-7369974005591323765mcnTextContent" valign="top" style="padding:0px 9px;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;text-align:center;word-break:break-word" width="282"> <h4 style="text-align:center;display:block;margin:0;padding:0;color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal"><span style="font-size:14px"><span style="color:#263e64"><span style="font-family:georgia,times,times new roman,serif">Shine the&nbsp;Spotlight</span></span></span></h4> <p dir="ltr" style="text-align:center;color:#263e64;font-family:Lato,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:14px;line-height:125%;margin:10px 0;padding:0"><span style="font-size:14px"><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif"><a href="https://docs.google.com/forms/d/e/1FAIpQLSc1ZF_N02Kj5Rnnb9hlQx9A9cNFLCzHfnv7bj9EWDrTrsq1gA/viewform" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://docs.google.com/forms/d/e/1FAIpQLSc1ZF_N02Kj5Rnnb9hlQx9A9cNFLCzHfnv7bj9EWDrTrsq1gA/viewform&amp;source=gmail&amp;ust=1581506291813000&amp;usg=AFQjCNGuTwZZxo3ptfr8gTRbs0vYvOe5Jw"><u>Submit news on an upcoming job</u></a> to have featured on the Ring of Keys social platforms</span></span></p> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> <tr> <td valign="top" id="m_-7369974005591323765templateFooter" style="background:#fafafa none no-repeat center/cover;background-color:#fafafa;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse"> <tbody> <tr> <td valign="top" style="padding:0px"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse"> <tbody><tr> <td valign="top" style="padding-right:0px;padding-left:0px;padding-top:0;padding-bottom:0;text-align:center"> <img align="center" alt="" src="https://ci4.googleusercontent.com/proxy/gP8_nPP3c1YThanS3TjjJxLrsjtL9oPCsxDyhexlE4IN5wmsf9behpOpopGM4ZBwA5zeiClTMuMpyA7xokcIGvSzlriDxEdmRcvcwYr0mLuftc0z4KugRnzIFloBAN0rwrMiE2EGev3evej3TVHR6i7qf7sTOQ=s0-d-e1-ft#https://mcusercontent.com/539a4242e28417ba21438bdae/images/0415bc6a-b262-4826-b9d4-d56bf3e990a8.jpg" width="600" style="max-width:1200px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="m_-7369974005591323765mcnImage CToWUd"> </td> </tr> </tbody></table> </td> </tr> </tbody> </table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse"> <tbody> <tr> <td valign="top" style="padding-top:9px"> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-7369974005591323765mcnTextContentContainer"> <tbody><tr> <td valign="top" class="m_-7369974005591323765mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:center"> <span style="font-size:18px"><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif"><strong>Let's Queer the Stage&nbsp;</strong></span></span><br> <br> <em><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif">Copyright © 2020 Ring of Keys, All rights reserved.</span></em><br> <br> <span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif">Want to change how you receive these emails?<br> You can <a href="https://ringofkeys.us4.list-manage.com/profile?u=539a4242e28417ba21438bdae&amp;id=f60441aafc&amp;e=" style="color:#656565;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://ringofkeys.us4.list-manage.com/profile?u%3D539a4242e28417ba21438bdae%26id%3Df60441aafc%26e%3D&amp;source=gmail&amp;ust=1581506291814000&amp;usg=AFQjCNFhP1LTxuc9DEBBRd-5AS-nirwUlA">update your preferences</a> or <a href="https://ringofkeys.us4.list-manage.com/unsubscribe?u=539a4242e28417ba21438bdae&amp;id=f60441aafc&amp;e=&amp;c=3c19b6dde7" style="color:#656565;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://ringofkeys.us4.list-manage.com/unsubscribe?u%3D539a4242e28417ba21438bdae%26id%3Df60441aafc%26e%3D%26c%3D3c19b6dde7&amp;source=gmail&amp;ust=1581506291814000&amp;usg=AFQjCNGp15TePjitI-LJNQW-pt3RRVwBCw">unsubscribe from this list</a>.</span> </td> </tr> </tbody></table> </td> </tr> </tbody> </table></td> </tr> </tbody></table> </td> </tr> </tbody></table>`,
        }
        
        const emailRes = await sgMail.send(msg)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(emailRes),
        }
    } catch(err) {
        console.error(err)

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: err.message,
        }
    }
}

function getHTML() {
    // return 
}