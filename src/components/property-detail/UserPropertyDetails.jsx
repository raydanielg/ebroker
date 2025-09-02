import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ChangeStatus from "../reusable-components/ChangeStatus";
import PropertyGallery from "./PropertyGallery";
import AboutProperty from "./AboutProperty";
import MortgageLoanCalculator from "./MortgageLoanCalculator";
import Video from "./Video";
import PropertyAddress from "./PropertyAddress";
import FeaturesAmenities from "./FeatureAmenities";
import { useSelector } from "react-redux";
import { useTranslation } from "../context/TranslationContext";
import FileAttachments from "../project-details/FileAttachments";
import { getAddedPropertiesApi } from "@/api/apiRoutes";
import ChangePropertyType from "./ChangePropertyType";
import FeatureCard from "../reusable-components/FeatureCard";
import NewBreadCrumb from "../breadcrumb/NewBreadCrumb";
import SimilarPropertySlider from "./SimilarPropertySlider";
import LightBox from "./LightBox";

const UserPropertyDetails = () => {
  const t = useTranslation();
  const router = useRouter();
  const { slug, locale } = router.query;

  const [propertyDetails, setPropertyDetails] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [imageURL, setImageURL] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState("Active");
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  // Lightbox states
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const webSettings = useSelector((state) => state.WebSetting?.data);
  const userData = useSelector((state) => state.User?.data);
  const DistanceSymbol = webSettings?.distance_option;
  const PlaceHolderImg = webSettings?.web_placeholder_logo;
  const galleryPhotos = propertyDetails?.gallery;
  const language = useSelector((state) => state.LanguageSettings?.active_language);
  const [isMessagingSupported, setIsMessagingSupported] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] =
    useState(false);

  const [isReportModal, setIsReportModal] = useState(false);
  const [interested, setInterested] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatData, setChatData] = useState({
    property_id: "",
    title: "",
    title_image: "",
    user_id: "",
    name: "",
    profile: "",
  });
  const isPremiumUser = userData && userData?.is_premium;
  const isPremiumProperty = propertyDetails && propertyDetails?.is_premium;

  // Function to open lightbox
  const openLightbox = (index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  useEffect(() => {
    if (slug && slug !== "") {
      getPropertyDetailsBySlug();
    }
  }, [slug, language]);

  const getPropertyDetailsBySlug = async () => {
    try {
      const response = await getAddedPropertiesApi({ slug_id: slug });
      setPropertyDetails(response?.data?.[0]);
      if (response?.data?.[0]?.status) {
        setPropertyStatus(response?.data?.[0]?.status);
      }
      setImageURL(response?.data?.[0]?.three_d_image);
      setSimilarProperties(response?.similiar_properties);
    } catch (error) {
      console.error("error", error);
    }
  };

  // Property Address Details Section
  const details = [
    { label: t("address"), value: propertyDetails?.address },
    { label: t("country"), value: propertyDetails?.country },
    { label: t("city"), value: propertyDetails?.city },
    { label: t("zipCode"), value: propertyDetails?.zip_code },
    { label: t("state"), value: propertyDetails?.state },
  ];

  useEffect(() => {
    if (propertyDetails && propertyDetails?.three_d_image) {
      setImageURL(propertyDetails?.three_d_image); // Set Panorama Image
    }
  }, [propertyDetails]);

  useEffect(() => {
    if (imageURL) {
      const initializePanorama = () => {
        const panoramaElement = document.getElementById("panorama");
        if (panoramaElement) {
          pannellum.viewer("panorama", {
            type: "equirectangular",
            panorama: imageURL,
            autoLoad: true,
          });
        } else {
          console.error("Panorama element not found");
        }
      };

      setTimeout(initializePanorama, 3000); // Slight delay to ensure the element is rendered
    }
  }, [imageURL]);

  const handleShowMap = () => {
    setShowMap(true);
  };

  const videoLink = propertyDetails && propertyDetails.video_link;

  const videoId = videoLink
    ? videoLink.includes("youtu.be")
      ? videoLink.split("/").pop().split("?")[0]
      : (videoLink.split("v=")[1]?.split("&")[0] ?? null)
    : null;

  const backgroundImageUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    : PlaceHolderImg;

  const handleStatusChange = (newStatus) => {
    setPropertyStatus(newStatus);
  };

  const handleOpenGoogleMap = () => {
    if (isPremiumProperty) {
      if (isPremiumUser) {
        router.push(
          `https://www.google.com/maps?q=${propertyDetails?.latitude},${propertyDetails?.longitude}`,
        );
      } else {
        Swal.fire({
          title: t("opps"),
          text: t("itsPrivatePrperty"),
          icon: "warning",
          allowOutsideClick: true,
          showCancelButton: false,
          customClass: {
            confirmButton: "Swal-confirm-buttons",
            cancelButton: "Swal-cancel-buttons",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/${locale}/subscription-plan`);
          }
        });
      }
    } else {
      router.push(
        `https://www.google.com/maps?q=${propertyDetails?.latitude},${propertyDetails?.longitude}`,
      );
    }
  };

  return (
    <section>
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 pb-8">
          {/* Main Content */}
          <NewBreadCrumb
            title={t("myProperty")}
            items={[
              {
                label: propertyDetails?.slug_id,
                href: `/my-property/${propertyDetails?.slug_id}`,
              },
            ]}
          />
          <div className="grid grid-cols-12 items-center justify-center gap-3">
            <div className="col-span-12">
              {/* Property Gallery */}
              {galleryPhotos && (
                <PropertyGallery
                  galleryPhotos={galleryPhotos}
                  titleImage={propertyDetails?.title_image}
                  PlaceholderImage={PlaceHolderImg}
                  onImageClick={openLightbox}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-3 pt-8">
          <div className="grid grid-cols-12 gap-3">
            {/* Property Gallery */}
            <div className="col-span-12 h-full w-full rounded-lg lg:col-span-9">
              {/* About Property */}
              {propertyDetails && propertyDetails?.description && (
                <AboutProperty description={propertyDetails?.translated_description || propertyDetails?.description} />
              )}

              {/* Features & Amenities */}
              <FeaturesAmenities
                data={propertyDetails}
                DistanceSymbol={DistanceSymbol}
              />

              {/* Property Address */}
              {propertyDetails &&
                propertyDetails?.latitude &&
                propertyDetails?.longitude && (
                  <PropertyAddress
                    latitude={propertyDetails?.latitude}
                    longitude={propertyDetails?.longitude}
                    handleShowMap={handleShowMap}
                    isPremiumProperty={isPremiumProperty}
                    isPremiumUser={isPremiumUser}
                    details={details}
                    showMap={showMap}
                    handleOpenGoogleMap={handleOpenGoogleMap}
                  />
                )}

              {/* 360degree Virtual Tour */}
              {imageURL ? (
                <div className="cardBg newBorder mb-5 flex flex-col rounded-lg md:rounded-2xl">
                  <div className="blackTextColor border-b p-5 text-base font-bold md:text-xl">
                    {t("virtualTour")}
                  </div>
                  <div className="flex h-[500px] justify-center rounded p-5">
                    <div id="panorama"></div>
                  </div>
                </div>
              ) : null}

              {/* Video */}
              {propertyDetails && propertyDetails?.video_link && (
                <Video
                  bgImageUrl={backgroundImageUrl}
                  videoLink={propertyDetails?.video_link}
                />
              )}

              {propertyDetails &&
                propertyDetails?.documents &&
                propertyDetails.documents.length > 0 && (
                  <FileAttachments
                    files={propertyDetails.documents}
                    projectCategory={propertyDetails.category?.category}
                    isProperty={true}
                  />
                )}
            </div>

            {/* Sidebar */}
            <div className="col-span-12 h-full w-full lg:col-span-3">
              {/* Change Property Status */}
              {propertyDetails?.request_status === "approved" && (
                <ChangeStatus
                  type="property"
                  id={propertyDetails?.id}
                  initialStatus={
                    propertyDetails?.status === 0 ? "Deactive" : "Active"
                  }
                  onStatusChange={handleStatusChange}
                  fetchDetails={getPropertyDetailsBySlug}
                />
              )}

              {/* Feature Property Card */}
              {propertyDetails &&
                propertyDetails?.request_status === "approved" &&
                propertyDetails?.is_feature_available && (
                  <FeatureCard
                    propertyId={propertyDetails?.id}
                    handleRefresh={getPropertyDetailsBySlug}
                  />
                )}

              {/* Mortgage Loan Calculator */}
              {propertyDetails?.property_type === "sell" && (
                <div className="mb-5">
                  <MortgageLoanCalculator propertyDetails={propertyDetails} />
                </div>
              )}

              {/* Change Property Type */}
              {propertyDetails &&
                propertyDetails?.request_status === "approved" &&
                propertyDetails?.status === 1 &&
                propertyDetails?.property_type !== "sold" && (
                  <ChangePropertyType
                    propertyId={propertyDetails?.id}
                    propertyType={propertyDetails?.property_type}
                    onStatusChange={getPropertyDetailsBySlug}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 py-8">
          {/* Similar Properties */}
          <SimilarPropertySlider
            data={similarProperties}
            isLoading={false}
            isUserProperty={true}
            currentPropertyId={propertyDetails?.id}
          />
        </div>
      </div>

      {/* LightBox Component */}
      <LightBox
        photos={galleryPhotos}
        viewerIsOpen={viewerIsOpen}
        currentImage={currentImage}
        onClose={() => setViewerIsOpen(false)}
        title_image={propertyDetails?.title_image}
        setCurrentImage={setCurrentImage}
      />
    </section>
  );
};

export default UserPropertyDetails;
