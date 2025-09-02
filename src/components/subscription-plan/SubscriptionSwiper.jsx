"use client";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";
import { useRouter } from "next/router";
import { useTranslation } from "../context/TranslationContext";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionSkeletonCard from "./SubscriptionSkeletonCard";
import {
  assignFreePackageApi, getPackagesApi,
  getPaymentSettingsApi
} from "@/api/apiRoutes";
import { useSelector } from "react-redux";
import LoginModal from "../modal/LoginModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import StripePayment from "../payment/StripePayment";
import { FaExclamationTriangle } from "react-icons/fa";
import { useRazorpay } from "react-razorpay";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";
import PaymentHandlers from "./PaymentHandlers";
import PaymentGatewaySelector from "./PaymentGatewaySelector";
import PaymentSelectionModal from "./PaymentSelectionModal";
import { isRTL } from "@/utils/helperFunction";
import NoDataFound from "../no-data-found/NoDataFound";

const SubscriptionSwiper = () => {
  const t = useTranslation();
  const router = useRouter();
  const locale = router?.query?.locale;

  const [packagedata, setPackageData] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentSettingsdata, setPaymentSettingsData] = useState([]);
  const [clientKey, setclientKey] = useState("");
  const [paymentTransactionId, setPaymentTransactionId] = useState("");
  const [priceData, setPriceData] = useState("");
  const [stripeformModal, setStripeFormModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [showPaypalModal, setShowPaypal] = useState(false);
  const [showFlutterwaveModal, setShowFlutterwaveModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);

  const user = useSelector((state) => state.User?.data);
  const webSettings = useSelector((state) => state.WebSetting?.data);
  const token = useSelector((state) => state.User?.jwtToken);
  const language = useSelector((state) => state.LanguageSettings?.current_languages);

  // Razorpay initialization
  const { Razorpay, isLoading } = useRazorpay();
  const isUserLoggedIn = token ? true : false;

  // Check if Stripe gateway is active
  const stripeActive = paymentSettingsdata.some(
    (item) => item.type === "stripe_gateway" && item.data === "1",
  );

  // Check if Razorpay gateway is active
  const razorpayActive = paymentSettingsdata.some(
    (item) => item.type === "razorpay_gateway" && item.data === "1",
  );

  // Check if PayStack gateway is active
  const payStackActive = paymentSettingsdata.some(
    (item) => item.type === "paystack_gateway" && item.data === "1",
  );

  // Check if PayPal gateway is active
  const payPalActive = paymentSettingsdata.some(
    (item) => item.type === "paypal_gateway" && item.data === "1",
  );

  // Check if Flutterwave gateway is active
  const FlutterwaveActive = paymentSettingsdata.some(
    (item) => item.type === "flutterwave_status" && item.data === "1",
  );

  // Check if Bank Transfer is active - you may need to adjust this based on your actual settings
  const bankTransferActive = paymentSettingsdata.some(
    (item) => item.type === "bank_transfer_status" && item.data === "1",
  );

  // Get Razorpay Key Object
  const razorKeyObject = paymentSettingsdata.find(
    (item) => item.type === "razor_key",
  );
  // Get Razorpay Key
  const razorKey = razorKeyObject ? razorKeyObject.data : null;

  // Get Stripe Currency
  const stripeCurrency = webSettings?.currency_symbol;

  // Sample bank details - you should fetch this from your backend or settings
  const bankDetails = webSettings?.bank_details;

  // Carousel options for responsive behavior
  const carouselOptions = {
    dragFree: true,
    loop: false,
    slidesToScroll: "auto",
    direction: isRTL() ? "rtl" : "ltr",
  };

  // Fetch packages data
  useEffect(() => {
    fetchPackages();
  }, [isUserLoggedIn, language]);

  // Fetch payment settings data
  useEffect(() => {
    if (isUserLoggedIn) {
      fetchPaymentSettings();
    }
  }, [isUserLoggedIn]);

  const fetchPaymentSettings = async () => {
    try {
      const res = await getPaymentSettingsApi();
      if (!res?.error) {
        setPaymentSettingsData(res?.data);
      } else {
        console.error("Error fetching payment settings:", res?.message);
      }
    } catch (err) {
      console.error("Error fetching payment settings:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getPackagesApi();
      if (!res.error) {
        const packageData = res?.data || [];
        const allFeatures = res?.all_features || [];
        const allActivePackages = res?.active_packages || [];

        // Combine both lists (active packages + all packages)
        const combinedPackages = [...allActivePackages, ...packageData];

        // Sort to ensure active packages (is_active === 1) appear first
        const sortedPackages = combinedPackages.sort((a, b) => {
          const getPriority = (pkg) => {
            if (pkg.is_active) return 3;
            if (pkg.package_status === "review") return 2;
            if (pkg.package_status === "rejected") return 1;
            return 0;
          };
          return getPriority(b) - getPriority(a);
        });

        // Set final sorted data
        setPackageData(sortedPackages);
        setAllFeatures(allFeatures);
      } else {
        console.error("Error fetching packages:", res.message);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setLoading(false);
    }
  };

  // Handle Payment Modal
  const subscribePayment = (e, data) => {
    e.preventDefault();

    if (!isUserLoggedIn) {
      Swal.fire({
        title: t("oops"),
        text: "You need to login!",
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
          setShowModal(true);
        }
      });
      return false;
    }

    if (webSettings.demo_mode) {
      Swal.fire({
        title: t("oops"),
        text: t("notAllowdDemo"),
        icon: "warning",
        showCancelButton: false,
        customClass: {
          confirmButton: "Swal-confirm-buttons",
          cancelButton: "Swal-cancel-buttons",
        },
        confirmButtonText: t("ok"),
      });
      return false;
    }

    setPriceData(data);

    // Handle free packages
    if (data?.package_type === "free") {
      // Confirm before assigning free package
      Swal.fire({
        title: t("areYouSure"),
        text: t("areYouSureToBuyThisFreePackage"),
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: "Swal-confirm-buttons",
          cancelButton: "Swal-cancel-buttons",
        },
        cancelButtonColor: "#d33",
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
      }).then((result) => {
        if (result.isConfirmed) {
          handleFreePackage(data);
        }
      });
      return;
    }

    // Handle paid packages based on active payment methods
    if (isUserLoggedIn) {
      const hasOnlinePayment = hasActiveOnlinePayment();

      if (hasOnlinePayment && bankTransferActive) {
        setShowPaymentSelection(true);
      } else if (hasOnlinePayment) {
        handleOnlinePayment();
      } else if (bankTransferActive) {
        setShowPaymentSelection(true);
      } else {
        Swal.fire({
          title: t("oops"),
          text: t("noPaymentActive") || "No payment method is active",
          icon: "warning",
          showCancelButton: false,
          customClass: {
            confirmButton: "Swal-confirm-buttons",
            cancelButton: "Swal-cancel-buttons",
          },
          confirmButtonText: t("ok"),
        }).then(() => {
          router.push(`/${locale}/contact-us`);
        });
      }
    }
  };

  // Handle free package assignment
  const handleFreePackage = async (data) => {
    try {
      const res = await assignFreePackageApi({
        package_id: data?.id,
      });
      if (!res?.error) {
        router.push(`/${locale}`);
        toast.success(t(res?.message));
      } else {
        console.error("Error Assigning Free Package:", res?.message);
        toast.error(t(res?.message) || t("errorOccurred"));
      }
    } catch (error) {
      console.error("Error Assigning Free Package:", error);
      toast.error(t(error?.message) || t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  // Handle online payment selection
  const handleOnlinePayment = () => {
    setShowPaymentSelection(false);
    const { handlePaymentSelection } = PaymentGatewaySelector({
      stripeActive,
      razorpayActive,
      payStackActive,
      payPalActive,
      FlutterwaveActive,
      setStripeFormModal,
      setShowRazorpayModal,
      setShowPaystackModal,
      setShowPaypal,
      setShowFlutterwaveModal,
      router,
      t,
    });
    handlePaymentSelection();
  };

  // Close payment selection modal
  const handleClosePaymentSelection = () => {
    setShowPaymentSelection(false);
  };

  // Payment handlers
  const {
    handleRazorpayPayment,
    handlePayStackPayment,
    handlePaypalPayment,
    handleFlutterwavePayment,
    createPaymentIntent,
  } = PaymentHandlers({
    priceData,
    user,
    webSettings,
    razorKey,
    setPaymentTransactionId,
    setclientKey,
    setLoading,
    router,
  });


  // useEffect to open Razorpay Modal
  // Effects for payment handling
  useEffect(() => {
    if (stripeformModal) {
      createPaymentIntent();
    }
  }, [stripeformModal]);

  useEffect(() => {
    if (showRazorpayModal) {
      handleRazorpayPayment(Razorpay);
    }
  }, [showRazorpayModal]);

  useEffect(() => {
    if (showPaystackModal) {
      handlePayStackPayment();
    }
    if (showPaypalModal) {
      handlePaypalPayment();
    }
    if (showFlutterwaveModal) {
      handleFlutterwavePayment();
    }
  }, [showPaystackModal, showPaypalModal, showFlutterwaveModal]);

  // Function to determine which payment gateway is active
  const getActivePaymentGateway = () => {
    if (stripeActive) return "stripe";
    if (razorpayActive) return "razorpay";
    if (payStackActive) return "paystack";
    if (payPalActive) return "paypal";
    if (FlutterwaveActive) return "flutterwave";
    return null;
  };

  // Generate skeleton cards while loading
  const renderSkeletonCards = () => {
    return [...Array(4)].map((_, index) => (
      <CarouselItem key={`skeleton-${index}`} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
        <SubscriptionSkeletonCard />
      </CarouselItem>
    ));
  };

  // Function to check if any online payment gateway is active
  const hasActiveOnlinePayment = () => {
    return (
      stripeActive ||
      razorpayActive ||
      payStackActive ||
      payPalActive ||
      FlutterwaveActive
    );
  };

  // Empty state when no packages are available
  const renderEmptyState = () => (
    <div className="flex w-full flex-col items-center justify-center px-4 py-16">
      <NoDataFound />
    </div>
  );

  return (
    <div>
      <NewBreadcrumb
        title={t("subscriptionPlan")}
        items={[{ href: "/subscription-plan", label: t("subscriptionPlan") }]}
      />
      <section id="subscription" className="my-5 px-2">
        <div className="container mx-auto">
          {packagedata && packagedata.length > 0 && (
            <div className="mb-4 p-3 text-base font-bold md:text-3xl lg:text-[40px]">
              {t("chooseSubscription")}
            </div>
          )}
          {loading ? (
            <Carousel
              opts={carouselOptions}
              className="w-full"
            >
              <CarouselContent>
                {renderSkeletonCards()}
              </CarouselContent>
              <CarouselDots className="mt-4" />
            </Carousel>
          ) : packagedata && packagedata.length > 0 ? (
            <Carousel
              opts={carouselOptions}
              className="w-full"
            >
              <CarouselContent>
                {packagedata.map((data, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <SubscriptionCard
                      data={data}
                      index={index + 1}
                      allFeatures={allFeatures}
                      subscribePayment={subscribePayment}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots className="mt-4 justify-center py-3 [&>div]:flex-wrap mr-1" />
            </Carousel>
          ) : (
            renderEmptyState()
          )}
        </div>
      </section>
      {stripeActive && stripeformModal && (
        <>
          <StripePayment
            clientKey={clientKey}
            open={stripeformModal}
            setOpen={setStripeFormModal}
            currency={stripeCurrency}
            payment_transaction_id={paymentTransactionId}
          />
        </>
      )}
      {showModal && (
        <LoginModal showLogin={showModal} setShowLogin={setShowModal} />
      )}
      {showPaymentSelection && (
        <PaymentSelectionModal
          isOpen={showPaymentSelection}
          onClose={handleClosePaymentSelection}
          onOnlinePayment={handleOnlinePayment}
          activePaymentGateway={getActivePaymentGateway()}
          bankDetails={bankDetails}
          bankTransferActive={bankTransferActive}
          hasOnlinePayment={hasActiveOnlinePayment()}
          packageId={priceData?.id}
        />
      )}
    </div>
  );
};

export default SubscriptionSwiper;
