import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APOLOGY_MESSAGES, FORGIVENESS_GIFS } from '../utils/constants';

const ApologyModal = ({ onClose }) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [language, setLanguage] = useState('english'); // Re-introduced language state: 'english' or 'short_msg'
  const [forgivenessStatus, setForgivenessStatus] = useState(null); // 'forgiven', 'not_forgiven', or null

  useEffect(() => {
    const openEnvelopeTimer = setTimeout(() => {
      setEnvelopeOpened(true);
    }, 500);

    return () => clearTimeout(openEnvelopeTimer);
  }, []);

  const handleEnvelopeOpenComplete = () => {
    const showMessageTimer = setTimeout(() => {
      setMessageVisible(true);
    }, 300);
    return () => clearTimeout(showMessageTimer);
  };

  const handleForgivenessChoice = (choice) => {
    setForgivenessStatus(choice);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full text-center border-4 border-pink-200 overflow-hidden"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ minHeight: '200px' }}
      >
        <motion.div
          initial={{ rotateX: 0, transformOrigin: 'top center' }}
          animate={envelopeOpened ? { rotateX: -90 } : {}}
          transition={{ duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }}
          onAnimationComplete={handleEnvelopeOpenComplete}
          className="absolute inset-0 bg-pink-100 rounded-3xl flex items-center justify-center"
          style={{
            zIndex: 2,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            transform: envelopeOpened ? 'rotateX(-90deg)' : 'rotateX(0deg)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-pink-500 text-6xl"
          >
            💌
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={messageVisible ? { y: '0%', opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative p-8"
          style={{ zIndex: 1 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition-colors duration-200"
            aria-label="Close"
          >
            &times;
          </button>
          <h3 className="text-3xl font-bold text-pink-600 mb-6">A Message From My Heart</h3>

          {forgivenessStatus === null ? ( // Only show apology message and language toggle if no forgiveness choice has been made
            <>
              <motion.p
                className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium leading-relaxed mb-6"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={language}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {language === 'english' ? APOLOGY_MESSAGES.english : APOLOGY_MESSAGES.short_msg}
                  </motion.span>
                </AnimatePresence>
              </motion.p>

              {language === 'english' && ( // Only show the toggle button if on the long message
                <motion.button
                  onClick={() => setLanguage('short_msg')}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-500 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Short Msg
                </motion.button>
              )}

              {language === 'short_msg' && ( // Show forgiveness buttons only if on the short message
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                  <motion.button
                    onClick={() => handleForgivenessChoice('forgiven')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Yes, I forgive you! ❤️
                  </motion.button>
                  <motion.button
                    onClick={() => handleForgivenessChoice('not_forgiven')}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-full shadow-md hover:from-red-600 hover:to-rose-700 transition duration-300 ease-in-out transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    I can't forgive you 💔
                  </motion.button>
                </div>
              )}
            </>
          ) : ( // Once a forgiveness choice is made, show the GIF
            <motion.div
              key={forgivenessStatus} // Key for AnimatePresence to detect change and re-animate
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 flex flex-col items-center"
            >
             <video
  src={forgivenessStatus === 'forgiven' ? FORGIVENESS_GIFS.forgiven : FORGIVENESS_GIFS.notForgiven}
  alt={forgivenessStatus === 'forgiven' ? "Forgiven animation" : "Not Forgiven animation"}
  className="rounded-lg shadow-lg max-w-full h-auto"
  style={{ maxHeight: '250px' }}
  autoPlay // Autoplays the video
  loop     // Loops the video
  muted    // Mutes the video (important for autoplay in many browsers)
  playsInline // Ensures it plays inline on iOS
>
  Your browser does not support the video tag.
</video>
              <p className="mt-4 text-xl font-semibold text-gray-800">
                {forgivenessStatus === 'forgiven' ? "Thank you so much! It means the world to me." : "I understand. I'll continue to reflect and try harder."}
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Close
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ApologyModal;