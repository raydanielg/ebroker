"use client";

import { useTranslation } from '@/components/context/TranslationContext';
import React from "react";

// ==============================
// Centralized Configuration
// ==============================
const CHART_CONFIG = {
    // Colors
    colors: {
        property: "#FF008A", // Pink
        project: "#0754FC",  // Blue
        unused: "#f0f0f0",   // Light gray for unused portion
        used: "#D3D3D3",     // Gray for used portion
    },
    // Sizes
    sizes: {
        strokeWidth: 10,     // Width of the circle stroke
        defaultRadius: 45,   // Default radius of the circle
    }
};

const DualColorCircularProgressBar = ({
    packageId,
    propertyUsed,
    projectUsed,
    propertyLimit,
    projectLimit,
    isPropertyUnlimited,
    isProjectUnlimited,
    isPropertyIncluded,
    isProjectIncluded
}) => {
    const t = useTranslation();
    const radius = CHART_CONFIG.sizes.defaultRadius;

    // ==============================
    // Special Case - Not Included + Unlimited
    // ==============================
    const propertyStatus = isPropertyIncluded ? (isPropertyUnlimited ? "unlimited" : "limited") : "notIncluded";
    const projectStatus = isProjectIncluded ? (isProjectUnlimited ? "unlimited" : "limited") : "notIncluded";
    
    // Special case: one is not included and other is unlimited
    if ((propertyStatus === "notIncluded" && projectStatus === "unlimited") || 
        (propertyStatus === "unlimited" && projectStatus === "notIncluded")) {
        // Determine which one is unlimited
        const isProperty = propertyStatus === "unlimited";
        const color = isProperty ? CHART_CONFIG.colors.property : CHART_CONFIG.colors.project;
        return <UnlimitedCircle radius={radius} color={color} t={t} />;
    }

    // ==============================
    // CASE 4 & 5 - One Not Included OR One Unlimited & One Limited (show only the limited one)
    // ==============================
    if (
        (!isPropertyIncluded || !isProjectIncluded) || 
        (isPropertyUnlimited !== isProjectUnlimited && isPropertyIncluded && isProjectIncluded) // One unlimited, the other limited (both included)
    ) {
        const showProperty = isPropertyIncluded && !isPropertyUnlimited;
        const showProject = isProjectIncluded && !isProjectUnlimited;

        // If neither is suitable to show (both not included or both unlimited)
        if (!showProperty && !showProject) {
            return <EmptyCircle radius={radius} t={t} />;
        }

        return (
            <SingleArc
                radius={radius}
                used={showProperty ? propertyUsed : projectUsed}
                limit={showProperty ? propertyLimit : projectLimit}
                isUnlimited={false} // We only show the limited one in this case
                color={showProperty ? CHART_CONFIG.colors.property : CHART_CONFIG.colors.project}
                caseNumber="4/5"
                t={t}
            />
        );
    }

    // ==============================
    // CASE 2 - Both Unlimited
    // ==============================
    if (isPropertyUnlimited && isProjectUnlimited) {
        return <FullCircleUnlimited radius={radius} caseNumber="2" t={t} />;
    }

    // ==============================
    // CASE 3 - One Unlimited, One Limited (only if both are visible and you want to show both)
    // Note: This case is now optional, depending on your product decision.
    // ==============================
    if (isPropertyUnlimited || isProjectUnlimited) {
        return (
            <HalfHalfSplit
                radius={radius}
                propertyUsed={propertyUsed}
                projectUsed={projectUsed}
                propertyLimit={propertyLimit}
                projectLimit={projectLimit}
                isPropertyUnlimited={isPropertyUnlimited}
                isProjectUnlimited={isProjectUnlimited}
                caseNumber="3"
                t={t}
            />
        );
    }

    // ==============================
    // CASE 1 - Both Limited
    // ==============================
    return (
        <ProportionalSplit
            radius={radius}
            propertyUsed={propertyUsed}
            projectUsed={projectUsed}
            propertyLimit={propertyLimit}
            projectLimit={projectLimit}
            caseNumber="1"
            t={t}
        />
    );
};

// ==============================
// Special Case - Just Unlimited (one feature)
// ==============================
const UnlimitedCircle = ({ radius, color, t }) => (
    <SvgBase radius={radius} centerText={t("unlimited")} caseNumber="unlimited">
        <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={CHART_CONFIG.sizes.strokeWidth}
            transform="rotate(-90 50 50)"
        />
    </SvgBase>
);

// ==============================
// Empty Circle (fallback for edge cases)
// ==============================
const EmptyCircle = ({ radius, t }) => (
    <SvgBase radius={radius} centerText="0/0" caseNumber="empty">
        <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={CHART_CONFIG.colors.used}
            strokeWidth={CHART_CONFIG.sizes.strokeWidth}
            transform="rotate(-90 50 50)"
        />
    </SvgBase>
);

// ==============================
// Case 2 - Both Unlimited
// ==============================
const FullCircleUnlimited = ({ radius, caseNumber, t }) => (
    <SvgBase radius={radius} centerText={t("unlimited")} caseNumber={caseNumber}>
        <ColoredArc radius={radius} color={CHART_CONFIG.colors.property} />
        <ColoredArc radius={radius} color={CHART_CONFIG.colors.project} rotate />
    </SvgBase>
);

