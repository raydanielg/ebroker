import { Skeleton } from "@/components/ui/skeleton";
import ChatListSkeleton from "./ChatListSkeleton";
import ChatHeaderSkeleton from "./ChatHeaderSkeleton";
import ChatMessageSkeleton from "./ChatMessageSkeleton";
import ChatInputSkeleton from "./ChatInputSkeleton";
import NoChatFoundSkeleton from "./NoChatFoundSkeleton";
import SelectConversationSkeleton from "./SelectConversationSkeleton";

const UserChatSkeleton = ({ isMobile = false }) => {
    return (
        <div className="flex h-[700px] min-h-[90%] flex-col">
            {/* Title skeleton */}
            <div>
                <Skeleton className="h-8 w-32 mb-4 mt-2" />
            </div>

            <div className="flex h-full w-full bg-white">
                {/* Chat List Skeleton */}
                {(!isMobile || (isMobile && false)) && (
                    <div className="w-full overflow-y-auto ltr:border-r rtl:border-l sm:w-1/3">
                        <ChatListSkeleton count={6} />
                    </div>
                )}

                {/* Chat Area Skeleton */}
                {(!isMobile || (isMobile && true)) && (
                    <div className="flex w-full flex-col">
                        {/* Chat Header Skeleton */}
                        <ChatHeaderSkeleton isMobile={isMobile} />

                        {/* Chat Messages Skeleton */}
                        <div className="flex-1 overflow-hidden">
                            <ChatMessageSkeleton count={6} />
                        </div>

                        {/* Chat Input Skeleton */}
                        <ChatInputSkeleton isMobile={isMobile} />
                    </div>
                )}
            </div>
        </div>
    );
};

// Export individual components for use in other places
export {
    ChatListSkeleton,
    ChatHeaderSkeleton,
    ChatMessageSkeleton,
    ChatInputSkeleton,
    NoChatFoundSkeleton,
    SelectConversationSkeleton,
};

export default UserChatSkeleton;
