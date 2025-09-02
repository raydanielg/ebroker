"use client"
import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowDown, MdClose } from 'react-icons/md'
import { applyAgentVerificationApi, getVerificationFormFieldsApi, getVerificationFormValuesApi } from '@/api/apiRoutes'
import Image from 'next/image'
import { useTranslation } from '../context/TranslationContext'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { truncate } from '@/utils/helperFunction'

const UserVerificationForm = () => {
    const t = useTranslation()
    const router = useRouter()
    const { locale } = router?.query

    const [formData, setFormData] = useState({})
    const [formFields, setFormFields] = useState([])
    const [imagePreviews, setImagePreviews] = useState({})
    const [loading, setLoading] = useState(false)
    const activeLanguage = useSelector((state) => state.LanguageSettings?.active_language)

    const getVerficationFormFields = async () => {
        try {
            const response = await getVerificationFormFieldsApi()
            if (!response.error) {
                setFormFields(response?.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }
    const getVerficationFormFieldsValues = async () => {
        try {
            const response = await getVerificationFormValuesApi()
            if (!response.error && response?.data?.verify_customer_values) {
                const initialValues = {};
                const previews = {};

                response?.data?.verify_customer_values?.forEach((value) => {
                    const formField = formFields.find(
                        (field) => field.id === value.verify_customer_form_id
                    );
                    if (formField) {
                        initialValues[formField.name] = value.value;

                        // Handle file preview
                        if (formField.field_type === "file" && value.value) {
                            previews[formField.name] = value.value; // Assuming value.value is the file URL
                        }
                    }
                });

                setFormData(initialValues);
                setImagePreviews(previews); // Set the file preview state
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getVerficationFormFields()
    }, [activeLanguage])

    useEffect(() => {
        getVerficationFormFieldsValues()
    }, [formFields])

    // Generic handler for field value changes
    const handleChange = (e, field) => {
        const { name, value, type, checked, files } = e.target;

        // Handle file input
        if (type === "file") {
            const file = files[0];
            if (file) {
                // Store the file object for all file types, not just images
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: file, // Store the actual file object
                }));

                // Update image preview state if the file is an image
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setImagePreviews((prevPreviews) => ({
                            ...prevPreviews,
                            [name]: reader.result, // Store image preview
                        }));
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Clear the preview if it's not an image (can add other types as needed)
                    setImagePreviews((prevPreviews) => ({
                        ...prevPreviews,
                        [name]: null,
                    }));
                }
            }
        }
        // Handle checkboxes
        else if (type === "checkbox") {
            setFormData((prevData) => {
                const existingValues = prevData[name] || [];
                if (checked) {
                    return {
                        ...prevData,
                        [name]: [...existingValues, value],
                    };
                } else {
                    return {
                        ...prevData,
                        [name]: existingValues.filter((v) => v !== value),
                    };
                }
            });
        }
        // Handle radio buttons
        else if (type === "radio") {
            setFormData((prevData) => ({
                ...prevData,
                [field.name]: value,
            }));
        }
        // Handle other input types (text, number, etc.)
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleRemoveFile = (fieldName) => {
        const updatedFormData = { ...formData }
        delete updatedFormData[fieldName]

        const updatedPreviews = { ...imagePreviews }
        delete updatedPreviews[fieldName]

        setFormData(updatedFormData)
        setImagePreviews(updatedPreviews)
    }

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;

        // Iterate through each form field to check if they are filled
        formFields.forEach((field) => {
            const fieldValue = formData[field.name];

            // If the field is required and the value is empty or null
            if (!fieldValue || fieldValue === "") {
                // toast.error(`${field.name} is required`);
                hasError = true; // Mark that there is an error
            }
        });

        // If there are any errors, prevent form submission
        if (hasError) {
            toast.error(t("allFields"));
            return;
        }

        setLoading(true); // Start loading
        const formFieldsData = formFields.map((field) => {
            const fieldValue = formData[field.name];

            if (fieldValue === undefined || fieldValue === "") {
                return { id: field.id, value: null };
            }

            // Ensure to return the file object for all file types
            return { id: field.id, value: fieldValue };
        });

        const filteredFormFieldsData = formFieldsData.filter(
            (field) => field.value !== null
        );

        try {
            const response = await applyAgentVerificationApi({ form_fields: filteredFormFieldsData })
            if (!response.error) {
                setLoading(false); // Stop loading
                toast.success(t(response?.message))
                router.push(`/${locale}/user/dashboard`)
            } else {
                toast.error(t(response?.message))
                setLoading(false); // Stop loading
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(t(error?.message))
            setLoading(false); // Stop loading on error
        }
    };



    const renderFields = (field) => {
        switch (field.field_type) {
            case "text":
                return (
                    <div className="flex flex-col space-y-2" key={field.id}>
                        <label className="font-bold break-all text-sm flex items-center">
                            {field.translated_name || field.name}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name={field.name}
                            placeholder={`${t("enter")} ${field.translated_name || field.name} ${t("here")}`}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(e, field)}
                            className="p-3 primaryBackgroundBg rounded-md focus:outline-none"
                        />
                    </div>
                );
            case "number":
                return (
                    <div className="flex flex-col space-y-2" key={field.id}>
                        <label className="font-bold break-all text-sm flex items-center">
                            {field.translated_name || field.name}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="number"
                            name={field.name}
                            placeholder={`${t("enter")} ${field.translated_name || field.name} ${t("here")}`}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(e, field)}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                );
            case "radio":
                return (
                    <div className="flex flex-col space-y-2" key={field.id}>
                        <label className="font-bold break-all text-sm flex items-center">
                            {field.translated_name || field.name}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {field.form_fields_values &&
                                field.form_fields_values.map((option, optionIndex) => (
                                    <div key={`radio_${option?.id}_${optionIndex}`} className='flex items-center justify-center gap-2'>
                                        <input
                                            type="radio"
                                            id={`radio_${option?.id}_${optionIndex}`}
                                            name={field.name}
                                            className="hidden"
                                            value={option.value}
                                            checked={formData[field.name] === option.value}
                                            onChange={(e) => handleChange(e, field)}
                                        />
                                        <label
                                            htmlFor={`radio_${option?.id}_${optionIndex}`}
                                            className={`p-3 w-full h-full border border-gray-300 rounded-md cursor-pointer ${formData[field.name] === option.value ? 'primaryBg text-white' : 'bg-white'
                                                }`}
                                        >
                                            {option.value}
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                );
            case "checkbox":
                return (
                    <div className="flex flex-col space-y-2" key={field.id}>
                        <label className="font-bold break-all text-sm flex items-center">
                            {field.translated_name || field?.name}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex flex-col space-y-2">
                            {field.form_fields_values &&
                                field.form_fields_values.map((option, optionIndex) => (
                                    <div key={`checkbox_${option?.id}_${optionIndex}`}>
                                        <input
                                            type="checkbox"
                                            id={`checkbox_${option?.id}_${optionIndex}`}
                                            name={field.name}
                                            className="hidden"
                                            value={option.value}
                                            checked={(formData[field.name] || []).includes(option.value)}
                                            onChange={(e) => handleChange(e, field)}
                                        />
                                        <label
                                            htmlFor={`checkbox_${option?.id}_${optionIndex}`}
                                            className={`p-2 w-10 h-10 flex items-center justify-center rounded border ${(formData[field.name] || []).includes(option.value) ? 'primaryBg text-white' : 'bg-white'
                                                } hover:cursor-pointer`}
                                        >
                                            {option.value}
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                );
            case "dropdown":
                return (
                    <div className="flex flex-col space-y-2" key={field.id}>
                        <label className="font-bold break-all text-sm flex items-center">
                            {field.translated_name || field.name}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(e, field)}
                                className="p-3 border rounded-md w-full focus:outline-none focus:primaryBorderColor appearance-none max-w-full overflow-hidden"
                            >
                                <option value="" className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                    {t("select")} {field.translated_name || field.name}
                                </option>
                                {field.form_fields_values &&
                                    field.form_fields_values.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.value}
                                            title={option.value}
                                            className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                        >
                                            {truncate(option.value, 30)}
                                        </option>
                                    ))}
                            </select>
                            <MdKeyboardArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                );
            case "textarea":
                return (
                    <div className="flex flex-col space-y-2" key={field.id}>
                        <label className="font-bold break-all text-sm flex items-center">
                            {field.translated_name || field.name}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            name={field.name}
                            placeholder={`${t("enter")} ${field.translated_name || field.name} ${t("here")}`}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(e, field)}
                        ></textarea>
                    </div>
                );
            case "file":
                return (
                    <div className="input-field" key={field.id}>
                        <label className="font-bold break-all text-sm flex items-center">
                            {field.translated_name || field.name}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        {formData[field.name] ? (
                            <div className="selected_file bg-gray-100 rounded-lg p-4 relative">
                                {/* Image preview with close button in top-right corner */}
                                <div className="relative">
                                    {imagePreviews[field.name] &&
                                        /\.(jpg|jpeg|png|gif)$/i.test(
                                            formData[field.name].name || formData[field.name]
                                        ) ? (
                                        <div className="image-preview">
                                            <Image
                                                src={imagePreviews[field.name]}
                                                alt="Preview"
                                                width={300}
                                                height={200}
                                                className="rounded-md object-cover w-full"
                                            />
                                        </div>
                                    ) : (
                                        <span>
                                            {formData[field.name]?.name || formData[field.name]}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="remove-button absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-colors"
                                        onClick={() => handleRemoveFile(field.name)}
                                    >
                                        <MdClose size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="file-input-container primaryBackgroundBg p-3">
                                <label className="cursor-pointer inline-flex items-center">
                                    <span className="border border-black secondaryText py-1 px-3 rounded mr-2 text-sm transition-colors">{t("chooseFile")}</span>
                                    <span className="text-sm">{t("noFileChosen")}</span>
                                    <input
                                        type="file"
                                        name={field.name}
                                        onChange={(e) => handleChange(e, field)}
                                        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='rounded-lg shadow-sm'>
            <h1 className='text-2xl font-bold mb-4'>{t("agentVerification")}</h1>

            <form onSubmit={handleSubmit} className='flex flex-col bg-white p-6 space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {formFields.length > 0 && formFields.map(field => renderFields(field))}
                </div>

                <div className='flex justify-end'>
                    {loading ?
                        (<button
                            type="button"
                            className='px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors'
                        >
                            <div className="my-10 flex items-center justify-center">
                                <div className="custom-loader"></div>
                            </div>
                        </button>)
                        :
                        (
                            <button
                                type="submit"
                                className='px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors'
                            >
                                {t("submit")}
                            </button>)
                    }
                </div>
            </form>
        </div>
    )
}

export default UserVerificationForm