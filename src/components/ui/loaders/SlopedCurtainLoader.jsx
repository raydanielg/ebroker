import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import BlueprintLoader from "./Loader";

// Create a static variable outside the component to track if animation is in progress
// This persists across re-renders and component instances
let isAnimationInProgress = false;

const SlopedCurtainLoader = ({ brandName = "eBroker", onAnimationComplete }) => {
    const [showLoading, setShowLoading] = useState(true);
    const [curtainUp, setCurtainUp] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);
    const animationStarted = useRef(false);

    useEffect(() => {
        // Skip if animation is already in progress
        if (isAnimationInProgress || animationStarted.current) {
            return;
        }

        // Mark animation as started
        isAnimationInProgress = true;
        animationStarted.current = true;

        // Show loading for 3 seconds
        const loadingTimer = setTimeout(() => {
            // Then animate the curtain up along with the loader
            setCurtainUp(true);

            // Remove component completely after animation completes
            setTimeout(() => {
                setShouldRender(false);
                // Reset the flag after animation is completely done
                isAnimationInProgress = false;
                // Call the callback if provided
                if (typeof onAnimationComplete === 'function') {
                    onAnimationComplete();
                }
            }, 2000); // Slightly longer than the animation to ensure smooth exit
        }, 3000);

        return () => {
            clearTimeout(loadingTimer);
            // If component unmounts before animation completes, reset the flag
            if (!curtainUp) {
                isAnimationInProgress = false;
            }
        };
    }, [curtainUp, onAnimationComplete]);

    if (!shouldRender) return null;

    return (
        <div id="curtain-loader" className="fixed inset-0 z-50 overflow-hidden">
            {/* Main container */}
            <div className="relative w-full h-full">
                {/* Blueprint Loader - positioned above the black overlay */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-30"
                    initial={{ opacity: 1 }}
                    animate={{
                        opacity: 1,
                        y: curtainUp ? "-100%" : 0 // Move up with the curtain
                    }}
                    transition={{
                        y: {
                            duration: 1.5,
                            ease: [0.25, 1, 0.5, 1],
                            delay: 0.1
                        }
                    }}
                >
                    <BlueprintLoader />
                </motion.div>

                {/* Black overlay with slide-up animation */}
                <motion.div
                    className="absolute inset-0 bg-black z-20"
                    style={{
                        originY: "bottom"
                    }}
                    initial={{
                        y: 0
                    }}
                    animate={{
                        y: curtainUp ? "-100%" : 0
                    }}
                    transition={{
                        duration: 1.5,
                        ease: [0.25, 1, 0.5, 1],
                        delay: 0.1
                    }}
                />
            </div>
        </div>
    );
};

export default SlopedCurtainLoader; 