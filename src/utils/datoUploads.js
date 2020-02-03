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
    console.log('uploading ', file.name, file.type)
    const signedUrlsRes = await fetch('/.netlify/functions/createDatoImgUrl', {
        method: 'POST',
        body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
        }),
    }).catch(err => console.err('error getting image url: ', JSON.parse(err)))
  
    const datoUrlRes = await signedUrlsRes
  
    console.log('datorUrlRes = ', datoUrlRes)
  
    const fileArray = await readFile(file)
  
    console.log('fileArray = ', fileArray)
  
    const uploadRes = await fetch(datoUrlRes.url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: fileArray,
    }).catch(err => console.err(err))
  
    console.log('uploadRes = ', uploadRes)
  
    return [datoUrlRes, uploadRes]
  }