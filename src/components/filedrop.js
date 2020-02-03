import React, { useState } from 'react'
import './filedrop.css'

const FileDrop = ({ helpText }) => {
    const [currFile, setFile] = useState('')

    return (<div className='drop-target' onDragOver={handleDragOver} onDragLeave={handleDragLeave}
    onDrop={e => {
        e.preventDefault()
        e.target.classList.remove('drag-over')
        const file = e.dataTransfer.items ? e.dataTransfer.items[0].getAsFile() : e.dataTransfer.files[0]
        console.log('dropped!', file, e.target)
        e.target.querySelector("input[type='file']").files[0] = file
        setFile(file)}
    }>
    <label className='file-drop'>
        <input type='file' className='visually-hidden' onChange={e => setFile(e.target.files[0])} required/>
        { !currFile
        ? (<>
            <p>Drag and drop your image here.</p>
            <span>{ currFile }</span>
            <span className='help-text'>or</span>
            <span className='btn bg_slate'>Browse Files</span>
            {helpText &&
                <span className='help-text'>{ helpText }</span>}
        </>)
        : (<>
            <img src={ URL.createObjectURL(currFile) } alt='uploaded image' />
            <button className='btn_close' onClick={() => setFile('')}><span className='visually-hidden'>Close</span>
                <svg viewBox='0 0 5 5'>
                    <path d='M 1 1 l 3 3' />
                    <path d='M 1 4 l 3 -3' />
                </svg>
            </button>
        </>)}
    </label>
    </div>)
}

export default FileDrop


function handleDragOver(e) {
    e.preventDefault()
    e.target.classList.add('drag-over')
}

function handleDragLeave(e) {
    e.preventDefault()
    e.target.classList.remove('drag-over')
}