// MortgageLoanCalculator.js
import { checkPackageLimitApi, mortgageCalculationApi } from "@/api/apiRoutes";
import { PackageTypes } from "@/utils/checkPackages/packageTypes";
import { formatPriceAbbreviated, showLoginSwal } from "@/utils/helperFunction";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "../context/TranslationContext";
import EMIModal from "./EMIModal";

const MortgageLoanCalculator = ({ propertyDetails, showLoginModal, setShowLoginModal }) => {
  const t = useTranslation();
  const webSettings = useSelector((state) => state.WebSetting?.data);
  const router = useRouter();
  const isLoggedIn = useSelector((state) => {
    if (!state || !state.User) {
      return null;
    }
    return state.User;
  });

  const CurrencySymbol = webSettings?.currency_symbol || "$";
  const userCurrentId = isLoggedIn?.data?.id;
  const themeColor = webSettings?.system_color;

  const minRateInterest = 1;
  const maxRateInterest = 100;
  const maxInterestYears = 30;

  const [interestRate, setInterestRate] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [downPaymentType, setDownPaymentType] = useState("price");
  const [years, setYears] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [totalEmiData, setTotalEmiData] = useState();
  const [totalEmiYearlyData, setTotalEmiYearlyData] = useState([]);

  const handleInputChangeforInterest = (event) => {
    let value = parseFloat(event.target.value.trim()) || 0;
    if (value > maxRateInterest) {
      toast.error(`${t("interestRate")} ${t("cannotExceed")} ${maxRateInterest}%`);
      value = maxRateInterest;
    }
    setInterestRate(value);
  };

  const handleInputChangeforDownPayment = (event) => {
    let value = parseFloat(event.target.value.trim()) || 0;

    if (downPaymentType === "price") {
      if (value > propertyDetails?.price) {
        toast.error(
          `${t("downPayment")} ${t("cannotExceed")} ${t("propertyPriceOf")} ${CurrencySymbol}${propertyDetails.price}`,
        );
        value = propertyDetails.price;
      }
    } else if (downPaymentType === "rate") {
      if (value > 100) {
        toast.error(`${t("downPaymentRate")} ${t("cannotExceed")} 100%`);
        value = 100;
      }
    }

    setDownPayment(value);
  };

  const calculatedDownPayment =
    downPaymentType === "price"
      ? downPayment
      : (downPayment / 100) * propertyDetails?.price;

  const handleInputChangeforYear = (event) => {
    let value = parseInt(event.target.value.trim(), 10) || 1;
    if (value > maxInterestYears) {
      toast.error(`${t("loanTerm")} ${t("cannotExceed")} ${maxInterestYears} ${t("years")}`);
      value = maxInterestYears;
    } else if (value < 1) {
      toast.error(`${t("loanTerm")} ${t("mustBeAtLeast")} 1 ${t("year")}`);
      value = 1;
    }
    setYears(value);
  };

  const fetchLoanCalculation = async (isFeatureAvailable) => {
    try {
      const res = await mortgageCalculationApi({
        loan_amount: propertyDetails?.price,
        down_payment: calculatedDownPayment > 0 ? calculatedDownPayment : "",
        interest_rate: interestRate,
        loan_term_years: years,
        show_all_details: isFeatureAvailable ? 1 : "",
      });
      if (!res?.error) {
        setTotalEmiData(res.data.main_total);
        setTotalEmiYearlyData(res.data.yearly_totals);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching loan calculation:", error);
    }
  };

  const handleCalculate = async () => {
    if (!userCurrentId) {
      showLoginSwal("oops", "plzLogFirsttoAccess", () => {
        setShowLoginModal(true)
      }, t)
      return;
    }
    if (
      downPaymentType === "price" &&
      (downPayment < 0 || downPayment >= propertyDetails?.price)
    ) {
      toast.error(
        `${t("downPayment")} ${t("shouldBeLessThan")} ${CurrencySymbol}${propertyDetails.price}`,
      );
      return;
    }

    if (downPaymentType === "rate" && (downPayment < 0 || downPayment > 100)) {
      toast.error(`${t("downPaymentRateShouldBeBetween0And100")}`);
      return;
    }

    if (interestRate < minRateInterest || interestRate > maxRateInterest) {
      toast.error(
        `${t("interestRate")} ${t("shouldBeBetween")} ${minRateInterest}% ${t("and")} ${maxRateInterest}%`,
      );
      return;
    }

    if (years < 1 || years > maxInterestYears) {
      toast.error(
        `${t("loanTerm")} ${t("shouldBeBetween")} 1 ${t("and")} ${maxInterestYears} ${t("years")}`,
      );
      return;
    }

    try {
      const res = await checkPackageLimitApi({
        type: PackageTypes.MORTGAGE_CALCULATOR_DETAIL,
      });

      const { feature_available } = res?.data;
      fetchLoanCalculation(feature_available);
    } catch (error) {
      console.error("Error in package limit check:", error);
      toast.error(t("unexpectedErrorOccurred"));
    }
  };

  const TotalEMIData = [
    { name: "Principal Amount", value: totalEmiData?.principal_amount },
    { name: "Interest Payable", value: totalEmiData?.payable_interest },
  ];

  const COLORS = [themeColor, "#282f39"];

  return (
    <div className="cardBg newBorder flex flex-col gap-4  border rounded-2xl">
      <div className="blackTextColor border-b p-5 text-base font-bold md:text-lg">
        {t("MLC")}
      </div>
      <div className="px-5">
        <p className="blackTextColor text-sm font-semibold">
          {t("propertyLoanAmount")}
        </p>
        <p className="primaryColor text-lg font-bold">
          {formatPriceAbbreviated(propertyDetails?.price)}
        </p>
      </div>
      <div className="flex flex-col gap-4 px-5 pb-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="downPayment" className="text-sm font-medium">
            {t("downPayment")}
          </label>
          <div className="flex min-h-12">
            <span className="blackBgColor primaryTextColor flex min-w-[72px] items-center justify-center rounded-bl rounded-tl px-4 text-base font-bold">
              {downPaymentType === "price" ? CurrencySymbol : "%"}
            </span>
            <input
              id="downPayment"
              type="number"
              min={0}
              className="cardBorder primaryBackgroundBg placeholder:brandColor w-full px-4 py-2 placeholder:text-xs focus:outline-none sm:placeholder:text-sm md:placeholder:text-base"
              placeholder={`${t("EnterDownPayment")} ${downPaymentType === "rate" ? t("rate") : t("price")
                }`}
              value={downPayment}
              max={propertyDetails?.price}
              onChange={(e) => handleInputChangeforDownPayment(e)}
            />
            <select
              name="downPaymentCurrency"
              className="cardBorder flex items-center rounded-br rounded-tr px-3 focus:outline-none"
              value={downPaymentType}
              onChange={(e) => setDownPaymentType(e.target.value)}
            >
              <option value="price">{CurrencySymbol}</option>
              <option value="rate">%</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="interestRate"
            className="blackTextColor text-sm font-medium"
          >
            {t("interestRate")}
          </label>
          <div className="flex min-h-12">
            <span className="blackBgColor primaryTextColor flex min-w-[72px] items-center justify-center rounded-bl rounded-tl px-4 text-base font-bold">
              %
            </span>
            <input
              type="number"
              min={minRateInterest}
              id="interestRate"
              className="cardBorder primaryBackgroundBg placeholder:brandColor w-full rounded-e px-4 py-2 placeholder:text-xs focus:outline-none sm:placeholder:text-sm md:placeholder:text-base"
              placeholder={t("enterIntrestRate")}
              value={interestRate}
              onChange={handleInputChangeforInterest}
              max={maxRateInterest}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="loanTenure"
            className="blackTextColor text-sm font-medium"
          >
            {t("tenures")}
          </label>
          <div className="flex min-h-12">
            <span className="blackBgColor primaryTextColor flex min-w-[72px] items-center justify-center rounded-bl rounded-tl px-4 text-base font-bold">
              {t("yrs")}
            </span>
            <input
              type="number"
              id="loanTenure"
              className="cardBorder primaryBackgroundBg placeholder:brandColor w-full rounded-e px-4 py-2 placeholder:text-xs focus:outline-none sm:placeholder:text-sm md:placeholder:text-base"
              placeholder={t("enterYears")}
              value={years}
              onChange={handleInputChangeforYear}
              min={1}
              max={maxInterestYears}
            />
          </div>
        </div>
        <div>
          <button
            onClick={handleCalculate}
            className="brandBg primaryTextColor w-full rounded-lg py-3 text-sm font-medium"
          >
            {t("calculate")}
          </button>
        </div>
      </div>
      {showModal && (
        <EMIModal
          show={showModal}
          TotalEMIData={TotalEMIData}
          data={totalEmiData}
          handleClose={() => setShowModal(false)}
          COLORS={COLORS}
          totalEmiYearlyData={totalEmiYearlyData}
          router={router}
          userCurrentId={userCurrentId}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
        />
      )}
      {/* {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )} */}
    </div>
  );
};

export default MortgageLoanCalculator;
