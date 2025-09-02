import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useTranslation } from "../context/TranslationContext";
import Link from "next/link";
import { useRouter } from "next/router";
import CustomLink from "../context/CustomLink";
const ApartMentTypeCard = ({ data }) => {
  const t = useTranslation();
  return (
    <CustomLink href={`/properties/category/${data?.slug_id}`}>
      <article
        className="primaryBackgroundBg hover:primaryBg group flex h-64 cursor-pointer flex-col justify-between rounded-xl p-6 transition-all duration-500 ease-in-out"
        role="button"
        aria-label={data?.category}
      >
        {/* Icon Container */}
        <figure
          className="cardBg flex h-14 w-14 items-center justify-center rounded-full"
          aria-hidden="true"
        >
          <ImageWithPlaceholder
            src={data?.image}
            alt="Villa Property Icon"
            className="h-8 w-8"
            loading="lazy"
          />
        </figure>

        {/* Title & Subtitle */}
        <header className="group-hover:primaryTextColor mt-6">
          <h2 className="hover:primaryTextColor text-base font-bold">
            <div className="focus:ring-primaryColor focus:outline-none focus:ring-2">
              {data?.category}
            </div>
          </h2>
          <p className="text-sm font-normal">
            {data?.properties_count} {t("properties")}
          </p>
        </header>
      </article>
    </CustomLink>
  );
};

export default ApartMentTypeCard;
