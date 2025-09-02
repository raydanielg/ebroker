import api from "./axiosMiddleware";
import * as apiEndpoints from "./apiEndpoints";
import {
  createFilteredFormData,
  getFilteredParams,
} from "@/utils/helperFunction";

// Not
// export const getSetting = async () => {
//   const res = await api.post(apiEndpoints.GET_SETTINGS);
//   return res.data;
// };

// 1.Get Web Settings
export const getWebSetting = async () => {
  const res = await api.get(apiEndpoints.WEB_SETTINGS);
  return res.data;
};

// 2.Get Home Page Data
export const getHomePageData = async ({
  latitude = "",
  longitude = "",
  radius = "",
}) => {
  // Only include params that have values
  const params = {};
  if (latitude) params.latitude = latitude;
  if (longitude) params.longitude = longitude;
  if (radius) params.radius = radius;

  const res = await api.get(apiEndpoints.HOMEPAGE_DATA, { params });
  return res.data;
};

// 3.Get Cities Data
export const getCitiesData = async ({ offset, limit }) => {
  const params = { offset: offset, limit: limit };
  const res = await api.get(apiEndpoints.GET_CITYS_DATA, { params });
  return res.data;
};

// 4.Get Property Details
export const getPropertyDetails = async ({ slug_id }) => {
  const params = { slug_id: slug_id };
  const res = await api.get(apiEndpoints.GET_PROPETRES, { params });
  return res.data;
};

// 5.Get Language Data
export const getLanguageData = async ({
  language_code,
  web_language_file = 1,
}) => {
  const params = { language_code, web_language_file };
  const res = await api.get(apiEndpoints.GET_LANGUAGES, { params });
  return res.data;
};

// 6.User Signup
export const userSignup = async ({
  name = "",
  email = "",
  password = "",
  mobile = "",
  type = "",
  address = "",
  auth_id = "",
  logintype = "",
  profile = "",
  fcm_id = "",
  country_code = "",
}) => {
  // Create an object with all parameters
  const userData = {
    name,
    email,
    password,
    mobile,
    type,
    address,
    auth_id,
    logintype,
    profile,
    fcm_id,
    country_code,
  };

  // Filter out falsy values and create FormData
  const formData = createFilteredFormData(userData);

  // Send only non-falsy values to the API
  const res = await api.post(apiEndpoints.USER_SIGNUP, formData);
  return res.data;
};

// 7.Verify OTP
export const verifyOTP = async ({ number = "", email = "", otp = "", country_code = "" }) => {
  const params = {
    number,
    email,
    otp,
    country_code
  };
  const res = await api.get(apiEndpoints.VERIFY_OTP, { params });
  return res.data;
};

// 8.User Register
export const userRegisterApi = async ({
  name = "",
  email = "",
  mobile = "",
  password = "",
  re_password = "",
  country_code = ""
}) => {
  const data = {
    name,
    email,
    mobile,
    password,
    re_password,
    country_code
  };

  const formData = createFilteredFormData(data);
  const res = await api.post(apiEndpoints.USER_REGISTER, formData);
  return res.data;
};

// 9.Get OTP
export const getOTPApi = async ({ number = "", email = "", country_code = "" }) => {
  const params = {
    number,
    email,
  };
  const res = await api.get(apiEndpoints.GET_OTP, { params });
  return res.data;
};

// 10.Forgot Password
export const forgotPasswordApi = async ({ email = "" }) => {
  const params = {
    email,
  };
  const res = await api.get(apiEndpoints.FORGOT_PASSWORD, { params });
  return res.data;
};

// 11.Before Logout
export const beforeLogoutApi = async ({ fcm_id = "" }) => {
  const formData = createFilteredFormData({ fcm_id });
  const res = await api.post(apiEndpoints.BEFORE_LOGOUT, formData);
  return res.data;
};

export const getPropertyListApi = async ({
  property_type = "",
  category_id = "",
  category_slug_id = "",
  city = "",
  state = "",
  country = "",
  min_price = "",
  max_price = "",
  posted_since = "",
  most_viewed = "",
  most_liked = "",
  promoted = "",
  limit = "",
  offset = "",
  search = "",
  parameter_id = "",
  get_all_premium_properties = "",
}) => {
  const params = {
    property_type,
    category_id,
    category_slug_id,
    city,
    state,
    country,
    min_price,
    max_price,
    posted_since,
    most_viewed,
    most_liked,
    promoted,
    limit,
    offset,
    search,
    parameter_id,
    get_all_premium_properties,
  };
  const filteredParams = getFilteredParams(params);
  const res = await api.get(apiEndpoints.GET_PROPERTY_LIST, {
    params: filteredParams,
  });
  return res.data;
};

