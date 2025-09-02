import {
  forgotPasswordApi,
  getOTPApi,
  userRegisterApi,
  userSignup,
  verifyOTP,
} from "@/api/apiRoutes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setAuth, setJWTToken } from "@/redux/slices/authSlice";
import FirebaseData from "@/utils/Firebase";
import { handleFirebaseAuthError, isRTL } from "@/utils/helperFunction";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle, FcPhoneAndroid } from "react-icons/fc";
import { RiMailSendFill } from "react-icons/ri";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import CustomLink from "../context/CustomLink";
import { useTranslation } from "../context/TranslationContext";
import OTPInput from "react-otp-input";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import ButtonLoader from "../ui/loaders/ButtonLoader";

// Reusable Auth Button
const AuthButton = ({ onClick, text, icon }) => {
  return (
    <button
      type="button"
      className="btnBorder flex w-full items-center justify-center gap-2 rounded-lg p-2 text-sm transition-all sm:gap-[10px] sm:p-[10px] sm:text-base md:text-base"
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </button>
  );
};
// Reusable Auth Footer
const AuthFooter = () => {
  const t = useTranslation();
  return (
    <div className="text-center text-xs sm:text-sm md:text-base">
      <span>{t("byClick")} </span>
      <span className="inline-flex flex-wrap justify-center">
        <CustomLink href={"#"} className="primaryColor hover:underline">
          {t("terms&Conditions")}
        </CustomLink>
        <span className="mx-1">{t("and")}</span>
        <CustomLink href={"#"} className="primaryColor hover:underline">
          {t("privacyPolicy")}
        </CustomLink>
      </span>
    </div>
  );
};

// Forgot Password Form/Modal
const ForgotPassword = ({ onSubmit, onBackToLogin, showLoader }) => {
  const t = useTranslation();
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };
  const [email, setEmail] = useState("");
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full flex-col justify-center gap-3 p-3 sm:gap-4 sm:p-3 md:p-4">
        <div className="mt-5 flex flex-col gap-2 text-base sm:text-lg">
          <h4 className="text-base font-medium md:text-2xl">
            {t("forgotPassword")}
          </h4>
          <div className="secondryTextColor font-light">
            {t("enterEmailForReset")}
          </div>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label
            htmlFor="forgot-email"
            className="text-base font-medium sm:text-lg"
          >
            {t("email")}
            <span className="ms-1 text-red-600">*</span>
          </label>
          <input
            type="email"
            id="forgot-email"
            name="forgot-email"
            className="primaryBackgroundBg w-full rounded border-none p-2 text-base outline-none sm:p-[10px] md:text-base"
            placeholder={t("enterYourEmail")}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="brandBg primaryTextColor w-full rounded p-2 text-base transition-all hover:primaryBg sm:p-[10px] sm:text-lg md:text-base"
          disabled={showLoader}
        >
          {showLoader ? (
            <ButtonLoader />
          ) : (
            t("submit")
          )}
        </button>
        <div
          className="primaryColor inline-flex items-center justify-center text-sm transition-opacity hover:cursor-pointer hover:underline hover:opacity-80 md:text-base"
          onClick={onBackToLogin}
        >
          {t("backtoLogin")}
        </div>
      </div>
    </form>
  );
};

