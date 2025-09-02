import { useState, useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";
import { FiMapPin } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { contactUsApi } from "@/api/apiRoutes";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import { LuPhoneCall } from "react-icons/lu";
import { BiListCheck, BiMailSend, BiMessageEdit } from "react-icons/bi";

const ContactUs = () => {
  const t = useTranslation();
  const webSettings = useSelector((state) => state.WebSetting?.data);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  // Error state for validation
  const [errors, setErrors] = useState({});

  // Track error timeout IDs for cleanup
  const [errorTimeouts, setErrorTimeouts] = useState({});

  // Loading state for submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input fields configuration for mapping
  const inputFields = [
    {
      name: "firstName",
      label: "firstName",
      type: "text",
      placeholder: "enterFirstName",
      colSpan: "md:col-span-1",
      required: true,
      icon: <FaRegUserCircle className="leadColor text-xl" />,
    },
    {
      name: "lastName",
      label: "lastName",
      type: "text",
      placeholder: "enterLastName",
      colSpan: "md:col-span-1",
      required: true,
      icon: <FaRegUserCircle className="leadColor text-xl" />,
    },
    {
      name: "email",
      label: "email",
      type: "email",
      placeholder: "enterEmail",
      colSpan: "md:col-span-1",
      required: true,
      icon: <BiMailSend className="leadColor text-xl" />,
    },
    {
      name: "subject",
      label: "subject",
      type: "text",
      placeholder: "enterSubject",
      colSpan: "md:col-span-1",
      required: true,
      icon: <BiListCheck className="leadColor text-xl" />,
    },
  ];

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      // Clear all active timeouts on unmount
      Object.values(errorTimeouts).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, [errorTimeouts]);

  // Function to set error with auto-clearing timeout
  const setErrorWithTimeout = (field, message) => {
    // Clear existing timeout for this field if any
    if (errorTimeouts[field]) {
      clearTimeout(errorTimeouts[field]);
    }

    // Set the error
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));

    // Set a timeout to clear this specific error after 5 seconds
    const timeoutId = setTimeout(() => {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));

      // Remove the timeout ID from tracking
      setErrorTimeouts((prev) => {
        const newTimeouts = { ...prev };
        delete newTimeouts[field];
        return newTimeouts;
      });
    }, 5000); // 5 seconds

    // Track the timeout ID
    setErrorTimeouts((prev) => ({
      ...prev,
      [field]: timeoutId,
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

      // Clear any existing timeout
      if (errorTimeouts[name]) {
        clearTimeout(errorTimeouts[name]);
        setErrorTimeouts((prev) => {
          const newTimeouts = { ...prev };
          delete newTimeouts[name];
          return newTimeouts;
        });
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Check each required field
    inputFields.forEach((field) => {
      if (field.required && !formData[field.name].trim()) {
        setErrorWithTimeout(field.name, `${t(field.label)} ${t("isRequired")}`);
        isValid = false;
      }
    });

    // Check message field
    if (!formData.message.trim()) {
      setErrorWithTimeout("message", `${t("message")} ${t("isRequired")}`);
      isValid = false;
    }

    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorWithTimeout("email", t("invalidEmail"));
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await contactUsApi({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      toast.success(t(response?.message) || t("messageSubmitted"));

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(t(error?.message) || t("somethingWentWrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const infoVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
    },
  };

  const mapVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
    },
  };

  // Error message animation variants
  const errorVariants = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, y: -10, height: 0 },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <NewBreadcrumb
        title={t("contactUs")}
        items={[{ href: "/contact-us", label: t("contactUs") }]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="mb-10 flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <div className="flex w-full flex-col gap-2 md:w-1/2">
              <h2 className="primaryColor text-base font-bold md:text-xl">
                {t("getInTouch")}
              </h2>
              <h4 className="brandColor text-xl font-bold sm:text-2xl lg:text-3xl">
                {t("needHelpWithRealEstate")}
              </h4>
            </div>
            <div className="w-full md:w-1/2">
              <p className="leadColor text-base font-medium">
                {t("haveQuestionsDescription")}
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Office Address Card */}
            {webSettings?.company_address && (
              <div className="primaryBackgroundBg flex flex-col justify-between gap-6 rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl">
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold">
                    {t("officeAddress")}
                  </h3>
                  <Link
                    href={`https://www.google.com/maps?q=${webSettings?.latitude},${webSettings?.longitude}` || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-colors duration-300 hover:text-primary"
                  >
                    <p className="leadColor text-base">
                      {webSettings?.company_address}
                    </p>
                  </Link>
                </div>
                <div className="inline-flex h-12 w-12 md:h-[72px] md:w-[72px] p-4 items-center justify-center rounded-full bg-white">
                  <FiMapPin className="leadColor text-3xl" />
                </div>
              </div>
            )}

            {/* Phone Number Card */}
            {(webSettings?.company_tel1 || webSettings?.company_tel2) &&
              <div className="primaryBackgroundBg justify-between flex flex-col gap-6 rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl">
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold">{t("phoneNumber")}</h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`tel:${webSettings?.company_tel1}`}
                      className="block transition-colors duration-300 hover:text-primary"
                    >
                      <p className="leadColor text-base">
                        {webSettings?.company_tel1}
                      </p>
                    </Link>
                    <Link
                      href={`tel:${webSettings?.company_tel2}`}
                      className="block transition-colors duration-300 hover:text-primary"
                    >
                      <p className="leadColor text-base">
                        {webSettings?.company_tel2}
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="inline-flex h-12 w-12 md:h-[72px] md:w-[72px] p-4 items-center justify-center rounded-full bg-white">
                  <LuPhoneCall className="leadColor text-3xl" />
                </div>
              </div>}

            {/* Email Us Card */}
            {webSettings?.company_email &&
              <div className="primaryBackgroundBg flex flex-col justify-between rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold">{t("emailUs")}</h3>
                  <Link
                    href={`mailto:${webSettings?.company_email}`}
                    className="block transition-colors duration-300 hover:text-primary"
                  >
                    <p className="leadColor text-base">
                      {webSettings?.company_email}
                    </p>
                  </Link>
                </div>
                <div className="inline-flex h-12 w-12 md:h-[72px] md:w-[72px] p-4 items-center justify-center rounded-full bg-white">
                  <BiMailSend className="leadColor text-3xl" />
                </div>
              </div>}
          </div>
        </div>
      </div>

      {webSettings?.iframe_link &&
        <motion.div className="h-[600px] rounded-none" variants={mapVariants}>
          <iframe
            src={`${webSettings?.iframe_link}`}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "0px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
            className="h-full w-full rounded-lg"
          ></iframe>
        </motion.div>}
      <div className="container mx-auto px-4 py-12">
        <div className={`cardBg relative mx-auto ${webSettings?.iframe_link ? "mt-[-200px]" : "mt-0"} rounded-2xl`}>
          <motion.div
            className="rounded-2xl bg-white p-3 cardHoverShadow md:p-8"
            variants={formVariants}
          >
            <motion.h2
              className="mb-2 text-base font-semibold md:text-2xl"
              variants={itemVariants}
            >
              {t("sendUsMessage")}
            </motion.h2>
            <motion.p className="mb-6 text-gray-500" variants={itemVariants}>
              {t("sendUsMessageDescription")}
            </motion.p>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <motion.div
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                variants={itemVariants}
              >
                {/* Map through input fields */}
                {inputFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    className={field.colSpan}
                    variants={itemVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                  >
                    <label className="mb-1 block text-sm">
                      {t(field.label)}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={t(field.placeholder)}
                        className={`primaryBackgroundBg w-full rounded-lg border p-3 pl-10 ${errors[field.name] ? "border-red-500" : "border-gray-200"} focus:primaryBorderColor rounded transition-all duration-200 focus:outline-none`}
                        required={field.required}
                      />
                      {field.icon && (
                        <div className="absolute left-3 top-4 pointer-events-none" tabIndex={-1}>
                          {field.icon}
                        </div>
                      )}
                    </div>
                    {/* Error message with auto-hiding animation */}
                    <AnimatePresence mode="wait">
                      {errors[field.name] && (
                        <motion.div
                          key={`error-${field.name}`}
                          variants={errorVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="overflow-hidden"
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                        >
                          <p className="mt-1 text-xs text-red-500">
                            {errors[field.name]}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
              {/* Message textarea */}
              <motion.div variants={itemVariants}>
                <label className="mb-1 block text-sm">
                  {t("message")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("enterMessage")}
                    className={`primaryBackgroundBg relative w-full rounded-lg border p-3 pl-10 ${errors.message ? "border-red-500" : "border-gray-200"} focus:primaryBorderColor resize-none rounded transition-all duration-200 focus:outline-none`}
                    required
                  ></textarea>
                  <BiMessageEdit className="leadColor absolute left-3 top-4 text-xl pointer-events-none" />
                </div>
                {/* Message error with auto-hiding animation */}
                <AnimatePresence mode="wait">
                  {errors.message && (
                    <motion.div
                      key="error-message"
                      variants={errorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="overflow-hidden"
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      <p className="mt-1 text-xs text-red-500">
                        {errors.message}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {/* Submit Button with loader */}
              <motion.div className="flex justify-end" variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="secondaryTextBg w-full sm:w-fit flex min-w-[120px] items-center justify-center overflow-hidden rounded-lg p-4 text-white transition duration-300"
                  // whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isSubmitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center"
                    >
                      <svg
                        className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("sending")}
                    </motion.div>
                  ) : (
                    t("sendMessage")
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;