export const getCountbyCityApi = async ({ offset = "", limit = "" }) => {
  const params = {
    offset,
    limit,
  };
  const res = await api.get(apiEndpoints.GET_CITYS_DATA, { params });
  return res.data;
};
// 13.Get Categories
export const getCategoriesApi = async ({
  limit = "",
  offset = "",
  has_property = false,
  passHasProperty = true,
}) => {
  const params = { limit, offset };

  if (passHasProperty) {
    params.has_property = has_property;
  }

  const res = await api.get(apiEndpoints.GET_CATEGORES, { params });
  return res.data;
};

// 14.Get Facilities
export const getFacilitiesApi = async () => {
  const res = await api.get(apiEndpoints.GET_FACILITIES);
  return res.data;
};

// 15. Get Facilities for Filter
export const getFacilitiesForFilterApi = async () => {
  const res = await api.get(apiEndpoints.GET_FACILITITES_FOR_FILTER);
  return res.data;
};

// 16. Contact Us
export const contactUsApi = async ({
  first_name = "",
  last_name = "",
  email = "",
  subject = "",
  message = "",
}) => {
  const formData = createFilteredFormData({
    first_name,
    last_name,
    email,
    subject,
    message,
  });
  const res = await api.post(apiEndpoints.CONTACT_US, formData);
  return res.data;
};

// 17. Get Packages
export const getPackagesApi = async () => {
  const res = await api.get(apiEndpoints.GET_PACKAGES);
  return res.data;
};

// 18. Get Payment Settings
export const getPaymentSettingsApi = async () => {
  const res = await api.get(apiEndpoints.GET_PAYMENT_SETTINGS);
  return res.data;
};

// 19. Assign Free Package
export const assignFreePackageApi = async ({ package_id = "" }) => {
  const formData = createFilteredFormData({ package_id });
  const res = await api.post(apiEndpoints.ASSIGN_FREE_PACKAGE, formData);
  return res.data;
};

// 20. Create Payment Intent
export const createAllPaymentIntentApi = async ({
  package_id = "",
  platform_type = "",
}) => {
  const formData = createFilteredFormData({ package_id, platform_type });
  const res = await api.post(apiEndpoints.CREATE_PAYMENT_INTENT, formData);
  return res.data;
};

// 21. Payment Transaction Failed
export const paymentTransactionFailApi = async ({
  payment_transaction_id = "",
}) => {
  const formData = createFilteredFormData({ payment_transaction_id });
  const res = await api.post(apiEndpoints.PAYMENT_TRANSACTION_FAIL, formData);
  return res.data;
};

// 22. Paypal Api
export const paypalApi = async ({ amount = "", package_id = "" }) => {
  const params = getFilteredParams({
    amount,
    package_id,
  });
  const res = await api.get(apiEndpoints.PAYPAL, { params });
  return res.data;
};

//  23. FlutterWave Api
export const flutterWaveApi = async ({ package_id = "" }) => {
  const formData = createFilteredFormData({ package_id });
  const res = await api.post(apiEndpoints.FLUTTERWAVE, formData);
  return res.data;
};

// 24. Get FAQs
export const getFaqsApi = async ({ limit = "", offset = "" }) => {
  const params = {
    limit,
    offset,
  };
  const filteredParams = getFilteredParams(params);
  const res = await api.get(apiEndpoints.FAQS, { params: filteredParams });
  return res.data;
};

// 25. Get All Agents
export const getAllAgentsApi = async ({ limit = "", offset = "" }) => {
  const params = { limit, offset };
  const res = await api.get(apiEndpoints.AGENT_LIST, { params });
  return res.data;
};

// 26. Get All Projects
export const getAllProjectsApi = async ({
  userid = "",
  id = "",
  slug_id = "",
  search = "",
  get_similar = "",
  category_id = "",
  city = "",
  state = "",
  country = "",
  posted_since = "",
  limit = "",
  offset = "",
  get_featured = "",
}) => {
  const params = {
    userid,
    id,
    slug_id,
    search,
    get_similar,
    category_id,
    city,
    state,
    country,
    posted_since,
    limit,
    offset,
    get_featured,
  };
  const filteredParams = getFilteredParams(params);
  const res = await api.get(apiEndpoints.GET_PROJECTS, {
    params: filteredParams,
  });
  return res.data;
};

// 27. Get All Articles
export const getArticlesApi = async ({
  id = "",
  category_id = "",
  slug_id = "",
  limit = "",
  offset = "",
}) => {
  const params = {
    id,
    category_id,
    slug_id,
    limit,
    offset,
  };
  const filteredParams = getFilteredParams(params);
  const res = await api.get(apiEndpoints.GET_ARTICLES, {
    params: filteredParams,
  });
  return res.data;
};

