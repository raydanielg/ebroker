import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoDocumentOutline } from "react-icons/io5";
import { useTranslation } from "../context/TranslationContext";
import Image from "next/image";
import NoChatFoundImg from "@/assets/no_chat_found.svg";
import AudioPlayer from "./AudioPlayer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import toast from "react-hot-toast";
import { isRTL } from "@/utils/helperFunction";
import LightBox from "../property-detail/LightBox";
import { useState } from "react";
import { ChatMessageSkeleton } from "@/components/skeletons";

const ChatMessage = ({
  messages,
  activeChat,
  userData,
  hasMore,
  loadMore,
  isLoading,
  handleDeleteMessage,
}) => {
  const t = useTranslation();
  const isRtl = isRTL();

  // Lightbox states
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  // Function to open lightbox
  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  const formateTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(t("messageCopiedSuccess"));
    });
  };

  const renderMessage = (message, index) => {
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
    const documentExtensions = ["pdf", "doc", "docx"];
    const isUser = message.sender_id === userData?.id;

    // Check message types
    const isFile = message.chat_message_type === "file";
    const isAudio = message.chat_message_type === "audio";
    const isText = message.chat_message_type === "text";
    const isFileAndText = message.chat_message_type === "file_and_text";

    // Check file types
    const isImage =
      (message.file &&
        typeof message.file === "string" &&
        imageExtensions.some((ext) => message.file.toLowerCase().endsWith(`.${ext}`))) ||
      (message.file instanceof File &&
        imageExtensions.some((ext) => message.file.name.toLowerCase().endsWith(`.${ext}`)));

    const isDocument =
      (message.file &&
        typeof message.file === "string" &&
        documentExtensions.some((ext) => message.file.toLowerCase().endsWith(`.${ext}`))) ||
      (message.file instanceof File &&
        documentExtensions.some((ext) =>
          message.file.name.toLowerCase().endsWith(`.${ext}`),
        ));

    // Function to render file content
    const renderFile = (file) => {
      if (isImage) {
        const imageSrc = message.file instanceof File ? URL.
          createObjectURL(file) : file;

        const handleImageClick = () => {
          const singleImage = [{ src: imageSrc, alt: "Chat Image" }];
          openLightbox(singleImage, 0);
        };

        return (
          <div className="mb-2 overflow-hidden rounded-lg">
            <div
              className="cursor-pointer"
              onClick={handleImageClick}
            >
              <ImageWithPlaceholder
                src={imageSrc}
                alt="Image"
                className="h-[100px] w-[100px] object-fill sm:h-[150px] sm:w-[150px] md:h-[200px] md:w-full"
              />
            </div>
            {message.message && <p className="mt-1">{message.message}</p>}
          </div>
        );
      } else if (isDocument) {
        const fileName =
          message.file instanceof File
            ? message.file.name
            : file.split("/").pop();
        return (
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-2">
              <div className="rounded bg-gray-200 p-2">
                <IoDocumentOutline className="h-5 w-5" />
              </div>
              <span
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  window.open(
                    file instanceof File ? URL.createObjectURL(file) : file,
                    "_blank",
                  )
                }
              >
                {fileName}
              </span>
            </div>
            {message.message && <p>{message.message}</p>}
          </div>
        );
      } else {
        return null;
      }
    };

    return (
      <div
        key={index}
        className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"} mb-5`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="flex">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <BsThreeDotsVertical className="text-sm text-gray-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRtl ? "end" : "start"} className="w-full">
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => handleCopy(message.message || message.text)}
                  >
                    {t("copy")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mr-2 flex h-6 w-6 items-center overflow-hidden rounded-full bg-gray-200 md:h-12 md:w-12">
              <ImageWithPlaceholder
                src={activeChat?.profile}
                alt={activeChat?.name}
                className="h-full w-full object-fill"
              />
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div className="flex w-auto max-w-[85%] flex-col md:max-w-[70%]">
          <div
            className={`relative w-full rounded-lg p-1 text-base md:p-2 ${isUser
              ? 'primaryBackgroundBg secondryTextColor ml-auto text-end after:absolute after:right-[-18px] after:top-[3px] after:border-[10px] after:border-transparent after:border-l-[var(--primary-background)] after:content-[""] md:after:right-[-24px] md:after:top-[10px] md:after:border-[12px]'
              : 'primaryBgLight before:absolute before:left-[-18px] before:top-[2px] before:border-[10px] before:border-transparent before:border-r-[#f6fafa] before:content-[""] md:before:left-[-29px] md:before:top-[8px] md:before:border-[15px]'
              }`}
          >
            {/* Render Audio */}
            {isAudio && (
              <div className="audio-player">
                {typeof message.audio === "string" ? (
                  <AudioPlayer audioSrc={message.audio} />
                ) : message.audio instanceof File &&
                  message.audio.type.startsWith("audio/") ? (
                  <AudioPlayer audioSrc={message.audio} />
                ) : message.audio instanceof Blob &&
                  message.audio.type.startsWith("audio/") ? (
                  <AudioPlayer audioSrc={URL.createObjectURL(message.audio)} />
                ) : null}
              </div>
            )}

            {/* Render File */}
            {isFile && message.file ? renderFile(message.file) : null}

            {/* Render Text */}
            {isText && (message.message || message.text) && (
              <p className="max-w-md whitespace-pre-wrap text-xs md:w-full md:text-base">
                {message.message || message.text}
              </p>
            )}

            {/* File with Text */}
            {isFileAndText && message.file && renderFile(message.file)}
          </div>

          {/* Time */}
          <span
            className={`${isUser ? "text-end" : "text-start"} mt-1 text-[10px] text-xs text-gray-500`}
          >
            {formateTime(message.created_at)}
          </span>
        </div>

        {/* User Avatar */}
        {isUser && userData?.profile && (
          <div className="flex">
            <div className="flex h-8 w-8 items-center overflow-hidden rounded-full bg-gray-200 sm:h-10 sm:w-10 md:h-12 md:w-12">
              <ImageWithPlaceholder
                src={message?.user_profile || userData?.profile}
                alt="User"
                className="h-full w-full object-fill"
              />
            </div>
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <BsThreeDotsVertical className="text-sm text-gray-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-full">
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => handleDeleteMessage(message)}
                  >
                    {t("deleteMessage")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => handleCopy(message.message || message.text)}
                  >
                    {t("copy")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    );
  };

  const loadingIndicator = (
    <div className="py-2">
      <ChatMessageSkeleton count={3} />
    </div>
  );

  return (
    <>
      <div
        id="scrollableDiv"
        className="flex h-full w-full flex-col-reverse space-y-4 overflow-y-auto px-2 md:px-6 md:py-8"
      >
        {messages?.length > 0 ? (
          <InfiniteScroll
            dataLength={messages.length}
            next={loadMore}
            className="flex !h-full flex-col-reverse"
            inverse={true}
            hasMore={hasMore}
            loader={loadingIndicator}
            scrollableTarget="scrollableDiv"
          >
            {messages.map((message, index) => renderMessage(message, index))}
          </InfiniteScroll>
        ) : isLoading ? (
          <ChatMessageSkeleton count={6} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <Image
              width={0}
              height={0}
              src={NoChatFoundImg}
              alt="No Chat Found"
              className="h-min w-min"
            />
            <p className="primaryColor text-2xl font-medium">{t("startChat")}</p>
          </div>
        )}
      </div>

      {/* LightBox Component */}
      <LightBox
        photos={lightboxImages}
        viewerIsOpen={viewerIsOpen}
        currentImage={currentImage}
        onClose={() => setViewerIsOpen(false)}
        setCurrentImage={setCurrentImage}
        title_image={null}
        isProject={false}
      />
    </>
  );
};

export default ChatMessage;
