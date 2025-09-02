import {
  createAllPaymentIntentApi,
  flutterWaveApi,
  paymentTransactionFailApi,
  paypalApi,
} from "@/api/apiRoutes";
import { useTranslation } from "../context/TranslationContext";

const PaymentHandlers = ({
  priceData,
  user,
  webSettings,
  razorKey,
  setPaymentTransactionId,
  setclientKey,
  setLoading,
  router,
}) => {
  const t = useTranslation();

  // Create Payment Intent Function
  const createPaymentIntent = async () => {
    try {
      // create payment api
      const res = await createAllPaymentIntentApi({
        package_id: priceData?.id,
        platform_type: "web",
      });
      if (!res?.error) {
        const paymentData = res?.data;
        setPaymentTransactionId(
          paymentData?.payment_intent?.payment_transaction_id,
        );
        setclientKey(
          paymentData?.payment_intent?.payment_gateway_response?.client_secret,
        );
      } else {
        console.error("Error creating payment intent:", res?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred during payment submission:", error);
      // Set loading state to false in case of an exception
      setLoading(false);
    }
  };

  // paystack payment method
  const handlePayStackPayment = async () => {
    try {
      // // Open the payment iframe
      // handler.openIframe();
      const res = await createAllPaymentIntentApi({
        package_id: priceData?.id,
        platform_type: "web",
      });
      if (!res?.error) {
        const payStackLink =
          res?.data?.payment_intent?.payment_gateway_response?.data
            ?.authorization_url;
        if (payStackLink) {
          // Open payStackLink in new tab
          window.location.href = payStackLink;
        } else {
          console.error("No paystack payment link found : ", res?.message);
        }
      }
    } catch (error) {
      // Handle unexpected errors
      console.error(
        "An error occurred while processing paystack payment:",
        error,
      );
      toast.error(t("unexpectedErrorOccurred"));
    }
  };

  // paypal payment method
  const handlePaypalPayment = async () => {
    try {
      await new Promise(async (resolve, reject) => {
        const res = await paypalApi({
          amount: priceData?.price,
          package_id: priceData?.id,
        });
        if (!res?.error) {
          // Create a temporary DOM element to parse the HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(res, "text/html");
          // Find the form
          const form = doc.querySelector('form[name="paypal_auto_form"]');
          if (form) {
            // Get the form action URL
            const paypalUrl = form.action;
            // Collect form data
            const formData = new FormData(form);
            const urlParams = new URLSearchParams(formData);
            // Redirect to PayPal with the form data
            window.location.href = `${paypalUrl}?${urlParams.toString()}`;
          } else {
            reject(new Error("PayPal form not found in the response"));
          }
        } else {
          console.error("error", res?.message);
          reject(new Error("PayPal API error: " + res?.message));
        }
      });
    } catch (err) {
      console.error("PayPal payment error:", err);
      alert(`Payment error: ${err.message}`);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  // flutterwave payment method
  const handleFlutterwavePayment = async () => {
    try {
      const res = await flutterWaveApi({
        package_id: priceData?.id,
      });
      if (!res?.error) {
        const flutterWaveLink = res?.data?.data?.link;
        if (flutterWaveLink) {
          window.location.href = flutterWaveLink;
        } else {
          console.error("Error in flutterwave api:", res?.message);
        }
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleRazorpayPayment = async (Razorpay) => {
    try {
      const res = await createAllPaymentIntentApi({
        package_id: priceData?.id,
        platform_type: "web",
      });
      if (!res?.error) {
        const razorPayPaymentTransactionId =
          res?.data?.payment_intent?.payment_transaction_id;
        const razorPayOrderId = res?.data?.payment_intent?.id;
        const options = {
          key: razorKey,
          amount: priceData?.price * 100,
          order_id: razorPayOrderId,
          name: webSettings?.company_name,
          description: webSettings?.company_name,
          image: webSettings?.web_logo,
          handler: (res) => {
            router.push(`/${locale}`);
            toast.success("paymentSuccessful");
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.mobile,
          },
          notes: {
            address: user?.address,
            user_id: user?.id,
            package_id: priceData?.id,
          },
          theme: {
            color: webSettings?.system_color,
          },
          modal: {
            ondismiss: async function () {
              const res = await paymentTransactionFailApi({
                payment_transaction_id: razorPayPaymentTransactionId,
              });
              if (!res?.error) {
                console.error("Razorpay Payment Cancelled by User");
                toast.error(t("paymentCancelled"));
              } else {
                console.error(
                  "Error updating cancelled payment:",
                  res?.message,
                );
              }
            },
            escape: false,
          },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();

        rzpay.on("payment.failed", async function (response) {
          setShowRazorpayModal(false);
          const res = await paymentTransactionFailApi({
            payment_transaction_id: razorPayPaymentTransactionId,
          });
          if (!res?.error) {
            console.error("Razorpay Payment transaction failed");
          } else {
            console.error(
              "Error updating failed razorpay payment:",
              res?.message,
            );
          }
          console.error(response.error.description);
          toast.error(response.error.description);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createPaymentIntent,
    handlePayStackPayment,
    handlePaypalPayment,
    handleFlutterwavePayment,
    handleRazorpayPayment,
  };
};

export default PaymentHandlers;
