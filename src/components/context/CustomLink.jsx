"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

/**
 * CustomLink Component
 *
 * A wrapper around Next.js Link component that preserves the current locale
 * in navigation. This ensures that all internal links maintain the currently
 * selected language.
 */
export default function CustomLink({
  href,
  passLocale = true,
  children,
  ...props
}) {
  const router = useRouter();
  const { locale } = router?.query;

  // Get language settings from Redux
  const activeLanguage = useSelector((state) => state.LanguageSettings?.active_language);
  const defaultLanguage = useSelector((state) => state.LanguageSettings?.default_language);

  // Use active language if available, otherwise use URL locale or default language
  const currentLanguage = locale || activeLanguage || defaultLanguage;

  return (
    <Link
      href={`${passLocale ? `/${currentLanguage}` : ""}${href || "#"}`}
      locale={currentLanguage}
      {...props}
    >
      {children}
    </Link>
  );
}
