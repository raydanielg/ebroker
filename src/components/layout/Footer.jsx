"use client";
import { useSelector } from "react-redux";
import {
  FaFacebookF, FaPhoneAlt, FaYoutube
} from "react-icons/fa";
import Image from "next/image";
import { useTranslation } from "../context/TranslationContext";
import Link from "next/link";
import { PiMapPinFill } from "react-icons/pi";
import { BiSolidEnvelope } from "react-icons/bi";
import CustomLink from "../context/CustomLink";
import playStore from "@/assets/playStore.svg";
import AppleStore from "@/assets/Apple.svg";
import { AiFillInstagram } from "react-icons/ai";
import { FaX } from "react-icons/fa6";

// Helper: Render only if value exists
function RenderIf({ condition, children }) {
  return condition ? children : null;
}

const Footer = () => {
  const t = useTranslation();
  // Get webSettings from redux
  const webSettings = useSelector((state) => state.WebSetting?.data);
  const currentYear = new Date().getFullYear();

  const propertyLinks = [
    { href: "/properties", label: t("allProperties") },
    { href: "/projects/featured-projects", label: t("featuredProjects") },
    { href: "/properties/featured-properties", label: t("featuredProperties") },
    { href: "/properties-on-map", label: t("propertiesOnMap") },
    {
      href: "/properties/most-viewed-properties",
      label: t("mostViewedProperties"),
    },
    {
      href: "/properties/most-favourite-properties",
      label: t("mostFavouriteProperties"),
    },
    {
      href: "/properties/properties-nearby-city",
      label: t("propertiesNearbyCity"),
    },
    { href: "/projects", label: t("upcomingProjects") },
  ];

  const quickLinks = [
    { href: "/", label: t("home") },
    { href: "/faqs", label: t("faqs") },
    { href: "/about-us", label: t("aboutUs") },
    { href: "/terms-and-conditions", label: t("termsAndConditions") },
    { href: "/subscription-plan", label: t("subscriptionPlan") },
    { href: "/privacy-policy", label: t("privacyPolicy") },
    { href: "/all/articles", label: t("articles") },
    { href: "/contact-us", label: t("contactUs") },
  ];
  const appLinks = [
    { href: webSettings?.appstore_id, label: t("appStore"), icon: "apple" },
    { href: webSettings?.playstore_id, label: t("googlePlay"), icon: "google" },
  ];
  const socialLinks = {
    facebook: webSettings?.facebook_id,
    twitter: webSettings?.twitter_id,
    instagram: webSettings?.instagram_id,
    youtube: webSettings?.youtube_id,
  };

  // Destructure all needed fields from webSettings
  // const {
  //   company_name: companyName,
  //   company_description: companyDescription,
  //   company_address: address,
  //   company_email: email,
  //   company_tel1: phone1,
  //   company_tel2: phone2,
  // } = webSettings;
  const companyName = webSettings?.company_name;
  const companyDescription = webSettings?.company_description;
  const address = webSettings?.company_address;
  const email = webSettings?.company_email;
  const phone1 = webSettings?.company_tel1;
  const phone2 = webSettings?.company_tel2;

  const phoneNumbers = [phone1, phone2];

  return (
    <footer className="brandBg">
      <div className="container w-full">
        {/* Top Contact Bar */}
        <RenderIf
          condition={address || email || (phoneNumbers && phoneNumbers.length)}
        >
          <div className="grid grid-cols-1 gap-4 px-4 py-6 md:grid-cols-12 md:px-4 md:py-12">
            <div className="col-span-12 flex flex-col gap-4 md:col-span-4">
              <CustomLink href="/">
                <Image
                  src={webSettings?.web_footer_logo}
                  className="h-[50px] w-[150px]"
                  alt="Logo"
                  width={0}
                  height={0}
                />
              </CustomLink>
              <div>
                <h2 className="primaryTextColor text-base font-medium">
                  {companyDescription ||
                    process.env.NEXT_PUBLIC_META_DESCRIPTION}
                </h2>
              </div>
            </div>
            <div className="col-span-12 flex flex-col flex-wrap gap-4 rounded-2xl bg-black p-4 md:col-span-8 md:flex-row md:px-2 lg:justify-evenly">
              {/* Address */}
              <RenderIf condition={address}>
                <div className="flex items-center gap-2 md:w-auto">
                  <span className="inline-flex items-center justify-center rounded-md bg-[#F5F5F429] bg-opacity-10 p-3">
                    <PiMapPinFill className="fill-white" size={24} />
                  </span>
                  <span className="max-w-sm text-base text-white">
                    {address}
                  </span>
                  <div className="ml-6 hidden h-10 w-px bg-white/20 lg:block"></div>
                </div>
              </RenderIf>
              {/* Email */}
              <RenderIf condition={email}>
                <div className="flex items-center gap-2 md:w-auto">
                  <span className="inline-flex items-center justify-center rounded-md bg-[#F5F5F429] bg-opacity-10 p-3">
                    <BiSolidEnvelope className="fill-white" size={24} />
                  </span>
                  <Link
                    href={`mailto:${email}`}
                    target="_blank"
                    className="text-base text-white hover:underline"
                    tabIndex={0}
                    aria-label="Email"
                  >
                    {email}
                  </Link>
                  <div className="ml-6 hidden h-10 w-px bg-white/20 lg:block"></div>
                </div>
              </RenderIf>
              {/* Phone Numbers */}
              <RenderIf condition={phoneNumbers && phoneNumbers.length}>
                <div className="flex items-center gap-2 md:w-auto">
                  <span className="inline-flex items-center justify-center rounded-md bg-[#F5F5F429] bg-opacity-10 p-3">
                    <FaPhoneAlt className="fill-white" size={24} />
                  </span>
                  <div className="flex flex-col text-base text-white">
                    {phoneNumbers.map((num, idx) => (
                      <Link
                        key={idx}
                        href={`tel:${num}`}
                        className="hover:underline"
                        tabIndex={0}
                        aria-label={`Phone ${idx + 1}`}
                      >
                        {num}
                      </Link>
                    ))}
                  </div>
                </div>
              </RenderIf>
            </div>
          </div>
        </RenderIf>
        {/* Main Footer Grid */}
        <div className={`primaryTextColor grid gap-y-12 sm:gap-12 px-4 py-6 grid-cols-12`}>
          {/* Property Listing */}
          <div className={`col-span-12 sm:col-span-6 ${appLinks?.every((link) => link.href !== null)
            ? 'lg:col-span-4'
            : 'lg:col-span-6'
            }`}>
            <h2 className="mb-3 border-b border-white/20 pb-3 text-xl font-semibold md:mb-6 md:pb-6">
              {t("propertyListing")}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {propertyLinks?.map((link) => (
                <CustomLink
                  key={link.href}
                  href={link.href}
                  className="hover-underline-animation h-fit w-fit text-white"
                  tabIndex={0}
                  aria-label={link.label}
                >
                  {link.label}
                </CustomLink>
              ))}
            </div>
          </div>
          {/* Quick Links */}
          <div className={`col-span-12 sm:col-span-6 ${appLinks?.every((link) => link.href !== null)
            ? 'lg:col-span-4'
            : 'lg:col-span-6'
            }`}>
            <h2 className="mb-3 border-b border-white/20 pb-3 text-xl font-semibold md:mb-6 md:pb-6">
              {t("quickLinks")}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickLinks?.map((link) => (
                <CustomLink
                  key={link.href}
                  href={link.href}
                  className="hover-underline-animation h-fit w-fit text-white"
                  tabIndex={0}
                  aria-label={link.label}
                >
                  {link.label}
                </CustomLink>
              ))}
            </div>
          </div>
          {/* Download App */}
          <RenderIf condition={appLinks?.every((link) => link.href !== null)}>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <h2 className="mb-3 border-b border-white/20 pb-3 text-xl font-semibold md:mb-6 md:pb-6">
                {t("downloadOurApp")}
              </h2>
              <p className="mb-6 text-white/80">
                {t("downloadApp1")} {companyName} {t("downloadApp2")}
              </p>
              <div className="mb-6 flex flex-wrap gap-4">
                {appLinks?.map((app) => (
                  <Link
                    key={app.href || app.label}
                    href={app.href || "#"}
                    target="_blank"
                    className="flex items-center gap-2 rounded-md !bg-white bg-opacity-10 px-4 py-2 hover:bg-opacity-20"
                    tabIndex={0}
                    aria-label={app.label}
                  >
                    {app.icon === "google" ? (
                      <Image
                        src={playStore}
                        alt="Google Play"
                        className="h-9 w-9"
                        width={0}
                        height={0}
                      />
                    ) : (
                      <Image src={AppleStore} alt="Apple Store" className="h-9 w-9" width={0} height={0} />
                    )}
                    <span className="flex flex-col text-left">
                      <span className="leadColor text-xs font-medium">
                        {t("downloadOn")}
                      </span>
                      <span className="brandColor text-lg font-bold">
                        {app.label}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </RenderIf>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-black">
        <div className="primaryTextColor container mx-auto flex flex-col items-center justify-center gap-2 py-3 md:flex-row md:justify-between">
          <p className="w-full text-center md:w-auto">
            {t("copyright")} &copy; {currentYear} {companyName}.{" "}
            {t("allRightsReserved")}
          </p>
          <RenderIf condition={[socialLinks?.facebook, socialLinks?.instagram, socialLinks?.twitter, socialLinks?.youtube]?.some((link) => link)}>
            <div className="flex w-full items-center justify-center gap-3 md:w-auto md:justify-end">
              <span className="text-base font-semibold">{t("followUs")} :</span>
              <ul className="flex gap-4">
                {socialLinks?.facebook && (
                  <li>
                    <Link
                      href={socialLinks.facebook}
                      aria-label="Facebook"
                      tabIndex={0}
                    >
                      <FaFacebookF size={20} />
                    </Link>
                  </li>
                )}
                {socialLinks?.twitter && (
                  <li>
                    <Link
                      href={socialLinks.twitter}
                      aria-label="Twitter"
                      tabIndex={0}
                    >
                      <FaX size={20} />
                    </Link>
                  </li>
                )}
                {socialLinks?.instagram && (
                  <li>
                    <Link
                      href={socialLinks.instagram}
                      aria-label="Instagram"
                      tabIndex={0}
                    >
                      <AiFillInstagram size={20} className="!fill-white" />
                    </Link>
                  </li>
                )}
                {socialLinks?.youtube && (
                  <li>
                    <Link
                      href={socialLinks.youtube}
                      aria-label="Youtube"
                      tabIndex={0}
                    >
                      <FaYoutube size={20} />
                    </Link>
                  </li>
                )}
              </ul>
            </div>

          </RenderIf>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