// Phone Login Form
const PhoneLogin = ({
  value,
  setValue,
  onSignUp,
  ShowGoogleLogin,
  handleEmailLoginshow,
  CompanyName,
  handleGoogleSignup,
  ShowPhoneLogin,
  showLoader,
}) => {
  const t = useTranslation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSignUp(e);
      }}
    >
      <div className="flex w-full flex-col justify-center gap-3 p-3 sm:gap-6 sm:p-3 md:p-4">
        <div className="flex flex-col text-base sm:text-lg">
          <h4 className="text-base font-medium md:text-2xl">
            {t("enterMobile")}
          </h4>
          <div className="secondryTextColor text-sm font-light md:text-base">
            {t("sendCode")}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="phoneNumber"
            className="text-sm font-medium sm:text-base"
          >
            {t("phoneNumber")}
            <span className="ms-1 text-red-600">*</span>
          </label>
          <div className="mobile-number">
            <PhoneInput
              defaultCountry={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
              international
              value={value}
              onChange={setValue}
              className="custom-phone-input rtl:direction-reverse"
              countrySelectProps={{
                arrowComponent: ({ children, ...props }) => (
                  <span {...props} className="custom-arrow">
                    <IoMdArrowDropdown size={16} />
                  </span>
                )
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className="brandBg primaryTextColor w-full rounded-lg p-2 text-sm transition-all hover:primaryBg sm:p-[10px] sm:text-base md:text-base"
          disabled={showLoader}
        >
          {showLoader ? (
            <ButtonLoader />
          ) : (
            t("continue")
          )}
        </button>
        {ShowGoogleLogin && (
          <div className="flex items-center justify-between ">
            <hr className="secondryTextColor flex-grow border-0 border-t-[1.5px] border-dashed sm:border-t-[1.9px]" />
            <div className="primaryBackgroundBg mx-2 rounded-full p-1 text-sm font-medium capitalize sm:mx-4 sm:p-2 md:p-3">
              {t("OR")}
            </div>
            <hr className="secondryTextColor flex-grow border-0 border-t-[1.5px] border-dashed sm:border-t-[1.9px]" />
          </div>
        )}
        <AuthButton
          onClick={handleEmailLoginshow}
          icon={<RiMailSendFill size={25} />}
          text={t("CWE")}
        />
        {ShowGoogleLogin && (
          <>
            {!ShowPhoneLogin && (
              <div className="modal-body-heading">
                <h4>
                  {t("loginTo")} {CompanyName}
                </h4>
                <span>{t("connectWithGoogle")}</span>
              </div>
            )}
            <AuthButton
              onClick={handleGoogleSignup}
              icon={
                <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              }
              text={t("CWG")}
            />
          </>
        )}
      </div>
    </form>
  );
};

// OTP Form
const OTPForm = ({
  phonenum,
  otp,
  setOTP,
  handleConfirm,
  showLoader,
  isCounting,
  timeLeft,
  formatTime,
  handleResendOTP,
  wrongNumber,
  wrongEmail,
  isEmailOtpEnabled,
  emailOtp = "", // Initialize as a string
  setEmailOtp,
  handleEmailOtpVerification,
  emailTimeLeft,
  isEmailCounting,
  email,
}) => {
  const t = useTranslation();

  // OTP component will handle all input, focus, and key events automatically
  return (
    <form>
      <div className="flex w-full flex-col justify-center gap-3 p-3 sm:gap-6 sm:p-3 md:p-4">
        <div className="flex flex-col text-base sm:text-lg">
          <h4 className="text-base font-medium md:text-xl">
            {t("otpVerification")}
          </h4>
          <span className="secondryTextColor text-sm font-light md:text-base">
            {email ? t("enterOtpSentToEmail") : t("enterOtp")} <span className="primaryColor text-base font-medium">{email ? email : phonenum}</span>
          </span>

          <span
            className="brandColor w-fit text-sm font-semibold hover:cursor-pointer hover:underline"
            onClick={email ? wrongEmail : wrongNumber}
          >
            {email ? t("wrongEmail") : t("wrongNumber")}
          </span>
        </div>
        <div className="flex flex-col gap-1 sm:gap-6">
          {/* OTP Input Fields */}
          <div className="userInput flex flex-wrap items-center justify-between gap-1 md:justify-center md:gap-5">
            <OTPInput
              value={isEmailOtpEnabled ? emailOtp : otp}
              onChange={isEmailOtpEnabled ? setEmailOtp : setOTP}
              numInputs={6}
              shouldAutoFocus
              renderInput={(props) => (
                <input
                  {...props}
                  autoComplete="one-time-code"
                  className="!w-10 !h-10 md:!w-[62px] md:!h-[62px] flex justify-center items-center !text-center rounded-lg border border-[--border-color] primaryBackgroundBg relative transition-all 
                  focus:outline-none focus:border-[--primary-color] focus:shadow-[0_0_5px_rgba(135,199,204,0.5)]"
                />
              )}
              containerStyle="w-full flex justify-between md:justify-center gap-2 md:gap-5"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  isEmailOtpEnabled ? handleEmailOtpVerification(e) : handleConfirm(e);
                }
              }}
            />
          </div>

          {/* Resend OTP Section */}
          <div className="resend-code flex flex-col items-center justify-center text-sm">
            {(() => {
              const isCountingActive = isEmailOtpEnabled
                ? isEmailCounting
                : isCounting;
              const currentTimeLeft = isEmailOtpEnabled
                ? emailTimeLeft
                : timeLeft;

              return isCountingActive ? (
                <span
                  id="re-text"
                  className="flex items-center justify-center text-base font-semibold"
                >
                  {t("resendOtp")} {t("in")}&nbsp;<span className="primaryColor">{formatTime(currentTimeLeft)}</span>
                </span>
              ) : (
                <span
                  id="re-text"
                  onClick={handleResendOTP}
                  className="primaryColor hover:cursor-pointer"
                >
                  {t("resendOtp")}
                </span>
              );
            })()}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="brandBg primaryTextColor w-full rounded p-2 text-sm transition-all hover:primaryBg sm:p-[10px] sm:text-base md:text-base"
            onClick={(e) =>
              isEmailOtpEnabled
                ? handleEmailOtpVerification(e)
                : handleConfirm(e)
            }
          >
            {showLoader ? (
              <ButtonLoader />
            ) : (
              <span>{t("confirm")}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
// Register Form
const RegisterForm = ({
  registerFormData,
  handleRegisterInputChange,
  handleRegisterPhoneChange,
  handleRegisterUser,
  handleSignIn,
  showLoader,
}) => {
  const t = useTranslation();
  const isRtl = isRTL();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <form onSubmit={handleRegisterUser}>
      <div className="flex w-full flex-col justify-center gap-3 p-3 sm:gap-4 sm:p-3 md:p-4">
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="name" className="text-sm font-medium sm:text-base">
            {t("name")}
            <span className="ms-1 text-red-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder={t("enterYourName")}
            className="primaryBackgroundBg w-full rounded border-none p-2 text-sm outline-none sm:p-[10px] sm:text-base md:text-base"
            value={registerFormData?.name}
            onChange={handleRegisterInputChange}
            required
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="email" className="text-sm font-medium sm:text-base">
            {t("email")}
            <span className="ms-1 text-red-600">*</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder={t("enterEmail")}
            className="primaryBackgroundBg w-full rounded border-none p-2 text-sm outline-none sm:p-[10px] sm:text-base md:text-base"
            value={registerFormData?.email}
            onChange={handleRegisterInputChange}
            required
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="phone">{t("phoneNumber")}</label>
          <PhoneInput
            defaultCountry={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
            international
            value={registerFormData?.phone}
            onChange={handleRegisterPhoneChange}
            className="custom-phone-input"
            countrySelectProps={{
              arrowComponent: ({ children, ...props }) => (
                <span {...props} className="custom-arrow">
                  <IoMdArrowDropdown size={16} />
                </span>
              )
            }}
          />
        </div>

        <div className="flex flex-col gap-1 sm:gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium sm:text-base"
          >
            {t("password")}
            <span className="ms-1 text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder={t("enterYourPassword")}
              className="primaryBackgroundBg w-full rounded border-none p-2 text-sm outline-none sm:p-[10px] sm:text-base md:text-base"
              value={registerFormData?.password}
              onChange={handleRegisterInputChange}
              required
            />
            <button
              type="button"
              className={`absolute ${isRtl ? "left-2 top-1/2 -translate-y-1/2" : "right-2 top-1/2 -translate-y-1/2 sm:right-3"}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-4 w-4 hover:opacity-100 sm:h-5 sm:w-5" />
              ) : (
                <FaEye className="h-4 w-4 hover:opacity-100 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium sm:text-base"
            >
              {t("confirmPassword")}
              <span className="ms-1 text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder={t("enterConfirmPassword")}
                className="primaryBackgroundBg w-full rounded border-none p-2 text-sm outline-none sm:p-[10px] sm:text-base md:text-base"
                value={registerFormData?.confirmPassword}
                onChange={handleRegisterInputChange}
                required
              />
              <button
                type="button"
                className={`absolute ${isRtl ? "left-2 top-1/2 -translate-y-1/2" : "right-2 top-1/2 -translate-y-1/2 sm:right-3"}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-4 w-4  hover:opacity-100 sm:h-5 sm:w-5" />
                ) : (
                  <FaEye className="h-4 w-4  hover:opacity-100 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="brandBg primaryTextColor w-full rounded-lg p-2 text-sm transition-all hover:primaryBg sm:p-[10px] sm:text-base md:text-base"
        >
          {showLoader ? (
            <ButtonLoader />
          ) : (
            t("register")
          )}
        </button>
        <div className="flex flex-wrap justify-center text-sm sm:text-base">
          <p className="me-1 text-[#555]">{t("alreadyHaveAccount")}</p>
          <div
            className="secondryTextColor font-bold transition-colors hover:cursor-pointer"
            onClick={handleSignIn}
          >
            {t("signIn")}
          </div>
        </div>
      </div>
    </form>
  );
};
// Email Login Form
const EmailLoginForm = ({
  signInFormData,
  handleSignInInputChange,
  SignInWithEmail,
  handlesignUp,
  ShowGoogleLogin,
  ShowPhoneLogin,
  handlePhoneLogin,
  handleGoogleSignup,
  showLoader,
  emailReverify,
  onForgotPasswordClick,
  handleResendOTP,
}) => {
  const t = useTranslation();
  const isRtl = isRTL();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      <div className="flex w-full flex-col justify-center gap-3 p-3 sm:gap-4 sm:p-3 md:p-4">
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="email" className="text-sm font-medium sm:text-base">
            {t("email")}
            <span className="ms-1 text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder={t("enterYourEmail")}
            className="primaryBackgroundBg w-full rounded border-none p-2 text-sm outline-none sm:p-[10px] sm:text-base md:text-base"
            value={signInFormData?.email}
            onChange={handleSignInInputChange}
            required
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium sm:text-base"
          >
            {t("password")}
            <span className="ms-1 text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder={t("enterYourPassword")}
              className="primaryBackgroundBg w-full rounded border-none p-2 text-sm outline-none sm:p-[10px] sm:text-base md:text-base"
              value={signInFormData?.password}
              onChange={handleSignInInputChange}
              required
            />
            <button
              type="button"
              className={`absolute ${isRtl ? "left-2 top-1/2 -translate-y-1/2" : "right-2 top-1/2 -translate-y-1/2 sm:right-3"}`}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="h-4 w-4 opacity-50 hover:opacity-100 sm:h-5 sm:w-5" />
              ) : (
                <FaEye className="h-4 w-4 opacity-50 hover:opacity-100 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <div
            className="text-sm font-bold underline transition-colors hover:cursor-pointer sm:text-base"
            onClick={onForgotPasswordClick}
          >
            {t("forgotPasswd")}
          </div>
        </div>
        {emailReverify ? (
          <button
            type="button"
            className="brandBg primaryTextColor w-full rounded-lg p-2 text-sm transition-all hover:primaryBg sm:p-[10px] sm:text-base md:text-base"
            onClick={handleResendOTP}
            disabled={showLoader}
          >
            {showLoader ? (
              <ButtonLoader />
            ) : (
              t("resendVerificationCode")
            )}
          </button>
        ) : (
          <button
            className="brandBg primaryTextColor w-full rounded-lg p-2 text-sm transition-all hover:primaryBg sm:p-[10px] sm:text-base md:text-base"
            onClick={(e) => SignInWithEmail(e)}
          >
            {t("signIn")}
          </button>
        )}
        <div className="flex flex-wrap justify-center text-sm sm:text-base">
          <p className="me-1 text-[#555]">{t("dontHaveAccount")}</p>
          <div
            className="secondryTextColor font-bold transition-colors hover:cursor-pointer"
            onClick={handlesignUp}
          >
            {t("registerNow")}
          </div>
        </div>
        {ShowGoogleLogin && (
          <div className="mt-1 flex items-center justify-between sm:mt-2">
            <hr className="secondryTextColor flex-grow border-0 border-t-[1.5px] border-dashed sm:border-t-[1.9px]" />
            <div className="primaryBackgroundBg mx-2 rounded-full p-1 text-sm font-medium capitalize sm:mx-4 sm:p-2 md:p-3">
              {t("OR")}
            </div>
            <hr className="secondryTextColor flex-grow border-0 border-t-[1.5px] border-dashed sm:border-t-[1.9px]" />
          </div>
        )}
        {ShowPhoneLogin && (
          <AuthButton
            text={t("CWP")}
            onClick={handlePhoneLogin}
            icon={
              <FcPhoneAndroid className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            }
          />
        )}
        {ShowGoogleLogin && (
          <AuthButton
            text={t("CWG")}
            onClick={handleGoogleSignup}
            icon={<FcGoogle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />}
          />
        )}
      </div>
    </form>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const LoginModal = ({ showLogin, setShowLogin }) => {
  const t = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { locale } = router?.query;
  const settingsData = useSelector((state) => state.WebSetting?.data);
  const isDemo = settingsData?.demo_mode;
  const CompanyName = settingsData?.company_name;

  const ShowPhoneLogin = settingsData?.number_with_otp_login === "1";
  const ShowGoogleLogin = settingsData?.social_login === "1";
  const ShowEmailLogin = settingsData?.email_password_login === "1";
  const isFirebaseOtp = settingsData?.otp_service_provider === "firebase";
  const isTwilioOtp = settingsData?.otp_service_provider === "twilio";

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswd, setShowForgotPasswd] = useState(false);
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [showOTPContent, setShowOTPContent] = useState(false);
  const [showEmailContent, setShowEmailContent] = useState(true);
  const [showRegisterContent, setShowRegisterContent] = useState(false);

  const { authentication } = FirebaseData();
  const FcmToken = useSelector((state) => state.WebSetting?.fcmToken);
  const DemoNumber = "+911234567890";
  const DemoOTP = "123456";

  const [isEmailOtpEnabled, setIsEmailOtpEnabled] = useState(false); // State to track email OTP
  const [emailOtp, setEmailOtp] = useState(""); // Initialize as string for react-otp-input
  const [emailTimeLeft, setEmailTimeLeft] = useState(120); // 2 minutes in seconds
  const [isEmailCounting, setIsEmailCounting] = useState(false); // State to track email OTP counting
  const [emailReverify, setEmailReverify] = useState(false);

  const [phonenum, setPhonenum] = useState();
  const [value, setValue] = useState(isDemo ? DemoNumber : "");
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [otp, setOTP] = useState(""); // Initialize as string for react-otp-input
  const [showLoader, setShowLoader] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isCounting, setIsCounting] = useState(false);

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });

  // Handle countdown logic
  useEffect(() => {
    let timer;
    if (isCounting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      setTimeLeft(0);
      setIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [isCounting, timeLeft]);

  useEffect(() => {
    let timer;
    if (isEmailCounting && emailTimeLeft > 0) {
      timer = setInterval(() => {
        setEmailTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (emailTimeLeft === 0) {
      clearInterval(timer);
      setIsEmailCounting(false);
    }
    return () => clearInterval(timer);
  }, [isEmailCounting, emailTimeLeft]);

  useEffect(() => {
    if (showLogin) {
      generateRecaptcha();
    }
    return () => {
      recaptchaClear();
    };
  }, [showLogin]);

  const recaptchaClear = async () => {
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (window.recaptchaVerifier) {
      try {
        await window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      } catch (error) {
        console.error("Error clearing ReCAPTCHA verifier:", error);
      }
    }
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = "";
      console.info("ReCAPTCHA container cleared");
    }
  };

  const generateRecaptcha = async () => {
    await recaptchaClear();
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (!recaptchaContainer) {
      console.error("Container element 'recaptcha-container' not found.");
      return null;
    }
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        authentication,
        recaptchaContainer,
        {
          size: "invisible",
        },
      );
      return window.recaptchaVerifier;
    } catch (error) {
      console.error("Error initializing RecaptchaVerifier:", error.message);
      return null;
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPasswd(false);
    setShowEmailContent(true);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswd(true);
    setShowEmailContent(false);
    setShowPhoneLogin(false);
    setShowOTPContent(false);
    setShowRegisterContent(false);
  };

  const handleResetAllStates = () => {
    // Reset all form data states
    setSignInFormData({
      email: "",
      password: "",
    });

    setRegisterFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    // Reset OTP related states
    setOTP("");
    setEmailOtp("");
    setTimeLeft(0);
    setEmailTimeLeft(0);
    setIsCounting(false);
    setIsEmailCounting(false);
    setIsEmailOtpEnabled(false);
    setEmailReverify(false);

    // Reset phone related states
    setValue("");
    setPhonenum("");

    // Reset modal view states
    setShowEmailContent(true);
    setShowPhoneLogin(false);
    setShowOTPContent(false);
    setShowRegisterContent(false);
    setShowForgotPasswd(false);
    setShowLoader(false);
  };

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    setShowPhoneLogin(true);
    setShowEmailContent(false);
    setShowOTPContent(false);
    setShowRegisterContent(false);
  };

  const handleEmailLoginshow = () => {
    setShowEmailContent(true);
    setShowPhoneLogin(false);
    setShowOTPContent(false);
    setShowRegisterContent(false);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setShowRegisterContent(false);
    setShowOTPContent(false);
    setShowEmailContent(true);
  };

  const handlesignUp = () => {
    setShowRegisterContent(true);
    setShowEmailContent(false);
    setShowOTPContent(false);
    setShowForgotPasswd(false);
  };

  const handleRegisterPhoneChange = (value) => {
    setRegisterFormData({
      ...registerFormData,
      phone: value,
    });
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;

    setRegisterFormData({
      ...registerFormData,
      [name]: value,
    });
  };

  // login with email
  const SignInWithEmail = async (e) => {
    e.preventDefault();

    if (!signInFormData?.email || !signInFormData?.password) {
      toast.error(t("allFieldsRequired"));
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      signInFormData?.email,
    );
    if (!isEmailValid) {
      toast.error(t("invalidEmail"));
      return;
    }

    setShowLoader(true);

    try {
      const response = await userSignup({
        type: "3",
        email: signInFormData?.email,
        password: signInFormData?.password,
        fcm_id: FcmToken,
      });
      if (!response.error) {
        setShowLoader(false);
        toast.success(t(response?.message));
        dispatch(setAuth({ data: response?.data }));
        dispatch(setJWTToken({ data: response?.token }));
        onCloseLogin();
      } else if (
        response.error &&
        response?.key === "accountDeactivated"
      ) {
        setShowLoader(false);
        Swal.fire({
          title: t("opps"),
          text: t("accountDeactivatedByAdmin"),
          icon: "warning",
          showCancelButton: false,
          customClass: {
            confirmButton: "Swal-confirm-buttons",
            cancelButton: "Swal-cancel-buttons",
          },
          confirmButtonText: t("ok"),
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/${locale}/contact-us`);
          }
        });
      }
    } catch (error) {
      if (error?.key === "emailNotVerified") {
        console.error("Error", error);
        setShowLoader(false);
        setEmailReverify(true);
        setIsEmailOtpEnabled(true);
        toast.error(error?.message);
      } else {
        console.error("SignInWithEmail error:", error);
        toast.error(t(error.message) || t("loginFailed"));
        setShowLoader(false);
      }
    }
  };

  // handle input change
  const handleSignInInputChange = (e) => {
    const { name, value } = e.target;
    // Check if the field being changed is the email
    if (name === "email") {
      if (value !== signInFormData.email) {
        setEmailReverify(false); // Email has been changed, set reverify flag
      }
    }

    setSignInFormData({
      ...signInFormData,
      [name]: value,
    });
  };

  const onCloseLogin = (e) => {
    if (e) {
      e.stopPropagation();
    }
    handleResetAllStates();
    setShowLogin(false);
  };

  // login with google
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(authentication, provider);

      const res = await userSignup({
        name: response?.user?.displayName,
        email: response?.user?.email,
        type: "0",
        auth_id: response?.user?.uid,
        profile: response?.user?.photoURL,
        fcm_id: FcmToken,
      });
      if (!res.error) {
        toast.success(t(res?.message));
        dispatch(setAuth({ data: res?.data }));
        dispatch(setJWTToken({ data: res?.token }));
        onCloseLogin();
      } else if (
        res?.error &&
        res?.key === "accountDeactivated"
      ) {
        onCloseLogin();
        Swal.fire({
          title: t("oops"),
          text: t("accountDeactivatedByAdmin"),
          icon: "warning",
          showCancelButton: false,
          customClass: {
            confirmButton: "Swal-confirm-buttons",
            cancelButton: "Swal-cancel-buttons",
          },
          confirmButtonText: t("ok"),
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/${locale}/contact-us`);
          }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(t("popupCancel"));
    }
  };

  // handle phone OTP
  const generateOTP = async (phoneNumber) => {
    if (!window.recaptchaVerifier) {
      console.error("window.recaptchaVerifier is null, unable to generate OTP");
      setShowLoader(false);
      return;
    }

    try {
      let appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        authentication,
        phoneNumber,
        appVerifier,
      );
      window.confirmationResult = confirmationResult;
      toast.success(t("otpSentsuccess"));

      if (isDemo) {
        setOTP(DemoOTP);
      }
      setTimeLeft(120);
      setIsCounting(true);
      setShowLoader(false);
    } catch (error) {
      console.error("Error generating OTP:", error);
      const errorCode = error.code;
      handleFirebaseAuthError(errorCode);
      setShowLoader(false);
    }
  };

  const generateOTPWithTwilio = async (phoneNumber) => {
    setShowLoader(true);
    const parsedNumber = parsePhoneNumber(phoneNumber);
    const formattedNumber = parsedNumber.format("E.164").slice(1);
    try {
      const res = await getOTPApi({ number: formattedNumber });
      if (!res.error) {
        setShowPhoneLogin(false);
        setShowOTPContent(true);
        setTimeLeft(120);
        setIsCounting(true);
        toast.success(t(res?.message));
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Error generating OTP with Twilio:", error);
      toast.error(t(error?.message) || t("otpSendFailed"));
      setShowLoader(false);
    }
  };

  // handles phone number and twilio signup
  const onSignUp = async (e) => {
    e.preventDefault();
    if (!value) {
      toast.error(t("enterPhoneNumber"));
      return;
    }

    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(value, "ZZ");
      if (!phoneUtil.isValidNumber(phoneNumber)) {
        toast.error(t("validPhonenum"));
        return;
      }

      setShowLoader(true); // Set loader before any async operations
      setPhonenum(value);

      if (isFirebaseOtp) {
        // Ensure reCAPTCHA is ready
        if (!window.recaptchaVerifier) {
          await generateRecaptcha();
        }
        await generateOTP(value);
      } else if (isTwilioOtp) {
        await generateOTPWithTwilio(value);
      }

      // Only change views after successful OTP generation
      setShowPhoneLogin(false);
      setShowOTPContent(true);

      if (isDemo) {
        setValue(DemoNumber);
      } else {
        setValue("");
      }
    } catch (error) {
      console.error("Error parsing phone number:", error);
      toast.error(t("validPhonenum"));
      setShowLoader(false);
    }
  };

  const wrongNumber = (e) => {
    e.preventDefault();
    setShowOTPContent(false);
    setShowPhoneLogin(true);
    setTimeLeft(0);
    setIsCounting(false);
  };
  const wrongEmail = (e) => {
    e.preventDefault();
    setShowOTPContent(false);
    setShowPhoneLogin(false);
    setShowEmailContent(true);
    setTimeLeft(0);
    setIsCounting(false);
  };

  // OTP Confirm handler
  const handleConfirm = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (otp === "" || otp.length !== 6) {
      toast.error(t("pleaseEnterOtp"));
      return;
    }
    setShowLoader(true);
    if (isFirebaseOtp) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then(async (result) => {
          const res = await userSignup({
            mobile: phoneUtil.parse(result.user.phoneNumber, "ZZ").getNationalNumber(),
            type: "1",
            auth_id: result.user.uid,
            fcm_id: FcmToken,
            country_code: phoneUtil.parse(result.user.phoneNumber, "ZZ").getCountryCode(),
          });
          if (!res.error) {
            setShowLoader(false);
            toast.success(t(res.message));
            dispatch(setAuth({ data: res?.data }));
            dispatch(setJWTToken({ data: res?.token }));
            onCloseLogin();
          } else if (
            res?.error &&
            res?.key === "accountDeactivated"
          ) {
            onCloseLogin();
            Swal.fire({
              title: t("oops"),
              text: t("accountDeactivatedByAdmin"),
              icon: "warning",
              showCancelButton: false,
              customClass: {
                confirmButton: "Swal-confirm-buttons",
                cancelButton: "Swal-cancel-buttons",
              },
              confirmButtonText: t("ok"),
            }).then((result) => {
              if (result.isConfirmed) {
                router.push(`/${locale}/contact-us`);
              }
            });
          }
        })
        .catch((error) => {
          setShowLoader(false);
          console.error(error);
          const errorCode = error.code;
          handleFirebaseAuthError(errorCode);
        });
    } else if (isTwilioOtp) {
      try {
        handleTwilioOTPConfirm();
      } catch (error) {
        console.error("Error verifying OTP with Twilio:", error);
        toast.error(t(error.message) || t("otpVerificationFailed"));
        setShowLoader(false);
      }
    }
  };

  const handleTwilioOTPConfirm = async () => {
    try {
      const res = await verifyOTP({
        number: phonenum.getNationalNumber(),
        otp: otp,
        country_code: phonenum.getCountryCode(),
      });
      if (!res.error) {
        const res2 = await userSignup({
          mobile: phonenum?.getNationalNumber(),
          type: "1",
          auth_id: res.auth_id,
          fcm_id: FcmToken,
          country_code: phonenum?.getCountryCode(),
        });
        if (!res2.error) {
          setShowLoader(false);
          toast.success(t(res2?.message));
          dispatch(setAuth({ data: res2?.data }));
          dispatch(setJWTToken({ data: res2?.token }));
          onCloseLogin();
        } else if (
          res2?.error &&
          res2?.key === "accountDeactivated"
        ) {
          Swal.fire({
            title: t("opps"),
            text: t("accountDeactivatedByAdmin"),
            icon: "warning",
            showCancelButton: false,
            customClass: {
              confirmButton: "Swal-confirm-buttons",
              cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: t("ok"),
          }).then((result) => {
            if (result.isConfirmed) {
              router.push(`/${locale}/contact-us`);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error verifying OTP with Twilio:", error);
      toast.error(t(error?.message) || t("otpVerificationFailed"));
      setShowLoader(false);
    }
  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    setShowLoader(true);
    try {
      if (isEmailOtpEnabled) {
        // Handle email OTP resend
        const response = await getOTPApi({
          email: signInFormData?.email || registerFormData?.email,
        });
        if (!response.error) {
          toast.success(t(response?.message));
          setShowEmailContent(false);
          setShowOTPContent(true);
          setEmailTimeLeft(120);
          setIsEmailCounting(true);
          setEmailOtp("");
          setShowLoader(false);
        }
      } else {
        // Handle phone OTP resend
        if (isFirebaseOtp) {
          try {
            let appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(
              authentication,
              phonenum,
              appVerifier,
            );
            window.confirmationResult = confirmationResult;
            toast.success(t("otpSentSuccessfully"));

            if (isDemo) {
              setOTP(DemoOTP);
            }
            setTimeLeft(120);
            setIsCounting(true);
            setOTP(""); // Reset phone OTP input
            setShowLoader(false);
          } catch (error) {
            console.error("Firebase OTP error:", error);
            const errorCode = error.code;
            handleFirebaseAuthError(errorCode);
            setIsCounting(false);
            setTimeLeft(0);
            setShowLoader(false);
          }
        } else if (isTwilioOtp) {
          try {
            const parsedNumber = parsePhoneNumber(phonenum);
            const formattedNumber = parsedNumber.format("E.164").slice(1);
            const phone = phoneUtil.parseAndKeepRawInput(
              phonenum,
              "ZZ",
            );
            const countryCode = phone?.getCountryCode();
            const phoneWithoutCountryCode = phone?.getNationalNumber();
            const response = await getOTPApi({ number: phoneWithoutCountryCode, country_code: countryCode });


            if (!response.error) {
              toast.success(t(response?.message));
              setTimeLeft(120);
              setIsCounting(true);
              setOTP(""); // Reset phone OTP input
              setShowLoader(false);
            }
          } catch (error) {
            console.error("Twilio OTP error:", error);
            toast.error(t(error?.message) || t("failedToSendOTP"));
            setIsCounting(false);
            setTimeLeft(0);
            setShowLoader(false);
          }
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.error("Resend OTP error:", error);
      toast.error(t(error?.message) || t("failedToSendOTP"));
      // Reset all counting states in case of error
      if (isEmailOtpEnabled) {
        setIsEmailCounting(false);
        setEmailTimeLeft(0);
      } else {
        setIsCounting(false);
        setTimeLeft(0);
      }
    }
  };

  // Email OTP verification handler
  const handleEmailOtpVerification = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (emailOtp === "" || emailOtp.length !== 6) {
      toast.error(t("pleaseEnterOTP"));
      return;
    }
    setShowLoader(true);
    try {
      // Call the API to verify the email OTP
      const response = await verifyOTP({
        email: registerFormData?.email
          ? registerFormData?.email
          : signInFormData?.email,
        otp: emailOtp,
      });
      if (!response.error) {
        toast.success(t(response?.message));
        setShowOTPContent(false); // Hide OTP section
        setShowEmailContent(true); // Show email login form
        setEmailReverify(false);
        setIsEmailOtpEnabled(false);
        setShowLoader(false);
      } else if (response.error) {
        console.error(response?.message);
        toast.error(t(response?.message));
        setShowLoader(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(t(error?.message));
      setShowLoader(false);
    }
  };

  // Register User Handler
  const handleRegisterUser = async (e) => {
    e.preventDefault();

    // Validation checks
    if (registerFormData?.password.length < 6) {
      toast.error(t("passwordLengthError"));
      return;
    }

    if (registerFormData?.password !== registerFormData?.confirmPassword) {
      toast.error(t("passwordsNotMatch"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerFormData?.email)) {
      toast.error(t("invalidEmail"));
      return;
    }

    // if (!registerFormData?.phone) {
    //   toast.error(translate("phoneRequired"));
    //   return;
    // }

    // Set loader to true before the API call
    setShowLoader(true);

    try {
      const formattedPhone =
        registerFormData?.phone && registerFormData?.phone.replace("+", "");
      const phoneNumber = phoneUtil.parseAndKeepRawInput(
        registerFormData?.phone,
        "ZZ",
      );
      if (!phoneNumber?.getCountryCode() && phoneNumber.getNationalNumber().length < 10) {
        toast.error(t("validPhonenum"));
        setShowLoader(false);
        return;
      }

      // Make the API call
      const response = await userRegisterApi({
        name: registerFormData?.name,
        email: registerFormData?.email,
        mobile: phoneNumber?.getNationalNumber(),
        password: registerFormData?.password,
        re_password: registerFormData?.confirmPassword,
        country_code: phoneNumber?.getCountryCode(),
      });
      if (!response.error) {
        setIsEmailOtpEnabled(true);
        setShowRegisterContent(false);
        setShowOTPContent(true);
        setEmailTimeLeft(120);
        setIsEmailCounting(true);
        toast.success(t("otpSentToEmail"));
        setShowLoader(false);
      }
    } catch (error) {
      console.error(error);
      console.error("Registration error:", error);
      toast.error(t(error?.message) || t("registrationFailed"));
      setShowLoader(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPasswordSubmit = async (email) => {
    if (!email) {
      toast.error(t("pleaseEnterEmail"));
      return;
    }

    setShowLoader(true);

    try {
      const response = await forgotPasswordApi({
        email: email,
      });
      if (!response.error) {
        toast.success(t(response?.message) || t("passwordResetEmailSent"));
        // Reset form and show email login screen
        setSignInFormData({ email: "", password: "" });
        setShowForgotPasswd(false);
        setShowEmailContent(true);
        setShowPhoneLogin(false);
        setShowOTPContent(false);
        setShowRegisterContent(false);
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(t(error?.message) || t("somethingWentWrong"));
      setShowLoader(false);
    }
  };

  return (
    <>
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="mx-auto max-w-md rounded-lg p-0 shadow-lg sm:max-w-lg [&>button]:hidden"
        >
          <DialogHeader className="w-full">
            <DialogTitle className="flex w-full items-center justify-between border-b p-3 sm:p-3 md:p-6">
              <div className="truncate text-base font-semibold sm:text-xl md:text-2xl">
                {showPhoneLogin && t("loginOrRegister")}
                {showForgotPasswd && t("resetPassword")}
                {showEmailContent && t("loginWithEmail")}
                {showOTPContent && t("verification")}
                {showRegisterContent && t("registerAccount")}
              </div>
              <AiOutlineClose
                className="primaryBackgroundBg leadColor font-bold rounded-xl h-6 w-6 flex-shrink-0 p-1 md:p-2 hover:cursor-pointer sm:h-7 sm:w-7 md:h-10 md:w-10"
                onClick={onCloseLogin}
              />
            </DialogTitle>
            <DialogDescription className="sr-only">
              Auth Modal
            </DialogDescription>
          </DialogHeader>

          {showForgotPasswd ? (
            <ForgotPassword
              showLoader={showLoader}
              onBackToLogin={handleBackToLogin}
              onSubmit={handleForgotPasswordSubmit}
            />
          ) : showEmailContent ? (
            <EmailLoginForm
              signInFormData={signInFormData}
              handleSignInInputChange={handleSignInInputChange}
              SignInWithEmail={(e) => SignInWithEmail(e)}
              handlesignUp={handlesignUp}
              ShowGoogleLogin={ShowGoogleLogin}
              ShowPhoneLogin={ShowPhoneLogin}
              handlePhoneLogin={handlePhoneLogin}
              handleGoogleSignup={handleGoogleSignup}
              showLoader={showLoader}
              emailReverify={emailReverify}
              onForgotPasswordClick={handleForgotPasswordClick}
              handleResendOTP={handleResendOTP}
              formatTime={formatTime}
            />
          ) : showPhoneLogin ? (
            <PhoneLogin
              value={value}
              setValue={setValue}
              onSignUp={onSignUp}
              ShowGoogleLogin={ShowGoogleLogin}
              handleEmailLoginshow={handleEmailLoginshow}
              CompanyName={CompanyName}
              handleGoogleSignup={handleGoogleSignup}
              ShowPhoneLogin={ShowPhoneLogin}
              showLoader={showLoader}
            />
          ) : showOTPContent ? (
            <OTPForm
              phonenum={phonenum}
              wrongNumber={wrongNumber}
              wrongEmail={wrongEmail}
              otp={otp}
              setOTP={setOTP}
              handleConfirm={handleConfirm}
              showLoader={showLoader}
              timeLeft={timeLeft}
              isEmailOtpEnabled={isEmailOtpEnabled}
              emailOtp={emailOtp}
              email={
                registerFormData?.email
                  ? registerFormData?.email
                  : signInFormData?.email
              }
              setEmailOtp={setEmailOtp}
              handleEmailOtpVerification={handleEmailOtpVerification}
              isEmailCounting={isEmailCounting}
              emailTimeLeft={emailTimeLeft}
              formatTime={formatTime}
              isCounting={isCounting}
              handleResendOTP={handleResendOTP}
            />
          ) : showRegisterContent ? (
            <RegisterForm
              registerFormData={registerFormData}
              handleRegisterInputChange={handleRegisterInputChange}
              handleRegisterPhoneChange={handleRegisterPhoneChange}
              handleRegisterUser={handleRegisterUser}
              handleSignIn={handleSignIn}
              showLoader={showLoader}
            />
          ) : null}

          <div className="w-full border-t p-3 sm:p-3">
            <AuthFooter />
          </div>
          <div id="recaptcha-container" style={{ display: "none" }}></div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginModal;