// 28. Get Added Properties
export const getAddedPropertiesApi = async ({
  limit = "",
  offset = "",
  slug_id = "",
  is_promoted = "",
}) => {
  const params = { limit, offset, slug_id, is_promoted };
  const res = await api.get(apiEndpoints.GET_ADDED_PROPERTIES, { params });
  return res.data;
};

// 29. Get Verification Form Fields
export const getVerificationFormFieldsApi = async () => {
  const res = await api.get(apiEndpoints.GET_AGENT_VERIFICATION_FORM_FIELDS);
  return res.data;
};

// 30. Get Verification Form Values
export const getVerificationFormValuesApi = async () => {
  const res = await api.get(apiEndpoints.GET_AGENT_VERIFICATION_FORM_VALUES);
  return res.data;
};

// 31. Apply Agent Verification
export const applyAgentVerificationApi = async ({ form_fields = [] }) => {
  let data = new FormData();
  // Append the parameters array if it is an array
  if (Array.isArray(form_fields)) {
    form_fields.forEach((field, index) => {
      data.append(`form_fields[${index}][id]`, field.id);
      data.append(`form_fields[${index}][value]`, field.value);
    });
  }
  const res = await api.post(apiEndpoints.APPLY_AGENT_VERIFICATION, data);
  return res.data;
};

// 32. Change Property Status
export const changePropertyStatusApi = async ({
  property_id = "",
  status = "",
}) => {
  const formData = createFilteredFormData({ property_id, status });
  const res = await api.post(apiEndpoints.CHANGE_PROPERTY_STATUS, formData);
  return res.data;
};

// 33. Update Property Status
export const updatePropertyStatusApi = async ({
  property_id = "",
  status = "",
}) => {
  const formData = createFilteredFormData({ property_id, status });
  const res = await api.post(apiEndpoints.UPDATE_PROPERTY_STATUS, formData);
  return res.data;
};

// 34. Check Package Limit
export const checkPackageLimitApi = async ({ type = "" }) => {
  const params = { type };
  const res = await api.get(apiEndpoints.CHECK_PACKAGE_LIMIT, { params });
  if (!res?.data?.error) {
    return res.data;
  } else {
    throw res.data;
  }
};

// 35. Feature Property
export const featurePropertyApi = async ({
  feature_for = "",
  property_id = "",
  project_id = "",
}) => {
  const formData = createFilteredFormData({
    feature_for,
    property_id,
    project_id,
  });
  const res = await api.post(apiEndpoints.STORE_ADVERTISEMENT, formData);
  return res.data;
};

// 36. Delete Property
export const deletePropertyApi = async ({ id = "" }) => {
  const formData = createFilteredFormData({ id });
  const res = await api.post(apiEndpoints.DELETE_PROPERTY, formData);
  return res.data;
};

// 37. Get Project Details
export const getProjectDetailsApi = async ({
  slug_id = "",
  get_similar = "",
}) => {
  const params = { slug_id, get_similar };
  const filteredParams = getFilteredParams(params);
  const res = await api.get(apiEndpoints.GET_PROJECT_DETAILS, {
    params: filteredParams,
  });
  return res.data;
};

// 38. Get Advertisements
export const getFeaturedDataApi = async ({
  type = "",
  limit = "",
  offset = "",
}) => {
  const params = { type, limit, offset };
  const res = await api.get(apiEndpoints.GET_FEATURED_DATA, { params });
  return res.data;
};

// 39. Get User Projects
export const getUserProjectsApi = async ({
  limit = "",
  offset = "",
  slug_id = "",
}) => {
  const params = { limit, offset, slug_id };
  const res = await api.get(apiEndpoints.GET__MY_PROJECTS, { params });
  return res.data;
};

// 40. Change Project Status
export const changeProjectStatusApi = async ({
  project_id = "",
  status = "",
}) => {
  const formData = createFilteredFormData({ project_id, status });
  const res = await api.post(apiEndpoints.CHANGE_PROJECT_STATUS, formData);
  return res.data;
};

// 41. Delete Project
export const deleteProjectApi = async ({ id = "" }) => {
  const formData = createFilteredFormData({ id });
  const res = await api.post(apiEndpoints.DELETE_PROJECT, formData);
  return res.data;
};

// 42. Get Favourite Property
export const getFavouritePropertyApi = async ({ limit = "", offset = "" }) => {
  const params = { limit, offset };
  const res = await api.get(apiEndpoints.GET_FAVOURITE_PROPERTY, { params });
  return res.data;
};

