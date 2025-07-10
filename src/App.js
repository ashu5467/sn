import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three'; // Import Three.js

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Hardcoded credentials for demonstration
  const correctUsername = 'user';
  const correctPassword = 'password';

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === correctUsername && password === correctPassword) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  return (
    // Main container with animated background gradient
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 font-inter"
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{
        duration: 30, // Slower, more dreamy animation
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      }}
      style={{
        // Softer, more pastel, and warm romantic gradient colors
        background: 'linear-gradient(270deg, #fce7f3, #e9d5ff, #dbeafe, #bfdbfe)',
        backgroundSize: '400% 400%', // Make the gradient larger than the viewport
      }}
    >
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
    </motion.div>
  );
}

// Login Form Component
const LoginForm = ({ username, setUsername, password, setPassword, handleLogin, loginError }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200 backdrop-blur-sm bg-opacity-80"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300"
            required
          />
        </div>
        {loginError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {loginError}
          </motion.p>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-lg"
        >
          Log In
        </button>
      </form>
    </motion.div>
  );
};

// Apology Modal Component
const ApologyModal = ({ onClose, apologyMessages, language, setLanguage }) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    // Stage 1: Envelope appears (handled by AnimatePresence on modal container)
    // Stage 2: Envelope opens after a short delay
    const openEnvelopeTimer = setTimeout(() => {
      setEnvelopeOpened(true);
    }, 500); // Delay before the envelope starts to open

    return () => clearTimeout(openEnvelopeTimer);
  }, []);

  // Callback when envelope opening animation is complete
  const handleEnvelopeOpenComplete = () => {
    // Stage 3: Message slides out after envelope is fully open
    const showMessageTimer = setTimeout(() => {
      setMessageVisible(true);
    }, 300); // Delay before message slides out
    return () => clearTimeout(showMessageTimer);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* The main envelope container that scales in/out */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full text-center border-4 border-pink-200 overflow-hidden"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ minHeight: '200px' }} // Ensure it has a minimum height for the message to slide into
      >
        {/* Envelope Top Flap - animates to open */}
        <motion.div
          initial={{ rotateX: 0, transformOrigin: 'top center' }}
          animate={envelopeOpened ? { rotateX: -90 } : {}} // Rotate to open downwards
          transition={{ duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }} // Spring-like ease
          onAnimationComplete={handleEnvelopeOpenComplete}
          className="absolute inset-0 bg-pink-100 rounded-3xl flex items-center justify-center" // This is the "flap"
          style={{
            zIndex: 2, // Keep flap above message initially
            backfaceVisibility: 'hidden', // Hide back of flap during rotation
            WebkitBackfaceVisibility: 'hidden', // For Safari
            transformStyle: 'preserve-3d',
            transform: envelopeOpened ? 'rotateX(-90deg)' : 'rotateX(0deg)', // Initial state for CSS
          }}
        >
          <span className="text-pink-500 text-2xl font-bold">✉️</span>
        </motion.div>

        {/* Message Card - slides out from under the flap */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }} // Start below the visible area
          animate={messageVisible ? { y: '0%', opacity: 1 } : {}} // Slide up to position
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative p-8" // Padding inside the message card
          style={{ zIndex: 1 }} // Ensure message is below flap initially
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition-colors duration-200"
            aria-label="Close"
          >
            &times;
          </button>
          <h3 className="text-3xl font-bold text-pink-600 mb-6">A Message From My Heart</h3>
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
                {apologyMessages[language]}
              </motion.span>
            </AnimatePresence>
          </motion.p>
          <motion.button
            onClick={() => setLanguage(language === 'english' ? 'marathi' : 'english')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-500 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {language === 'english' ? 'मराठीत बदला' : 'Change to English'}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};


