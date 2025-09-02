"use client";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import { useSelector } from "react-redux";

const ImageWithPlaceholder = ({
  src,
  alt,
  className,
  imageClassName = "",
}) => {
  const webSettings = useSelector((state) => state.WebSetting?.data);

  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!src || src === "") {
      setImageSrc(webSettings?.web_placeholder_logo || Logo);
    } else {
      setImageSrc(src);
      setIsLoading(false)
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false); // Set loading to false when image loads
  };

  const handleError = () => {
    setImageSrc(webSettings?.web_placeholder_logo || Logo);
    setIsError(true);
    setIsLoading(false); // Set loading to false when image fails to load
  };

  return (
    <div className={`relative ${className} ${isLoading ? "flex justify-center items-center" : ""}`}>
      {isLoading ? (
        <Image
          width={0}
          height={0}
          src={webSettings?.web_placeholder_logo || Logo}
          alt="loading"
          className="h-[200px] w-[200px] animate-pulse object-contain opacity-30" // Add animation class
        />
      ) : (
        <Image
          width={0}
          height={0}
          src={
            typeof imageSrc === "object" && imageSrc?.src
              ? imageSrc.src
              : imageSrc
          }
          alt={alt}
          className={`${className} ${imageClassName} ${isError ? "!object-contain" : ""}`} // Fade-in effect
          onLoad={handleLoad}
          onError={handleError}
          priority={true}
        />
      )}
    </div>
  );
};

export default ImageWithPlaceholder;
