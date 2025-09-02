import { store } from "@/redux/store";
import { getTranslationByLocale } from "./translation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { PackageTypes } from "./checkPackages/packageTypes";
import { checkPackageAvailable } from "./checkPackages/checkPackage";
import { featurePropertyApi } from "@/api/apiRoutes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import moment from "moment";
import { setLocationAction } from "@/redux/slices/locationSlice";
// Helper function to get translations in non-component files
const t = (label) => {
  try {
    const LanguageSettings = store?.getState()?.LanguageSettings;
    if (!LanguageSettings) {
      return label; // Fallback if store not ready
    }
    const translations = LanguageSettings?.currentLang?.file_name;
    const currentLocale = LanguageSettings?.default_language;

    if (translations) {
      return translations[label] || label;
    } else {
      const fallbackTranslations = getTranslationByLocale(currentLocale);
      return fallbackTranslations[label] || label;
    }
  } catch (error) {
    console.error("Error in translation function:", error);
    return label;
  }
};

export const truncate = (input, maxLength) => {
  // Check if input is undefined or null
  if (!input) {
    return ""; // or handle the case as per your requirement
  }
  // Convert input to string to handle both numbers and text
  let text = String(input);
  // If the text length is less than or equal to maxLength, return the original text
  if (text.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return text.slice(0, maxLength) + "...";
  }
};

export const formatPriceAbbreviated = (price) => {
  try {
    const WebSetting = store?.getState()?.WebSetting;
    const systemSettingsData = WebSetting?.data;
    const CurrencySymbol = systemSettingsData?.currency_symbol || "";
    const FullPriceShow = systemSettingsData?.number_with_suffix === "1";

    if (FullPriceShow) {
      if (price >= 1000000000) {
        // Billions
        return CurrencySymbol + (price / 1000000000).toFixed(1) + "B";
      } else if (price >= 1000000) {
        // Millions
        return CurrencySymbol + (price / 1000000).toFixed(1) + "M";
      } else if (price >= 1000) {
        // Thousands
        return CurrencySymbol + (price / 1000).toFixed(1) + "K";
      } else {
        // Less than 1K
        return CurrencySymbol + price ? CurrencySymbol + price?.toString() : "";
      }
    } else {
      return CurrencySymbol + price ? CurrencySymbol + price?.toString() : "";
    }
  } catch (error) {
    console.error("Error in formatPriceAbbreviated:", error);
    return price ? price.toString() : "";
  }
};

export const formatPriceAbbreviatedIndian = (price) => {
  const systemSettingsData = store.getState()?.WebSetting?.data;
  const FullPriceShow = systemSettingsData?.number_with_suffix === "1";
  if (FullPriceShow) {
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(1) + "Ab";
    } else if (price >= 10000000) {
      return (price / 10000000).toFixed(1) + "Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(1) + "L";
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1) + "K";
    } else {
      return price ? price?.toString() : "";
    }
  }
};

export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const secondsAgo = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export const BadgeSvg = (
  <svg
    width="26"
    height="26"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 2.9165H5C4.46957 2.9165 3.96086 3.12923 3.58579 3.50788C3.21071 3.88654 3 4.4001 3 4.9356V13.8592C3.00019 14.2151 3.09353 14.5646 3.27057 14.8723C3.44762 15.18 3.70208 15.435 4.00817 15.6115L9.50409 18.7832C9.65504 18.8705 9.82601 18.9165 10 18.9165C10.174 18.9165 10.345 18.8705 10.4959 18.7832L15.9918 15.6115C16.298 15.4351 16.5526 15.1802 16.7296 14.8724C16.9067 14.5647 17 14.2151 17 13.8592V4.9356C17 4.4001 16.7893 3.88654 16.4142 3.50788C16.0391 3.12923 15.5304 2.9165 15 2.9165ZM13.9223 9.31352L9.63897 13.6447L6.71662 10.6889C6.53155 10.4991 6.42828 10.2431 6.42933 9.97675C6.43038 9.7104 6.53565 9.45525 6.72222 9.2669C6.90878 9.07856 7.16151 8.97228 7.42535 8.97122C7.68919 8.97016 7.94275 9.07441 8.13079 9.26126L9.63897 10.7825L12.515 7.88585C12.703 7.69901 12.9566 7.59476 13.2204 7.59582C13.4843 7.59687 13.737 7.70315 13.9236 7.8915C14.1101 8.07984 14.2154 8.33499 14.2164 8.60135C14.2175 8.8677 14.1142 9.12369 13.9292 9.31352H13.9223Z"
      fill="#fff"
    />
  </svg>
);