// ==============================
// Case 3 - One Unlimited, One Limited (optional visual)
// ==============================
const HalfHalfSplit = ({
    radius,
    propertyUsed,
    projectUsed,
    propertyLimit,
    projectLimit,
    isPropertyUnlimited,
    isProjectUnlimited,
    caseNumber,
    t
}) => {
    const halfCircumference = Math.PI * radius;

    const propertyUnusedPercent = isPropertyUnlimited
        ? 100
        : 100 - (propertyUsed / propertyLimit) * 100;

    const projectUnusedPercent = isProjectUnlimited
        ? 100
        : 100 - (projectUsed / projectLimit) * 100;

    const propertyText = isPropertyUnlimited
        ? t("unlimited")
        : `${propertyUsed}/${propertyLimit}`;
    const projectText = isProjectUnlimited
        ? t("unlimited")
        : `${projectUsed}/${projectLimit}`;

    return (
        <SvgBase radius={radius} centerText={`${propertyText} | ${projectText}`} caseNumber={caseNumber}>
            <HalfArc radius={radius} color={CHART_CONFIG.colors.property} percent={propertyUnusedPercent} offset={0} />
            <HalfArc radius={radius} color={CHART_CONFIG.colors.project} percent={projectUnusedPercent} offset={halfCircumference} />
        </SvgBase>
    );
};

// ==============================
// Case 1 - Both Limited
// ==============================
const ProportionalSplit = ({
    radius,
    propertyUsed,
    projectUsed,
    propertyLimit,
    projectLimit,
    caseNumber,
  }) => {
    const totalLimit = propertyLimit + projectLimit;
    const totalUsed = propertyUsed + projectUsed;
    const propertyUnused = propertyLimit - propertyUsed;
    const projectUnused = projectLimit - projectUsed;
  
    // Check if both property and project are fully unused
    const bothUnused = propertyUsed === 0 && projectUsed === 0;
  
    if (bothUnused) {
      return (
        <SvgBase radius={radius} centerText={`${totalUsed}/${totalLimit}`} caseNumber={caseNumber}>
          {/* Property Unused - Pink - 180° */}
          <ArcSection radius={radius} color={CHART_CONFIG.colors.property} percent={50} offset={0} />
          {/* Project Unused - Blue - 180° */}
          <ArcSection radius={radius} color={CHART_CONFIG.colors.project} percent={50} offset={50} />
        </SvgBase>
      );
    }
  
    const propertyUnusedPercent = (propertyUnused / totalLimit) * 100;
    const projectUnusedPercent = (projectUnused / totalLimit) * 100;
    const totalUsedPercent = (totalUsed / totalLimit) * 100;
  
    return (
      <SvgBase radius={radius} centerText={`${totalUsed}/${totalLimit}`} caseNumber={caseNumber}>
        {/* Property Unused - Pink */}
        <ArcSection radius={radius} color={CHART_CONFIG.colors.property} percent={propertyUnusedPercent} offset={0} />
        {/* Project Unused - Blue */}
        <ArcSection radius={radius} color={CHART_CONFIG.colors.project} percent={projectUnusedPercent} offset={propertyUnusedPercent} />
        {/* Total Used - Gray */}
        <ArcSection radius={radius} color={CHART_CONFIG.colors.used} percent={totalUsedPercent} offset={propertyUnusedPercent + projectUnusedPercent} />
      </SvgBase>
    );
  };
  
// ==============================
// Case 4 & 5 - Show Only Limited One
// ==============================
const SingleArc = ({ radius, used, limit, color, caseNumber, t }) => {
    const unusedPercent = 100 - (used / limit) * 100;
    const centerText = `${used}/${limit}`;

    return (
        <SvgBase radius={radius} centerText={centerText} caseNumber={caseNumber}>
            <ArcSection radius={radius} color={color} percent={unusedPercent} offset={0} />
            <ArcSection radius={radius} color={CHART_CONFIG.colors.unused} percent={100 - unusedPercent} offset={unusedPercent} />
        </SvgBase>
    );
};

// ==============================
// Shared Components
// ==============================
const SvgBase = ({ radius, children, centerText, caseNumber }) => (
    <svg width="100" height="100" viewBox="0 0 100 100">
        {children}
        <text x="50" y="54" textAnchor="middle" fontWeight="bold" fontSize="12px" fill="black">
            {centerText}
        </text>
        {/* Uncomment to debug case numbers */}
        {/* <CaseNumberText caseNumber={caseNumber} /> */}
    </svg>
);

const ColoredArc = ({ radius, color, rotate = false }) => (
    <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={CHART_CONFIG.sizes.strokeWidth}
        strokeDasharray={`${Math.PI * radius} ${Math.PI * radius}`}
        strokeDashoffset={rotate ? -Math.PI * radius : 0}
        transform="rotate(-90 50 50)"
    />
);

const HalfArc = ({ radius, color, percent, offset }) => {
    const halfCircumference = Math.PI * radius;
    const unusedLength = (percent / 100) * halfCircumference;

    return (
        <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={CHART_CONFIG.sizes.strokeWidth}
            strokeDasharray={`${unusedLength} ${halfCircumference}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 50 50)"
        />
    );
};

const ArcSection = ({ radius, color, percent, offset }) => {
    const circumference = 2 * Math.PI * radius;
    return (
        <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={CHART_CONFIG.sizes.strokeWidth}
            strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
            strokeDashoffset={-(offset / 100) * circumference}
            transform="rotate(-90 50 50)"
        />
    );
};

// Uncomment to debug case numbers
// const CaseNumberText = ({ caseNumber }) => (
//     <text x="50" y="90" textAnchor="middle" fontSize="10px" fill="black">
//         Case {caseNumber}
//     </text>
// );

export default DualColorCircularProgressBar; 