// 43. Add Favourite Property
export const addFavouritePropertyApi = async ({
  property_id = "",
  type = "", // 0 for like, 1 for unlike
}) => {
  const formData = createFilteredFormData({ property_id, type });
  const res = await api.post(apiEndpoints.ADD_FAVOURITE, formData);
  return res.data;
};

// 44. Update User Profile
export const updateUserProfileApi = async ({
  userid = "",
  name = "",
  email = "",
  mobile = "",
  address = "",
  firebase_id = "",
  logintype = "",
  profile = "",
  latitude = "",
  longitude = "",
  about_me = "",
  facebook_id = "",
  twiiter_id = "",
  instagram_id = "",
  youtube_id = "",
  city = "",
  state = "",
  country = "",
  country_code = "",
}) => {
  const formData = createFilteredFormData({
    userid,
    name,
    email,
    mobile,
    address,
    firebase_id,
    logintype,
    profile,
    latitude,
    longitude,
    city,
    state,
    country,
    about_me,
    facebook_id,
    instagram_id,
    youtube_id,
    twiiter_id,
    country_code,
  });
  const res = await api.post(apiEndpoints.UPDATE_PROFILE, formData);
  return res.data;
};

// 45. Get Notification List
export const getNotificationListApi = async ({ limit = "", offset = "" }) => {
  const params = { limit, offset };
  const res = await api.get(apiEndpoints.GET_NOTIFICATION_LIST, { params });
  return res.data;
};

// 46. Get User transaction details
export const getUserTransactionDetailsApi = async ({
  limit = "",
  offset = "",
  payment_type = "",
}) => {
  const params = {
    limit,
    offset,
    payment_type,
  };
  const res = await api.get(apiEndpoints.GET_PAYMENT_DETAILS, { params });
  return res.data;
};

// 47. download payment receipt
export const downloadPaymentReceiptApi = async ({
  payment_transaction_id = "",
}) => {
  const params = { payment_transaction_id };
  const res = await api.get(apiEndpoints.GET_PAYMENT_RECEIPT, { params });
  return res.data;
};

// 48. Initiate Bank Transfer
export const initiateBankTransferApi = async ({ package_id = "", file }) => {
  const formData = createFilteredFormData({ package_id, file });
  const res = await api.post(apiEndpoints.INITIATE_BANK_TRANSFER, formData);
  return res.data;
};

// 49. Upload Bank Receipt File
export const uploadBankReceiptFileApi = async ({
  file = "",
  payment_transaction_id = "",
}) => {
  const formData = createFilteredFormData({ file, payment_transaction_id });
  const res = await api.post(apiEndpoints.UPLOAD_BANK_RECEIPT_FILE, formData);
  return res.data;
};

