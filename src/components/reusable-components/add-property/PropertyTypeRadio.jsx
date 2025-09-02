import React from 'react'

// Custom Radio Button component
const PropertyTypeRadio = ({ value, checked, onChange, label, name }) => {
    const handleChange = (e) => {
        // Create a custom event with the correct properties
        onChange(e, name, value);
    };

    return (
        <div
            className={`flex items-center gap-2 primaryBackgroundBg ${checked ? "primaryBorderColor" : ""} relative p-2 rounded-lg w-full`}
        >
            <label htmlFor={`propertyType${value}`} className="flex items-center gap-2 w-full cursor-pointer">
                <input
                    id={`propertyType${value}`}
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={handleChange}
                    className="peer sr-only"
                />
                {/* Custom radio */}
                <div className="w-5 h-5 rounded-full border bg-white peer-checked:primaryBg outline outline-1 outline-black peer-checked:border-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full primaryBg scale-0 peer-checked:scale-100 transition-transform"></div>
                </div>
                {/* Label text */}
                <span>{label}</span>
            </label>
        </div>
    )
}

export default PropertyTypeRadio