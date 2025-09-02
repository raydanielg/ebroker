"use client"
import { useSelector } from "react-redux"
import { useTranslation } from "../context/TranslationContext"
import { isRTL } from "@/utils/helperFunction"

const UserFooter = ({ isMobile, open }) => {
    const t = useTranslation()
    const currentYear = new Date().getFullYear()
    const CompanyName = useSelector(state => state.WebSetting?.data?.company_name)
    const isRtl = isRTL()
    return (
        <footer className={`${isMobile ? open ? "hidden" : "max-w-full" : !isMobile && open && !isRtl ? "max-w-[calc(100%-240px)]" : "max-w-full"}  text-center fixed bottom-0 w-full right-0 h-16 bg-white shadow-lg  z-30 flex justify-center items-center px-4 transition-all duration-300 ease-out`}>
            <div className="text-base font-medium secondryTextColor">{t("copyright")} &copy; {currentYear} {CompanyName} {t("allRightsReserved")}</div>
        </footer>
    )
}

export default UserFooter