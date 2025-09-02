import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { FiTrash2, FiRefreshCw, FiSlash } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdArrowBack, MdDeleteOutline } from "react-icons/md";
import { FaUserAltSlash } from "react-icons/fa";
import { useTranslation } from "../context/TranslationContext";
import { isRTL } from "@/utils/helperFunction";

const ChatHeader = ({
  isMobile,
  handleBackToChatList,
  activeChat,
  handleDeleteChat,
  handleReloadChat,
  handleBlockUser,
  handleUnblockUser,
}) => {
  const t = useTranslation();
  const isRtl = isRTL();
  return (
    <div className="flex items-center justify-between gap-3 border-b px-2 py-4 md:p-4">
      <div className="flex items-center rtl:gap-2">
        {isMobile && (
          <button
            onClick={handleBackToChatList}
            className="mr-2 font-semibold text-primary"
          >
            <MdArrowBack className="h-5 w-5 rtl:rotate-180" />
          </button>
        )}
        <div className="relative">
          <div className="mr-3 h-7 w-7 overflow-hidden rounded-full bg-gray-200 md:h-12 md:w-12">
            {activeChat?.title_image && (
              <ImageWithPlaceholder
                src={activeChat?.title_image}
                alt={activeChat?.title}
                className="h-7 w-7 object-fill md:h-12 md:w-12"
              />
            )}
          </div>
          {activeChat?.isActive && (
            <div className="absolute -bottom-1 right-[10px] h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
          )}
        </div>
        <div>
          <h3 className="break-words font-medium">{activeChat?.name}</h3>
          <p className="break-words text-xs text-gray-600 md:text-sm">
            {activeChat?.title}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <BsThreeDotsVertical className="text-xl text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-48">
          <DropdownMenuItem
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => handleDeleteChat(activeChat)}
          >
            <MdDeleteOutline /> {t("deleteAllMessages")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => handleReloadChat(activeChat)}
          >
            <FiRefreshCw /> {t("refreshMessages")}
          </DropdownMenuItem>
          {!activeChat?.is_blocked_by_me && (
            <DropdownMenuItem
              className="flex items-center gap-2 hover:cursor-pointer"
              onClick={() => handleBlockUser(activeChat)}
            >
              <FaUserAltSlash /> {t("blockUser")}
            </DropdownMenuItem>
          )}
          {activeChat?.is_blocked_by_me && (
            <DropdownMenuItem
              className="flex items-center gap-2 hover:cursor-pointer"
              onClick={() => handleUnblockUser(activeChat)}
            >
              <FaUserAltSlash /> {t("unblockUser")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
