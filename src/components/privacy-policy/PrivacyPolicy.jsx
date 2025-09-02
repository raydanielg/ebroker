"use client";
import { useTranslation } from "../context/TranslationContext";
import { useSelector } from "react-redux";
import RichTextContent from "../reusable-components/RichTextContent";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import NoDataFound from "../no-data-found/NoDataFound";

const PrivacyPolicy = () => {
  const t = useTranslation();
  const privacyPolicy = useSelector(
    (state) => state.WebSetting?.data?.privacy_policy,
  );
  return (
    <div>
      <NewBreadcrumb title={t("privacyPolicy")} items={[{ href: "/privacy-policy", label: t("privacyPolicy") }]} />
      <section id="privacy-policy" className="my-12">
        <div className="container px-2">
          {privacyPolicy ?
            (<div className="primaryBackgroundBg rounded-lg p-4 shadow-md">
              <RichTextContent content={privacyPolicy} />
            </div>) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <NoDataFound />
              </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
