import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useTranslation } from "../context/TranslationContext";
import { useRouter } from "next/router";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import PremiumIcon from "@/assets/premium.svg";
import { useSelector } from "react-redux";
import { PackageTypes } from "@/utils/checkPackages/packageTypes";
import { handlePackageCheck, isRTL } from "@/utils/helperFunction";
import { ReactSVG } from "react-svg";

// ProjectCardWithSwiperNew component definition
// This component displays a project card with an image carousel and project details.
const ProjectCardWithSwiperNew = ({ data }) => {
  const t = useTranslation();
  const router = useRouter();
  const { locale } = router?.query;

  const userData = useSelector((state) => state?.User?.data);

  // State for the carousel API and current slide
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isUserProject = data?.added_by == userData?.id;

  // Extract images for the carousel: primary image and up to 4 gallery images
  const galleryImages = data?.gallary_images
    ? data?.gallary_images.map((image) => image.name)
    : [];
  const images = [data.image, ...galleryImages]?.slice(0, 5);

  // Effect to update carousel state when API or images change
  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    // Set up drag detection
    const handleDragStart = () => {
      setIsDragging(true);
    };

    const handleDragEnd = () => {
      setTimeout(() => {
        setIsDragging(false);
      }, 100); // Small delay to prevent immediate click after drag
    };

    api.on("select", handleSelect);
    api.on("pointerDown", handleDragStart);
    api.on("pointerUp", handleDragEnd);

    return () => {
      api.off("select", handleSelect);
      api.off("pointerDown", handleDragStart);
      api.off("pointerUp", handleDragEnd);
    };
  }, [api, images]);
  // Handler for card click, navigates to project details page
  const handleCardClick = (e) => {
    if (!isDragging && isUserProject) {
      handlePackageCheck(
        e,
        PackageTypes.PROJECT_ACCESS,
        router,
        data?.slug_id,
        data,
        false,
        isUserProject,
        t
      );
    } else if (!isDragging) {
      handlePackageCheck(
        e,
        PackageTypes.PROJECT_ACCESS,
        router,
        data?.slug_id,
        data,
        false,
        isUserProject,
        t
      );
    }
  };

  // Handler for keydown events on the card for accessibility
  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      handleCardClick();
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  // TODO: API call to add/remove favorite
  const handleFavouriteClick = () => {
    // setIsFavorite((prev) => !prev);
  };

  // Prevent event propagation to parent carousel
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Handle carousel navigation button clicks
  const handlePrevClick = (e) => {
    e.stopPropagation();
    if (api) {
      api.scrollPrev();
    }
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    if (api) {
      api.scrollNext();
    }
  };

  const renderCarousel = () => {
    if (images?.length > 1) {
      return (
        <div
          className="w-full"
          onPointerDown={stopPropagation}
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          onTouchMove={stopPropagation}
          onTouchEnd={stopPropagation}
          onClick={stopPropagation}
        >
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              watchDrag: (enabled, event) => {
                // This ensures the parent carousel doesn't react to this carousel's drag events
                event?.stopPropagation();
                return enabled;
              },
              direction: isRTL() ? "rtl" : "ltr",
            }}
          >
            <CarouselContent>
              {images?.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/3] w-full rounded-b-2xl">
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 z-10 h-2/3 w-full rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    <ImageWithPlaceholder
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="h-full w-full rounded-b-2xl object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Carousel Controls */}
            {images && images.length > 1 && (
              <>
                <button
                  onClick={handlePrevClick}
                  className="absolute left-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none border-none bg-white text-black !opacity-0 transition-opacity duration-500 ease-in-out group-hover:!opacity-100 sm:h-10 sm:w-10"
                  aria-label="Previous image"
                  disabled={current === 0}
                >
                  <FaChevronLeft size={16} className="sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={handleNextClick}
                  className="absolute right-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none border-none bg-white text-black !opacity-0 transition-opacity duration-500 ease-in-out group-hover:!opacity-100 sm:h-10 sm:w-10"
                  aria-label="Next image"
                  disabled={current === count - 1}
                >
                  <FaChevronRight size={16} className="sm:h-5 sm:w-5" />
                </button>

                {/* Pagination Dots */}
                <div
                  className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2 !opacity-0 transition-opacity duration-500 ease-in-out group-hover:!opacity-100"
                  onClick={stopPropagation}
                >
                  <CarouselDots className="z-30 after:!ring-white" />
                </div>
              </>
            )}
          </Carousel>
        </div>
      );
    } else {
      return (
        <div className="relative aspect-[4/3] w-full rounded-b-lg">
          {/* Shadow overlay for single image */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 z-10 h-1/3 w-full rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
          <ImageWithPlaceholder
            src={images[0]}
            alt={data?.title}
            className="h-full w-full rounded-b-2xl object-cover"
          />
        </div>
      );
    }
  };

  const title = data?.translated_title || data?.title;
  const location = data?.city + ", " + data?.state + ", " + data?.country;

  return (
    <div
      className="group mx-auto flex w-full flex-col gap-4 overflow-hidden rounded-2xl"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="button"
      aria-label={data?.title || "Project card"}
    >
      {/* Image Carousel */}
      <div className="relative h-full w-full">
        {/* Status Badge */}
        <div className="absolute left-4 top-4 z-[5]">
          <div className="primaryBg rounded p-2 text-xs font-medium text-white">
            {t(data?.type)}
          </div>
        </div>

        {/* Favorite Button */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className="brandBg absolute right-4 top-4 z-10 rounded-lg bg-opacity-50 p-2"
        >
          {isFavorite ? (
            <FaHeart className="h-5 w-5 text-white" />
          ) : (
            <FaRegHeart className="h-5 w-5 text-white" />
          )}
        </button> */}

        <div className="relative">{renderCarousel()}</div>
      </div>

      {/* Content */}
      <div
        className="rounded-t-2xl bg-zinc-900 p-4 text-white"
        onClick={handleCardClick}
      >
        <div className="flex w-full flex-row gap-3 sm:flex-row sm:items-end justify-between">
          <div className="flex w-fit flex-col gap-6 px-2">
            <div className="leadColor flex w-fit gap-2 items-center rounded-lg bg-white p-2 text-xs font-bold">
              {/* <ImageWithPlaceholder
                  src={data?.category?.image}
                  alt={data?.category?.translated_name || data?.category?.category}
                  className="h-4 w-4 rounded-full"
                /> */}
              <ReactSVG
                src={data?.category?.image}
                beforeInjection={(svg) => {
                  svg.setAttribute(
                    "style",
                    `height: 100%; width: 100%;`,
                  );
                  svg.querySelectorAll("path").forEach((path) => {
                    path.setAttribute(
                      "style",
                      `fill: var(--facilities-icon-color);`,
                    );
                  });
                }}
                className="w-5 h-5 flex items-center justify-center object-contain shrink-0"
                alt={data?.category?.translated_name || data?.category?.name || 'category icon'}
              />
              <span className="text-wrap line-clamp-1">{data?.category?.translated_name || data?.category?.category}</span>
            </div>
            <div>
              <h3 className="line-clamp-1 text-base font-semibold sm:text-xl">
                {title?.slice(0, 15)}
              </h3>
              <p className="line-clamp-1 text-sm md:text-base font-normal text-white opacity-65">
                {location?.slice(0, 15)}
              </p>
            </div>
          </div>
          <div className="md:ml-4">
            <div className="premiumBgColor flex items-center justify-center gap-1 rounded-full p-2 text-white">
              <ImageWithPlaceholder
                src={PremiumIcon}
                alt="Premium Icon"
                className="h-5 w-5 rounded-full"
              />
              <span className="brandColor block px-1 text-sm font-semibold md:hidden xl:block">
                {t("premium")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardWithSwiperNew;
