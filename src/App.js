import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './components/LoginForm';
import SorryMessage from './components/SorryMessage';
import MusicPlayer from './components/MusicPlayer';
import { PLAYLIST, CORRECT_USERNAME, CORRECT_PASSWORD } from './utils/constants';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Effect to handle music autoplay and login state changes
  useEffect(() => {
    if (audioRef.current && isLoggedIn) {
      audioRef.current.src = PLAYLIST[currentSongIndex].src;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Autoplay prevented:', error);
        setIsPlaying(false);
      });
    } else if (audioRef.current && !isLoggedIn) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isLoggedIn, currentSongIndex]);

  // Effect to handle song ending and play the next one
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSongEnd = () => {
      handleNextSong();
    };

    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [currentSongIndex]);

  // Handles user login attempt
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  // Toggles play/pause for the music player
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Plays the next song in the playlist
  const handleNextSong = () => {
    let nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
  };

  // Plays the previous song in the playlist
  const handlePreviousSong = () => {
    let prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentSongIndex(prevIndex);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-inter relative"
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{
        duration: 30,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      }}
      style={{
        background: 'linear-gradient(270deg, #fce7f3, #e9d5ff, #dbeafe, #bfdbfe)',
        backgroundSize: '400% 400%',
      }}
    >
      <audio ref={audioRef} preload="auto" />

      <AnimatePresence mode="wait">
        {isLoggedIn ? (
          <SorryMessage key="sorry" />
        ) : (
          <LoginForm
            key="login"
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            loginError={loginError}
          />
        )}
      </AnimatePresence>

      {isLoggedIn && (
        <MusicPlayer
          currentSong={PLAYLIST[currentSongIndex]}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNextSong}
          onPrevious={handlePreviousSong}
        />
      )}
    </motion.div>
  );
}

export default App;