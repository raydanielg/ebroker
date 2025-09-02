"use client";
import { useTranslation } from "../context/TranslationContext";
import { useSelector } from "react-redux";
import RichTextContent from "../reusable-components/RichTextContent";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import NoDataFound from "../no-data-found/NoDataFound";

const AboutUs = () => {
  const t = useTranslation();
  const aboutUs = useSelector((state) => state.WebSetting?.data?.about_us);
  return (
    <div>
      <NewBreadcrumb
        title={t("aboutUs")}
        items={[{ href: "/about-us", label: t("aboutUs") }]}
      />
      <section id="about-us" className="my-12">
        <div className="container px-2">
          {aboutUs ? (
            <div className="primaryBackgroundBg rounded-lg p-4 shadow-md">
              <RichTextContent content={aboutUs} />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <NoDataFound />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
