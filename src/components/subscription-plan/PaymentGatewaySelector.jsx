import Swal from "sweetalert2";
import { useTranslation } from "../context/TranslationContext";
import { useRouter } from "next/router";

const PaymentGatewaySelector = ({
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
}) => {
  const { locale } = router?.query;
  const handlePaymentSelection = () => {
    if (
      !stripeActive &&
      !razorpayActive &&
      !payStackActive &&
      !payPalActive &&
      !FlutterwaveActive
    ) {
      Swal.fire({
        title: t("opps"),
        text: t("noPaymenetActive"),
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
      return false;
    }

    if (stripeActive) {
      setStripeFormModal(true);
    } else if (razorpayActive) {
      setShowRazorpayModal(true);
    } else if (payStackActive) {
      setShowPaystackModal(true);
    } else if (payPalActive) {
      setShowPaypal(true);
    } else if (FlutterwaveActive) {
      setShowFlutterwaveModal(true);
    }
  };

  return { handlePaymentSelection };
};

export default PaymentGatewaySelector;
