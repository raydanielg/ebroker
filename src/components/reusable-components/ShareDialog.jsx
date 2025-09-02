"use client";
import { toast } from "react-hot-toast";
import { useTranslation } from "../context/TranslationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { MdClose } from "react-icons/md";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiFileCopy2Line } from "react-icons/ri";

const ShareDialog = ({
  open,
  onOpenChange,
  title = "",
  subtitle = "",
  pageUrl = "",
}) => {
  const t = useTranslation();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.success(t("linkCopiedSuccessfully"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[310px] rounded-2xl p-0 md:max-w-2xl [&>button]:hidden">
        <DialogHeader className="w-fit space-y-4 p-3 md:p-4">
          <DialogTitle className="text-center text-base font-semibold md:text-2xl">
            <div className="flex justify-between items-center">
              {title}
              <button
                onClick={() => onOpenChange(false)}
                className="primaryBackgroundBg flex h-10 w-10 items-center justify-center rounded-xl focus:outline-none focus:ring-0"
              >
                <MdClose className="h-5 w-5" />
              </button>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm">
            {subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-2 md:p-4">
          <div className="flex flex-col gap-4">
            {/* Social Sharing Options */}
            <div className="grid gap-4 md:grid-cols-3">
              <ShareButton
                type="facebook"
                url={pageUrl}
                label={t("facebook")}
                icon={<FaFacebook size={20} />}
              />
              <ShareButton
                type="twitter"
                url={pageUrl}
                label={t("twitter")}
                icon={<FaXTwitter size={20} />}
              />
              <ShareButton
                type="whatsapp"
                url={pageUrl}
                label={t("whatsapp")}
                icon={<FaWhatsapp size={20} />}
              />
            </div>

            {/* Copy Link */}
            <div className="pt-2">
              <div className="mb-2 text-sm font-medium md:text-base">
                {t("pageLink")}
              </div>
              <div className="primaryBackgroundBg cardBorder flex items-center gap-2 rounded p-2 sm:justify-between md:flex-row md:rounded-lg">
                <span className="break-all text-start text-xs md:text-sm">
                  {pageUrl}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="primaryBg flex items-center justify-center gap-2 rounded-lg p-1 px-2 py-2 text-xs font-medium text-white transition-colors hover:opacity-90 md:w-fit md:text-sm"
                >
                  <RiFileCopy2Line className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:block text-nowrap">{t("copyLink")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for social media share buttons
const ShareButton = ({ type, url, label, icon }) => {
  const ButtonComponent =
    type === "facebook"
      ? FacebookShareButton
      : type === "twitter"
        ? TwitterShareButton
        : type === "whatsapp"
          ? WhatsappShareButton
          : ({ children, ...props }) => <button {...props}>{children}</button>;

  return (
    <ButtonComponent
      url={url}
      className={`flex flex-shrink-0 !w-full flex-row items-center justify-center gap-2 rounded-lg border !px-4 !py-2 transition-colors md:rounded-2xl md:!py-4 ${type === "facebook" ? "!blueBgLight !blueTextColor" : type === "twitter" ? "!brandBgLight" : "!greenBgLight !greenTextColor"}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </ButtonComponent>
  );
};

export default ShareDialog;
