"use client";
import { useRouter } from "next/router";
import { BiDollarCircle } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa";
import {
  MdBusiness,
  MdDeleteOutline,
  MdLogout,
  MdOutlineArrowBack,
  MdOutlineDashboard,
  MdReceipt,
  MdStars,
  MdTagFaces,
} from "react-icons/md";
import {
  RiAdvertisementLine,
  RiHeartLine,
  RiMessage2Line,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import CustomLink from "../context/CustomLink";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useTranslation } from "../context/TranslationContext";
import Swal from "sweetalert2";
import { getAuth, deleteUser } from "firebase/auth";
import FirebaseData from "@/utils/Firebase";
import toast from "react-hot-toast";
import { logout } from "@/redux/slices/authSlice";
import { isDemoMode, isRTL } from "@/utils/helperFunction";
import { beforeLogoutApi, deleteUserAccountApi } from "@/api/apiRoutes";

const UserSidebar = ({ isMobile = false, open = false, toggleDrawer }) => {
  const router = useRouter();
  const pathname = router?.asPath;
  const dispatch = useDispatch();
  const settingData = useSelector((state) => state.WebSetting?.data);
  const logo = settingData?.web_footer_logo;
  const t = useTranslation();
  const isRtl = isRTL();
  const { signOut } = FirebaseData();
  const FcmToken = useSelector((state) => state.WebSetting?.fcmToken);

  // handle logout functionality
  const handleLogout = async () => {
    Swal.fire({
      title: t("areYouSure"),
      text: t("youNotAbelToRevertThis"),
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      confirmButtonText: t("yesLogout"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (FcmToken) {
            const res = await beforeLogoutApi({ fcm_id: FcmToken });
            if (!res.error) {
              dispatch(logout());
              signOut();
              toast.success(t("logoutSuccess"));
              router.push("/");
            }
          } else {
            dispatch(logout());
            signOut();
            toast.success(t("logoutSuccess"));
            router.push("/");
          }
        } catch (error) {
          console.error("Error logging out:", error);
        }
      } else {
        toast.error(t("logoutcancel"));
      }
    });
  };

  // Handle delete account functionality
  const handleDeleteAcc = async () => {
    if (isDemoMode()) {
      Swal.fire({
        title: t("opps"),
        text: t("notAllowdDemo"),
        icon: "warning",
        showCancelButton: false,
        customClass: {
          confirmButton: "Swal-confirm-buttons",
          cancelButton: "Swal-cancel-buttons",
        },
        confirmButtonText: t("ok"),
        cancelButtonText: t("cancel"),
      });
      return; // Stop further execution
    }

    // Initialize Firebase Authentication
    const auth = getAuth();

    // Get the currently signed-in user
    const user = auth?.currentUser;

    Swal.fire({
      title: t("areYouSure"),
      text: t("youNotAbelToRevertThis"),
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "Swal-confirm-buttons",
        cancelButton: "Swal-cancel-buttons",
      },
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Delete the user
        if (user) {
          try {
            // Firebase deleteUser returns undefined on success
            await deleteUser(user);

            // After successful Firebase deletion, call the API
            const response = await deleteUserAccountApi();

            // Handle success
            router.push("/");
            toast.success(t("accountDeletedSuccessfully"));
            dispatch(logout());
            signOut();
          } catch (error) {
            console.error("Error deleting user:", error.message);
            if (error.code === "auth/requires-recent-login") {
              router.push("/");
              toast.error(error.message);
              dispatch(logout());
              signOut();
            }
          }
        } else {
          try {
            const response = await deleteUserAccountApi();
            router.push("/");
            toast.success(t("accountDeletedSuccessfully"));
            dispatch(logout());
            signOut();
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        console.error("delete account process canceled ");
      }
    });
  };

  const sideBarItems = [
    {
      title: t("myDashboard"),
      icon: MdOutlineDashboard,
      url: "/user/dashboard",
    },
    {
      title: t("myAdvertisement"),
      icon: RiAdvertisementLine,
      url: "/user/advertisement?tab=property",
    },
    {
      title: t("myProjects"),
      icon: MdBusiness,
      url: "/user/projects",
    },
    {
      title: t("favourites"),
      icon: RiHeartLine,
      url: "/user/favourites",
    },
    {
      title: t("messages"),
      icon: RiMessage2Line,
      url: "/user/chat",
    },
    {
      title: t("myProfile"),
      icon: MdTagFaces,
      url: "/user/profile",
    },
    {
      title: t("personalizeFeed"),
      icon: MdStars,
      url: "/user/personalize-feed",
    },
    {
      title: t("userNotification"),
      icon: FaRegBell,
      url: "/user/notifications",
    },
    {
      title: t("mySubscriptions"),
      icon: BiDollarCircle,
      url: "/user/subscription",
    },
    {
      title: t("transactionHistory"),
      icon: MdReceipt,
      url: "/user/transaction-history",
    },
    {
      title: t("deleteAccount"),
      icon: MdDeleteOutline,
      onClick: handleDeleteAcc,
    },
    {
      title: t("logout"),
      icon: MdLogout,
      onClick: handleLogout,
    },
  ];

  return (
    <div
      className={`flex h-full flex-col justify-center bg-white shadow-md transition-all duration-300 ease-in-out  ${isMobile ? (open ? "w-full" : "hidden") : !isMobile && open ? "w-60" : "hidden"} `}
    >
      <div className="flex h-full flex-col">
        {/* Top header with toggle */}
        <div
          className={`secondaryTextBg relative flex h-24 items-center justify-between p-3 ${open ? "z-40" : ""}`}
        >
          <CustomLink href="/">
            <ImageWithPlaceholder
              src={settingData?.web_footer_logo || logo}
              alt="logo"
              className="h-[50px] w-[150px] object-contain"
            />
          </CustomLink>
          {isMobile && open ? (
            <MdOutlineArrowBack
              onClick={toggleDrawer}
              className={`secondaryTextBg absolute top-5 ${isRtl ? "left-0 rotate-180" : "right-0"} flex h-12 w-12 items-center justify-center rounded-full border-[5px] border-white p-2 text-white hover:cursor-pointer`}
            />
          ) : (
            !isMobile &&
            open && (
              <MdOutlineArrowBack
                onClick={toggleDrawer}
                className={`secondaryTextBg absolute  top-6  ${isRtl ? "-left-5 rotate-180" : "-right-5"} flex h-12 w-12 items-center justify-center rounded-full border-[5px] border-white p-2 text-white hover:cursor-pointer`}
              />
            )
          )}
        </div>

        {/* Sidebar Items */}
        <ul className="mt-4 md:mt-0 overflow-y-auto">
          {sideBarItems.map((item) => (
            <li key={item?.title}>
              <CustomLink
                href={item.url || "#"}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  (isMobile && open) && toggleDrawer();
                }}
                className={`${pathname?.includes(item?.url) ? "primaryBgLight primaryColor primaryBorderColor" : "secondaryBorderColor group"} hover:primaryBgLight hover:primaryBorderColor flex items-center border-b border-dashed px-4 py-3 ${!open && "justify-center"}`}
              >
                <div
                  className={`flex w-full items-center gap-4 transition-all duration-300 ease-out group-hover:ml-2`}
                >
                  <span className="group-hover:primaryColor flex-shrink-0 ps-1">
                    {<item.icon size={24} />}
                  </span>
                  {open && (
                    <span className="group-hover:primaryColor">
                      {item.title}
                    </span>
                  )}
                </div>
              </CustomLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserSidebar;