export const showSwal = ({
  icon,
  title,
  text,
  onConfirm,
  isPremiumCheck,
  router,
  showCancelButton = false,
  t = () => { }
}) =>
  Swal.fire({
    icon,
    title,
    text,
    showCancelButton,
    customClass: { confirmButton: "Swal-confirm-buttons" },
    confirmButtonText: t("ok"),
  }).then((result) => {
    if (result.isConfirmed) {
      if (isPremiumCheck)
        router.push(`/${router?.query?.locale}/subscription-plan`);
      else if (onConfirm) onConfirm();
    }
  });

// utils/stickyNote.js
export const createStickyNote = () => {
  const systemSettingsData = store.getState()?.WebSetting?.data;
  const appUrl = systemSettingsData?.appstore_id;

  // Create the sticky note container
  const stickyNote = document.createElement("div");
  stickyNote.style.position = "fixed";
  stickyNote.style.bottom = "0";
  stickyNote.style.width = "100%";
  stickyNote.style.backgroundColor = "#ffffff";
  stickyNote.style.color = "#000000";
  stickyNote.style.padding = "10px";
  stickyNote.style.textAlign = "center";
  stickyNote.style.fontSize = "14px";
  stickyNote.style.zIndex = "99999";

  // Create the close button
  const closeButton = document.createElement("span");
  closeButton.style.cursor = "pointer";
  closeButton.style.float = "right";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = function () {
    document.body.removeChild(stickyNote);
  };

  // Add content to the sticky note
  stickyNote.innerHTML = t("chatAndNotificationNotSupported");
  stickyNote.appendChild(closeButton);

  // Conditionally add the "Download Now" link if appUrl exists
  if (appUrl) {
    const link = document.createElement("a");
    link.style.textDecoration = "underline";
    link.style.color = "#3498db";
    link.style.marginLeft = "10px"; // Add spacing between text and link
    link.innerText = t("downloadNow");
    link.href = appUrl;
    link.target = "_blank"; // Open link in a new tab
    stickyNote.appendChild(link);
  }

  // Append the sticky note to the document body
  document.body.appendChild(stickyNote);
};

/**
 * Creates a FormData object containing only non-falsy values
 * @param {Object} data - Object containing the data to be added to FormData
 * @returns {FormData} FormData object with only non-falsy values
 */
