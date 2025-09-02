"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  downloadPaymentReceiptApi,
  getUserTransactionDetailsApi,
} from "@/api/apiRoutes";
import { useSelector } from "react-redux";
import { useTranslation } from "../context/TranslationContext";
import { FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import CustomPagination from "@/components/ui/custom-pagination";
import { FaUpload } from "react-icons/fa";
import { getFormattedDate, isRTL, RejectionTooltip } from "@/utils/helperFunction";
import UploadFileReceiptModal from "../ui/upload-recepit-modal";

const UserTransactionHistory = () => {
  const t = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });
  const isRtl = isRTL();

  const activeLang = useSelector((state) => state.LanguageSettings.active_language);
  const renderStatusBadge = (status, t) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "approved":
        return (
          <div className="rounded-md bg-[#83B8071F] px-4 py-2 font-medium capitalize text-[#83B807]">
            {t("success")}
          </div>
        );
      case "review":
        return (
          <div className="rounded-md bg-[#0186D81F] px-4 py-2 font-medium capitalize text-[#0186D8]">
            {t("review")}
          </div>
        );
      case "pending":
        return (
          <div className="rounded-md bg-[#DB93051F] px-4 py-2 font-medium capitalize text-[#DB9305]">
            {t("pending")}
          </div>
        );
      case "rejected":
        return (
          <div className="rounded-md bg-[#DB3D261F] px-4 py-2 font-medium capitalize text-[#DB3D26]">
            {t("rejected")}
          </div>
        );
      case "failed":
        return (
          <div className="rounded-md bg-[#DB3D261F] px-4 py-2 font-medium capitalize text-[#DB3D26]">
            {t("failed")}
          </div>
        );
      default:
        return (
          <div className="rounded-md bg-[#808080] px-4 py-2 font-medium capitalize text-[#808080]">
            {status || "-"}
          </div>
        );
    }
  };

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [uploadFileReceiptModal, setUploadFileReceiptModal] = useState(false);

  const systemSettings = useSelector((state) => state?.WebSetting?.data);
  const currencySymbol = systemSettings?.currency_symbol;

  // Fetch transaction data
  const fetchTransactions = async (page = 1, filter = "all") => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsPageLoading(true);
    }

    try {
      const offset = (page - 1) * pagination.limit;
      const response = await getUserTransactionDetailsApi({
        offset: offset.toString(),
        limit: pagination.limit.toString(),
        payment_type: filter === "all" ? "" : filter,
      });

      setTransactions(response.data);
      setPagination({
        ...pagination,
        currentPage: page,
        totalPages: Math.ceil(response.total / pagination.limit),
        totalRecords: response.total,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(t("errorFetchingTransactions"));
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setIsPageLoading(true);
    fetchTransactions(page, paymentTypeFilter);
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setPaymentTypeFilter(value);
    fetchTransactions(1, value);
  };


  // Handle download invoice
  const handleDownloadInvoice = async (transaction) => {
    try {
      const response = await downloadPaymentReceiptApi({
        payment_transaction_id: transaction.id,
      });

      // Remove all <script> tags from the response
      const sanitizedHTML = response.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");

      // Popup window dimensions and position
      const width = 800;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const popup = window.open(
        "",
        "InvoicePopup",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        alert("Popup blocked. Please enable popups for this site.");
        return;
      }
      // Write sanitized HTML and script loader to popup
      popup.document.open();
      popup.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${transaction.id}</title>
          <meta charset="UTF-8" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        </head>
        <body>
          <div id="invoice-content" style="width: 794px; margin: 0 auto; padding: 0px 20px 0px 0px; box-sizing: border-box;">
            ${sanitizedHTML}      
          </div>    
            <script>
            window.onload = function () {
              const invoice = document.getElementById("invoice-content");

              const opt = {
                filename: "invoice-${transaction.id}.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
              };

              html2pdf()
                .set(opt)
                .from(invoice)
                .save()
                .then(() => {
                  setTimeout(() => {
                    window.close(); // Close popup after download
                  }, 1000);
                })
                .catch((error) => {
                  console.error("Download invoice error:", error);
                });
            };
          </script>
        </body>
      </html>
    `);
      popup.document.close();
    } catch (error) {
      console.error("Download invoice error:", error);
      toast.error(t("errorDownloadingInvoice"));
    }
  };



  // Handle upload receipt
  const handleUploadReceipt = (transaction) => {
    // Implementation will depend on your API
    setSelectedTransaction(transaction);
    setUploadFileReceiptModal(true);
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [activeLang]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h2 className="mb-4 text-2xl font-bold md:mb-0">
          {t("transactionHistory")}
        </h2>

        <div className="w-full md:w-64">
          <Select value={paymentTypeFilter} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("allPaymentTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allPaymentTypes")}</SelectItem>
              <SelectItem value="free">{t("free")}</SelectItem>
              <SelectItem value="online payment">
                {t("onlinePayment")}
              </SelectItem>
              <SelectItem value="bank transfer">{t("bankTransfer")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-center font-medium">
                    {t("ID")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("transactionId")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("orderId")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("date")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("price")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("paymentType")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("paymentMethod")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("status")}
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    {t("invoice")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 9 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex} className="py-4">
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : transactions?.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <TableRow key={transaction.id || index}>
                      <TableCell className="text-center">
                        {transaction.id}
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction.transaction_id || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction.order_id || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {getFormattedDate(transaction.created_at, t)}
                      </TableCell>
                      <TableCell className="text-center">
                        {currencySymbol}
                        {transaction.amount}
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction?.payment_type === "free " ?
                          t("free")
                          : transaction?.payment_type === "online payment" ?
                            t("onlinePayment") :
                            transaction?.payment_type === "bank transfer" ?
                              t("bankTransfer") :
                              null}
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction.payment_gateway || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {renderStatusBadge(transaction.payment_status, t)}

                          {transaction.payment_status === "rejected" &&
                            transaction.reject_reason && (
                              <RejectionTooltip
                                reason={transaction.reject_reason}
                                t={t}
                                side={isRtl ? "right" : "left"}
                              />
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction.payment_status === "success" ? (
                          <div className="flex items-center justify-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="primaryBgLight border primaryBorderColor primaryColor flex h-8 w-8 items-center justify-center rounded-md"
                                    onClick={() => {
                                      handleDownloadInvoice(transaction);
                                    }}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t("downloadInvoice")}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : transaction.payment_status === "pending" ||
                          transaction.payment_status === "rejected" ? (
                          <div className="flex items-center justify-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="primaryBgLight border primaryBorderColor primaryColor flex h-8 w-8 items-center justify-center rounded-md"
                                    onClick={() =>
                                      handleUploadReceipt(transaction)
                                    }
                                  >
                                    <FaUpload className="h-4 w-4 " />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {transaction.payment_status === "pending"
                                      ? t("uploadReceipt")
                                      : t("reuploadReceipt")}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="py-4 text-center">
                      {t("noDataAvailable")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div
          className={`transition-opacity duration-200 ${isPageLoading ? "opacity-50" : "opacity-100"}`}
        >
          {!isLoading && transactions?.length > pagination.limit && (
            <CustomPagination
              currentPage={pagination.currentPage}
              totalItems={pagination.totalRecords}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              isLoading={isPageLoading}
              translations={{
                showing: t("showing"),
                to: t("to"),
                of: t("of"),
                entries: t("entries"),
              }}
            />
          )}
        </div>
      </Card>

      <UploadFileReceiptModal
        open={uploadFileReceiptModal}
        onClose={() => setUploadFileReceiptModal(false)}
        transaction={selectedTransaction}
        onSuccess={() =>
          fetchTransactions(pagination.currentPage, paymentTypeFilter)
        }
      />
    </div>
  );
};

export default UserTransactionHistory;
