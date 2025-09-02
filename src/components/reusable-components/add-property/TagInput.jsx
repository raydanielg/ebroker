import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { FaTimes } from 'react-icons/fa'
import { useTranslation } from '@/components/context/TranslationContext'

// Custom Tag Input Component
const TagInput = ({ tags, setTags, maxTags, name, setData }) => {
    const t = useTranslation()
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')

    const handleKeyDown = (e) => {
        // Create a tag when Tab, Enter or Space is pressed
        if ((e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key === ',') && inputValue.trim() !== '') {
            e.preventDefault()
            const newTag = inputValue.trim()

            // Check if tag already exists (case insensitive)
            if (tags.some(tag => tag.toLowerCase() === newTag.toLowerCase())) {
                setError("Tag already exists")
                return
            }

            // Check if we've reached the maximum number of tags
            // if (tags.length >= maxTags) {
            //     return
            // }

            const newTags = [...tags, newTag]
            setTags(newTags)
            setInputValue('')
            setError('')

            // Pass updated tags to parent component
            if (setData) {
                setData(newTags.join(','), name)
            }
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            // Remove the last tag when backspace is pressed and input is empty
            const newTags = [...tags]
            newTags.pop()
            setTags(newTags)
            setError('')

            // Pass updated tags to parent component
            if (setData) {
                setData(newTags.join(','), name)
            }
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
        setError('') // Clear error when input changes
    }

    const handleRemoveTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove)
        setTags(newTags)
        setError('')

        // Pass updated tags to parent component
        if (setData) {
            setData(newTags.join(','), name)
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 p-1 border rounded-md primaryBackgroundBg min-h-fit">
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md">
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-primary/70 hover:text-primary focus:outline-none"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                ))}
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? t("typeAndPressEnterTabOrSpaceToAddKeywords") : ""}
                    className="flex-grow placeholder:text-wrap w-full h-fit bg-transparent border-0 focus:outline-none focus:border-none focus:ring-0 shadow-none min-w-[150px]"
                // disabled={tags.length >= maxTags}
                />
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
            {tags.length >= maxTags && (
                <p className="text-red-500 text-xs mt-1">
                    {t("maximumOf")} {maxTags} {t("tagsReached")}
                </p>
            )}
        </div>
    )
}

export default TagInput