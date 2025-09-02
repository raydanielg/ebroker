import { useEffect, useState } from "react";
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
import { updatePropertyStatusApi } from "@/api/apiRoutes";
import toast from "react-hot-toast";


const ChangePropertyType = ({
    propertyId,
    propertyType,
    onStatusChange,
}) => {
    const t = useTranslation()
    const webSettings = useSelector(state => state.WebSetting?.data)

    const [status, setStatus] = useState(propertyType || "");

    // Get available options based on current property type
    const getStatusOptions = () => {
        switch (propertyType) {
            case 'sell':
                return [{ value: '2', label: t("sold") }];
            case 'rent':
                return [{ value: '3', label: t("rented") }];
            case 'rented':
                return [{ value: '1', label: t("rent") }];
            case 'sold':
                return [{ value: '0', label: t("sell") }];
            default:
                return [];
        }
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    }

    const handleSave = async () => {
        if (webSettings?.demo_mode === true) {
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
            return false;
        }

        try {
            const res = await updatePropertyStatusApi({
                property_id: propertyId,
                status: status
            })
            if (!res?.error) {
                toast.success(t(res?.message));
                onStatusChange?.();
            } else {
                toast.error(t(res?.message) || t("failedToUpdateStatus"));
            }
        } catch (error) {
            toast.error(t(error?.message) || t("failedToUpdateStatus"));
        }
    };
    // Only render the card if there are available options
    const statusOptions = getStatusOptions();
    statusOptions.unshift({ value: propertyType, label: t(propertyType) });
    if (statusOptions.length === 0) return null;

    return (
        <div className={"w-full rounded-2xl border bg-white mb-4"}>
            <div className="px-4 py-3 border-b">
                <h2 className="text-base font-extrabold blackTextColor">
                    {t("changePropertyType")}
                </h2>
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-normal secondryTextColor mb-2">
                        {t("status")}
                    </label>
                    <Select defaultValue={"0"} value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger
                            className="w-full !secondryTextColor bg-white border rounded-md h-10 focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Select Property Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem className="hover:!primaryBgLight hover:!secondryTextColor hover:cursor-pointer" key={option?.value} value={option?.value}>
                                    {option?.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full h-11 brandBg text-white font-medium rounded-md transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-90"
                    disabled={status === propertyType}
                >
                    {t("save")}
                </button>
            </div>
        </div>
    )
}

export default ChangePropertyType