// 50. Post Property
export const postPropertyApi = async ({
  userid = "",
  title = "",
  description = "",
  city = "",
  state = "",
  country = "",
  latitude = "",
  longitude = "",
  address = "",
  price = "",
  category_id = "",
  property_type = "",
  video_link = "",
  parameters = {},
  facilities = {},
  title_image = null,
  three_d_image = null,
  gallery_images = [],
  meta_title = "",
  meta_description = "",
  meta_keywords = "",
  meta_image = null,
  rentduration = "",
  is_premium = "",
  client_address = "",
  slug_id = "",
  documents = [],
  translations = [],
}) => {
  const formData = new FormData();

  // Basic property details
  if (userid) {
    formData.append("userid", userid);
  }
  if (title) {
    formData.append("title", title);
  }
  if (description) {
    formData.append("description", description);
  }
  if (city) {
    formData.append("city", city);
  }
  if (state) {
    formData.append("state", state);
  }
  if (country) {
    formData.append("country", country);
  }
  if (latitude) {
    formData.append("latitude", latitude);
  }
  if (longitude) {
    formData.append("longitude", longitude);
  }
  if (address) {
    formData.append("address", address);
  }
  if (price) {
    formData.append("price", price);
  }
  if (category_id) {
    formData.append("category_id", category_id);
  }
  if (property_type) {
    formData.append("property_type", property_type);
  }
  if (video_link) {
    formData.append("video_link", video_link);
  }
  if (meta_title) {
    formData.append("meta_title", meta_title);
  }
  if (meta_description) {
    formData.append("meta_description", meta_description);
  }
  if (meta_keywords) {
    formData.append("meta_keywords", meta_keywords);
  }
  if (meta_image) {
    formData.append("meta_image", meta_image);
  }
  if (property_type === "1" && rentduration) {
    formData.append("rentduration", rentduration);
  }
  if (is_premium) {
    formData.append("is_premium", is_premium);
  }
  if (client_address) {
    formData.append("client_address", client_address);
  }
  if (slug_id) {
    formData.append("slug_id", slug_id);
  }

  // Handle translations data
  if (translations && translations.length > 0) {
    translations.forEach((translation, index) => {
      // Handle title with its nested properties
      if (translation.title) {
        // Handle translation_id for title
        formData.append(`translations[${index}][title][translation_id]`, "");

        // Handle language_id for title
        if (translation.language_id) {
          formData.append(
            `translations[${index}][title][language_id]`,
            translation.language_id,
          );
        }

        // Handle value for title
        if (translation.title) {
          formData.append(
            `translations[${index}][title][value]`,
            translation.title,
          );
        }
      }

      // Handle description with its nested properties
      if (translation.description) {
        // Handle translation_id for description
        formData.append(
          `translations[${index}][description][translation_id]`,
          "",
        );

        // Handle language_id for description
        if (translation.language_id) {
          formData.append(
            `translations[${index}][description][language_id]`,
            translation.language_id,
          );
        }

        // Handle value for description
        if (translation.description) {
          formData.append(
            `translations[${index}][description][value]`,
            translation.description,
          );
        }
      }
    });
  }

  // Media files
  if (title_image) {
    formData.append("title_image", title_image);
  }
  if (three_d_image) {
    formData.append("three_d_image", three_d_image);
  }

  // Transform facilities data into the expected format
  if (facilities && Object.keys(facilities).length > 0) {
    Object.entries(facilities).forEach(([facilityId, distance], index) => {
      formData.append(`facilities[${index}][facility_id]`, facilityId);
      formData.append(`facilities[${index}][distance]`, distance);
    });
  }

  // Transform parameters data into the expected format
  if (parameters && Object.keys(parameters).length > 0) {
    Object.entries(parameters).forEach(([parameterId, value], index) => {
      formData.append(`parameters[${index}][parameter_id]`, parameterId);
      formData.append(`parameters[${index}][value]`, value);
    });
  }

  // Append gallery images as array elements
  if (Array.isArray(gallery_images) && gallery_images.length > 0) {
    gallery_images.forEach((image, index) => {
      formData.append(`gallery_images[${index}]`, image);
    });
  }

  // Append documents as array elements
  if (Array.isArray(documents) && documents.length > 0) {
    documents.forEach((doc, index) => {
      formData.append(`documents[${index}]`, doc);
    });
  }

  const res = await api.post(apiEndpoints.POST_PROPERTY, formData);
  return res.data;
};

