import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApologyModal from './ApologyModal';
import useThreeScene from '../hooks/useThreeScene';
import { APOLOGY_MESSAGES } from '../utils/constants'; // Import messages from constants

const SorryMessage = () => {
  const text = "Sorry";
  const [language, setLanguage] = useState('english');
  const [showApologyModal, setShowApologyModal] = useState(false);

  const colors = [
    "from-rose-500 to-pink-600", "from-purple-500 to-fuchsia-600",
    "from-indigo-500 to-violet-600", "from-blue-500 to-sky-600",
    "from-emerald-500 to-teal-600", "from-red-500 to-orange-600",
  ];

  const letterVariants = {
    hidden: { opacity: 0, y: 100, rotateX: -90, scale: 0.5, transformOrigin: "center bottom" },
    visible: (i) => ({
      opacity: 1, y: 0, rotateX: 0, scale: 1,
      transition: { delay: i * 0.1, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
    hover: {
      y: -20, scale: 1.2, rotateY: [0, 15, -15, 0], rotateX: [0, 10, -10, 0],
      filter: "drop-shadow(0 15px 15px rgba(255, 100, 200, 0.6))",
      transition: { duration: 0.4, ease: "easeOut", repeat: Infinity, repeatType: "mirror" },
    },
    glow: {
      filter: ["drop-shadow(0 0px 5px rgba(255, 150, 200, 0.3))", "drop-shadow(0 0px 15px rgba(255, 150, 200, 0.8))", "drop-shadow(0 0px 5px rgba(255, 150, 200, 0.3))"],
      transition: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
    },
  };

  const mountRef = useRef(null);
  // Use the custom hook for Three.js scene
  useThreeScene(mountRef);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotateY: 30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.7, rotateY: -30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full w-full p-4 relative z-10"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={mountRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      ></div>

      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-center relative z-10"
        variants={letterVariants}
        animate="glow"
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className={`inline-block mx-1 sm:mx-2 bg-clip-text text-transparent bg-gradient-to-br ${colors[i % colors.length]} drop-shadow-lg`}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={i}
            style={{
              transformStyle: "preserve-3d",
              transform: `translateZ(${i * 8}px) rotateY(${i * 3}deg)`,
            }}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <motion.button
        onClick={() => setShowApologyModal(true)}
        className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xl rounded-full shadow-xl hover:from-pink-600 hover:to-rose-700 transition duration-300 ease-in-out transform hover:scale-105 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }}
      >
        Read My Apology
      </motion.button>

      <AnimatePresence>
        {showApologyModal && (
          <ApologyModal
            onClose={() => setShowApologyModal(false)}
            apologyMessages={APOLOGY_MESSAGES}
            language={language}
            setLanguage={setLanguage}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SorryMessage;