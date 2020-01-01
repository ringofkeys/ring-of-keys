import { useState } from 'react'

export default function useForm (initial = {}) {
    const [inputs, updateInputs] =useState(initial)

    function handleChange(e) {
        updateInputs({
            ...inputs,
            [e.target.name]: e.target.files ? e.target.files[0] : e.target.value
        })
    }

    function resetForm() {
        updateInputs(initial)
    }

    return {
        inputs,
        handleChange,
        resetForm
    }
}