// 51. Update Property
export const updatePostPropertyApi = async ({
  action_type = "",
  id = "",
  title = "",
  description = "",
  city = "",
  state = "",
  country = "",
  latitude = "",
  longitude = "",
  address = "",
  price = "",
  category_id = "",
  property_type = "",
  video_link = "",
  parameters = [],
  facilities = [],
  title_image = "",
  three_d_image = "",
  gallery_images = [],
  slug_id = "",
  meta_title = "",
  meta_description = "",
  meta_keywords = "",
  meta_image = "",
  rentduration = "",
  is_premium = "",
  client_address = "",
  remove_gallery_images = "",
  remove_documents = "",
  documents = [],
  remove_three_d_image,
  translations = [],
}) => {
  let data = new FormData();

  // Append the property data to the FormData object
  if (action_type) {
    data.append("action_type", action_type);
  }
  if (id) {
    data.append("id", id);
  }
  if (title) {
    data.append("title", title);
  }
  if (description) {
    data.append("description", description);
  }
  if (city) {
    data.append("city", city);
  }
  if (state) {
    data.append("state", state);
  }
  if (country) {
    data.append("country", country);
  }
  if (latitude) {
    data.append("latitude", latitude);
  }
  if (longitude) {
    data.append("longitude", longitude);
  }
  if (address) {
    data.append("address", address);
  }
  if (price) {
    data.append("price", price);
  }
  if (category_id) {
    data.append("category_id", category_id);
  }
  if (property_type) {
    data.append("property_type", property_type);
  }
  if (video_link) {
    data.append("video_link", video_link);
  }
  if (title_image) {
    data.append("title_image", title_image);
  }
  if (three_d_image) {
    data.append("three_d_image", three_d_image);
  }
  if (slug_id) {
    data.append("slug_id", slug_id);
  }
  if (meta_title) {
    data.append("meta_title", meta_title);
  }
  if (meta_description) {
    data.append("meta_description", meta_description);
  }
  if (meta_keywords) {
    data.append("meta_keywords", meta_keywords);
  }
  // Only append meta_image if it's a File or empty, skip if it's a string
  if (meta_image instanceof File) {
    data.append("meta_image", meta_image); // Pass file if it's a File
  } else if (!meta_image) {
    data.append("meta_image", ""); // Pass empty string if meta_image is null/undefined
  }
  if (property_type === "1" && rentduration) {
    data.append("rentduration", rentduration);
  }
  if (is_premium) {
    data.append("is_premium", is_premium);
  }
  if (client_address) {
    data.append("client_address", client_address);
  }
  if (remove_three_d_image) {
    data.append("remove_three_d_image", remove_three_d_image);
  }

  // Handle translations data
  if (translations && translations.length > 0) {
    translations.forEach((translation, index) => {
      // Handle title with its nested properties
      if (translation.title) {
        // Handle translation_id for title
        if (translation.title.translation_id !== undefined) {
          data.append(
            `translations[${index}][title][translation_id]`,
            translation.title.translation_id,
          );
        }

        // Handle language_id for title
        if (translation.title.language_id) {
          data.append(
            `translations[${index}][title][language_id]`,
            translation.title.language_id,
          );
        }

        // Handle value for title
        if (translation.title.value) {
          data.append(
            `translations[${index}][title][value]`,
            translation.title.value,
          );
        }
      }

      // Handle description with its nested properties
      if (translation.description) {
        // Handle translation_id for description
        if (translation.description.translation_id !== undefined) {
          data.append(
            `translations[${index}][description][translation_id]`,
            translation.description.translation_id,
          );
        }

        // Handle language_id for description
        if (translation.description.language_id) {
          data.append(
            `translations[${index}][description][language_id]`,
            translation.description.language_id,
          );
        }

        // Handle value for description
        if (translation.description.value) {
          data.append(
            `translations[${index}][description][value]`,
            translation.description.value,
          );
        }
      }
    });
  }

  // Append the parameters array if it is an array
  if (Array.isArray(parameters)) {
    parameters.forEach((parameter, index) => {
      data.append(`parameters[${index}][parameter_id]`, parameter.parameter_id);
      data.append(`parameters[${index}][value]`, parameter.value);
    });
  }
  // Append the facilities array if it is an array
  if (Array.isArray(facilities)) {
    facilities.forEach((facility, index) => {
      data.append(`facilities[${index}][facility_id]`, facility.facility_id);
      data.append(`facilities[${index}][distance]`, facility.distance);
    });
  }

  // Check if gallery_images is defined and an array before using forEach
  if (Array.isArray(documents)) {
    documents.forEach((image, index) => {
      data.append(`documents[${index}]`, image);
    });
  }
  if (Array.isArray(gallery_images)) {
    gallery_images.forEach((image, index) => {
      data.append(`gallery_images[${index}]`, image);
    });
  }
  if (Array.isArray(remove_gallery_images)) {
    remove_gallery_images.forEach((image, index) => {
      data.append(`remove_gallery_images[${index}]`, image);
    });
  }
  if (Array.isArray(remove_documents)) {
    remove_documents.forEach((image, index) => {
      data.append(`remove_documents[${index}]`, image);
    });
  }

  const res = await api.post(apiEndpoints.UPDATE_POST_PROPERTY, data);
  return res.data;
};

// 52. Submit User Interests
export const submitUserInterestsApi = async ({
  category_ids,
  outdoor_facilitiy_ids,
  price_range,
  property_type,
  city,
}) => {
  const formData = createFilteredFormData({
    category_ids,
    outdoor_facilitiy_ids,
    price_range,
    property_type,
    city,
  });
  const res = await api.post(apiEndpoints.USER_INTREST, formData);
  return res.data;
};

// 53. Get User Intrested Data
export const getUserIntrestedDataApi = async () => {
  const res = await api.get(apiEndpoints.USER_INTREST);
  return res.data;
};

// 54. Delete User Intrested Data
export const deleteUserIntrestedDataApi = async () => {
  const res = await api.delete(apiEndpoints.USER_INTREST);
  return res.data;
};

// 55. Delete User Account
export const deleteUserAccountApi = async () => {
  const res = await api.post(apiEndpoints.DELETE_USER);
  return res.data;
};

