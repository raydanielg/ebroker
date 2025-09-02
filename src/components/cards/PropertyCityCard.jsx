import { FiArrowUpRight } from "react-icons/fi";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import CustomLink from "../context/CustomLink";
import { useTranslation } from "../context/TranslationContext";
import { isRTL } from "@/utils/helperFunction";

const PropertyCityCard = ({ property }) => {
  const t = useTranslation();
  const isRtl = isRTL(); // Assuming isRTL is imported from utils/helperFunction
  return (
    <CustomLink
      href={`/properties/city/${property?.City}`}
      title={property?.City}
      className="w-full max-h-[380px] sm:max-h-full"
    >
      <article
        className="cardBg group h-full max-w-sm cursor-pointer items-center overflow-hidden rounded-2xl transition-all duration-700"
        aria-label={`Property listings for ${property?.City}`}
      >
        <figure className="relative h-full w-full ">
          {/* Optimized Image */}
          <ImageWithPlaceholder
            src={property?.image}
            alt={property?.City}
            className="h-full max-h-[480px] w-full rounded-t-md object-fill"
          />

          {/* Gradient Overlay */}
          <div
            className="z-3 absolute bottom-0 left-0 h-[10%] w-full bg-gradient-to-t from-black/50 to-transparent transition-all duration-700 group-hover:h-[60%]"
            aria-hidden="true"
          ></div>

          {/* Card Content */}
          <section className="cardBg absolute bottom-3 left-0 right-0 mx-auto flex w-[96%] justify-between rounded-lg p-4">
            <header>
              <h2 className="text-base font-bold">{property?.City}</h2>
              <p className="leadColor text-sm font-medium">
                {property?.Count} {t("propertiesAvailable")}
              </p>
            </header>
            <button
              className="bg-white border brandBorder group-hover:brandBg group-hover:primaryTextColor rounded-md p-3 transition-all duration-500 ease-in-out"
              aria-label={`View properties in ${property?.City}`}
            >
              <FiArrowUpRight className={`flex-shrink-0 ${isRtl ? "-rotate-90" : ""}`} size={24} />
            </button>
          </section>
        </figure>
      </article>
    </CustomLink>
  );
};

export default PropertyCityCard;
