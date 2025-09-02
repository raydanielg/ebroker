"use client"
import { useState, useEffect } from "react"
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder"

const ImageToSVG = ({ imageUrl, className, alt }) => {
    const [svg, setSvg] = useState("")

    useEffect(() => {
        const fetchSvg = async () => {
            try {
                const response = await fetch(imageUrl)
                const originalSvgContent = await response.text();

                // Replace <defs> with <use>
                const modifiedSvgContent = originalSvgContent.replace(/<defs>([\s\S]*?)<\/defs>/, '');

                setSvg(modifiedSvgContent);
            } catch (error) {
                console.error("Error fetching SVG:", error)
            }
        }
        if (imageUrl) {
            fetchSvg()
        }
    }, [imageUrl])
    return (
        svg ?
            <div className={className} dangerouslySetInnerHTML={{ __html: svg }} aria-label={alt} />
            :
            <ImageWithPlaceholder src={imageUrl} className={"w-12 h-12"} alt={alt} />
    )
}

export default ImageToSVG