// Sorry Message Component
const SorryMessage = () => {
  const text = "Sorry";
  // State to manage the current language of the apology message
  const [language, setLanguage] = useState('english'); // 'english' or 'marathi'
  // State to control modal visibility
  const [showApologyModal, setShowApologyModal] = useState(false);

  // Translation object for the apology message
  const apologyMessages = {
    english: "I've been thinking about what I said, Sonu, and my heart feels so heavy knowing I hurt you. When I'm angry, my words sometimes run wild, and I said things I absolutely didn't mean. Please don't let my thoughtless anger stop us from talking. You mean too much to me.",
    marathi: "मी काय बोललो याचा विचार करत होतो, आणि तुला दुखावल्याचं कळल्यावर माझं हृदयच पिळवटून निघालंय, माझ्या लाडक्या सोनू. जेव्हा मी रागात असतो ना, तेव्हा माझे शब्द कधीकधी खूपच भरकटतात, आणि मी अशा काही गोष्टी बोलून टाकल्या ज्याचा मला मुळीच अर्थ नव्हता. विश्वास ठेव माझ्यावर. माझ्या त्या चुकीच्या रागामुळे आपलं बोलणं थांबवू नकोस प्लीज. तू फक्त माझी मैत्रीण नाहीस, तू माझ्या आयुष्यातला सर्वात सुंदर क्षण आहेस.",
  };

  // More vibrant and romantic color palette
  const colors = [
    "from-rose-500 to-pink-600",
    "from-purple-500 to-fuchsia-600",
    "from-indigo-500 to-violet-600",
    "from-blue-500 to-sky-600",
    "from-emerald-500 to-teal-600",
    "from-red-500 to-orange-600", // Added more colors for longer words if needed
  ];

  const letterVariants = {
    hidden: { opacity: 0, y: 100, rotateX: -90, scale: 0.5, transformOrigin: "center bottom" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: i * 0.1, // Staggered entry
        duration: 1.2,
        // Softer, more fluid ease for a cute effect
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad-like
      },
    }),
    hover: {
      y: -20, // Lift higher
      scale: 1.2, // Scale up more
      rotateY: [0, 15, -15, 0], // Funky rotation on hover
      rotateX: [0, 10, -10, 0],
      filter: "drop-shadow(0 15px 15px rgba(255, 100, 200, 0.6))", // Romantic glow shadow
      transition: {
        duration: 0.4,
        ease: "easeOut",
        repeat: Infinity, // Keep animating on hover
        repeatType: "mirror",
      },
    },
    // Add a subtle pulsating glow animation for the text
    glow: {
      filter: ["drop-shadow(0 0px 5px rgba(255, 150, 200, 0.3))", "drop-shadow(0 0px 15px rgba(255, 150, 200, 0.8))", "drop-shadow(0 0px 5px rgba(255, 150, 200, 0.3))"],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  const mountRef = useRef(null); // Ref for the canvas container

  useEffect(() => {
    let scene, camera, renderer, rose, particles, hearts = [];
    let animationFrameId;

    const initThree = () => {
      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100); // Adjusted far plane
      camera.position.z = 3; // Position camera to see the rose and particles

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering quality
      mountRef.current.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7); // Stronger directional light
      directionalLight.position.set(5, 10, 5).normalize();
      scene.add(directionalLight);
      const pointLight = new THREE.PointLight(0xffaaff, 1.5, 10); // Romantic pinkish point light
      pointLight.position.set(-2, 1, 3);
      scene.add(pointLight);

      // --- Create a more realistic rose ---
      rose = new THREE.Group();
      rose.scale.set(0.8, 0.8, 0.8); // Scale down the entire rose
      rose.position.set(0, -0.5, -2); // Position it further back and slightly down

      // Rose Bud (using LatheGeometry for a more organic shape)
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.3 + 0.1, (i - 5) * 0.1));
      }
      const budGeometry = new THREE.LatheGeometry(points, 32);
      const budMaterial = new THREE.MeshStandardMaterial({ color: 0xff007f, roughness: 0.4, metalness: 0.1 }); // Deep rose pink
      const bud = new THREE.Mesh(budGeometry, budMaterial);
      rose.add(bud);

      // Petals (using custom Shape and ExtrudeGeometry for organic look)
      const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xff3399, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide }); // Slightly lighter pink
      const numPetalLayers = 3;
      const petalsPerLayer = [6, 8, 10]; // Number of petals in each layer
      const petalScaleFactors = [0.8, 1.0, 1.2]; // Scale for each layer
      const petalYOffsets = [0.1, 0.0, -0.1]; // Y offset for each layer

      for (let layer = 0; layer < numPetalLayers; layer++) {
        for (let i = 0; i < petalsPerLayer[layer]; i++) {
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.bezierCurveTo(0.1, 0.5, 0.4, 0.7, 0.5, 0.5);
          shape.bezierCurveTo(0.6, 0.7, 0.9, 0.5, 1.0, 0);
          shape.bezierCurveTo(0.9, -0.5, 0.6, -0.7, 0.5, -0.5);
          shape.bezierCurveTo(0.4, -0.7, 0.1, -0.5, 0, 0);

          const extrudeSettings = {
            steps: 2,
            depth: 0.05,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 1,
          };

          const petalGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const petal = new THREE.Mesh(petalGeometry, petalMaterial);

          const angle = (i * Math.PI * 2) / petalsPerLayer[layer];
          petal.position.x = Math.cos(angle) * 0.3 * petalScaleFactors[layer];
          petal.position.z = Math.sin(angle) * 0.3 * petalScaleFactors[layer];
          petal.position.y = petalYOffsets[layer];

          petal.rotation.y = angle + Math.PI / 2; // Orient correctly
          petal.rotation.x = Math.PI / 2 - 0.2; // Tilt slightly

          petal.scale.set(petalScaleFactors[layer], petalScaleFactors[layer], petalScaleFactors[layer]);
          rose.add(petal);
        }
      }

      // Stem (simple cylinder)
      const stemGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 32);
      const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.6 }); // Forest green
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = -0.8;
      rose.add(stem);

      scene.add(rose);

      // --- Sparkling Particle System ---
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const particleColor = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        // Position particles randomly in a sphere
        positions[i * 3] = (Math.random() * 2 - 1) * 10; // X
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * 10; // Y
        positions[i * 3 + 2] = (Math.random() * 2 - 1) * 10; // Z

        // Assign random romantic colors (pink, purple, gold)
        const hue = Math.random();
        if (hue < 0.33) particleColor.set(0xffaaff); // Pink
        else if (hue < 0.66) particleColor.set(0xcc99ff); // Purple
        else particleColor.set(0xffddaa); // Gold
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;

        sizes[i] = Math.random() * 0.1 + 0.05; // Random size
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        blending: THREE.AdditiveBlending, // For glowing effect
        transparent: true,
        depthWrite: false, // Prevents particles from obscuring each other incorrectly
        sizeAttenuation: true, // Particles closer to camera appear larger
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // --- Floating Hearts ---
      // Custom Heart Shape Geometry
      function createHeartShape(scale = 1) {
        const shape = new THREE.Shape();
        const x = 0, y = 0;
        shape.moveTo(x + 0.5 * scale, y + 0.5 * scale);
        shape.bezierCurveTo(x + 0.5 * scale, y + 0.5 * scale, x + 0.4 * scale, y, x, y);
        shape.bezierCurveTo(x - 0.6 * scale, y, x - 0.6 * scale, y + 0.7 * scale, x - 0.6 * scale, y + 0.7 * scale);
        shape.bezierCurveTo(x - 0.6 * scale, y + 1.1 * scale, x - 0.3 * scale, y + 1.5 * scale, x + 0.5 * scale, y + 1.9 * scale);
        shape.bezierCurveTo(x + 1.3 * scale, y + 1.5 * scale, x + 1.6 * scale, y + 1.1 * scale, x + 1.6 * scale, y + 0.7 * scale);
        shape.bezierCurveTo(x + 1.6 * scale, y + 0.7 * scale, x + 1.6 * scale, y, x + 1.0 * scale, y);
        shape.bezierCurveTo(x + 0.7 * scale, y, x + 0.5 * scale, y + 0.5 * scale, x + 0.5 * scale, y + 0.5 * scale);

        const extrudeSettings = {
          steps: 1,
          depth: 0.1 * scale,
          bevelEnabled: true,
          bevelThickness: 0.02 * scale,
          bevelSize: 0.02 * scale,
          bevelOffset: 0,
          bevelSegments: 1,
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
      }

      const heartMaterial = new THREE.MeshStandardMaterial({
        color: 0xffc0cb, // Light pink
        transparent: true,
        opacity: 0.7,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0xffc0cb, // Emissive for a glowing effect
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
      });

      const numHearts = 15;
      for (let i = 0; i < numHearts; i++) {
        const heart = new THREE.Mesh(createHeartShape(0.1 + Math.random() * 0.1), heartMaterial);
        heart.position.set(
          (Math.random() * 2 - 1) * 5, // X
          (Math.random() * 2 - 1) * 5, // Y
          (Math.random() * 2 - 1) * 5 // Z
        );
        heart.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        heart.userData.speed = Math.random() * 0.002 + 0.001; // Individual floating speed
        heart.userData.rotationSpeed = Math.random() * 0.01 + 0.005;
        hearts.push(heart);
        scene.add(heart);
      }


      // Animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Rotate the rose
        rose.rotation.y += 0.003; // Slower rotation
        rose.rotation.x = Math.sin(Date.now() * 0.0003) * 0.05; // Gentle bobbing

        // Animate particles
        const positions = particles.geometry.attributes.position.array;
        const sizes = particles.geometry.attributes.size.array;
        for (let i = 0; i < particleCount; i++) {
          // Move particles
          positions[i * 3 + 1] += 0.005; // Move upwards
          if (positions[i * 3 + 1] > 5) { // Reset if too high
            positions[i * 3 + 1] = -5;
          }

          // Twinkle effect
          sizes[i] = (Math.sin(Date.now() * 0.005 + i) * 0.02 + 0.08) * (Math.random() * 0.5 + 0.5);
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;

        // Animate hearts
        hearts.forEach(heart => {
          heart.position.y += heart.userData.speed;
          heart.rotation.x += heart.userData.rotationSpeed;
          heart.rotation.y += heart.userData.rotationSpeed / 2;
          heart.rotation.z += heart.userData.rotationSpeed / 3;

          if (heart.position.y > 5) { // Reset heart position if it floats too high
            heart.position.y = -5;
            heart.position.x = (Math.random() * 2 - 1) * 5;
            heart.position.z = (Math.random() * 2 - 1) * 5;
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (mountRef.current) {
          camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        // Dispose of Three.js objects to prevent memory leaks
        scene.traverse((object) => {
          if (object.isMesh || object.isPoints) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              // Ensure material is an array or single material
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        renderer.dispose();
      };
    };

    if (mountRef.current) {
      initThree();
    }

  }, []); // Empty dependency array means this runs once on mount

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotateY: 30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.7, rotateY: -30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full w-full p-4 relative z-10"
      style={{ perspective: '1200px' }} // Enhanced perspective for deeper 3D
    >
      {/* Canvas for 3D Rose and Particles - positioned absolutely in the background */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0" // Position behind text
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }} // Ensure it doesn't block interactions
      ></div>

      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-center relative z-10"
          // Apply the pulsating glow animation to the entire h1
          variants={letterVariants}
          animate="glow"
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            // Increased horizontal margin to ensure proper display, especially for 'y'
            className={`inline-block mx-1 sm:mx-2 bg-clip-text text-transparent bg-gradient-to-br ${colors[i % colors.length]} drop-shadow-lg`}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={i}
            style={{
              transformStyle: "preserve-3d", // Crucial for nested 3D transforms
              transform: `translateZ(${i * 8}px) rotateY(${i * 3}deg)`, // More pronounced 3D offset
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
            apologyMessages={apologyMessages}
            language={language}
            setLanguage={setLanguage}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default App;
