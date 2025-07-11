import React from 'react';
import { motion } from 'framer-motion';

const MusicPlayer = ({ currentSong, isPlaying, onPlayPause, onNext, onPrevious }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-md p-4 shadow-xl rounded-t-2xl flex flex-col items-center justify-center space-y-3 z-50 border-t-2 border-pink-200"
    >
      <div className="text-lg font-semibold text-gray-800">
        Now Playing: <span className="text-pink-600">{currentSong.title}</span>
      </div>
      <div className="flex space-x-6">
        <button
          onClick={onPrevious}
          className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full shadow-lg hover:from-purple-500 hover:to-pink-500 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-300"
          aria-label="Previous Song"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onPlayPause}
          className="p-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-rose-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-300"
          aria-label={isPlaying ? "Pause Song" : "Play Song"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197 2.132A1 1 0 0010 14.65V9.35a1 1 0 001.555-.832l3.197 2.132a1 1 0 010 1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        <button
          onClick={onNext}
          className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full shadow-lg hover:from-purple-500 hover:to-pink-500 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-300"
          aria-label="Next Song"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;