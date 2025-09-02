"use client";
import { useTranslation } from "../context/TranslationContext";
import { useSelector } from "react-redux";
import RichTextContent from "../reusable-components/RichTextContent";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import NoDataFound from "../no-data-found/NoDataFound";

const TermsAndConditions = () => {
  const t = useTranslation();
  const termsAndConditions = useSelector(
    (state) => state.WebSetting?.data?.terms_conditions,
  );
  return (
    <div>
      <NewBreadcrumb title={t("termsAndConditions")} items={[{ href: "/terms-and-conditions", label: t("termsAndConditions") }]} />
      <section id="terms-and-conditions" className="my-12">
        <div className="container px-2">
          {termsAndConditions ?
            (<div className="primaryBackgroundBg rounded-lg p-4 shadow-md">
              <RichTextContent content={termsAndConditions} />
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

export default TermsAndConditions;
