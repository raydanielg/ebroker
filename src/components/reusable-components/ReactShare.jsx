"use client"
import React from 'react'
import { FacebookIcon, FacebookShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share'
import { CiLink } from "react-icons/ci"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip"
import { useTranslation } from '../context/TranslationContext'

const ReactShare = ({ currentUrl, handleCopyUrl, data, CompanyName }) => {
    const t = useTranslation()
    return (
        <div className="flex items-center gap-5">
            <p className='text-base secondryTextColor font-medium'>{t("sharePost")} :</p>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <FacebookShareButton url={currentUrl} title={currentUrl + CompanyName} hashtag={CompanyName}>
                            <FacebookIcon size={30} round />
                        </FacebookShareButton>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                        <p>{t("shareOnFacebook")}</p>
                        <TooltipArrow width={15} height={10} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <TwitterShareButton url={currentUrl}>
                            <XIcon size={30} round />
                        </TwitterShareButton>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5} >
                        <p>{t("shareOnTwitter")}</p>
                        <TooltipArrow width={15} height={10} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <WhatsappShareButton url={currentUrl} title={data + "" + " - " + "" + CompanyName} hashtag={CompanyName}>
                            <WhatsappIcon size={30} round />
                        </WhatsappShareButton>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                        <p>{t("shareOnWhatsapp")}</p>
                        <TooltipArrow width={15} height={10} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleCopyUrl}
                            className="bg-gray-200 rounded-full p-1.5 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                            <CiLink size={17} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                        <p>{t("copyUrl")}</p>
                        <TooltipArrow width={15} height={10} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default ReactShare 