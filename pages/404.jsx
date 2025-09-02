"use client";
import Image from "next/image";
import { useTranslation } from "@/components/context/TranslationContext";
import { IoMdArrowBack } from "react-icons/io";
import NoPageFound from "@/assets/404.png";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Index = () => {
  const t = useTranslation();
  const router = useRouter();
  const defaultLang = useSelector(
    (state) => state.LanguageSettings.default_language,
  );
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div>
          <Image
            loading="lazy"
            src={NoPageFound}
            alt="404"
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="primaryColor text-3xl font-semibold">404</h3>
          <span>{t("pageNotFound")}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="primaryBg primaryTextColor mt-4 flex items-center justify-center gap-2 rounded-md px-4 py-2"
            onClick={() => router.push(`/${defaultLang}`)}
          >
            <IoMdArrowBack size={18} /> {t("backToHome")}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Index;
