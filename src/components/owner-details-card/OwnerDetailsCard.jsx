import { BadgeSvg } from "@/utils/helperFunction";
import { BiLike, BiMessageSquareDetail, BiPhone } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdThumbsUp } from "react-icons/io";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "../context/TranslationContext";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdEmail } from "react-icons/md";

const OwnerDetailsCard = ({
  ownerData,
  showChat = true,
  interested = false,
  isReported = false,
  handleInterested,
  handleNotInterested,
  isMessagingSupported = true,
  notificationPermissionGranted = true,
  handleChat,
  userCurrentId,
  handleReportProperty,
  placeholderImage,
  handleCheckPremiumUserAgent,
  isProject = false,
  isAgent = false,
}) => {
  const t = useTranslation();
  const router = useRouter();
  const { locale } = router?.query;
  let {
    profile,
    customer_name,
    is_verified,
    email,
    mobile,
    client_address,
    added_by,
    facebook_id,
    instagram_id,
    twitter_id,
    youtube_id,
    customer_total_properties: total_properties = 0,
    customer_total_projects: total_projects = 0,
    customer_slug_id,
    is_admin_listing = 0,
  } = ownerData || {};

  if (isProject) {
    customer_name = ownerData?.customer?.name;
    profile = ownerData?.customer?.profile;
    email = ownerData?.customer?.email;
    mobile = ownerData?.customer?.mobile;
    client_address = ownerData?.customer?.address;
    added_by = ownerData?.added_by;
    customer_slug_id = ownerData?.customer?.slug_id;
    total_projects = ownerData?.customer?.projects_count;
    total_properties = ownerData?.customer?.property_count;
  }
  if (isAgent) {
    customer_name = ownerData?.name;
    profile = ownerData?.profile;
    email = ownerData?.email;
    mobile =
      ownerData?.mobile && ownerData?.mobile !== "null"
        ? ownerData?.mobile
        : null;
    client_address = ownerData?.address;
    added_by = ownerData?.added_by;
    is_verified = ownerData?.is_verify;
    facebook_id = ownerData?.facebook_id;
    instagram_id = ownerData?.instagram_id;
    twitter_id = ownerData?.twitter_id;
    youtube_id = ownerData?.youtube_id;
  }

  return (
    <div className="cardBg newBorder mb-7 overflow-hidden rounded-2xl">
      {/* Header with verified badge */}
      <div className="primaryBg relative p-6 h-16">
        {is_verified && (
          <div className="absolute ltr:right-3 top-4 rtl:left-3">
            <div className="flex items-center gap-1 rounded-md bg-white px-2 py-1 [&>svg>path]:fill-[#0186D8]">
              {BadgeSvg}
              <span className="leadColor text-sm font-medium">
                {t("verified")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative -mt-10 p-2 md:-mt-8 lg:-mt-8 lg:p-5">
        {/* Profile section */}
        <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-4 md:mb-6 xl:flex-row xl:flex-nowrap w-full border-b newBorderColor pb-4">
          <div className="h-[90px] w-[90px] flex-shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg md:h-[100px] md:w-[100px] xl:h-[120px] xl:w-[120px]">
            <ImageWithPlaceholder
              src={profile || placeholderImage}
              className="h-full w-full object-cover"
              alt="PropertyOwner"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col flex-grow justify-center md:justify-normal gap-2 sm:gap-6 w-full">
            <div className="self-center md:self-end">
              {/* {is_verified && (
                <div className="">
                  <div className="flex items-center gap-1 rounded-md bg-white px-2 py-1 [&>svg>path]:fill-[#0186D8]">
                    {BadgeSvg}
                    <span className="leadColor text-xs font-medium">
                      {t("verified")}
                    </span>
                  </div>
                </div>
              )} */}
            </div>
            <div className="flex justify-between md:flex-row  w-full">
              <div className="flex flex-col gap-2">
                <h3 className="blackTextColor flex w-full flex-grow cursor-pointer justify-between text-xl font-bold">
                  {customer_name}
                </h3>
                {email && (
                  <Link
                    href={`mailto:${email}`}
                    className="leadColor flex items-center flex-shrink-0 text-sm"
                  >
                    <MdEmail className="mr-1 flex-shrink-0" />
                    <span className="break-all text-sm">{email}</span>
                  </Link>
                )}
              </div>
              {showChat &&
                userCurrentId !== added_by &&
                isMessagingSupported &&
                notificationPermissionGranted && (
                  <button
                    type="button"
                    onClick={handleChat}
                    className="brandBg primaryTextColor flex h-7 w-7 items-center justify-center rounded-lg md:h-8 md:w-8"
                  >
                    <BiMessageSquareDetail className="text-white" />
                  </button>
                )}
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="mb-1 flex flex-col flex-wrap py-2">
              <h3 className="blackTextColor flex w-full flex-grow cursor-pointer justify-between text-xl font-bold">
                {customer_name}
                {showChat &&
                  userCurrentId !== added_by &&
                  isMessagingSupported &&
                  notificationPermissionGranted && (
                    <button
                      type="button"
                      onClick={handleChat}
                      className="brandBg primaryTextColor flex h-7 w-7 items-center justify-center rounded-lg md:h-8 md:w-8"
                    >
                      <BiMessageSquareDetail className="text-white" />
                    </button>
                  )}
              </h3>

              {email && (
                <Link
                  href={`mailto:${email}`}
                  className="leadColor flex items-center text-sm"
                >
                  <MdEmail className="mr-1" />
                  <span className="break-all text-sm">{email}</span>
                </Link>
              )}
            </div>
            <div className="brandBg flex items-center gap-2"></div>
          </div> */}
        </div>

        {/* Address section */}
        {client_address && (
          <div
            className={`mb-2 flex items-center gap-2 border-b pb-3 ${mobile && mobile !== "null" ? "border-b-0 pb-0" : ""
              }`}
          >
            <div className="primaryBgLight flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
              <IoLocationOutline className="primaryColor h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="blackTextColor text-sm font-semibold">
                {t("address")}
              </span>
              <p className="leadColor text-sm">{client_address}</p>
            </div>
          </div>
        )}

        {/* Call section */}
        {mobile && mobile !== "null" && (
          <div
            className={`mb-2 flex items-center gap-2 border-b pb-3 newBorderColor ${client_address && client_address !== "null"
              ? "border-b-0 pb-0"
              : ""
              }`}
          >
            <div className="primaryBgLight flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
              <BiPhone className="primaryColor h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="blackTextColor text-sm font-semibold">
                {t("call")}
              </span>
              <Link href={`tel:${mobile}`} className="leadColor text-sm">
                {mobile}
              </Link>
            </div>
          </div>
        )}

        {/* Properties and Projects count */}
        {(total_properties > 0 ||
          total_projects > 0) && (
            <div className="primaryBackgroundBg justify-self-center mb-6 flex flex-wrap sm:w-full items-center justify-center xl:gap-2 xl:w-full rounded-lg ">
              <div className="text-center px-2 py-2 md:py-4">
                <div className="leadColor text-base text-nowrap">
                  {t("properties")} :{" "}
                  <span className="blackTextColor font-semibold">
                    {total_properties}
                  </span>
                </div>
              </div>
              <div className="w-full h-[0.5px] sm:h-6 sm:w-2 border-b sm:border-l-2 newBorderColor"></div>
              <div className="text-center px-2 py-2 md:py-4">
                <div className="leadColor text-base text-nowrap">
                  {t("projects")} :{" "}
                  <span className="blackTextColor font-semibold">
                    {total_projects}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* Action buttons */}
        {userCurrentId !== added_by && (
          <div className="flex justify-center gap-3">
            {/* Interest button */}
            {!isProject ? (
              interested ? (
                <button
                  className="blackBgColor w-fit flex lg:flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-white xl:px-3 xl:py-2"
                  onClick={handleNotInterested}
                >
                  <IoMdThumbsUp size={20} />
                  {t("interested")}
                </button>
              ) : (
                <button
                  className="blackBgColor w-fit flex lg:flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-white xl:px-3 xl:py-2"
                  onClick={handleInterested}
                >
                  <BiLike size={20} />
                  {t("interest")}
                </button>
              )
            ) : null}

            {/* View Listing button */}
            <button
              className="blackTextColor w-fit flex lg:flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium"
              onClick={(e) =>
                router.push(`/${locale}/agent-details/${customer_slug_id}/${(isProject && is_admin_listing === 1) || added_by === 0 ? `?is_admin=true` : ""}`)
              }
            >
              {t("viewListing")}
              <FiArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OwnerDetailsCard;