export const createFilteredFormData = (data) => {
  const formData = new FormData();

  // Iterate through all properties and only append non-falsy values
  Object.entries(data).forEach(([key, value]) => {
    // Check if value is not null, undefined, empty string, 0, false, or NaN
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  return formData;
};

// Utility function to filter out falsy values from params
export const getFilteredParams = (params) => {
  const filteredParams = {};
  Object.entries(params).forEach(([key, value]) => {
    // Check if value is not null, undefined, empty string, 0, false, or NaN
    if (value !== undefined && value !== null && value !== "") {
      filteredParams[key] = value;
    }
  });
  return filteredParams;
};

// Error handling function
export const handleFirebaseAuthError = (errorCode) => {
  const ERROR_CODES = {
    "auth/user-not-found": t("userNotFound"),
    "auth/wrong-password": t("invalidPassword"),
    "auth/email-already-in-use": t("emailInUse"),
    "auth/invalid-email": t("invalidEmail"),
    "auth/user-disabled": t("userAccountDisabled"),
    "auth/too-many-requests": t("tooManyRequests"),
    "auth/operation-not-allowed": t("operationNotAllowed"),
    "auth/internal-error": t("internalError"),
    "auth/invalid-login-credentials": t("incorrectDetails"),
    "auth/invalid-credential": t("incorrectDetails"),
    "auth/admin-restricted-operation": t("adminOnlyOperation"),
    "auth/already-initialized": t("alreadyInitialized"),
    "auth/app-not-authorized": t("appNotAuthorized"),
    "auth/app-not-installed": t("appNotInstalled"),
    "auth/argument-error": t("argumentError"),
    "auth/captcha-check-failed": t("captchaCheckFailed"),
    "auth/code-expired": t("codeExpired"),
    "auth/cordova-not-ready": t("cordovaNotReady"),
    "auth/cors-unsupported": t("corsUnsupported"),
    "auth/credential-already-in-use": t("credentialAlreadyInUse"),
    "auth/custom-token-mismatch": t("customTokenMismatch"),
    "auth/requires-recent-login": t("requiresRecentLogin"),
    "auth/dependent-sdk-initialized-before-auth": t(
      "dependentSdkInitializedBeforeAuth",
    ),
    "auth/dynamic-link-not-activated": t("dynamicLinkNotActivated"),
    "auth/email-change-needs-verification": t("emailChangeNeedsVerification"),
    "auth/emulator-config-failed": t("emulatorConfigFailed"),
    "auth/expired-action-code": t("expiredActionCode"),
    "auth/cancelled-popup-request": t("cancelledPopupRequest"),
    "auth/invalid-api-key": t("invalidApiKey"),
    "auth/invalid-app-credential": t("invalidAppCredential"),
    "auth/invalid-app-id": t("invalidAppId"),
    "auth/invalid-user-token": t("invalidUserToken"),
    "auth/invalid-auth-event": t("invalidAuthEvent"),
    "auth/invalid-cert-hash": t("invalidCertHash"),
    "auth/invalid-verification-code": t("invalidVerificationCode"),
    "auth/invalid-continue-uri": t("invalidContinueUri"),
    "auth/invalid-cordova-configuration": t("invalidCordovaConfiguration"),
    "auth/invalid-custom-token": t("invalidCustomToken"),
    "auth/invalid-dynamic-link-domain": t("invalidDynamicLinkDomain"),
    "auth/invalid-emulator-scheme": t("invalidEmulatorScheme"),
    "auth/invalid-message-payload": t("invalidMessagePayload"),
    "auth/invalid-multi-factor-session": t("invalidMultiFactorSession"),
    "auth/invalid-oauth-client-id": t("invalidOauthClientId"),
    "auth/invalid-oauth-provider": t("invalidOauthProvider"),
    "auth/invalid-action-code": t("invalidActionCode"),
    "auth/unauthorized-domain": t("unauthorizedDomain"),
    "auth/invalid-persistence-type": t("invalidPersistenceType"),
    "auth/invalid-phone-number": t("invalidPhoneNumber"),
    "auth/invalid-provider-id": t("invalidProviderId"),
    "auth/invalid-recaptcha-action": t("invalidRecaptchaAction"),
    "auth/invalid-recaptcha-token": t("invalidRecaptchaToken"),
    "auth/invalid-recaptcha-version": t("invalidRecaptchaVersion"),
    "auth/invalid-recipient-email": t("invalidRecipientEmail"),
    "auth/invalid-req-type": t("invalidReqType"),
    "auth/invalid-sender": t("invalidSender"),
    "auth/invalid-verification-id": t("invalidVerificationId"),
    "auth/invalid-tenant-id": t("invalidTenantId"),
    "auth/multi-factor-info-not-found": t("multiFactorInfoNotFound"),
    "auth/multi-factor-auth-required": t("multiFactorAuthRequired"),
    "auth/missing-android-pkg-name": t("missingAndroidPkgName"),
    "auth/missing-app-credential": t("missingAppCredential"),
    "auth/auth-domain-config-required": t("authDomainConfigRequired"),
    "auth/missing-client-type": t("missingClientType"),
    "auth/missing-verification-code": t("missingVerificationCode"),
    "auth/missing-continue-uri": t("missingContinueUri"),
    "auth/missing-iframe-start": t("missingIframeStart"),
    "auth/missing-ios-bundle-id": t("missingIosBundleId"),
    "auth/missing-multi-factor-info": t("missingMultiFactorInfo"),
    "auth/missing-multi-factor-session": t("missingMultiFactorSession"),
    "auth/missing-or-invalid-nonce": t("missingOrInvalidNonce"),
    "auth/missing-phone-number": t("missingPhoneNumber"),
    "auth/missing-recaptcha-token": t("missingRecaptchaToken"),
    "auth/missing-recaptcha-version": t("missingRecaptchaVersion"),
    "auth/missing-verification-id": t("missingVerificationId"),
    "auth/app-deleted": t("appDeleted"),
    "auth/account-exists-with-different-credential": t(
      "accountExistsWithDifferentCredential",
    ),
    "auth/network-request-failed": t("networkRequestFailed"),
    "auth/no-auth-event": t("noAuthEvent"),
    "auth/no-such-provider": t("noSuchProvider"),
    "auth/null-user": t("nullUser"),
    "auth/operation-not-supported-in-this-environment": t(
      "operationNotSupportedInThisEnvironment",
    ),
    "auth/popup-blocked": t("popupBlocked"),
    "auth/popup-closed-by-user": t("popupClosedByUser"),
    "auth/provider-already-linked": t("providerAlreadyLinked"),
    "auth/quota-exceeded": t("quotaExceeded"),
    "auth/recaptcha-not-enabled": t("recaptchaNotEnabled"),
    "auth/redirect-cancelled-by-user": t("redirectCancelledByUser"),
    "auth/redirect-operation-pending": t("redirectOperationPending"),
    "auth/rejected-credential": t("rejectedCredential"),
    "auth/second-factor-already-in-use": t("secondFactorAlreadyInUse"),
    "auth/maximum-second-factor-count-exceeded": t(
      "maximumSecondFactorCountExceeded",
    ),
    "auth/tenant-id-mismatch": t("tenantIdMismatch"),
    "auth/timeout": t("timeout"),
    "auth/user-token-expired": t("userTokenExpired"),
    "auth/unauthorized-continue-uri": t("unauthorizedContinueUri"),
    "auth/unsupported-first-factor": t("unsupportedFirstFactor"),
    "auth/unsupported-persistence-type": t("unsupportedPersistenceType"),
    "auth/unsupported-tenant-operation": t("unsupportedTenantOperation"),
    "auth/unverified-email": t("unverifiedEmail"),
    "auth/user-cancelled": t("userCancelled"),
    "auth/user-mismatch": t("userMismatch"),
    "auth/user-signed-out": t("userSignedOut"),
    "auth/weak-password": t("weakPassword"),
    "auth/web-storage-unsupported": t("webStorageUnsupported"),
  };

  // Check if the error code exists in the ERROR_CODES object
  if (ERROR_CODES.hasOwnProperty(errorCode)) {
    // If the error code exists, log the corresponding error message
    toast.error(ERROR_CODES[errorCode]);
  } else {
    // If the error code is not found, log a generic error message
    toast.error(`${t("errorOccurred")}:${errorCode}`);
  }
  // Optionally, you can add additional logic here to handle the error
  // For example, display an error message to the user, redirect to an error page, etc.
};

export const formatDuration = (hours,t) => {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days} ${t("days")}`;
  } else {
    return `${hours} ${t("hours")}`;
  }
};

//  LOAD STRIPE API KEY
export const loadStripeApiKey = () => {
  const STRIPEData = store.getState()?.WebSetting;
  const StripeKey = STRIPEData?.data?.stripe_publishable_key;
  if (StripeKey) {
    ``;
    return StripeKey;
  }
  return false;
};
//  LOAD Paystack API KEY
export const loadPayStackApiKey = () => {
  const PaystackData = store.getState()?.WebSetting;
  const PayStackKey = PaystackData?.data?.paystack_public_key;
  if (PayStackKey) {
    ``;
    return PayStackKey;
  }
  return false;
};

export const canRedirectToDetails = (data, router, isUserProperty, locale) =>
  router.push(
    isUserProperty
      ? `/${locale}/my-property/${data?.slug_id}`
      : `/${locale}/property-details/${data?.slug_id}`,
  );

export const getLimitErrorMessageKey = (type) =>
  ({
    [PackageTypes.PROPERTY_LIST]: "propertyListLimitOrPackageNotAvailable",
    [PackageTypes.PROJECT_LIST]: "projectListLimitOrPackageNotAvailable",
    [PackageTypes.PROPERTY_FEATURE]:
      "propertyFeatureLimitOrPackageNotAvailable",
    [PackageTypes.PROJECT_FEATURE]: "projectFeatureLimitOrPackageNotAvailable",
    [PackageTypes.MORTGAGE_CALCULATOR_DETAIL]:
      "mortgageCalculatorLimitOrPackageNotAvailable",
    [PackageTypes.PREMIUM_PROPERTIES]:
      "premiumPropertiesLimitOrPackageNotAvailable",
    [PackageTypes.PROJECT_ACCESS]: "projectAccessLimitOrPackageNotAvailable",
  })[type] || "limitOrPackageNotAvailable";

export const handlePackageCheck = async (
  e,
  type,
  router,
  id,
  propertyData = null,
  isUserProperty = false,
  isUserProject = false,
  t = () => { }
) => {
  const WebSetting = store?.getState()?.WebSetting;
  const User = store?.getState()?.User;
  const LanguageSettings = store?.getState()?.LanguageSettings;

  const userData = User?.data;
  const systemSettingsData = WebSetting?.data;
  const locale = LanguageSettings?.default_language || "en-new";

  if (!userData?.id) {
    return showSwal({
      title: t("plzLogFirst"),
      icon: "warning",
      showCancelButton: false,
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      confirmButtonText: t("ok"),
      t
    }).then((result) => {
    });
  }
  // User profile completeness check for property & project listing
  if ([PackageTypes.PROPERTY_LIST, PackageTypes.PROJECT_LIST].includes(type)) {

    const isProfileComplete = [
      "name",
      "email",
      "mobile",
      "profile",
      "address",
    ].every((key) => userData?.[key]);

    if (!isProfileComplete) {
      return showSwal({
        icon: "error",
        title: t("oops"),
        text: t("youHaveNotCompleteProfile"),
        onConfirm: () => router.push(`/${locale}/user/profile`),
        t
      });
    }

    // Verification check
    const needToVerify = systemSettingsData?.verification_required_for_user;
    const verificationStatus = systemSettingsData?.verification_status;

    if (needToVerify && verificationStatus !== "success") {
      const statusMessages = {
        pending: {
          icon: "warning",
          title: t("verifyPendingTitle"),
          text: t("verifyPendingDesc"),
          t
        },
        failed: {
          icon: "error",
          title: t("verifyFailTitle"),
          text: t("verifyFailDesc"),
          onConfirm: () => router.push(`/${locale}/user/dashboard`),
          t
        },
        default: {
          icon: "error",
          title: t("oops"),
          text: t("youHaveNotVerifiedUser"),
          onConfirm: () => router.push(`/${locale}/user/verification-form/`),
          t
        },
      };

      return showSwal(
        statusMessages[verificationStatus] || statusMessages.default,
      );
    }
  }

  // Special case handling for premium properties
  if (type === PackageTypes.PREMIUM_PROPERTIES) {
    if (propertyData?.is_premium) {
      const isAvailable = await checkPackageAvailable(type);
      if (!isAvailable) {
        return showSwal({
          icon: "error",
          title: t("oops"),
          text: t(getLimitErrorMessageKey(type)),
          isPremiumCheck: true,
          router,
          t
        });
      }
    }
    // After checks, just redirect to details
    return canRedirectToDetails(propertyData, router, isUserProperty, locale);
  }

  // 🔥 Special Handling for Project Access (if it requires similar flow)
  if (type === PackageTypes.PROJECT_ACCESS) {
    const isAvailable = await checkPackageAvailable(type);
    if (!isAvailable) {
      return showSwal({
        icon: "error",
        title: t("oops"),
        text: t(getLimitErrorMessageKey(type)),
        isPremiumCheck: true,
        router,
        t
      });
    }
    return isUserProject
      ? router.push(`/${locale}/my-project/${id}`)
      : router.push(`/${locale}/project-details/${id}`);
  }

  // 🧵 For all other types (Generic Flow)
  const isAvailable = await checkPackageAvailable(type);
  if (!isAvailable) {
    return showSwal({
      icon: "error",
      title: t("oops"),
      text: t(getLimitErrorMessageKey(type)),
      isPremiumCheck: true,
      router,
      t
    });
  }

  const successActions = {
    [PackageTypes.PROPERTY_LIST]: () =>
      router.push(`/${locale}/user/add-property`),
    [PackageTypes.PROJECT_LIST]: () =>
      router.push(`/${locale}/user/add-project`),
    [PackageTypes.PROPERTY_FEATURE]: async () => {
      try {
        const res = await featurePropertyApi({
          feature_for: "property",
          property_id: id,
        });
        toast.success(t(res.message));
        router.push(`/${locale}/user/advertisement?tab=property`);
      } catch (err) {
        // console.error("[DEBUG] Error featuring property:", err);
        toast.error(t(err.message));
      }
    },
    [PackageTypes.PROJECT_FEATURE]: async () => {
      try {
        const res = await featurePropertyApi({
          feature_for: "project",
          project_id: id,
        });
        toast.success(t(res.message));
        router.push(`/${locale}/user/advertisement?tab=project`);
      } catch (err) {
        toast.error(t(err.message));
      }
    },
    [PackageTypes.MORTGAGE_CALCULATOR_DETAIL]: () => {
    },
  };

  return successActions[type]
    ? successActions[type]()
    : console.warn("[DEBUG] No action defined for type:", type);
};

export const isDemoMode = () => {
  const WebSetting = store?.getState()?.WebSetting;
  return WebSetting?.data?.demo_mode;
};

/**
 * Extracts address components from a Google Place object
 * @param {Object} place - Google Place object
 * @returns {Object} Object containing city, state, country and formatted address
 */
export const extractAddressComponents = (place) => {
  let addressData = {
    city: "",
    state: "",
    country: "",
    formattedAddress: place.formatted_address || "",
  };

  if (place.address_components) {
    for (const component of place.address_components) {
      const types = component.types;

      if (types.includes("locality")) {
        addressData.city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        addressData.state = component.long_name;
      } else if (types.includes("country")) {
        addressData.country = component.long_name;
      }
    }
  }

  return addressData;
};

/**
 * Creates a standardized rejection tooltip for displaying rejection reasons
 * @param {string} reason - The rejection reason text
 * @param {string} title - The title of the tooltip (defaults to "Rejection Reason")
 * @param {string} side - Tooltip position (left, right, top, bottom)
 * @param {function} t - Translation function
 * @returns {JSX.Element} - Returns a tooltip component
 */
export const RejectionTooltip = ({ reason, title, side = "left", t }) => {
  if (!reason) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#ffdddd] text-[#DB3D26] transition-colors hover:bg-[#f9c6c6]">
            <span className="text-xs font-bold">?</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align="center"
          className="z-50 max-w-lg rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-800">
              {title || t("rejectionReason")}:
            </h3>
            <p className="break-words text-sm text-gray-600">{reason}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export const capitalizeFirstLetter = (string) => {
  // Handle null, undefined, or empty string cases
  if (!string || typeof string !== "string") {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const renderStatusBadge = (status, t) => {
  switch (status?.toLowerCase()) {
    case "success":
    case "approved":
      return (
        <div className="rounded-md bg-[#83B8071F] px-4 py-2 font-medium capitalize text-[#83B807]">
          {t("success")}
        </div>
      );
    case "review":
      return (
        <div className="rounded-md bg-[#0186D81F] px-4 py-2 font-medium capitalize text-[#0186D8]">
          {t("review")}
        </div>
      );
    case "pending":
      return (
        <div className="rounded-md bg-[#DB93051F] px-4 py-2 font-medium capitalize text-[#DB9305]">
          {t("pending")}
        </div>
      );
    case "rejected":
      return (
        <div className="rounded-md bg-[#DB3D261F] px-4 py-2 font-medium capitalize text-[#DB3D26]">
          {t("rejected")}
        </div>
      );
    case "failed":
      return (
        <div className="rounded-md bg-[#DB3D261F] px-4 py-2 font-medium capitalize text-[#DB3D26]">
          {t("failed")}
        </div>
      );
    default:
      return (
        <div className="rounded-md bg-[#808080] px-4 py-2 font-medium capitalize text-[#808080]">
          {status || "-"}
        </div>
      );
  }
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
  // .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
};

export const getFormattedDate = (date, t) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  return `${t(month?.toLowerCase())} ${day}, ${dateObj.getFullYear()}`;
};

export const getBgColorConfig = (type) => {
  const bgColorConfig = {
    premium_properties_section: "primaryBgLight",
    featured_projects_section: "primaryBgLight",
    featured_properties_section: "primaryBgLight",
    properties_by_cities_section: "bg-white",
    similar_projects_section: "bg-transparent",
  };
  return bgColorConfig[type] || "bg-white";
};

export const formatTimeDifference = (timestamp) => {
  const now = moment();
  const messageTime = moment(timestamp);
  const diffInSeconds = now.diff(messageTime, "seconds");

  if (diffInSeconds < 1) {
    return "1s ago";
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return messageTime.format("h:mm A");
  }
};

/**
 * Fetch location data from coordinates using browser's geolocation API
 * @param {Function} onSuccess - Callback function on success
 * @param {Function} onError - Callback function on error
 */
export const getCurrentLocationData = (onSuccess, onError) => {
  // Check if location data already exists in the store
  const currentLocation = store.getState()?.location;

  // If valid location data exists (has latitude and longitude), use it instead of fetching new data
  if (
    currentLocation?.latitude &&
    currentLocation?.longitude &&
    currentLocation?.formatted_address &&
    currentLocation?.formatted_address.trim() !== ""
  ) {
    const existingLocationData = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      formatted_address: currentLocation.formatted_address,
      city: currentLocation.city || "",
      state: currentLocation.state || "",
      country: currentLocation.country || "",
      radius: currentLocation.radius || 1,
    };

    if (onSuccess) onSuccess(existingLocationData);
    return;
  }

  if (!navigator.geolocation) {
    const errorMsg = t("geolocationNotSupported");
    toast.error(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
        const errorMsg = t("geolocationNotSupported");
        toast.error(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const result = results[0];
          const { city, state, country, formattedAddress } = extractAddressComponents(result);

          const locationData = {
            latitude,
            longitude,
            formatted_address: formattedAddress,
            city,
            state,
            country,
            radius: 1,
          };

          store.dispatch(
            setLocationAction({
              city,
              country,
              state,
              formatted_address: formattedAddress,
              latitude,
              longitude,
              radius: 1,
            }),
          );

          if (onSuccess) onSuccess(locationData);
        } else {
          const errorMsg = t("locationNotFound");
          store.dispatch(
            setLocationAction({
              city: "",
              country: "",
              state: "",
              formatted_address: "",
              latitude: 0,
              longitude: 0,
              radius: 1,
            }),
          );
          toast.error(errorMsg);
          if (onError) onError(errorMsg);
        }
      });
    },
    (error) => {
      toast.dismiss();
      let errorMsg = t("locationError");

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = t("locationPermissionDenied");
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = t("locationUnavailable");
          break;
        case error.TIMEOUT:
          errorMsg = t("locationTimeout");
          break;
      }

      //   toast.error(errorMsg);
      console.error("Geolocation error:", error);
      if (onError) onError(errorMsg);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
};

export const showLoginSwal = (
  title = "oops",
  text = "plzLoginFirst",
  onConfirm = () => { },
  t = () => { }
) => {
  Swal.fire({
    title: t(title),
    text: t(text),
    icon: "warning",
    allowOutsideClick: true,
    showCancelButton: false,
    customClass: {
      confirmButton: "Swal-confirm-buttons",
      cancelButton: "Swal-cancel-buttons",
    },
    confirmButtonText: t("ok"),
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

export const getPostedSince = (time) => {
  switch (time) {
    case "anytime":
      return "";
    case "lastWeek":
      return "0";
    case "yesterday":
      return "1";
    case "lastMonth":
      return "2";
    case "last3Months":
      return "3";
    case "last6Months":
      return "4";
    default:
      return "";
  }
};

export const isRTL = () => {
  const language = store.getState().LanguageSettings?.current_language;
  return language?.rtl === 1;
};

export const extractSchemaMarkup = (markup) => {
  try {
    return JSON.parse(markup);
  } catch (error) {
    console.error("Error parsing schema markup:", error);
    return null;
  }
};

export const getDefaultSchemaMarkup = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${process.env.NEXT_PUBLIC_WEB_URL}/#organization`,
    name: process.env.NEXT_PUBLIC_APPLICATION_NAME,
    url: process.env.NEXT_PUBLIC_WEB_URL,
    logo: {
      "@type": "ImageObject",
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/favicon.ico`,
      width: "512",
      height: "512",
    },
    description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    sameAs: [
      // Add your social media URLs here if available
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_WEB_URL}/search/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    areaServed: {
      "@type": "Country",
      name: "Global",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_WEB_URL}/#webpage`,
    },
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_APPLICATION_NAME,
    },
    datePublished: new Date().toISOString(),
  };
};

