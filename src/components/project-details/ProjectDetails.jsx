"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProjectDetailsApi } from "@/api/apiRoutes";
import ProjectDetailsSkeleton from "../skeletons/project-skeletons/ProjectDetailsSkeleton";
import NoDataFound from "../no-data-found/NoDataFound";
import { useTranslation } from "../context/TranslationContext";
import toast from "react-hot-toast";
import OwnerDetailsCard from "../owner-details-card/OwnerDetailsCard";
import Video from "../property-detail/Video";
import PropertyAddress from "../property-detail/PropertyAddress";
import FeaturesAmenities from "../property-detail/FeatureAmenities";
import AboutProperty from "../property-detail/AboutProperty";
import { useSelector } from "react-redux";
import FloorAccordion from "../reusable-components/FloorAccordion";
import FileAttachments from "./FileAttachments";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import ShareDialog from "../reusable-components/ShareDialog";
import ProjectInfoBanner from "./ProjectInfoBanner";
import ProjectGallery from "./ProjectGallery";
import HomeNewSectionTwo from "../homepagesections/HomeNewSectionTwo";
import { capitalizeFirstLetter } from "@/utils/helperFunction";
import LightBox from "../property-detail/LightBox";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileBottomSheet from "../mobile-bottom-sheet/MobileBottomSheet";
import Swal from "sweetalert2";

