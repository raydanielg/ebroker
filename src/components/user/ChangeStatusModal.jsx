"use client";
import { useEffect, useState } from 'react';
import { RiCloseCircleLine } from "react-icons/ri";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useTranslation } from '@/components/context/TranslationContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import { updatePropertyStatusApi } from '@/api/apiRoutes';

const ChangeStatusModal = ({ open, onOpenChange, propertyId, propertyType, onStatusChanged }) => {
    const t = useTranslation();
    const [changeStatusType, setChangeStatusType] = useState();

    useEffect(() => {
        if (propertyType === "sell") {
            setChangeStatusType(2);
        } else if (propertyType === "rent") {
            setChangeStatusType(3);
        } else if (propertyType === "rented") {
            setChangeStatusType(1);
        }
    }, [propertyType]);

    const handleChangeStatus = async () => {
        try {
            const res = await updatePropertyStatusApi({
                property_id: propertyId,
                status: changeStatusType,
            });

            if (!res?.error) {
                if (onStatusChanged) onStatusChanged();
                onOpenChange(false);
                toast.success(t(res.message) || t("statusUpdatedSuccessfully"));
            } else {
                toast.error(t(res?.message) || t("failedToUpdateStatus"));
            }
        } catch (error) {
            console.error(error);
            toast.error(t(error?.message) || t("failedToUpdateStatus"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md [&>button]:hidden p-0">
                <DialogHeader className="flex flex-row justify-between items-center border-b p-4">
                    <DialogTitle className="text-2xl">{t("changeStatus")}</DialogTitle>
                    <button className="h-9 w-9 flex items-center justify-center rounded-full primaryTextColor secondaryTextBg cursor-pointer focus:outline-none">
                        <RiCloseCircleLine
                            className="h-7 w-7"
                            onClick={() => onOpenChange(false)}
                        />
                        <span className="sr-only">Close</span>
                    </button>
                    <DialogDescription className="sr-only">
                        Change Status
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between gap-8 p-5 mx-auto">
                    {propertyType === "sell" ? (
                        <>
                            <div className="primaryTextColor primaryBg px-7 py-2.5 rounded-lg text-lg">
                                {t("sell")}
                            </div>
                            <FaAngleDoubleRight size={25} className="text-black" />
                            <div className="primaryTextColor primaryBg px-7 py-2.5 rounded-lg text-lg">
                                {t("sold")}
                            </div>
                        </>
                    ) : propertyType === "rent" ? (
                        <>
                            <div className="primaryTextColor primaryBg px-7 py-2.5 rounded-lg text-lg">
                                {t("rent")}
                            </div>
                            <FaAngleDoubleRight size={25} className="text-black" />
                            <div className="primar primaryBg px-7 py-2.5 rounded-lg text-lg">
                                {t("rented")}
                            </div>
                        </>
                    ) : propertyType === "rented" ? (
                        <>
                            <div className="primar primaryBg px-7 py-2.5 rounded-lg text-lg">
                                {t("rented")}
                            </div>
                            <FaAngleDoubleRight size={25} className="text-black" />
                            <div className="primaryTextColor primaryBg px-7 py-2.5 rounded-lg text-lg">
                                {t("rent")}
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="p-4 flex justify-between sm:justify-between">
                    <DialogClose asChild>
                        <button className="border border-black p-2.5 w-1/2 m-1 rounded-md">
                            {t("cancel")}
                        </button>
                    </DialogClose>
                    <button
                        className="primaryBg text-white p-2.5 w-1/2 m-1 rounded-md"
                        onClick={handleChangeStatus}
                    >
                        {t("change")}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeStatusModal; 