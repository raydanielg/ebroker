'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import cookiesIcon from '@/assets/CookieIcon.svg';
import { useSelector } from 'react-redux';
import { useTranslation } from '../context/TranslationContext';

const CookieComponent = () => {
    const t = useTranslation();
    const [showPopup, setShowPopup] = useState(false);
    const [isCookiesAccept, setIsCookiesAccept] = useState(false);

    const userData = useSelector(state => state.User);
    const websettings = useSelector(state => state.WebSetting);
    const data = userData?.data;

    const isLogin = userData?.jwtToken;

    const expirationDays = 7;

    const handleAccept = () => {
        Cookies.set('cookie-consent', 'accepted', { expires: expirationDays });

        setShowPopup(false);
        setIsCookiesAccept(true);
        handleSaveData();
    };

    const handleDecline = () => {
        Cookies.set('cookie-consent', 'declined', { expires: expirationDays });
        setShowPopup(false);
    };

    const handleSaveData = () => {
        Cookies.set('user-name', data?.name, { expires: expirationDays });
        Cookies.set('user-email', data?.email, { expires: expirationDays });
        Cookies.set('user-number', data?.mobile, { expires: expirationDays });
        Cookies.set('user-token', userData?.jwtToken, { expires: expirationDays });
        Cookies.set('user-fcmId', websettings?.fcmToken, { expires: expirationDays });
        Cookies.set('user-loginType', data?.logintype, { expires: expirationDays });
    };


    useEffect(() => {
        const consent = Cookies.get('cookie-consent');
        if (!consent) {
            setShowPopup(true);
        }
    }, []);

    useEffect(() => {
        if (isLogin && isCookiesAccept) {
            handleSaveData();
        }
    }, [isLogin, showPopup, userData]);

    if (!showPopup) return null;




    return (
        <div className='fixed bottom-1 right-1 md:bottom-5 md:right-5 sm:bottom-[10px] sm:right-[10px] z-[999] 
            p-5 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center gap-7 
            w-[300px] h-[420px] px-5 py-5 
            sm:w-[350px] sm:h-[490px] sm:px-5 sm:py-5
            md:w-[450px] md:h-[450px]
            lg:w-[640px] lg:h-[366px] '>
            <div className="imgWrapper mt-7">
                <Image src={cookiesIcon} height={0} width={0} alt='cookiesImg' />
            </div>

            <div className='content flex flex-col gap-4 items-center text-center'>
                <span className='text-lg sm:text-lg md:text-xl lg:text-2xl font-bold secondryTextColor'>{t("cookieConsent")}</span>
                <span className='text-sm sm:text-sm md:text-base lg:text-base secondryTextColor font-semibold'>{t("cookieConsentDescription")}</span>
            </div>

            <div className="btnsWrapper flex flex-wrap items-center justify-center gap-5 mt-0 sm:mt-0 md:mt-3 lg:mt-6 pb-7">
                <button
                    onClick={handleDecline}
                    className='btnBorder bg-transparent rounded-sm px-5 py-2 font-semibold'>
                    {t("declineCookies")}
                </button>
                <button
                    onClick={handleAccept}
                    className='primaryBg text-white px-5 rounded-sm py-2 font-semibold'>
                    {t("acceptCookies")}
                </button>
            </div>
        </div>
    );
};

export default CookieComponent;