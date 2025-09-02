"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "../context/TranslationContext";
import { AiOutlineClose } from "react-icons/ai";

const unitData = {
    squareFeet: {
        name: "squareFeet",
        convertFactor: 1,
    },
    squareMeter: {
        name: "squareMeter",
        convertFactor: 0.092903,
    },
    acre: {
        name: "acre",
        convertFactor: 0.00002295,
    },
    hectare: {
        name: "hectare",
        convertFactor: 0.000009,
    },
    gaj: {
        name: "gaj",
        convertFactor: 0.112188,
    },
    bigha: {
        name: "bigha",
        convertFactor: 0.000037,
    },
    cent: {
        name: "cent",
        convertFactor: 0.002296,
    },
    katha: {
        name: "katha",
        convertFactor: 0.000735,
    },
    guntha: {
        name: "guntha",
        convertFactor: 0.0009182,
    },
};

const AreaConverter = ({ isOpen, onClose }) => {
    const t = useTranslation();
    const [value, setValue] = useState("");
    const [fromUnit, setFromUnit] = useState("squareFeet");
    const [toUnit, setToUnit] = useState("squareMeter");
    const [convertedValue, setConvertedValue] = useState("");

    const handleValueChange = (event) => {
        setValue(event.target.value);
        setConvertedValue("");
    };

    const handleFromUnitChange = (unitValue) => {
        setFromUnit(unitValue);
        setConvertedValue("");
    };

    const handleToUnitChange = (unitValue) => {
        setToUnit(unitValue);
        setConvertedValue("");
    };

    const convertValue = () => {
        if (!value || isNaN(value)) return;

        const fromFactor = unitData[fromUnit].convertFactor;
        const toFactor = unitData[toUnit].convertFactor;

        if (fromFactor && toFactor) {
            const converted = (parseFloat(value) / fromFactor) * toFactor;
            // Round to a reasonable number of decimal places based on the magnitude
            const roundedValue = converted < 0.01 ?
                converted.toFixed(6) :
                converted < 1 ?
                    converted.toFixed(4) :
                    converted.toFixed(2);

            setConvertedValue(roundedValue);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="[&>button]:hidden p-0">
                <DialogHeader className="flex flex-row justify-between items-center border-b p-4">
                    <DialogTitle className="text-2xl font-medium">{t("areaConverter")}</DialogTitle>
                    <AiOutlineClose
                        className="primaryBackgroundBg leadColor font-bold rounded-xl h-6 w-6 flex-shrink-0 p-1 md:p-2 hover:cursor-pointer sm:h-7 sm:w-7 md:h-10 md:w-10"
                        onClick={onClose}
                    />
                    <DialogDescription className="sr-only">
                        Area Converter
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 p-4">
                    <div>
                        <h4 className="text-2xl font-medium">{t("convertArea")}</h4>
                        <p className="text-left text-base font-light secondryTextColor">{t("desiredUnits")}</p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="w-full md:w-2/3 space-y-2">
                            <label htmlFor="from-value" className="block text-sm md:text-base font-medium">
                                {t("from")}:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="from-value"
                                    type="number"
                                    value={value}
                                    onChange={handleValueChange}
                                    placeholder={t("enterTheValue")}
                                    min="0"
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = 0;
                                        }
                                    }}
                                    className="areaConverterInput primaryBackgroundBg h-[5vh] w-full outline-none rounded-md px-2 py-2 text-sm md:text-base"
                                />
                                <Select value={fromUnit} onValueChange={handleFromUnitChange}>
                                    <SelectTrigger className="w-full primaryBackgroundBg secondryTextColor h-[5vh] sm:min-w-[120px] outline-none focus:ring-0 text-sm md:text-base" id="from-unit">
                                        <SelectValue placeholder={unitData[fromUnit].name} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(unitData).map((unitKey) => (
                                            <SelectItem key={unitKey} value={unitKey}>
                                                {t(unitData[unitKey].name)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 space-y-2">
                            <label htmlFor="to-unit" className="block text-sm md:text-base font-medium">
                                {t("to")}:
                            </label>
                            <Select value={toUnit} onValueChange={handleToUnitChange}>
                                <SelectTrigger className="w-full primaryBackgroundBg secondryTextColor h-[5vh] sm:min-w-[120px] outline-none focus:ring-0 text-sm md:text-base" id="to-unit">
                                    <SelectValue placeholder={unitData[toUnit].name} />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(unitData).map((unitKey) => (
                                        <SelectItem key={unitKey} value={unitKey}>
                                            {t(unitData[unitKey].name)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {convertedValue && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 rounded-md text-xl bg-teal-50 border primaryBorderColor text-center primaryCatBg text-teal-700"
                        >
                            <span className="font-medium">
                                {value} {t(unitData[fromUnit].name)} = {convertedValue} {t(unitData[toUnit].name)}
                            </span>
                        </motion.div>
                    )}
                </div>

                <DialogFooter className="sm:justify-center p-4 border-t">
                    <Button
                        onClick={convertValue}
                        className="w-full text-base brandBg py-4 min-h-12 rounded-lg hover:primaryBg text-white"
                    >
                        {t("convert")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AreaConverter;
