import React from 'react'

const PreviewMessage = () => (
    <div className={`preview-message`}>
        <div className='wrapper'>
            <p>
                You're viewing a preview of your new profile content. We're rebuilding the site now with your edits, and you
                should see them across the site within a few minutes.
            </p>
            <button className='btn_close' onClick={ e => {
                    console.log('target = ', e.target)
                    let elem = e.target
                    while (!elem.classList.contains('preview-message') && elem.parentElement) {
                        elem = elem.parentElement
                    }

                    elem.classList.add('closed')
                }}>
                <span className='visually-hidden'>Close</span>
                <svg viewBox='0 0 5 5'>
                    <path d='M 1 1 l 3 3' stroke='black' />
                    <path d='M 1 4 l 3 -3' stroke='black' />
                </svg>
            </button>
        </div>
    </div>
)

export default PreviewMessage