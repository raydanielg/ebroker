import React from "react";
import premiumBg from "@/assets/premiumBg.jpg";
import { useTranslation } from "../context/TranslationContext";
import { useRouter } from "next/router";

const UnlockPremiumPropertyCard = ({ count = 0 }) => {
  const t = useTranslation();
  const router = useRouter();
  const { locale } = router?.query;

  return (
    <div
      className="relative h-full min-h-[300px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
      style={{
        backgroundImage: `url(${premiumBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/65"></div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-full flex-col items-center justify-between gap-4">
        <div className="flex w-full flex-col gap-2 p-4 text-center md:p-4 md:text-start lg:p-3 xl:p-5">
          <h2 className="text-wrap text-2xl font-bold text-white">
            {t("unlockPremiumProperties")}
          </h2>
          <p className="text-base font-medium leading-relaxed text-white/90">
            {t("thisAgentHas")} {count} {t("exclusivePremiumListingsAvailable")}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-4 md:p-4 lg:p-3 xl:p-5">
          <button
            onClick={() => {
              router.push(`/${locale}/subscription-plan`);
            }}
            className="secondryTextColor rounded-lg bg-white px-4 py-2 text-base font-medium shadow-lg transition-colors duration-300 hover:bg-gray-100 md:text-lg"
          >
            {t("subscribeNow")}
          </button>
          <p className="text-sm text-white">{t("accessDetailedInformation")}</p>
        </div>
      </div>
    </div>
  );
};

export default UnlockPremiumPropertyCard;
