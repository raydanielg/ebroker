import { motion } from "framer-motion";

// // 4. House Blueprint Loader Component
const BlueprintLoader = ({ brandName = process.env.NEXT_PUBLIC_APPLICATION_NAME, color = "white" }) => {
  // Drawing animation variants
  const drawPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: i => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.4, duration: 1.5, ease: "easeInOut" },
        opacity: { delay: i * 0.4, duration: 0.01 }
      }
    })
  };

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="w-32 h-32 relative mb-4">
        <motion.svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${color === "white" ? "text-white" : "text-primary"}`}
        >
          {/* House outline */}
          <motion.path
            d="M 15 50 L 50 20 L 85 50 L 85 85 L 15 85 L 15 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            variants={drawPathVariants}
            custom={0}
            initial="hidden"
            animate="visible"
          />
          
          {/* Door */}
          <motion.path
            d="M 40 85 L 40 60 L 60 60 L 60 85"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,2"
            variants={drawPathVariants}
            custom={1}
            initial="hidden"
            animate="visible"
          />
          
          {/* Windows */}
          <motion.path
            d="M 25 50 L 25 65 L 35 65 L 35 50 L 25 50 Z M 65 50 L 75 50 L 75 65 L 65 65 L 65 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,2"
            variants={drawPathVariants}
            custom={2}
            initial="hidden"
            animate="visible"
          />
          
          {/* Roof detail */}
          <motion.path
            d="M 40 35 L 40 45 L 60 45 L 60 35"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,2"
            variants={drawPathVariants}
            custom={3}
            initial="hidden"
            animate="visible"
          />

          {/* Blueprint grid - horizontal */}
          {/* <motion.path
            d="M 10 30 L 90 30 M 10 40 L 90 40 M 10 50 L 90 50 M 10 60 L 90 60 M 10 70 L 90 70 M 10 80 L 90 80"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeOpacity="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          /> */}
          
          {/* Blueprint grid - vertical */}
          {/* <motion.path
            d="M 20 15 L 20 90 M 30 15 L 30 90 M 40 15 L 40 90 M 50 15 L 50 90 M 60 15 L 60 90 M 70 15 L 70 90 M 80 15 L 80 90"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeOpacity="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          /> */}
        </motion.svg>
      </div>
      
      <motion.div
        className="text-3xl md:text-6xl font-bold text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.5,
          duration: 0.8, 
          ease: "easeOut"
        }}
      >
        {brandName}
      </motion.div>
    </div>
  );
};


export default BlueprintLoader;
