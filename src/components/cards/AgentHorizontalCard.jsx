import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useTranslation } from "../context/TranslationContext";
import {
  FaFacebookF,
  FaInstagram, FaYoutube,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt
} from "react-icons/fa";
import { BadgeSvg } from "@/utils/helperFunction";
import Link from "next/link";
import { FaX } from "react-icons/fa6";

const AgentHorizontalCard = ({ agentDetails, isFeatureAvailable = false }) => {
  const t = useTranslation();

  // Extract data from agentDetails prop
  const {
    id,
    slug_id,
    name,
    profile: imgSrc,
    mobile: phone,
    email,
    address,
    facebook_id,
    twitter_id,
    youtube_id,
    instagram_id,
    is_verify: isVerified,
  } = agentDetails || {};

  // Create social links object from the API data
  const socialLinks = [
    {
      icon: <FaFacebookF className="h-4 w-4" />,
      link: facebook_id && facebook_id !== "null" ? facebook_id : null,
    },
    {
      icon: <FaX className="h-4 w-4" />,
      link: twitter_id && twitter_id !== "null" ? twitter_id : null,
    },
    {
      icon: <FaYoutube className="h-4 w-4" />,
      link: youtube_id && youtube_id !== "null" ? youtube_id : null,
    },
    {
      icon: <FaInstagram className="h-4 w-4" />,
      link: instagram_id && instagram_id !== "null" ? instagram_id : null,
    },
  ];

  const renderSocialLinks = () => {
    if (socialLinks.length === 0) return <div className="h-8 w-8" />;
    return (
      <div className="flex items-center gap-3">
        {socialLinks.map((link) => {
          if (!link.link) return;
          return (
            <Link
              href={link.link}
              key={link.link}
              target="_blank"
              className="primaryBackgroundBg flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:cursor-pointer hover:bg-gray-100 sm:h-10 sm:w-10"
            >
              {link.icon}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6 md:max-h-[800px] lg:max-h-[600px]">
      <div className="flex flex-col items-start gap-4 sm:gap-2 md:flex-row md:gap-6">
        {/* Agent Image Section */}
        <div className={`h-fit w-full md:max-w-[16rem] primaryBackgroundBg rounded-2xl`}>
          <ImageWithPlaceholder
            src={imgSrc}
            alt={`${name} - Real Estate Agent`}
            className="h-[373px] max-h-full w-full object-fill rounded-2xl"
            priority={false}
          />
        </div>

        {/* Agent Details Section */}
        <div className="relative flex w-full flex-1 flex-col justify-between h-[372px]">
          {/* Header Section */}
          <div className="space-y-4">
            {/* Name and Agent ID */}
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="brandColor mb-1 max-w-min text-base font-bold sm:text-xl md:max-w-full md:text-2xl">
                {name}
              </h2>
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                {/* Display Agent ID if available */}
                {/* {id && (
                  <p className="text-sm text-gray-500">
                    {t("agentId")}: {id}
                  </p>
                )} */}
                {/* Verification Badge */}
                {isVerified && (
                  <div className="flex items-center gap-1 rounded bg-[#0186D8] px-2 py-1 text-xs font-medium text-white shadow-md">
                    {BadgeSvg}
                    <span>{t("verified")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              {/* Address */}
              {address && (
                <div className="flex items-center gap-3">
                  <div className="primaryBgLight flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                    <FaMapMarkerAlt className="primaryColor h-5 w-5" />
                  </div>
                  <p className="flex flex-col gap-2 md:text-base">
                    <span className="brandColor font-bold">{t("address")}</span>
                    <span className="leadColor text-sm font-medium sm:text-base">
                      {address}
                    </span>
                  </p>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="flex items-center gap-3">
                  <div className="primaryBgLight flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                    <FaEnvelope className="primaryColor h-5 w-5 flex-shrink-0" />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <span className="brandColor font-bold">{t("email")}</span>
                    <Link
                      href={`mailto:${email}`}
                      className="leadColor w-fit break-all text-sm font-medium hover:underline sm:text-base"
                    >
                      {email}
                    </Link>
                  </div>
                </div>
              )}

              {/* Phone */}
              {phone && phone !== "null" && (
                <div className="flex items-center gap-3">
                  <div className="primaryBgLight flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                    <FaPhoneAlt className="primaryColor h-5 w-5" />
                  </div>
                  <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="brandColor font-bold">{t("call")}</span>
                      <Link
                        href={`tel:${phone}`}
                        className="leadColor text-sm font-medium sm:text-base"
                      >
                        {phone}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Section */}
          {socialLinks.every((link) => link.link) && (
            <div className="border-t pt-4 mt-4">
              {/* Social Media Links */}
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-4">
                  <p className="brandColor text-sm font-bold md:text-base">
                    {t("followMe")}:
                  </p>
                  <div className="flex items-center gap-3">
                    {renderSocialLinks()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentHorizontalCard;
