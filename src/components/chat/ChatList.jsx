import { formatTimeDifference } from "@/utils/helperFunction";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { ChatListSkeleton } from "@/components/skeletons";
import { useTranslation } from "../context/TranslationContext";

const ChatList = ({ conversations, activeChat, handleSelectChat, loading }) => {
  const t = useTranslation();

  if (loading) {
    return <ChatListSkeleton count={5} />;
  }

  return (
    <>
      {conversations &&
        conversations?.map((conversation) => (
          <div
            key={`${conversation?.property_id}-${conversation?.user_id}`}
            onClick={() => handleSelectChat(conversation)}
            className={`flex cursor-pointer items-center p-4 transition-colors hover:bg-gray-50 rtl:gap-2 ${activeChat?.property_id == conversation.property_id && activeChat?.user_id == conversation.user_id
              ? "primaryBorderColor primaryBgLight border-l-4 bg-gray-100"
              : "border-b"
              } ${conversation?.is_blocked_by_me ? "opacity-75" : ""}`}
          >
            <div className="relative">
              <div className="flex h-7 w-7 items-center overflow-hidden rounded-full bg-gray-200 md:h-12 md:w-12">
                {conversation && conversation?.profile ? (
                  <ImageWithPlaceholder
                    src={conversation?.profile}
                    alt={conversation?.name}
                    className="h-7 w-7 object-fill md:h-12 md:w-12"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    {conversation?.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium">{conversation?.name}</h3>
                  {conversation?.is_blocked_by_me && (
                    <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                      {t("blocked")}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 rtl:ltr-number">
                  {formatTimeDifference(conversation?.date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="truncate text-sm text-gray-500">
                  {conversation?.title}
                </p>
                {conversation?.unread_count > 0 && (
                  <div className="primaryBg flex h-6 w-6 items-center justify-center rounded-full text-xs text-white">
                    {conversation?.unread_count}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ChatList;