export const getDisplayValueForOption = (elem) => {
  // If value is an array, join its elements with a comma
  if (Array.isArray(elem?.value)) {
    return truncate(elem.value.join(", "), 30);
  }

  // If value is a string containing a comma, split and translate each part
  if (typeof elem?.value === "string" && elem.value.includes(",")) {
    return truncate(elem.value
      .split(",")
      .map(
        (value) =>
          elem?.translated_option_value?.find(
            (option) => option.value === value
          )?.translated || value
      )
      .join(", "), 30);
  }

  // If translated_option_value exists, find the translation for the value
  if (elem?.translated_option_value) {
    const found = elem.translated_option_value.find(
      (option) => option.value === elem.value
    );
    return found ? truncate(found.translated, 30) : truncate(elem.value, 30);
  }

  // Otherwise, just return the value
  return truncate(elem?.value, 30);
};

/**
 * Validates social media URLs for different platforms
 * @param {string} url - The URL to validate
 * @param {string} platform - The social media platform (facebook, instagram, youtube, twitter)
 * @returns {Object} Object containing isValid boolean and error message if invalid
 */
export const validateSocialMediaUrl = (url, platform) => {
  return {
    isValid: isValidUrl(url, platform),
    error: isValidUrl(url, platform) ? null : t("invalidSocialMediaUrl")
  };
};

