import { useState } from "react"

export default function useForm(initial = {}) {
    const [inputs, updateInputs] = useState(initial)

    function handleChange(e) {
        updateInputs({
            ...inputs,
            [e.target.name]: getValue(e.target),
        })
    }

    function resetForm() {
        updateInputs(initial)
    }

    return {
        inputs,
        handleChange,
        resetForm,
    }

    function getValue(input) {
        if (input.files) return input.files[0]

        if (input.type === "checkbox") return input.checked

        return input.value
    }
}
