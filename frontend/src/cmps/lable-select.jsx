import React, { useEffect, useState } from 'react'
import Select from 'react-select'
export function LabelSelect({ handleLableChange, lables }) {
    const [options, setOptions] = useState([])

    useEffect(() => {
        onSetOptions()
    }, [])

    function onSetOptions() {
        let options = []
        lables.forEach(lable => {
            if (lable.txt === 'Default') return
            options.push({ value: lable.txt, label: lable.txt, isFixed: true, })
        })
        setOptions(options)
    }

    function handleChange(...props) {
        // let { value, name: field, type } = target
        const labels = props[0].map((labelInfo) => labelInfo.value)
        handleLableChange(labels)
    }
    return (
        <div className="select-wrap">
            <Select
                defaultValue={''}
                isMulti
                name="colors"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
            />
        </div>
    )
}