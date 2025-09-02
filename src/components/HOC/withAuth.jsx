"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/ui/loaders/Loader";
import Swal from "sweetalert2";
import { useTranslation } from "@/components/context/TranslationContext";
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useSelector } from 'react-redux';
import toast from "react-hot-toast";

const withAuth = (WrappedComponent) => {
    const Wrapper = (props) => {
        const t = useTranslation()
        const router = useRouter();
        const { locale } = router?.query;

        const isUserLoggedIn = useAuthStatus();

        // Use useSelector instead of direct store.getState() to prevent undefined access
        const userData = useSelector(state => state?.User?.data);
        const hasSubscription = useSelector(state => state?.WebSetting?.data?.subscription);
        const isPremiumUser = useSelector(state => state?.WebSetting?.data?.is_premium);

        const [isAuthorized, setIsAuthorized] = useState(false);
        const [authChecked, setAuthChecked] = useState(false);

        useEffect(() => {
            // Base private routes without dynamic slugs
            const privateRoutes = [
                `/${locale}/user/advertisement/`,
                `/${locale}/user/chat/`,
                `/${locale}/user/dashboard/`,
                `/${locale}/user/profile/`,
                `/${locale}/user/edit-property/`,
                `/${locale}/user/edit-project/`,
                `/${locale}/user/favourites-properties/`,
                `/${locale}/user/personalize-feed/`,
                `/${locale}/user/subscription/`,
                `/${locale}/user/notifications/`,
                `/${locale}/user/transaction-history/`,
                `/${locale}/user/interested/`,
                `/${locale}/user/projects/`,
                `/${locale}/user/verification-form/`,
                `/${locale}/my-property/`,
                `/${locale}/user-register/`,
                `/${locale}/user/add-property/`,
                `/${locale}/my-project/`,
                `/${locale}/all-personalized-feeds/`,
            ];

            // Updated subscription routes to support dynamic slugs
            const subscriptionRoutes = ["/user/properties", "/user/add-project"];

            const premiumUserRoutes = [
                `/${locale}/project-details`, // Base path for dynamic slugs
                `/${locale}/property-details`,
            ];

            // Check if current path exactly matches one of the private routes
            const isExactPrivateRoute = privateRoutes.includes(router.asPath);

            // Check if current path starts with one of the private routes (for dynamic slugs)
            const isDynamicPrivateRoute = privateRoutes.some(route =>
                router.asPath.startsWith(route)
            );

            // Combine both checks for private routes
            const isPrivateRoute = isExactPrivateRoute || isDynamicPrivateRoute;

            // Check for subscription routes, including dynamic slugs
            const isSubscriptionRoute = subscriptionRoutes.some((route) =>
                router?.pathname?.startsWith(route)
            );

            const isPremiumUserRoute = premiumUserRoutes.some((route) =>
                router?.pathname?.startsWith(route)
            );

            if (isPrivateRoute && !isUserLoggedIn) {
                toast.error(t("pleaseLoginToAccess"))
                router.push(`/${locale}/`);
            }
            else if (isPremiumUserRoute && !isPremiumUser) {
                Swal.fire({
                    title: t("oops"),
                    text: t("notPremiumUser"),
                    icon: "warning",
                    allowOutsideClick: false,
                    showCancelButton: false,
                    customClass: {
                        confirmButton: "Swal-confirm-buttons",
                        cancelButton: "Swal-cancel-buttons",
                    },
                    confirmButtonText: t("ok"),
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push(`/${locale}/`);
                    }
                });
            } else {
                setIsAuthorized(true);
            }

            setAuthChecked(true);
        }, [userData, router, hasSubscription, isPremiumUser, isUserLoggedIn, locale, t]);

        if (!authChecked) {
            return <Loader />;
        }

        return isAuthorized ? <WrappedComponent {...props} /> : null;
    };

    return Wrapper;
};

export default withAuth;
