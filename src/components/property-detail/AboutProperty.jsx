// AboutProperty.js
// import { t } from '@/utils/translation';
import React, { useState } from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { useTranslation } from "../context/TranslationContext";

const AboutProperty = ({ description, isProject = false }) => {
  const t = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="cardBg newBorder mb-7 flex flex-col rounded-2xl">
      <div className="brandColor border-b text-base font-bold p-5 md:text-xl">
        {isProject ? t("aboutProject") : t("aboutProperty")}
      </div>
      <div className="p-5">
        <p
          className={`mb-0 w-full overflow-hidden whitespace-pre-wrap break-words text-sm md:text-base ${isExpanded ? "h-max" : "h-24"}`}
        >
          {description}
        </p>
        {description && description.split("\n").length > 3 && (
          <div
            className="primaryColor flex items-center justify-start font-medium hover:cursor-pointer"
            onClick={toggleExpand}
          >
            {isExpanded ? t("readLess") : t("readMore")}
            {isExpanded ? (
              <MdOutlineArrowDropUp size={30} />
            ) : (
              <MdOutlineArrowDropDown size={30} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutProperty;
