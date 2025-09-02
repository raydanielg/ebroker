"use client"
import React from 'react'
import noDataFound from '@/assets/no_data_found.svg'
import { useTranslation } from '../context/TranslationContext'
import Image from 'next/image'

const NoDataFound = ({title, description}) => {
    const t = useTranslation()
    return (
        <div className="flex flex-col items-center justify-center my-[100px] gap-4 h-[60vh]">
            <Image
                loading="lazy"
                src={noDataFound}
                alt="no data found"
                width={200}
                height={200}
            />
            <div className="flex flex-col items-center justify-center">
                <h3 className="primaryColor text-2xl font-medium">{title || t("noDataFound")}</h3>
                <span className='font-normal secondryTextColor'>{description || t("noDataFoundMessage")}</span>
            </div>
        </div>
    )
}

export default NoDataFound