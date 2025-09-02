import NewBreadcrumbSkeleton from "../NewBreadcrumbSkeleton";
import OwnerDetailsCardSkeleton from "../OwnerDetailsCardSkeleton";
import {
  PropertyGallerySkeleton,
  PropertyInfoBannerSkeleton,
  AboutPropertySkeleton,
  FeaturesAmenitiesSkeleton,
  PropertyAddressSkeleton,
  VirtualTourSkeleton,
  VideoSkeleton,
  FileAttachmentsSkeleton,
  MortgageLoanCalculatorSkeleton,
  SimilarPropertySliderSkeleton,
} from "./index";

const PropertyDetailSkeleton = () => {
  return (
    <section>
      {/* Header Section with Primary Background */}
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 pb-8">
          {/* Breadcrumb Skeleton */}
          <NewBreadcrumbSkeleton />

          <div className="grid grid-cols-12 items-center justify-center gap-3">
            <div className="col-span-12">
              {/* Property Gallery Skeleton */}
              <PropertyGallerySkeleton />
            </div>
          </div>

          {/* Property Info Banner Skeleton */}
          <PropertyInfoBannerSkeleton />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white">
        <div className="container mx-auto px-3 pt-8">
          <div className="grid grid-cols-12 gap-3">
            {/* Main Content Column */}
            <div className="col-span-12 h-full w-full rounded-lg lg:col-span-9">
              {/* About Property Skeleton */}
              <AboutPropertySkeleton />

              {/* Features & Amenities Skeleton */}
              <FeaturesAmenitiesSkeleton />

              {/* Property Address Skeleton */}
              <PropertyAddressSkeleton />

              {/* Virtual Tour Skeleton */}
              <VirtualTourSkeleton />

              {/* Video Skeleton */}
              <VideoSkeleton />

              {/* File Attachments Skeleton */}
              <FileAttachmentsSkeleton />
            </div>

            {/* Sidebar Column */}
            <div className="col-span-12 h-full w-full lg:col-span-3">
              {/* Owner Details Card Skeleton */}
              <OwnerDetailsCardSkeleton />

              {/* Mortgage Loan Calculator Skeleton */}
              <MortgageLoanCalculatorSkeleton />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 py-8">
          <SimilarPropertySliderSkeleton />
        </div>
      </div>
    </section>
  );
};

export default PropertyDetailSkeleton;
