"use client";
import React, { useEffect, useState, memo } from "react";
import { useRouter } from "next/router";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../context/TranslationContext";

// Optimized confetti component using memo to prevent unnecessary re-renders
const Confetti = memo(() => {
  const [isPresent, safeToRemove] = usePresence();
  const [pieces] = useState(() => {
    // Create confetti pieces with optimized count (30 instead of 50)
    return Array.from({ length: 30 }, (_, i) => {
      // Precompute random values to avoid recalculations
      const size = Math.random() * 8 + 4; // Slightly smaller pieces
      const duration = Math.random() * 2.5 + 1.5; // Slightly faster animations
      const initialX = Math.random() * 100;
      const initialY = -10;
      const finalY = 100 + Math.random() * 10;
      // Use smaller angle changes for more natural movement
      const finalX = initialX + (Math.random() * 20 - 10);
      const rotation = Math.random() * 360;
      const finalRotation = rotation + Math.random() * 360;
      // Preselect color and shape for each piece
      const colors = [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#F3FF33",
        "#FF33F3",
        "#33FFF3",
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;

      return {
        id: i,
        size,
        duration,
        initialX,
        initialY,
        finalX,
        finalY,
        rotation,
        finalRotation,
        color,
        isCircle,
        delay: Math.random() * 0.5, // Add slight delay for more natural effect
      };
    });
  });

  // Use AnimatePresence for better animation management
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        {isPresent &&
          pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.initialX}vw`,
                y: `${piece.initialY}vh`,
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{
                x: `${piece.finalX}vw`,
                y: `${piece.finalY}vh`,
                rotate: piece.finalRotation,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: piece.duration,
                ease: "easeOut",
                delay: piece.delay,
              }}
              style={{
                position: "absolute",
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                borderRadius: piece.isCircle ? "50%" : "0%",
                // Add will-change for GPU acceleration
                willChange: "transform, opacity",
                // Add transform style for performance
                transformStyle: "preserve-3d",
              }}
              onAnimationComplete={!isPresent ? safeToRemove : undefined}
            />
          ))}
      </AnimatePresence>
    </div>
  );
});

Confetti.displayName = "Confetti";

const PaymentCheck = () => {
  const [isSuccess, setIsSuccess] = useState(null);
  const router = useRouter();
  const t = useTranslation();
  const { locale, slug } = router.query;

  useEffect(() => {
    // Extract the payment status from URL slug
    if (slug) {
      setIsSuccess(slug === "success");
    }
  }, [slug]);

  // Loading state while determining success/failure
  if (isSuccess === null || !locale) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-t-4 border-solid border-blue-500"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-lg font-medium text-gray-700"
        >
          {t("checkingPaymentStatus")}
        </motion.p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 p-6">
      {/* Only render confetti when success is true */}
      <AnimatePresence>{isSuccess && <Confetti />}</AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
      >
        {isSuccess ? (
          // Success UI
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 scale-125 animate-pulse rounded-full bg-green-100" />
              <FaCheckCircle className="relative z-10 h-24 w-24 text-green-500" />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="mb-2 text-3xl font-bold text-gray-800"
            >
              {t("paymentSuccessful")}
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="mb-4 h-1 w-16 rounded-full bg-green-500"
            />

            <motion.p variants={itemVariants} className="mb-8 text-gray-600">
              {t("paymentSuccessfulMessage")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${locale}`}>
                <Button className="primaryBg flex items-center gap-2 rounded-md px-6 py-5 text-lg text-white hover:bg-teal-600">
                  <FaHome className="mr-1" /> {t("returnToHome")}
                </Button>
              </Link>
            </motion.div>
          </div>
        ) : (
          // Failure UI
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 5, -5, 5, -5, 0] }}
              transition={{
                scale: { type: "spring", stiffness: 200, damping: 15 },
                rotate: { delay: 0.5, duration: 0.5 },
              }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 scale-125 rounded-full bg-red-100" />
              <FaTimesCircle className="relative z-10 h-24 w-24 text-red-500" />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="mb-2 text-3xl font-bold text-gray-800"
            >
              {t("paymentFailed")}
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="mb-4 h-1 w-16 rounded-full bg-red-500"
            />

            <motion.p variants={itemVariants} className="mb-8 text-gray-600">
              {t("paymentFailedMessage")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${locale}`}>
                <Button className="primaryBg flex items-center gap-2 rounded-md px-6 py-5 text-lg text-white hover:bg-teal-600">
                  <FaHome className="mr-1" /> {t("returnToHome")}
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCheck;