// 56. Post Project
export const postProjectApi = async ({
  id = "",
  title = "",
  description = "",
  category_id = "",
  type = "",
  meta_title = "",
  meta_description = "",
  meta_keywords = "",
  meta_image = null,
  city = "",
  state = "",
  country = "",
  latitude = "",
  longitude = "",
  location = "",
  video_link = "",
  image = null,
  plans = [],
  documents = [],
  gallery_images = [],
  remove_documents = [],
  remove_gallery_images = [],
  remove_plans = [],
  slug_id = "",
  translations = [],
}) => {
  let data = new FormData();
  // Append the property data to the FormData object
  if (id) {
    data.append("id", id);
  }
  if (title) {
    data.append("title", title);
  }
  if (description) {
    data.append("description", description);
  }
  if (category_id) {
    data.append("category_id", category_id);
  }
  if (type) {
    data.append("type", type);
  }
  if (meta_title) {
    data.append("meta_title", meta_title);
  }
  if (meta_description) {
    data.append("meta_description", meta_description);
  }
  if (meta_keywords) {
    data.append("meta_keywords", meta_keywords);
  }

  // Only append meta_image if it's a File or empty, skip if it's a string
  if (meta_image instanceof File) {
    data.append("meta_image", meta_image); // Pass file if it's a File
  } else if (!meta_image) {
    data.append("meta_image", ""); // Pass empty string if meta_image is null/undefined
  }

  if (city) {
    data.append("city", city);
  }
  if (state) {
    data.append("state", state);
  }
  if (country) {
    data.append("country", country);
  }
  if (latitude) {
    data.append("latitude", latitude);
  }
  if (longitude) {
    data.append("longitude", longitude);
  }
  if (location) {
    data.append("location", location);
  }
  if (video_link) {
    data.append("video_link", video_link);
  }
  if (image) {
    data.append("image", image);
  }
  if (remove_documents) {
    data.append("remove_documents", remove_documents);
  }
  if (remove_gallery_images) {
    data.append("remove_gallery_images", remove_gallery_images);
  }
  if (remove_plans) {
    data.append("remove_plans", remove_plans);
  }
  if (slug_id) {
    data.append("slug_id", slug_id);
  }

  // Handle translations data
  if (translations && translations.length > 0) {
    translations.forEach((translation, index) => {
      // Handle title with its nested properties
      if (translation.title) {
        // Handle translation_id for title
        data.append(`translations[${index}][title][translation_id]`, "");

        // Handle language_id for title
        if (translation.language_id) {
          data.append(
            `translations[${index}][title][language_id]`,
            translation.language_id,
          );
        }

        // Handle value for title
        if (translation.title) {
          data.append(
            `translations[${index}][title][value]`,
            translation.title,
          );
        }
      }

      // Handle description with its nested properties
      if (translation.description) {
        // Handle translation_id for description
        data.append(`translations[${index}][description][translation_id]`, "");

        // Handle language_id for description
        if (translation.language_id) {
          data.append(
            `translations[${index}][description][language_id]`,
            translation.language_id,
          );
        }

        // Handle value for description
        if (translation.description) {
          data.append(
            `translations[${index}][description][value]`,
            translation.description,
          );
        }
      }
    });
  }

  // Append the parameters array if it is an array
  if (Array.isArray(plans)) {
    plans.forEach((plans, index) => {
      data.append(`plans[${index}][id]`, plans.id);
      data.append(`plans[${index}][title]`, plans.title);
      data.append(`plans[${index}][document]`, plans.document);
    });
  }

  // Check if gallery_images is defined and an array before using forEach
  if (Array.isArray(documents)) {
    documents.forEach((image, index) => {
      data.append(`documents[${index}]`, image);
    });
  }
  // Check if gallery_images is defined and an array before using forEach
  if (Array.isArray(gallery_images)) {
    gallery_images.forEach((image, index) => {
      data.append(`gallery_images[${index}]`, image);
    });
  }

  const res = await api.post(apiEndpoints.POST_PROJECT, data);
  return res.data;
};

// 57. Get Interested Users
export const getInterestedUsersApi = async ({
  property_id = "",
  slug_id = "",
  limit = "",
  offset = "",
}) => {
  const params = getFilteredParams({ property_id, slug_id, limit, offset });
  const res = await api.get(apiEndpoints.GET_INTERESTED_USERS, { params });
  return res.data;
};

// 58. Get Agent Properties
export const getAgentPropertiesApi = async ({
  is_admin = "",
  slug_id = "",
  is_projects = "",
  limit = "",
  offset = "",
}) => {
  const params = getFilteredParams({
    is_admin,
    slug_id,
    is_projects,
    limit,
    offset,
  });
  const res = await api.get(apiEndpoints.AGENT_PROPERTIES, { params });
  return res.data;
};

// 59. Get Chat Lists
export const getChatListsApi = async () => {
  const res = await api.get(apiEndpoints.GET_CHATS);
  return res.data;
};

// 60. Get Chat Messages
export const getChatMessagesApi = async ({
  user_id = "",
  property_id = "",
  page = "",
  per_page = "",
}) => {
  const params = getFilteredParams({ user_id, property_id, page, per_page });
  const res = await api.get(apiEndpoints.GET_CHATS_MESSAGES, { params });
  return res.data;
};

