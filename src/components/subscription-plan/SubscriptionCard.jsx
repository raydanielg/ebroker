"use client";
import React from "react";
import { BiSolidCheckCircle, BiSolidXCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "../context/TranslationContext";
import { formatDuration } from "@/utils/helperFunction";
import { FaArrowRight, FaInfoCircle } from "react-icons/fa";
import CustomLink from "../context/CustomLink";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

const SubscriptionCard = ({ data, index, allFeatures, subscribePayment }) => {
  const t = useTranslation();
  const currencySymbol = useSelector(
    (state) => {
      if (!state || !state.WebSetting) {
        return "$"; // Default currency symbol
      }
      return state.WebSetting.data?.currency_symbol || "$";
    }
  );

  return (
    <article
      className={`${data?.is_active ? "primaryBg" : data?.package_status === "review" ? "brandBg" : "secondaryTextBg"} flex h-[650px] w-full flex-col justify-between rounded-xl p-4 text-white sm:gap-7 md:h-[680px]`}
      aria-label={`Subscription plan: ${data?.name}`}
    >
      <header className="mx-5 mt-[30px]">
        <span
          className={`bg-[#ffffff14] primaryTextColor mb-3 self-start rounded-lg px-3 py-1.5 text-sm font-normal capitalize sm:px-4 sm:py-2`}
          aria-label="Plan Name"
        >
          {data?.translated_name || data?.name}
        </span>
        <p
          className="mt-4 break-words text-3xl font-extrabold sm:text-4xl md:text-5xl"
          aria-label="Price"
        >
          {data?.package_type === "paid"
            ? currencySymbol + data?.price
            : t("free")}
        </p>
      </header>

      <section className="flex h-[380px] flex-col justify-start gap-4">
        <div className="flex items-start gap-2 text-sm font-medium sm:items-center sm:gap-3 sm:text-base md:gap-5">
          <span className="">
            <BiSolidCheckCircle size={16} />
          </span>
          <span>
            <strong>{t("validity")}</strong> {formatDuration(data?.duration, t)}
          </span>
        </div>

        {allFeatures.map((feature, featureIndex) => {
          const assignedFeature = data?.features?.find(
            (f) => f.id === feature.id,
          );
          return (
            <div
              className="flex items-start gap-2 text-sm font-medium sm:items-center sm:gap-3 sm:text-base md:gap-5"
              key={feature.id}
            >
              <span className="mt-0.5 flex-shrink-0 sm:mt-0">
                {assignedFeature ? (
                  <BiSolidCheckCircle size={16} className="primaryTextColor" />
                ) : (
                  <BiSolidXCircle size={16} className="text-red-500" />
                )}
              </span>
              <span className="break-words">
                {feature?.translated_name || feature?.name}:{" "}
                {assignedFeature
                  ? assignedFeature.limit_type === "limited"
                    ? assignedFeature.limit
                    : t("unlimited")
                  : t("notIncluded")}
              </span>
            </div>
          );
        })}
      </section>
      {data?.is_active ? (
        <div className="mb-[65px]"></div>
      ) : data?.package_status === "review" ? (
        <div className="flex items-center justify-between bg-white brandColor rounded-lg px-4 py-3 mt-6">
          <div className="flex items-center w-full gap-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <FaInfoCircle className="brandColor" size={16} />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  {t("verficationPendingTooltip")}
                  <TooltipArrow className="fill-gray-700" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm font-medium">
              {t("verificationPending")}
            </span>
          </div>
          <CustomLink href={`/user/transaction-history`} className="flex items-center gap-2 text-sm font-medium brandColor cursor-pointer">
            {t("view")} <FaArrowRight className={`brandColor ${isRtl ? "rotate-180" : ""}`} />
          </CustomLink>
        </div>
      ) : (
        <motion.button
          className="primaryBg mt-6 w-full cursor-pointer items-center self-end rounded py-2.5 text-center font-medium text-white transition-colors hover:bg-teal-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Subscribe ${data?.translated_name || data?.name} plan`}
          onClick={(e) => subscribePayment(e, data)}
        >
          {t("subscribe")}
        </motion.button>
      )}
    </article>
  );
};

export default SubscriptionCard;
