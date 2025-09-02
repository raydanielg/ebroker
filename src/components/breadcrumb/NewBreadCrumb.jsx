import Link from "next/link";
import { useRouter } from "next/router";
import { HiMiniSlash } from "react-icons/hi2";
import { useTranslation } from "../context/TranslationContext";
import { LuHeart, LuShare2 } from "react-icons/lu";

const NewBreadcrumb = ({
  items = [],
  title,
  subtitle = "",
  layout = "default",
  showLike = false,
  setIsShareModalOpen = () => { },
  handleInterested = () => { },
  handleNotInterested = () => { },
  interested = false,
}) => {
  const router = useRouter();
  const { locale } = router?.query;
  const t = useTranslation();
  const isActive = (item) => {
    const currentPath = router?.asPath;
    const itemPath = item.href.toString();
    return currentPath.includes(itemPath);
  };

  return (
    <div
      className={`flex w-full items-center justify-center bg-[#F5F5F4] ${layout === "default" ? "min-h-[130px]" : ""}`}
    >
      {/* Title Section */}
      {layout === "default" ? (
        <div className="container mx-auto px-4 md:px-6 xl:px-0">
          <div className="flex flex-col items-start justify-center md:flex-row md:items-center md:justify-between py-8 gap-2">
            <div className={title ? "flex flex-col items-start gap-2" : ""}>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl sm:font-bold md:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="leadColor text-sm font-medium md:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {/* Breadcrumb Navigation */}
            <nav className="">
              <ul className="flex flex-wrap justify-start lg:justify-center text-xs sm:text-sm">
                <li className="flex items-center">
                  <Link
                    href={`/${locale}`}
                    className="brandColor text-base font-medium transition-all duration-300 hover:opacity-80"
                  >
                    {t("home")}
                  </Link>
                </li>
                {items.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <HiMiniSlash className="mx-1 h-4 w-4 text-base font-medium" />
                    {index === items.length - 1 ? (
                      <span
                        className={`text-base brandColor break-all ${isActive(item) ? "!primaryColor !font-bold" : ""}`}
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={`/${locale}${item.href}`}
                        className="brandColor text-base font-medium transition-all duration-300 hover:opacity-80"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <div className="container pb-6 pt-10 md:pt-12">
          <div className="flex items-center justify-between gap-3 sm:items-center">
            {/* Breadcrumb Navigation */}
            <nav className="order-1">
              <ul className="md:ml-2 flex flex-wrap items-center">
                <li className="flex items-center">
                  <Link
                    href="/"
                    className="brandColor text-nowrap text-base transition-all duration-300 hover:opacity-80"
                  >
                    {t("home")}
                  </Link>
                </li>
                {items.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <HiMiniSlash className="mx-1 h-4 w-4" />
                    {index === items.length - 1 ? (
                      <span
                        className={`font-medium text-base ${isActive(item) ? "primaryColor !font-bold " : "brandColor"}`}
                      >
                        {item.label}
                      </span>
                    ) : item.disable ? (
                      <span className="brandColor text-nowrap text-base">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={`/${locale}${item.href}`}
                        className="brandColor transition-all duration-300 hover:opacity-80"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="order-2 flex  items-center gap-3">
              {showLike && (
                <div className="leadColor flex items-center gap-2 text-sm font-medium sm:text-base">
                  <div
                    className={`cardBorder hover:primaryBorderColor hover:primaryColor flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition-all duration-300 hover:cursor-pointer ${interested ? "primaryBg primaryColor" : ""}`}
                    onClick={
                      interested ? handleNotInterested : handleInterested
                    }
                  >
                    <LuHeart
                      className={`${interested ? "h-5 w-5 fill-white" : ""} `}
                    />
                  </div>
                  <span className="hidden sm:block">{t("save")}</span>
                </div>
              )}
              {/* Share Button */}
              <div className="leadColor flex items-center gap-2 text-sm font-medium sm:text-base">
                <div
                  className="cardBorder hover:primaryBorderColor hover:primaryColor flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition-all duration-300 hover:cursor-pointer"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <LuShare2 className="" />
                </div>
                <span className="hidden sm:block">{t("share")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBreadcrumb;
