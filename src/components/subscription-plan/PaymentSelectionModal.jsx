import React, { useState, useEffect } from "react";
import {
  FaUniversity,
  FaArrowLeft,
  FaCheckCircle,
  FaCopy,
  FaCloudUploadAlt,
  FaFileAlt,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import {
  initiateBankTransferApi,
  uploadBankReceiptFileApi,
} from "@/api/apiRoutes";
import { useRouter } from "next/router";
import { useTranslation } from "../context/TranslationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Payment gateway icons - you may need to update these paths based on your actual asset structure
import stripeIcon from "@/assets/paymentIcons/stripe.png";
import razorpayIcon from "@/assets/paymentIcons/razorpay.png";
import paypalIcon from "@/assets/paymentIcons/paypal.png";
import paystackIcon from "@/assets/paymentIcons/paystack.png";
import flutterwaveIcon from "@/assets/paymentIcons/flutterwave.png";
import cardIcon from "@/assets/paymentIcons/card.jpg";

const PaymentSelectionModal = ({
  isOpen,
  onClose,
  onOnlinePayment,
  activePaymentGateway,
  bankDetails,
  bankTransferActive,
  hasOnlinePayment,
  packageId,
}) => {
  const router = useRouter();
  const t = useTranslation();
  const locale = router?.query?.locale;

  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Auto-show bank details if only bank transfer is active
  useEffect(() => {
    if (isOpen && bankTransferActive && !hasOnlinePayment) {
      setShowBankDetails(true);
      setSelectedPaymentMethod("bank");
    }
  }, [isOpen, bankTransferActive, hasOnlinePayment]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowBankDetails(false);
      setError(null);
      setTransactionId(null);
      setFile(null);
      setFileError("");
      setSelectedPaymentMethod(null);
    }
  }, [isOpen]);

  const onClosePaymentSelectionModal = () => {
    onClose();
    setShowBankDetails(false);
    setError(null);
    setTransactionId(null);
    setFile(null);
    setFileError("");
    setSelectedPaymentMethod(null);
  };

  const handleBankTransfer = () => {
    setSelectedPaymentMethod("bank");
    setShowBankDetails(true);
    setError(null);
  };

  const handleOnlinePayment = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    onOnlinePayment(paymentMethod);
  };

  const handleBack = () => {
    setShowBankDetails(false);
    setSelectedPaymentMethod(null);
    setError(null);
  };

  // Validate file upload
  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setFileError(
        t("invalidFileType") ||
        "Invalid file type. Please upload JPG, PNG, or PDF.",
      );
      return false;
    }

    if (file.size > maxSize) {
      setFileError(
        t("fileSizeTooLarge") ||
        "File size exceeds 5MB. Please upload a smaller file.",
      );
      return false;
    }

    setFileError("");
    return true;
  };

  // Initiate bank transfer and get transaction ID
  const handleInitiateBankTransfer = async () => {
    setIsUploading(true);
    setError(null);

    try {
      // First, initiate the bank transfer to get transaction ID
      const initiateRes = await initiateBankTransferApi({
        package_id: packageId,
        file: file,
      });

      if (!initiateRes?.error) {
        setIsUploading(false);
        toast.success(t("receiptUploadedSuccessfully"));
        onClose();
        router.push(`/${locale}/user/transaction-history`);
      } else {
        setIsUploading(false);
        const errorMessage =
          initiateRes?.message || t("bankTransferInitiationFailed");
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Bank transfer initiation error:", error);
      setIsUploading(false);
      const errorMessage = error?.message || t("receiptUploadFailed");
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copiedToClipboard"));
  };

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "application/pdf": [".pdf"],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 1,
      onDrop: (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          if (rejectedFiles[0].errors[0].code === "file-too-large") {
            setFileError(t("fileSizeTooLarge"));
          } else if (rejectedFiles[0].errors[0].code === "file-invalid-type") {
            setFileError(t("invalidFileType"));
          } else {
            setFileError(t("invalidFileType"));
          }
          return;
        }

        if (acceptedFiles.length > 0) {
          const selectedFile = acceptedFiles[0];
          if (validateFile(selectedFile)) {
            setFile(selectedFile);
          }
        }
      },
    });

  // Payment method options configuration
  const paymentMethods = [
    {
      id: "bank",
      name: t("bankTransfer") || "Bank Transfer",
      icon: <FaUniversity className="h-6 w-6 text-gray-700" />,
      available: bankTransferActive,
      onClick: handleBankTransfer,
      hasArrow: true,
    },
    {
      id: "razorpay",
      name: "Razorpay",
      icon: (
        <Image
          src={razorpayIcon}
          alt="Razorpay"
          width={24}
          height={24}
          className="object-contain"
        />
      ),
      available: hasOnlinePayment && activePaymentGateway === "razorpay",
      onClick: () => handleOnlinePayment("razorpay"),
    },
    {
      id: "paypal",
      name: "Paypal",
      icon: (
        <Image
          src={paypalIcon}
          alt="PayPal"
          width={24}
          height={24}
          className="object-contain"
        />
      ),
      available: hasOnlinePayment && activePaymentGateway === "paypal",
      onClick: () => handleOnlinePayment("paypal"),
    },
    {
      id: "paystack",
      name: "Paystack",
      icon: (
        <Image
          src={paystackIcon}
          alt="Paystack"
          width={24}
          height={24}
          className="object-contain"
        />
      ),
      available: hasOnlinePayment && activePaymentGateway === "paystack",
      onClick: () => handleOnlinePayment("paystack"),
    },
    {
      id: "stripe",
      name: "Stripe",
      icon: (
        <Image
          src={stripeIcon}
          alt="Stripe"
          width={24}
          height={24}
          className="object-contain"
        />
      ),
      available: hasOnlinePayment && activePaymentGateway === "stripe",
      onClick: () => handleOnlinePayment("stripe"),
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      icon: (
        <Image
          src={flutterwaveIcon}
          alt="Flutterwave"
          width={24}
          height={24}
          className="object-contain"
        />
      ),
      available: hasOnlinePayment && activePaymentGateway === "flutterwave",
      onClick: () => handleOnlinePayment("flutterwave"),
    },
  ];

  // Filter available payment methods
  const availablePaymentMethods = paymentMethods.filter(
    (method) => method.available,
  );

  // Render upload section
  const renderUploadSection = () => {
    if (!showBankDetails) return null;

    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("uploadPaymentReceipt")}
          </h3>

          {!file ? (
            <div
              {...getRootProps()}
              className={cn(
                "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300",
                "hover:primaryBorderColor hover:primaryBgLight border-gray-300 bg-gray-50",
                isDragActive && "primaryBorderColor bg-teal-50",
                fileError && "border-red-500 bg-red-50",
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-3">
                <div className="rounded-full bg-gray-100 p-3">
                  <FaCloudUploadAlt className="h-8 w-8 text-gray-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-base text-gray-700">
                    {t("dragDropUpload") || "Drag & drop here or"}{" "}
                    <span className="font-semibold underline">
                      {t("clickToChoose") || "click to choose a file."}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <FaFileAlt className="primaryColor h-6 w-6" />
                <span className="max-w-[150px] truncate text-sm font-medium text-gray-800 md:max-w-[300px]">
                  {file.name}
                </span>
              </div>
              <button
                className="text-red-500 transition-colors hover:text-red-700"
                onClick={() => setFile(null)}
                aria-label="Remove file"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          )}

          {fileError && <p className="text-sm text-red-600">{fileError}</p>}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClosePaymentSelectionModal}>
      <DialogContent className="mx-auto max-w-md rounded-2xl bg-white p-0 shadow-lg [&>button]:hidden">
        {/* Close button */}

        {!showBankDetails ? (
          // Payment Method Selection View
          <div className="space-y-6 p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center justify-between text-xl font-semibold text-gray-900">
                {t("selectPaymentMethod")}
                <div
                  onClick={onClosePaymentSelectionModal}
                  className="primaryBackgroundBg flex h-8 w-8 items-center justify-center rounded-lg p-1 transition-colors hover:cursor-pointer"
                >
                  <FaTimes className="h-4 w-4" />
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              {availablePaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  onClick={method.onClick}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center">
                      {method.icon}
                    </div>
                    <span className="font-medium text-gray-800">
                      {method.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {method.hasArrow ? (
                      <FaArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300">
                        {selectedPaymentMethod === method.id && (
                          <div className="primaryBg h-3 w-3 rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Bank Transfer Details View
          <div className="space-y-6 p-6">
            <DialogHeader className="space-y-2">
              <div className="flex items-center space-x-3">
                {hasOnlinePayment && (
                  <button
                    className="primaryBackgroundBg flex h-8 w-8 items-center justify-center rounded-lg p-1 transition-colors hover:cursor-pointer"
                    onClick={handleBack}
                  >
                    <FaArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {t("bankTransferDetails")}
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Bank Details Fields */}
            <div className="space-y-4">
              {bankDetails &&
                bankDetails.map((detail, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {detail.title}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={detail.value}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pr-10 font-mono text-sm text-gray-800"
                      />
                      <button
                        onClick={() => copyToClipboard(detail.value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded p-1 transition-colors hover:bg-gray-200"
                      >
                        <FaCopy className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Upload Section */}
            {renderUploadSection()}

            {/* Info Note */}
            <div className="blueBgLight flex items-start space-x-3 rounded-lg border p-4">
              <FaInfoCircle className="blueTextColor mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="blueTextColor text-sm">{t("bankTransferNote")}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Action Button - Only show Complete Payment when file is uploaded */}
            {file && (
              <Button
                className="primaryBg w-full rounded-lg py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                onClick={handleInitiateBankTransfer}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>{t("uploadingReceipt") || "Uploading..."}</span>
                  </div>
                ) : (
                  t("confirmPayment")
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSelectionModal;