// 61. Send Message
export const sendMessageApi = async ({
  sender_id = "",
  receiver_id = "",
  message = "",
  property_id = "",
  file = null,
  audio = null,
}) => {
  const formData = createFilteredFormData({
    sender_id,
    receiver_id,
    message,
    property_id,
    file,
    audio,
  });

  const res = await api.post(apiEndpoints.SEND_MESSAGE, formData);
  return res.data;
};

// 62. Delete Chat
export const deleteChatApi = async ({
  message_id = "",
  sender_id = "",
  receiver_id = "",
  property_id = "",
}) => {
  const formData = createFilteredFormData({
    message_id,
    sender_id,
    receiver_id,
    property_id,
  });
  const res = await api.post(apiEndpoints.DELETE_MESSAGES, formData);
  return res.data;
};

// 63. Block User
export const blockUserApi = async ({
  to_user_id = "",
  to_admin = "",
  reason = "",
}) => {
  const formData = createFilteredFormData({
    to_user_id,
    to_admin,
    reason,
  });
  const res = await api.post(apiEndpoints.BLOCK_USER, formData);
  return res.data;
};

// 64. Unblock User
export const unblockUserApi = async ({
  to_user_id = "",
  to_admin = "",
  reason = "",
}) => {
  const formData = createFilteredFormData({
    to_user_id,
    to_admin,
    reason,
  });
  const res = await api.post(apiEndpoints.UNBLOCK_USER, formData);
  return res.data;
};

// 65. Interested Property
export const interestedPropertyApi = async ({
  property_id = "",
  type = "",
}) => {
  const formData = createFilteredFormData({
    property_id,
    type,
  });
  const res = await api.post(apiEndpoints.INTEREST_PROPERTY, formData);
  return res.data;
};

// 66. Get Report Reasons
export const getReportReasonsApi = async () => {
  const res = await api.get(apiEndpoints.GET_REPORT_REASONS);
  return res.data;
};

// 67. Report Property
export const addReportApi = async ({
  reason_id = "",
  property_id = "",
  other_message = "",
}) => {
  let formData = new FormData();
  formData.append("reason_id", reason_id);
  formData.append("property_id", property_id);
  formData.append("other_message", other_message);
  const res = await api.post(apiEndpoints.ADD_REPORT, formData);
  return res.data;
};

// 68. Mortgage Caculation PAI
export const mortgageCalculationApi = async ({
  loan_amount = "",
  down_payment = "",
  interest_rate = "",
  loan_term_years = "",
  show_all_details = "",
}) => {
  const params = {
    loan_amount,
    down_payment,
    interest_rate,
    loan_term_years,
    show_all_details,
  };
  const res = await api.get(apiEndpoints.MORTGAGE_CALCULATOR, { params });
  return res.data;
};

// 69. GET ALL SIMILAR PROPERTIES
export const getAllSimilarPropertiesApi = async ({
  property_id = "",
  limit = "",
  offset = "",
  search = "",
}) => {
  const params = { property_id, limit, offset, search };
  const res = await api.get(apiEndpoints.GET_ALL_SIMILAR_PROPERTIES, {
    params,
  });
  return res.data;
};

// 70. Compare Properties API
export const comparePropertiesAPI = async ({
  source_property_id = "",
  target_property_id = "",
}) => {
  const params = {
    source_property_id,
    target_property_id,
  };
  const res = await api.get(apiEndpoints.COMPARE_PROPERTIES, { params });
  return res.data;
};

// 71. Get User Personalized Feeds
export const getUserPersonalizedFeedsApi = async ({ limit, offset }) => {
  const params = { limit, offset };
  const res = await api.get(apiEndpoints.GET_USER_RECOMMENDATION, { params });
  return res.data;
};

// 72. Get Property On Map
export const getPropertyOnMapApi = async ({
  property_type = "",
  category_id = "",
  category_slug_id = "",
  city = "",
  state = "",
  country = "",
  min_price = "",
  max_price = "",
  posted_since = "",
  most_viewed = "",
  most_liked = "",
  promoted = "",
  parameter_id = "",
  get_all_premium_properties = "",
  latitude = "",
  longitude = "",
  radius = "",
  search = "",
}) => {
  const data = {
    latitude,
    longitude,
    radius,
    property_type,
    category_id,
    category_slug_id,
    city,
    state,
    country,
    min_price,
    max_price,
    posted_since,
    most_viewed,
    most_liked,
    promoted,
    parameter_id,
    get_all_premium_properties,
    search,
  };
  const params = getFilteredParams(data);
  const res = await api.get(apiEndpoints.GET_PROPERTY_ON_MAP, { params });
  return res.data;
};


// 73. Get User Profile
export const getUserProfileApi = async () => {
  const res = await api.get(apiEndpoints.GET_USER_DATA);
  return res.data;
};