const ProjectDetails = () => {
  const router = useRouter();
  const { slug, locale } = router.query;
  const t = useTranslation();
  const language = useSelector((state) => state.LanguageSettings?.active_language);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [interested, setInterested] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isMessagingSupported, setIsMessagingSupported] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] =
    useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // Lightbox states
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/project-details/${slug}?share=true`;
  const isMobile = useIsMobile();
  const isShare = router?.query?.share === "true";

  const webSettings = useSelector((state) => state.WebSetting?.data);
  const DistanceSymbol = webSettings?.distance_option;
  const PlaceHolderImg = webSettings?.web_placeholder_logo;
  const userCurrentId = useSelector((state) => state.User?.data?.id);
  const isAccessible = webSettings?.features_available?.project_access;

  // Function to open lightbox
  const openLightbox = (index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  useEffect(() => {
    if (slug) {
      fetchProjectDetails();
    }
  }, [slug, language]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const response = await getProjectDetailsApi({
        slug_id: slug,
        get_similar: "1",
      });

      if (response && !response.error) {
        setProjectDetails(response.data);
        if (response.similar_projects && response.similar_projects.length > 0) {
          setSimilarProjects(response.similar_projects);
        }
      } else {
        setError(response?.message || t("failedToFetchProjectDetails"));
        toast.error(t(response?.message) || t("failedToFetchProjectDetails"));
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError(error?.message || t("somethingWentWrong"));
      toast.error(t(error?.message) || t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectDetails && projectDetails?.three_d_image) {
      setImageURL(projectDetails?.three_d_image); // Set Panorama Image
    }
  }, [projectDetails]);

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

  const videoLink = projectDetails && projectDetails.video_link;

  const videoId = videoLink
    ? videoLink.includes("youtu.be")
      ? videoLink.split("/").pop().split("?")[0]
      : (videoLink.split("v=")[1]?.split("&")[0] ?? null)
    : null;

  const backgroundImageUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    : PlaceHolderImg;

  const handleShowMap = (e) => {
    e.preventDefault();
    setShowMap(true);
  };

  const handleCheckPremiumUserAgent = (e) => {
    e.preventDefault();
    router.push(
      `/${locale}/agent-details/${projectDetails?.customer?.slug_id}`,
    );
  };

  const galleryPhotos = projectDetails?.gallary_images;
  // Property Address Details Section
  const details = [
    { label: t("address"), value: projectDetails?.location },
    { label: t("country"), value: projectDetails?.country },
    { label: t("city"), value: projectDetails?.city },
    { label: t("zipCode"), value: projectDetails?.zip_code },
    { label: t("state"), value: projectDetails?.state },
  ];



  const handleVideoReady = (state) => {
    setPlaying(state);
    setShowThumbnail(!state);
  };

  const handleSeek = (e) => {
    if (e && typeof e.playedSeconds === "number") {
      setSeekPosition(parseFloat(e.playedSeconds));
      // Avoid pausing the video when seeking
      if (!manualPause) {
        setPlaying(true);
      }
    }
  };
  const handleSeekEnd = () => {
    setShowThumbnail(false);
  };

  const handlePause = () => {
    setManualPause(true); // Manually pause the video
    setShowThumbnail(true); // Reset showThumbnail to true
  };
  const handleDownload = async (fileName) => {
    try {
      // Construct the file URL based on your backend or API
      const fileUrl = `${fileName}`;
      // Fetch the file data
      const response = await fetch(fileUrl);

      // Get the file data as a Blob
      const blob = await response.blob();

      // Create a URL for the Blob object
      const blobUrl = URL.createObjectURL(blob);

      // Create an anchor element
      const link = document.createElement("a");

      // Set the anchor's href attribute to the Blob URL
      link.href = blobUrl;

      // Specify the file name for the download
      link.setAttribute("download", fileName);

      // Append the anchor element to the body
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the anchor element from the body
      document.body.removeChild(link);

      // Revoke the Blob URL to release memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleOpenGoogleMap = () => {
    router.push(
      `https://www.google.com/maps?q=${projectDetails?.latitude},${projectDetails?.longitude}`,
    );
  };

  const handleProjectDirectLinkHit = () => {
    // This function can be used to track when the project direct link is hit
    if (!isAccessible) {
      Swal.fire({
        title: t("oops"),
        text: t("projectAccessLimitOrPackageNotAvailable"),
        icon: "warning",
        allowOutsideClick: false,
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
  };

  useEffect(() => {
    if (slug) {
      handleProjectDirectLinkHit();
    }
  }, [slug, userCurrentId]);

  // Show skeleton during loading
  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  // Show error state if there's an error or no data
  if (error || !projectDetails) {
    return (
      <div>
        <NewBreadcrumb
          items={[
            {
              label: projectDetails?.title,
              href: `/project-details/${slug}`,
            },
          ]}
        />
        <div className="container mx-auto px-2 py-10">
          <NoDataFound />
        </div>
      </div>
    );
  }
  // Render project details once loaded
  return (
    <section>
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 pb-8">
          {/* Main Content */}
          <NewBreadcrumb
            items={[
              {
                label: t("projectDetails"),
                href: `/project-details/${slug}`,
                disable: true
              },
              {
                label: capitalizeFirstLetter(projectDetails?.title),
                href: `/project-details/${slug}`,
              },
            ]}
            setIsShareModalOpen={setIsShareModalOpen}
            layout="reverse"
          />
          {/* Project Info Banner */}
          {projectDetails && (
            <ProjectInfoBanner projectDetails={projectDetails} />
          )}

          <div className="grid grid-cols-12 items-center justify-center gap-3">
            <div className="col-span-12">
              {/* Property Gallery */}
              {galleryPhotos && (
                <ProjectGallery
                  galleryPhotos={galleryPhotos}
                  titleImage={projectDetails?.image}
                  PlaceholderImage={PlaceHolderImg}
                  isProject={true}
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
            {/* Project Details */}
            <div className="col-span-12 h-full w-full rounded-2xl lg:col-span-9">
              {/* About Property */}
              {projectDetails && (projectDetails?.translated_description || projectDetails?.description) && (
                <AboutProperty description={projectDetails?.translated_description || projectDetails?.description} isProject={true} />
              )}

              {/* Features & Amenities */}
              <FeaturesAmenities
                data={projectDetails}
                DistanceSymbol={DistanceSymbol}
              />

              {/* Property Address */}
              {projectDetails &&
                projectDetails?.latitude &&
                projectDetails?.longitude && (
                  <PropertyAddress
                    latitude={projectDetails?.latitude}
                    longitude={projectDetails?.longitude}
                    handleShowMap={handleShowMap}
                    handleOpenGoogleMap={handleOpenGoogleMap}
                    showMap={showMap}
                    details={details}
                    isProject={true}
                  />
                )}

              {/* 360degree Virtual Tour */}
              {imageURL ? (
                <div className="cardBg newBorder mb-5 flex flex-col rounded-2xl">
                  <div className="blackTextColor border-b p-5 text-base font-bold md:text-xl">
                    {t("virtualTour")}
                  </div>
                  <div className="flex h-[500px] justify-center rounded p-5">
                    <div id="panorama"></div>
                  </div>
                </div>
              ) : null}

              {/* Video */}
              {projectDetails && projectDetails?.video_link && (
                <Video
                  bgImageUrl={backgroundImageUrl}
                  videoLink={projectDetails?.video_link}
                />
              )}

              {/* Floor Plans */}
              {projectDetails && projectDetails?.plans && (
                <FloorAccordion plans={projectDetails?.plans} />
              )}

              {/* Documents/Attachments */}
              {projectDetails &&
                projectDetails?.documents &&
                projectDetails.documents.length > 0 && (
                  <FileAttachments
                    files={projectDetails.documents}
                    projectCategory={projectDetails.category?.translated_name || projectDetails.category?.category}
                  />
                )}
            </div>

            {/* Sidebar */}
            <div className="col-span-12 h-full w-full lg:col-span-3">
              {/* Property Owner */}
              {projectDetails && (
                <OwnerDetailsCard
                  ownerData={projectDetails}
                  showChat={showChat}
                  userCurrentId={userCurrentId}
                  interested={interested}
                  isReported={isReported}
                  isMessagingSupported={true}
                  notificationPermissionGranted={true}
                  placeholderImage={PlaceHolderImg}
                  handleCheckPremiumUserAgent={handleCheckPremiumUserAgent}
                  isProject={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 py-8">
          {/* Similar Projects */}
          {similarProjects && similarProjects.length > 0 && (
            <HomeNewSectionTwo
              data={similarProjects}
              type="similar_projects_section"
              title={t("similarProjects")}
              name={"similarProjects"}
            />
          )}
        </div>
      </div>
      {isShareModalOpen && (
        <ShareDialog
          title={t("shareProjectTitle")}
          subtitle={t("shareProjectSubtitle")}
          open={isShareModalOpen}
          onOpenChange={() => setIsShareModalOpen(false)}
          pageUrl={currentUrl}
        />
      )}

      {/* LightBox Component */}
      <LightBox
        photos={galleryPhotos || []}
        viewerIsOpen={viewerIsOpen}
        currentImage={currentImage}
        onClose={() => setViewerIsOpen(false)}
        title_image={projectDetails?.image}
        setCurrentImage={setCurrentImage}
        isProject={true}
      />
      {isMobile && isShare && <MobileBottomSheet isShare={true} />}
    </section>
  );
};

export default ProjectDetails;
