export const readFile = file => {
    const fr = new FileReader()

    return new Promise((resolve, reject) => {
        fr.onerror = () => {
        fr.abort();
        reject(new DOMException("Problem parsing input file."));
        };

        fr.onload = async () => {
        resolve(fr.result);
        };
        fr.readAsArrayBuffer(file);
    });
}


export const uploadFile = async (file) => {
    const signedUrlsRes = await fetch(process.env.FUNCTIONS_HOST || '' + '/.netlify/functions/createDatoImgUrl', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: file.name,
    }).catch(err => console.error('error getting image url: ', err))
  
    const datoUrlRes = await signedUrlsRes.json().catch(err => console.error(err))

    const fileArray = await readFile(file)
  
    const uploadRes = await fetch(datoUrlRes.url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: fileArray,
    }).catch(err => console.error(err))
  
    console.log('uploadRes = ', uploadRes)
  
    return [datoUrlRes, uploadRes]
  }