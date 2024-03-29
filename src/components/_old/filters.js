import React, { useEffect } from "react"
import { Field } from "../components/formfields"
import CheckboxGrid from "../components/checkboxgrid"

const Filters = ({ formik, filters }) => {
    // Using useEffect to update localStorage with latest filters on every change
    useEffect(() => {
        async function setFilter() {
            if (typeof window !== "undefined") {
                localStorage.setItem(
                    "latestFilters",
                    JSON.stringify(formik.values)
                )
            }
            console.log("setting to: ", formik.values)
        }

        setFilter()
    }, [formik.values])

    return filters.map((filter) => {
        if (filter.type === "checkbox") {
            return (
                <CheckboxGrid
                    className={filter.field}
                    label={filter.label}
                    helpText={filter.helpText}
                    fieldData={filter.values}
                >
                    {filter.values.map((val, i) => (
                        <Field
                            type="checkbox"
                            name={`${filter.field}[${i}]`}
                            label={val}
                            change={formik.handleChange}
                            value={formik.values[filter.field][i]}
                            defaultChecked={formik.values[filter.field][i]}
                            key={val}
                        />
                    ))}
                    {/* <Field type='text' name='locationsOther' change={formik.handleChange} label='Other' value={formik.values.locationsOther} /> */}
                </CheckboxGrid>
            )
        } else if (filter.type === "dropdown") {
            return (
                <>
                    <label htmlFor={filter.field}>{filter.label}</label>
                    <select
                        name={filter.field}
                        onChange={formik.handleChange}
                        value={formik.values[filter.field]}
                    >
                        <option value="">{filter.placeholder}</option>
                        {filter.values.map((value) => (
                            <option value={value}>{value}</option>
                        ))}
                    </select>
                </>
            )
        } else {
            return (
                <Field
                    type="text"
                    name={filter.field}
                    label={filter.label}
                    helpText={filter.helpText}
                    change={formik.handleChange}
                    value={formik.values[filter.field]}
                    placeholder={filter.placeholder}
                />
            )
        }
    })
}
export default Filters
