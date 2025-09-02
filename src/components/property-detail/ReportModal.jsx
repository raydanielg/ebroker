"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/components/context/TranslationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { addReportApi, getReportReasonsApi } from "@/api/apiRoutes";

const ReportModal = ({
  open,
  handleReportModal,
  propertyId,
  setIsReported,
}) => {
  const t = useTranslation();
  const [reportReasons, setReportReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [reason, setReason] = useState("");

  const fetchReportReasons = async () => {
    try {
      setLoading(true);
      const res = await getReportReasonsApi();
      if (!res?.error) {
        setReportReasons(res?.data);
      }
    } catch (error) {
      console.error("Error fetching report reasons", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      fetchReportReasons();
    }
    return () => {
      setReportReasons([]);
      setLoading(false);
      setSelectedReason(null);
      setReason("");
    };
  }, [open]);

  const ReportSkeleton = () => {
    return (
      <div className="flex w-full flex-col gap-3">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="primaryBackgroundBg h-12 w-full animate-pulse rounded-md border p-3"
          >
            <div className=""></div>
          </div>
        ))}
      </div>
    );
  };

  const submitReport = async (e) => {
    e.preventDefault();
    if (selectedReason === null) {
      toast.error(t("plsSelectReason"));
      return;
    } else if (selectedReason === 0 && reason.trim() === "") {
      toast.error(t("plsWriteReason"));
      return;
    }
    try {
      const res = await addReportApi({
        reason_id: selectedReason === 0 ? null : selectedReason,
        other_message: selectedReason === 0 ? reason : null,
        property_id: propertyId,
      });
      if (!res?.error) {
        toast.success(t(res?.message));
        setIsReported(true);
        handleReportModal();
      } else {
        toast.error(t(res?.message));
        setIsReported(false);
      }
    } catch (error) {
      console.error("Error submitting report", error);
      toast.error(t(error?.message));
    }
  };
  const handleSelectReason = (reason) => {
    if (reason === "Other") {
      setSelectedReason(0);
    } else {
      setSelectedReason(reason?.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleReportModal}>
      <DialogContent className="!max-w-[300px] rounded-md p-0 sm:!max-w-md md:rounded-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between border-b p-4">
            <div className="text-xl font-bold">{t("reportProperty")}</div>
            <div
              className="primaryBackgroundBg leadColor flex h-9 w-9 items-center justify-center rounded-xl hover:cursor-pointer focus:outline-none"
              onClick={handleReportModal}
            >
              <AiOutlineClose size={22} />
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Report Property
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 max-h-[500px] overflow-y-auto md:max-h-full">
          <div className="secondryTextColor mb-2 text-base">{t("reasons")}</div>
          <div className="flex w-full flex-col gap-4">
            {loading ? (
              <ReportSkeleton />
            ) : reportReasons?.length > 0 ? (
              <>
                {reportReasons?.map((reason) => (
                  <div
                    key={reason?.id}
                    className={`${selectedReason === reason?.id ? "primaryCheckbox ring-1 ring-black" : ""} text-sm md:text-base secondryTextColor newBorder flex items-center justify-between rounded-lg px-2 py-2 md:py-3 transition-colors duration-300 hover:cursor-pointer md:rounded-2xl`}
                    onClick={() => handleSelectReason(reason)}
                  >
                    {reason?.translated_reason || reason?.reason}
                    <input
                      type="radio"
                      name="reportReason"
                      className="w-4 h-4 md:h-6 md:w-6"
                      value={reason?.id}
                      checked={selectedReason === reason?.id}
                      onChange={() => handleSelectReason(reason)}
                    />
                  </div>
                ))}
                <div
                  key={reason?.id}
                  className={`${selectedReason === 0 ? "primaryCheckbox ring-1 ring-black" : ""} text-sm md:text-base secondryTextColor newBorder flex justify-center rounded-lg  px-2 py-2 md:py-3 transition-colors duration-300 hover:cursor-pointer md:rounded-2xl`}
                  onClick={() => handleSelectReason("Other")}
                >
                  {t("other")}
                </div>
              </>
            ) : (
              <div>{t("noReportReasons")}</div>
            )}
          </div>
          {selectedReason === 0 && (
            <>
              <div className="secondryTextColor my-2 text-sm md:text-base">
                {t("writeReason")}
              </div>
              <div className="flex w-full flex-col">
                <input
                  type="text"
                  className="primaryBackgroundBg h-8 md:h-10 w-full rounded-md border px-3 py-2 focus:outline-none placeholder:text-sm"
                  placeholder={t("writeReasonPlaceholder")}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <div className={"flex w-full gap-2 p-3 justify-end md:p-4 border-t newBorderColor"}>
          <button
            className="blackTextColor rounded-lg px-4 py-3 text-sm md:text-base md:px-4 md:py-2 hover:brandBg hover:text-white"
            onClick={handleReportModal}
          >
            {t("cancel")}
          </button>
          <button
            className="brandBg rounded-lg px-4 py-3 text-sm md:text-base text-white md:px-4 md:py-2 hover:primaryBg"
            onClick={(e) => submitReport(e)}
          >
            {t("report")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
