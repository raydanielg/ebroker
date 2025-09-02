"use client";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";
import { useTranslation } from "../context/TranslationContext";
import { IoDocumentOutline } from "react-icons/io5";
const FileAttachments = ({ files, projectCategory, isProperty = false }) => {
  const t = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const getFileBg = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "blueTextColor blueBgLight";
      case "doc":
        return "primaryRentBg primaryRentText";
      case "docx":
        return "primaryRentBg primaryRentText";
      default:
        return "primaryBgLight primaryTextColor";
    }
  };
  const getFileIcon = (fileType) => {
    // Map file extensions to their appropriate icon/display
    return (
      <div
        className={`primaryBackgroundBg relative flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-gray-200 ${getFileBg(fileType)}`}
      >
        <IoDocumentOutline size={55} className="primaryColor" />
        <span className="primaryColor absolute left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
          {fileType.toUpperCase()}
        </span>
      </div>
    );
  };

  const handleDownload = async (file) => {
    try {
      setIsDownloading(true);

      // Construct the file URL based on your backend or API
      const fileUrl = isProperty ? `${file?.file}` : `${file?.name}`;
      // Fetch the file data
      const response = await fetch(fileUrl);

      // Get the file data as a Blob
      const blob = await response.blob();

      // Create a URL for the Blob object
      const blobUrl = URL.createObjectURL(blob);

      // Create an anchor element
      const link = document.createElement("a");

      // Set the anchor's href attribute to the Blob URL
      link.href = blobUrl;

      // Specify the file name for the download
      link.setAttribute("download", isProperty ? file?.file_name : file?.name);

      // Append the anchor element to the body
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the anchor element from the body
      document.body.removeChild(link);

      // Revoke the Blob URL to release memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <>
      {files?.length > 0 && (
        <div className="mb-7 w-full rounded-2xl border newBorder bg-white">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-bold brandColor md:text-xl">
              {t("fileAttachments")}
            </h2>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {files &&
                files.map((file, index) => {
                  const fileExtension = isProperty
                    ? file?.type
                    : file?.name?.split(".").pop();
                  const fileName = file?.name?.split("/images/")[1];
                  return (
                    <button key={index} className="flex flex-row gap-2 items-center newBorder rounded-2xl p-4"
                      onClick={() => handleDownload(file)}
                    >
                      {getFileIcon(fileExtension, index)}
                      <p className="mb-3 mt-3 max-w-full truncate text-sm text-gray-700">
                        {/* {fileName} */}
                        {projectCategory}
                        {t("document")}
                        {index + 1}
                      </p>
                      {/* <button
                        onClick={() => handleDownload(file)}
                        disabled={isDownloading}
                        className="brandBg hover:primaryBg flex items-center justify-center gap-2 rounded-md border border-gray-200 px-5 py-2 text-white hover:text-white"
                        aria-label={`Download ${file.name}`}
                        tabIndex={0}
                      >
                        <LuDownload className="h-4 w-4" />
                        <span className="text-sm">{t("download")}</span>
                      </button> */}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileAttachments;
