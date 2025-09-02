"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "../context/TranslationContext";
import Image from "next/image";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";

const FloorAccordion = ({ plans }) => {
  const t = useTranslation();
  const [activeKey, setActiveKey] = useState(null);

  const handleAccordionToggle = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <div className="cardBg newBorder mb-7 flex flex-col rounded-2xl">
      <div className="blackTextColor border-b p-5 text-base font-bold md:text-xl">
        {t("floorPlans")}
      </div>

      <div className={`p-5`}>
        <Accordion
          type="single"
          collapsible
          value={activeKey}
          className="w-full transition-all duration-500 hover:cursor-pointer"
        >
          {plans.map((plan, index) => {
            const planId = plan?.id || `${index}`;
            return (
              <AccordionItem
                key={planId}
                value={planId}
                className="mb-2 rounded-lg newBorder primaryBackgroundBg"
              >
                <div
                  className={`flex w-full items-center justify-between p-4 ${activeKey === planId ? "" : ""}`}
                  onClick={() => handleAccordionToggle(planId)}
                >
                  <AccordionTrigger className="flex-1 text-base font-medium hover:no-underline">
                    {plan?.title}
                  </AccordionTrigger>
                  <div className="brandBg flex h-8 w-8 items-center justify-center rounded">
                    {activeKey === planId ? (
                      <FaMinus className="text-xs text-white" />
                    ) : (
                      <FaPlus className="text-xs text-white" />
                    )}
                  </div>
                </div>
                <AccordionContent className="p-4 transition-all duration-300 ease-in-out">
                  <div className="w-full">
                    <ImageWithPlaceholder
                      width={0}
                      height={0}
                      src={plan?.document}
                      alt={plan?.title || "Floor Plan"}
                      className="h-full max-h-[500px] w-full object-cover rounded-2xl transition-opacity duration-300 ease-in-out"
                      loading="lazy"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default FloorAccordion;
