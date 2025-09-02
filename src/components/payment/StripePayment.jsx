import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm.jsx"; // Import the StripePaymentForm component
import { loadStripeApiKey } from "@/utils/helperFunction";
import { useTranslation } from "../context/TranslationContext.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.jsx";
import { paymentTransactionFailApi } from "@/api/apiRoutes";
import { IoMdClose } from "react-icons/io";

const stripeLoadKey = loadStripeApiKey();
const stripePromise = loadStripe(stripeLoadKey);

const StripePayment = ({
  clientKey,
  open,
  setOpen,
  currency,
  payment_transaction_id,
}) => {
  const t = useTranslation();
  const options = {
    clientSecret: clientKey,
    shipping: null,
    appearance: {
      theme: "stripe",
    },
  };

  const handleClose = async () => {
    try {
      // Handle failed payment
      setOpen(false); // Close the modal
      const res = await paymentTransactionFailApi({
        payment_transaction_id: payment_transaction_id,
      });
      if (!res?.error) {
        console.error("Payment transaction failed");
      } else {
        console.error("Error payment transaction failed :", res?.error);
      }
    } catch (err) {
      console.error(
        "Catch Segment! Error in payment transaction failed :",
        res?.error,
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex w-full items-center justify-between border-b p-3 font-bold sm:p-3 md:p-4">
            <div>{t("payWithStripe")}</div>
            <IoMdClose
              size={20}
              onClick={handleClose}
              className="hover:cursor-pointer"
            />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Stripe Payment Form
          </DialogDescription>
        </DialogHeader>
        {clientKey && (
          <Elements stripe={stripePromise} options={options}>
            <StripePaymentForm
              currency={currency}
              open={open}
              setOpen={setOpen}
              clientKey={clientKey}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default StripePayment;
