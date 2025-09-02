"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../context/TranslationContext';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import UserSidebar from './UserSidebar';
import { beforeLogoutApi, deleteUserAccountApi, getWebSetting } from '@/api/apiRoutes';
import { useRouter } from 'next/router';
import { setWebSettings } from '@/redux/slices/webSettingSlice';
import { logout } from '@/redux/slices/authSlice';
import FirebaseData from '@/utils/Firebase';
import Swal from 'sweetalert2';
import withAuth from '../HOC/withAuth';
import { isRTL } from '@/utils/helperFunction';


const VerticleLayout = ({ children }) => {
    const { signOut } = FirebaseData();
    const t = useTranslation();
    const router = useRouter();
    const { slug } = router.query;
    const dispatch = useDispatch();

    const isRtl = isRTL();

    const FcmToken = useSelector((state) => state.WebSetting?.fcmToken);

    // Selectors
    const webSettings = useSelector((state) => state?.WebSetting?.data);
    const currentLang = useSelector((state) => state.LanguageSettings?.current_language);

    // const [isMessagingSupported, setIsMessagingSupported] = useState(false);
    // const [notificationPermissionGranted, setNotificationPermissionGranted] =
    //     useState(false);
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);



    const CheckActiveUserAccount = () => {
        if (webSettings?.is_active === false) {
            Swal.fire({
                title: t("opps"),
                text: t("yourAccountDeactivated"),
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                customClass: {
                    confirmButton: "Swal-confirm-buttons",
                    cancelButton: "Swal-cancel-buttons",
                },
                confirmButtonText: t("logout"),
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(logout());
                    signOut();
                }
            });
        }
    };
    useEffect(() => {
        CheckActiveUserAccount();
    }, [webSettings?.is_active]);

    const fetchWebSettings = async () => {
        try {
            const res = await getWebSetting();
            if (!res?.error) {
                dispatch(setWebSettings({ data: res.data }));
                document.documentElement.lang = currentLang?.code;
                document.documentElement.dir = currentLang?.rtl ? "rtl" : "ltr";

                document.documentElement.style.setProperty(
                    "--primary-color",
                    res?.data?.system_color
                );
                document.documentElement.style.setProperty(
                    "--primary-category-background",
                    res?.data?.category_background
                );
                document.documentElement.style.setProperty(
                    "--primary-sell",
                    res?.data?.sell_web_color
                );
                document.documentElement.style.setProperty(
                    "--primary-rent",
                    res?.data?.rent_web_color
                );
                document.documentElement.style.setProperty(
                    "--primary-sell-bg",
                    res?.data?.sell_web_background_color
                );
                document.documentElement.style.setProperty(
                    "--primary-rent-bg",
                    res?.data?.rent_web_background_color
                );
            } else {
                console.error(res?.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchWebSettings();
        }
    }, [slug]);


    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDrawer = () => {
        setOpen((prev) => !prev);
    };




    return (
        <div className="relative h-screen overflow-hidden bg-gray-100">
            {/* Header */}
            <UserHeader isMobile={isMobile} open={open} toggleDrawer={toggleDrawer} />

            {/* Footer */}
            <UserFooter isMobile={isMobile} open={open} />

            {/* Main wrapper */}
            <div className="flex h-full">
                {/* Sidebar */}
                <UserSidebar isMobile={isMobile} open={open} toggleDrawer={toggleDrawer} />

                {/* Main content */}
                <main className={`flex-1 px-2 sm:px-6 md:px-8 py-6 mt-24 mb-16  overflow-y-auto ${isMobile ? open ? "hidden" : "max-w-full" : !isMobile && open && !isRtl ? "max-w-[calc(100%-240px)]" : "max-w-full"}`}>
                    {children}
                </main>
            </div>
        </div>
    );


};

export default withAuth(VerticleLayout);