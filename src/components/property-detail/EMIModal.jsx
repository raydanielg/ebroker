import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import SemiDonutChart from "../semi-donut-chart/SemiDonutChart";
import CollapsibleTable from "../semi-donut-chart/CollapsibleTable";
import { formatPriceAbbreviated } from "@/utils/helperFunction";
import { useTranslation } from "../context/TranslationContext";
import { IoCloseOutline } from "react-icons/io5";

const EMIModal = ({
  show,
  handleClose,
  data,
  TotalEMIData,
  COLORS,
  totalEmiYearlyData,
  router,
  userCurrentId,
  setShowLoginModal,
}) => {
  const t = useTranslation();
  const { locale } = router?.query;
  const handleSubscribe = () => {
    if (userCurrentId) {
      router.push(`/${locale}/subscription-plan`);
    } else {
      Swal.fire({
        title: t("plzLogFirsttoAccess"),
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
          setShowLoginModal(true);
          handleClose();
        }
      });
    }
  };

  const EMIDataItem = ({ color = "", label = "", value = "" }) => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <div className={`mr-2 h-3 w-3 rounded-full ${color}`}></div>
          <span className="text-sm">{label}</span>
        </div>
        <span className="font-semibold">{value}</span>
      </div>
    );
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="!max-h-[90vh] w-full max-w-[95vw] overflow-y-auto p-0 sm:max-w-3xl md:max-w-4xl lg:max-w-5xl [&>button]:!hidden">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="flex items-center justify-between text-start text-lg font-semibold sm:text-xl">
            <div>{t("MLCEMIData")}</div>
            <div onClick={handleClose} className="hover:cursor-pointer">
              <IoCloseOutline className="h-6 w-6 text-gray-500 hover:cursor-pointer hover:text-black sm:h-7 sm:w-7" />
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            EMI Modal
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 py-6 sm:px-6">
          {data ? (
            <div className="rounded-lg bg-white">
              <div className="flex justify-center">
                <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
                  <SemiDonutChart
                    stroke={50}
                    data={TotalEMIData}
                    colors={COLORS}
                    totalEmiData={data}
                  />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                <EMIDataItem
                  color="bg-orange-500"
                  label={t("MonthlyEMI")}
                  value={formatPriceAbbreviated(data?.monthly_emi)}
                />
                <EMIDataItem
                  color="bg-indigo-500"
                  label={t("downPayment")}
                  value={formatPriceAbbreviated(data?.down_payment)}
                />
                <EMIDataItem
                  color="bg-teal-600"
                  label={t("PrincipalAmount")}
                  value={formatPriceAbbreviated(data?.principal_amount)}
                />
                <EMIDataItem
                  color="bg-gray-800"
                  label={t("InterestPayable")}
                  value={formatPriceAbbreviated(data?.payable_interest)}
                />
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              {t("NoDataAvailable")}
            </p>
          )}
        </div>

        <DialogFooter className="p-4">
          {totalEmiYearlyData && totalEmiYearlyData.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <CollapsibleTable data={totalEmiYearlyData} />
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-between gap-4 rounded-lg bg-blue-50 p-4 sm:flex-row sm:gap-0">
              <div className="text-center sm:text-left">
                <h4 className="font-medium text-gray-900">
                  {t("accessTable")}
                </h4>
                <p className="text-sm text-gray-500">{t("viewTable")}</p>
              </div>
              <Button
                onClick={handleSubscribe}
                className="w-full rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 sm:w-auto"
              >
                {t("subScribeNow")}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EMIModal;
