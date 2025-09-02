import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import under_maintenance from '@/assets/under_maintenance.svg';

const UnderMaintenance = () => {
    const t = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col gap-4 text-center items-center justify-center">
                <div>
                    <ImageWithPlaceholder
                        src={under_maintenance.src}
                        alt="underMaintenanceImg"
                        className={"w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"}
                    />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h3 className='primaryColor'>{t("underMaintenance")}</h3>
                    <span className='secondryTextColor'>{t("pleaseTryAgain")}</span>
                </div>
            </div>
        </div>
    );
};

export default UnderMaintenance;