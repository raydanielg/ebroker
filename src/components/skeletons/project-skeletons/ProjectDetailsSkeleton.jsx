import NewBreadcrumbSkeleton from "../NewBreadcrumbSkeleton";
import ProjectInfoBannerSkeleton from "./ProjectInfoBannerSkeleton";
import ProjectGallerySkeleton from "./ProjectGallerySkeleton";
import AboutPropertySkeleton from "../property-skeletons/AboutPropertySkeleton";
import FeaturesAmenitiesSkeleton from "../property-skeletons/FeaturesAmenitiesSkeleton";
import PropertyAddressSkeleton from "../property-skeletons/PropertyAddressSkeleton";
import VirtualTourSkeleton from "../property-skeletons/VirtualTourSkeleton";
import VideoSkeleton from "../property-skeletons/VideoSkeleton";
import FloorAccordionSkeleton from "./FloorAccordionSkeleton";
import FileAttachmentsSkeleton from "../property-skeletons/FileAttachmentsSkeleton";
import OwnerDetailsCardSkeleton from "../OwnerDetailsCardSkeleton";
import SimilarProjectsSkeleton from "./SimilarProjectsSkeleton";

const ProjectDetailsSkeleton = () => {
  return (
    <section>
      {/* Primary Background Section */}
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 pb-8">
          {/* Breadcrumb */}
          <NewBreadcrumbSkeleton />

          {/* Project Info Banner */}
          <ProjectInfoBannerSkeleton />

          {/* Project Gallery */}
          <div className="grid grid-cols-12 items-center justify-center gap-3">
            <div className="col-span-12">
              <ProjectGallerySkeleton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white">
        <div className="container mx-auto px-3 pt-8">
          <div className="grid grid-cols-12 gap-3">
            {/* Main Content Column */}
            <div className="col-span-12 h-full w-full rounded-lg lg:col-span-9">
              {/* About Property */}
              <AboutPropertySkeleton />

              {/* Features & Amenities */}
              <FeaturesAmenitiesSkeleton />

              {/* Property Address */}
              <PropertyAddressSkeleton />

              {/* Virtual Tour */}
              <VirtualTourSkeleton />

              {/* Video */}
              <VideoSkeleton />

              {/* Floor Plans */}
              <FloorAccordionSkeleton />

              {/* File Attachments */}
              <FileAttachmentsSkeleton />
            </div>

            {/* Sidebar */}
            <div className="col-span-12 h-full w-full lg:col-span-3">
              {/* Owner Details Card */}
              <OwnerDetailsCardSkeleton />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Projects Section */}
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-3 py-8">
          <SimilarProjectsSkeleton />
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailsSkeleton;
