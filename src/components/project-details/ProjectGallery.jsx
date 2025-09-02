import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";
import { FaArrowRight } from "react-icons/fa";
import { isRTL } from "@/utils/helperFunction";

const ProjectGallery = ({
  galleryPhotos,
  titleImage,
  PlaceholderImage,
  isProject = false,
  onImageClick,
}) => {
  const t = useTranslation();
  const isRtl = isRTL();
  const [mobileApi, setMobileApi] = useState(null);
  const [desktopApi, setDesktopApi] = useState(null);

  // Prepare all images for display
  const allImages = [titleImage || PlaceholderImage]
    .concat(
      galleryPhotos?.map((photo) =>
        !isProject ? photo?.image_url : photo?.name,
      ) || [],
    )
    .filter(Boolean);

  const totalImages = allImages.length;
  // Handle thumbnail click to navigate carousel
  const handleThumbnailClick = (index) => {
    if (desktopApi) {
      desktopApi.scrollTo(index);
    }
  };
  // Mobile carousel for all image counts
  const renderMobileCarousel = () => {
    return (
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-2xl">
          <Carousel
            className="w-full"
            setApi={setMobileApi}
            opts={{
              loop: true,
              align: "start",
              direction: isRtl ? "rtl" : "ltr",
              slidesToScroll: 1,
              containScroll: "trimSnaps",
            }}
          >
            <CarouselContent>
              {allImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div
                    className="cursor-pointer"
                    onClick={() => onImageClick && onImageClick(index)}
                  >
                    <ImageWithPlaceholder
                      src={image}
                      className="h-64 w-full object-cover md:h-80"
                      alt={`Project view ${index + 1}`}
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <button
              onClick={(e) => {
                e.preventDefault();
                isRtl ? mobileApi?.scrollNext() : mobileApi?.scrollPrev();
              }}
              className="carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 left-2 h-10 w-10 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
            >
              <MdKeyboardArrowLeft className="h-5 w-5 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                isRtl ? mobileApi?.scrollPrev() : mobileApi?.scrollNext();
              }}
              className="carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 right-2 h-10 w-10 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
            >
              <MdKeyboardArrowRight className="h-5 w-5 text-gray-800" />
            </button>
          </Carousel>
        </div>
      </div>
    );
  };

  // Desktop layouts based on image count
  const renderDesktopLayout = () => {
    // If only 1 image (title image)
    if (totalImages === 1) {
      return (
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <div className="relative overflow-hidden rounded-2xl">
                <div
                  className="cursor-pointer"
                  onClick={() => onImageClick && onImageClick(0)}
                >
                  <ImageWithPlaceholder
                    src={allImages[0]}
                    className="h-[600px] w-full object-cover"
                    alt="Project view"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If 2 images
    if (totalImages === 2) {
      return (
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-2">
            {/* Main carousel on left */}
            <div className="col-span-12 lg:col-span-8">
              <div className="relative overflow-hidden rounded-2xl">
                <Carousel
                  className="w-full"
                  setApi={setDesktopApi}
                  opts={{
                    loop: true,
                    align: "start",
                    direction: isRtl ? "rtl" : "ltr",
                    slidesToScroll: 1,
                    containScroll: "trimSnaps",
                  }}
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {allImages.map((image, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                        <div
                          className="cursor-pointer"
                          onClick={() => onImageClick && onImageClick(index)}
                        >
                          <ImageWithPlaceholder
                            src={image}
                            className="h-[600px] w-full object-cover"
                            alt={`Project view ${index + 1}`}
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollNext() : desktopApi?.scrollPrev();
                    }}
                    className="carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 left-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollPrev() : desktopApi?.scrollNext();
                    }}
                    className="carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 right-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                </Carousel>
              </div>
            </div>
            {/* Single image on right sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <div className="grid grid-cols-1 gap-2 h-full">
                <div
                  className="relative cursor-pointer overflow-hidden rounded-2xl h-full"
                  onClick={() => onImageClick && onImageClick(1)}
                >
                  <ImageWithPlaceholder
                    src={allImages[1]}
                    className="h-[600px] w-full object-cover transition-transform duration-300"
                    alt="Project view 2"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If 3 images
    if (totalImages === 3) {
      return (
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-2">
            {/* Main carousel on left */}
            <div className="col-span-12 lg:col-span-8">
              <div className="relative overflow-hidden rounded-2xl">
                <Carousel
                  className="w-full"
                  setApi={setDesktopApi}
                  opts={{
                    loop: true,
                    align: "start",
                    direction: isRtl ? "rtl" : "ltr",
                    slidesToScroll: 1,
                    containScroll: "trimSnaps",
                  }}
                >
                  <CarouselContent>
                    {allImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div
                          className="cursor-pointer"
                          onClick={() => onImageClick && onImageClick(index)}
                        >
                          <ImageWithPlaceholder
                            src={image}
                            className="h-[600px] w-full object-cover"
                            alt={`Project view ${index + 1}`}
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollNext() : desktopApi?.scrollPrev();
                    }}
                    className="carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 left-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollPrev() : desktopApi?.scrollNext();
                    }}
                    className="carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 right-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                </Carousel>
              </div>
            </div>
            {/* Two images stacked on right sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <div className="grid grid-cols-1 gap-2 h-full">
                {allImages.slice(1, 3).map((image, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => onImageClick && onImageClick(index + 1)}
                  >
                    <ImageWithPlaceholder
                      src={image}
                      className="h-[294px] w-full object-cover transition-transform duration-300"
                      alt={`Project view ${index + 2}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If 4 images
    if (totalImages === 4) {
      return (
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-2">
            {/* Main carousel on left */}
            <div className="col-span-12 lg:col-span-8">
              <div className="relative overflow-hidden rounded-2xl">
                <Carousel
                  className="w-full"
                  setApi={setDesktopApi}
                  opts={{
                    loop: true,
                    align: "start",
                    direction: isRtl ? "rtl" : "ltr",
                    slidesToScroll: 1,
                    containScroll: "trimSnaps",
                  }}
                >
                  <CarouselContent>
                    {allImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div
                          className="cursor-pointer"
                          onClick={() => onImageClick && onImageClick(index)}
                        >
                          <ImageWithPlaceholder
                            src={image}
                            className="h-[600px] w-full object-cover"
                            alt={`Project view ${index + 1}`}
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollNext() : desktopApi?.scrollPrev();
                    }}
                    className="carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 left-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollPrev() : desktopApi?.scrollNext();
                    }}
                    className="carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 right-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                </Carousel>
              </div>
            </div>
            {/* Right sidebar with 1 large + 2 small images */}
            <div className="col-span-12 lg:col-span-4">
              <div className="grid grid-cols-1 gap-2 h-full">
                {/* Large image on top */}
                <div
                  className="relative cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => onImageClick && onImageClick(1)}
                >
                  <ImageWithPlaceholder
                    src={allImages[1]}
                    className="h-[294px] w-full object-cover transition-transform duration-300"
                    alt="Project view 2"
                    loading="lazy"
                  />
                </div>
                {/* Two smaller images in grid */}
                <div className="grid grid-cols-2 gap-2">
                  {allImages.slice(2, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer overflow-hidden rounded-2xl"
                      onClick={() => onImageClick && onImageClick(index + 2)}
                    >
                      <ImageWithPlaceholder
                        src={image}
                        className="h-[294px] w-full object-cover transition-transform duration-300"
                        alt={`Project view ${index + 3}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If exactly 5 images
    if (totalImages === 5) {
      return (
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-2">
            {/* Main carousel on left */}
            <div className="col-span-12 lg:col-span-8">
              <div className="relative overflow-hidden rounded-2xl">
                <Carousel
                  className="w-full"
                  setApi={setDesktopApi}
                  opts={{
                    loop: true,
                    align: "start",
                    direction: isRtl ? "rtl" : "ltr",
                    slidesToScroll: 1,
                    containScroll: "trimSnaps",
                  }}
                >
                  <CarouselContent>
                    {allImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div
                          className="cursor-pointer"
                          onClick={() => onImageClick && onImageClick(index)}
                        >
                          <ImageWithPlaceholder
                            src={image}
                            className="h-[600px] w-full object-cover"
                            alt={`Project view ${index + 1}`}
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollNext() : desktopApi?.scrollPrev();
                    }}
                    className="carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 left-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      isRtl ? desktopApi?.scrollPrev() : desktopApi?.scrollNext();
                    }}
                    className="carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 right-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                  >
                    <MdKeyboardArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                  </button>
                </Carousel>
              </div>
            </div>
            {/* Right sidebar with 2x2 grid of images */}
            <div className="col-span-12 lg:col-span-4">
              <div className="grid grid-cols-2 gap-2 h-full">
                {allImages.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => onImageClick && onImageClick(index + 1)}
                  >
                    <ImageWithPlaceholder
                      src={image}
                      className="h-[294px] w-full object-cover transition-transform duration-300"
                      alt={`Project view ${index + 2}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If more than 5 images (6+ images with "See All" overlay)
    return (
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-2">
          {/* Main carousel on left */}
          <div className="col-span-12 lg:col-span-8">
            <div className="relative overflow-hidden rounded-2xl">
              <Carousel
                className="w-full"
                setApi={setDesktopApi}
                opts={{
                  loop: true,
                  align: "start",
                  direction: isRtl ? "rtl" : "ltr",
                  slidesToScroll: 1,
                  containScroll: "trimSnaps",
                }}
              >
                <CarouselContent>
                  {allImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div
                        className="cursor-pointer"
                        onClick={() => onImageClick && onImageClick(index)}
                      >
                        <ImageWithPlaceholder
                          src={image}
                          className="h-[600px] w-full object-cover"
                          alt={`Project view ${index + 1}`}
                          loading="lazy"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    isRtl ? desktopApi?.scrollNext() : desktopApi?.scrollPrev();
                  }}
                  className="carousel-arrow carousel-arrow-prev absolute top-1/2 -translate-y-1/2 left-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                >
                  <MdKeyboardArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    isRtl ? desktopApi?.scrollPrev() : desktopApi?.scrollNext();
                  }}
                  className="carousel-arrow carousel-arrow-next absolute top-1/2 -translate-y-1/2 right-2 h-10 md:h-12 w-10 md:w-12 bg-white shadow-md rounded-full opacity-80 hover:opacity-100 flex items-center justify-center z-10 focus:outline-none"
                >
                  <MdKeyboardArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                </button>
              </Carousel>
            </div>
          </div>
          {/* Right sidebar with 2x2 grid of 4 images (with "See All" overlay) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="grid grid-cols-2 gap-2 h-full">
              {allImages.slice(1, 5).map((image, index) => {
                const isLastThumbnail = index === 3; // This is the fourth image in the grid (bottom right)
                return (
                  <div
                    key={index}
                    className="relative cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => {
                      if (isLastThumbnail) {
                        onImageClick && onImageClick(allImages.length - 2); // Open lightbox from the last image
                      } else {
                        onImageClick && onImageClick(index + 1);
                      }
                    }}
                  >
                    <ImageWithPlaceholder
                      src={image}
                      className="h-[294px] w-full object-cover transition-transform duration-300"
                      alt={`Project view ${index + 2}`}
                      loading="lazy"
                    />
                    {/* Show "See All" overlay on the last visible thumbnail for 6+ images */}
                    {isLastThumbnail && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 text-white">
                        <span className="brandColor rounded-lg py-2 px-4 bg-white font-medium flex items-center gap-2">
                          {t("seeAll")}
                          <FaArrowRight className={`flex-shrink-0 ${isRtl ? "rotate-180" : ""}`} />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Mobile Carousel - Single carousel for all image counts */}
      {renderMobileCarousel()}

      {/* Desktop Layout - Different layouts based on image count */}
      {renderDesktopLayout()}
    </div>
  );
};

export default ProjectGallery;
