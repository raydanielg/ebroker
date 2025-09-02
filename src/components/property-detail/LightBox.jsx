"use client"
import Lightbox from 'react-spring-lightbox';
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { isRTL } from "@/utils/helperFunction";

const LightBox = ({ photos, viewerIsOpen, currentImage, setCurrentImage, onClose, title_image, isProject = false }) => {

    const isRtl = isRTL()

    // if (!photos || photos.length === 0) {
    //     return null;
    // }

    // Process photos based on whether they're from a project or property
    const processedPhotos = photos?.map(photo => {
        if (typeof photo === 'string') {
            return { src: photo, alt: 'Image' };
        } else if (photo.src) {
            // Handle chat images or any photos that already have src property
            return { src: photo.src, alt: photo.alt || 'Image' };
        } else if (isProject) {
            return { src: photo.name, alt: photo.alt || 'Project Image' };
        } else {
            return { src: photo.image_url, alt: photo.alt || 'Property Image' };
        }
    });

    // Add title image if provided
    const lightboxPhotos = title_image
        ? [{ src: title_image, alt: 'Title Image' }, ...processedPhotos]
        : processedPhotos;

    // Fixed navigation logic for RTL
    const gotoPrevious = () => {
        if (isRtl) {
            // In RTL, "previous" means going to the next index
            if (currentImage < lightboxPhotos.length - 1) {
                setCurrentImage(currentImage + 1);
            }
        } else {
            // In LTR, "previous" means going to the previous index
            if (currentImage > 0) {
                setCurrentImage(currentImage - 1);
            }
        }
    };

    const gotoNext = () => {
        if (isRtl) {
            // In RTL, "next" means going to the previous index
            if (currentImage > 0) {
                setCurrentImage(currentImage - 1);
            }
        } else {
            // In LTR, "next" means going to the next index
            if (currentImage < lightboxPhotos?.length - 1) {
                setCurrentImage(currentImage + 1);
            }
        }
    };

    const isPrevDisabled = isRtl ? currentImage >= lightboxPhotos?.length - 1 : currentImage <= 0;
    const isNextDisabled = isRtl ? currentImage <= 0 : currentImage >= lightboxPhotos?.length - 1;

    return (
        <Lightbox
            images={lightboxPhotos}
            currentIndex={currentImage}
            isOpen={viewerIsOpen}
            onClose={onClose}
            onPrev={gotoPrevious}
            onNext={gotoNext}
            renderHeader={() => (
                <button
                    onClick={onClose}
                    className={`absolute top-4 z-50 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all ${isRtl ? 'left-4' : 'right-4'}`}
                >
                    <FaTimes className="h-6 w-6" />
                </button>
            )}
            renderPrevButton={({ canPrev }) =>
                lightboxPhotos?.length > 1 && (
                    <button
                        onClick={gotoPrevious}
                        disabled={isPrevDisabled}
                        className={`absolute top-1/2 -translate-y-1/2 z-10 rounded-full p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all ${isRtl ? "right-4" : "left-4"
                            } ${isPrevDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                    >
                        {isRtl ? <FaChevronRight className="h-5 w-5" /> : <FaChevronLeft className="h-5 w-5" />}
                    </button>
                )
            }
            renderNextButton={({ canNext }) =>
                lightboxPhotos?.length > 1 && (
                    <button
                        onClick={gotoNext}
                        disabled={isNextDisabled}
                        className={`absolute top-1/2 -translate-y-1/2 z-10 rounded-full p-3 text-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all ${isRtl ? "left-4" : "right-4"
                            } ${isNextDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                    >
                        {isRtl ? <FaChevronLeft className="h-5 w-5" /> : <FaChevronRight className="h-5 w-5" />}
                    </button>
                )
            }
            className="z-50"
            style={{ background: "rgba(0, 0, 0, 0.9)" }}
            singleClickToZoom={true}
            pageTransitionConfig={{
                from: { opacity: 0, transform: 'scale(0.5)' },
                enter: { opacity: 1, transform: 'scale(1)' },
                leave: { opacity: 0, transform: 'scale(0.5)' },
            }}
        />
    );
};

export default LightBox; 