/**
 * Validates all social media URLs in a form data object
 * @param {Object} formData - Object containing social media URLs
 * @returns {Object} Object containing validation results for each platform
 */
export const validateAllSocialMediaUrls = (formData) => {
  const platformMappings = [
    { key: 'facebook_id', platform: 'facebook' },
    { key: 'instagram_id', platform: 'instagram' },
    { key: 'youtube_id', platform: 'youtube' },
    { key: 'twiiter_id', platform: 'twitter' } // Note: handling the typo in field name
  ];

  const hasErrors = platformMappings.some(({ key, platform }) => {
    if (formData[key]) {
      return !isValidUrl(formData[key], platform);
    }
    return false;
  });

  return {
    isValid: !hasErrors
  };
};


// Utility function to validate URLs for specific platforms
// Returns true if the URL is valid for the specified platform, false otherwise
export const isValidUrl = (url, platform) => {
  if (!url) return true; // Allow empty (optional)
  try {
    const parsed = new URL(url);
    switch (platform) {
      case "facebook":
        return /^(www\.)?facebook\.com/.test(parsed.hostname);
      case "instagram":
        return /^(www\.)?instagram\.com/.test(parsed.hostname);
      case "youtube":
        return /^(www\.)?youtube\.com|youtu\.be/.test(parsed.hostname);
      case "twitter":
        return /^(www\.)?twitter\.com|x\.com/.test(parsed.hostname);
      default:
        return false;
    }
  } catch {
    return false;
  }
};