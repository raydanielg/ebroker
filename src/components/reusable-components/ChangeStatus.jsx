import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "../context/TranslationContext";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import {
  changeProjectStatusApi,
  changePropertyStatusApi,
} from "@/api/apiRoutes";
import toast from "react-hot-toast";

const ChangeStatus = ({
  id,
  type = "property", // 'property' or 'project'
  initialStatus = "Active",
  onStatusChange,
  fetchDetails,
}) => {
  const t = useTranslation();
  const webSettings = useSelector((state) => state.WebSetting?.data);

  const [status, setStatus] = useState(initialStatus);

  // Status options
  const statusOptions = [
    {
      label: t("active"),
      value: "Active",
    },
    {
      label: t("deactive"),
      value: "Deactive",
    },
  ];

  // Check for demo mode
  const checkDemoMode = () => {
    if (webSettings?.demo_mode) {
      Swal.fire({
        title: t("opps"),
        text: t("notAllowdDemo"),
        icon: "warning",
        showCancelButton: false,
        customClass: {
          confirmButton: "Swal-buttons",
        },
        confirmButtonText: t("ok"),
      });
      return true;
    }
    return false;
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setStatus(value);
  };

  // Handle save
  // Handle status change
  const handleSave = async () => {
    if (checkDemoMode()) return;

    const newStatus = status === "Active" ? 1 : 0;
    if (type === "project") {
      try {
        const res = await changeProjectStatusApi({
          project_id: id,
          status: newStatus,
        });
        if (!res?.error) {
          toast.success(t(res?.message));
          onStatusChange?.();
          fetchDetails();
        } else {
          toast.error(t(res?.message) || t("failedToUpdateStatus"));
        }
      } catch (error) {
        console.error("Failed to update project status:", error);
        toast.error(t(error?.message) || t("failedToUpdateStatus"));
      }
    } else {
      try {
        const res = await changePropertyStatusApi({
          property_id: id,
          status: newStatus,
        });
        if (!res?.error) {
          toast.success(t(res?.message));
          onStatusChange?.();
          fetchDetails();
        } else {
          toast.error(t(res?.message) || t("failedToUpdateStatus"));
        }
      } catch (error) {
        console.error("Failed to update property status:", error);
        toast.error(t(error?.message) || t("failedToUpdateStatus"));
      }
    }
  };

  return (
    <div className={"mb-4 w-full rounded-2xl border bg-white"}>
      <div className="border-b px-4 py-3">
        <h2 className="blackTextColor text-base font-extrabold">
          {type === "project"
            ? t("changeProjectStatus")
            : t("changePropertyStatus")}
        </h2>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <label
            htmlFor="status"
            className="secondryTextColor mb-2 block text-sm font-normal"
          >
            {t("status")}
          </label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="!secondryTextColor h-10 w-full rounded-md border bg-white focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem
                  className="hover:!primaryBgLight hover:!secondryTextColor hover:cursor-pointer"
                  key={option?.value}
                  value={option?.value}
                >
                  {option?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={handleSave}
          className="brandBg h-11 w-full rounded-md font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-90"
          disabled={status === initialStatus}
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
};

export default ChangeStatus;
