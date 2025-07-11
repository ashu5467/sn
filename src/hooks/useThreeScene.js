import { useEffect } from 'react';
import * as THREE from 'three';

const useThreeScene = (mountRef) => {
  useEffect(() => {
    let scene, camera, renderer, rose, particles, hearts = [];
    let animationFrameId;

    const initThree = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
      camera.position.z = 3;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight.position.set(5, 10, 5).normalize();
      scene.add(directionalLight);
      const pointLight = new THREE.PointLight(0xffaaff, 1.5, 10);
      pointLight.position.set(-2, 1, 3);
      scene.add(pointLight);

      rose = new THREE.Group();
      rose.scale.set(0.8, 0.8, 0.8);
      rose.position.set(0, -0.5, -2);

      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.3 + 0.1, (i - 5) * 0.1));
      }
      const budGeometry = new THREE.LatheGeometry(points, 32);
      const budMaterial = new THREE.MeshStandardMaterial({ color: 0xff007f, roughness: 0.4, metalness: 0.1 });
      const bud = new THREE.Mesh(budGeometry, budMaterial);
      rose.add(bud);

      const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xff3399, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide });
      const numPetalLayers = 3;
      const petalsPerLayer = [6, 8, 10];
      const petalScaleFactors = [0.8, 1.0, 1.2];
      const petalYOffsets = [0.1, 0.0, -0.1];

      for (let layer = 0; layer < numPetalLayers; layer++) {
        for (let i = 0; i < petalsPerLayer[layer]; i++) {
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.bezierCurveTo(0.1, 0.5, 0.4, 0.7, 0.5, 0.5);
          shape.bezierCurveTo(0.6, 0.7, 0.9, 0.5, 1.0, 0);
          shape.bezierCurveTo(0.9, -0.5, 0.6, -0.7, 0.5, -0.5);
          shape.bezierCurveTo(0.4, -0.7, 0.1, -0.5, 0, 0);

          const extrudeSettings = {
            steps: 2, depth: 0.05, bevelEnabled: true, bevelThickness: 0.01,
            bevelSize: 0.01, bevelOffset: 0, bevelSegments: 1,
          };

          const petalGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const petal = new THREE.Mesh(petalGeometry, petalMaterial);

          const angle = (i * Math.PI * 2) / petalsPerLayer[layer];
          petal.position.x = Math.cos(angle) * 0.3 * petalScaleFactors[layer];
          petal.position.z = Math.sin(angle) * 0.3 * petalScaleFactors[layer];
          petal.position.y = petalYOffsets[layer];

          petal.rotation.y = angle + Math.PI / 2;
          petal.rotation.x = Math.PI / 2 - 0.2;

          petal.scale.set(petalScaleFactors[layer], petalScaleFactors[layer], petalScaleFactors[layer]);
          rose.add(petal);
        }
      }

      const stemGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 32);
      const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.6 });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = -0.8;
      rose.add(stem);

      scene.add(rose);

      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const particleColor = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() * 2 - 1) * 10;
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
        positions[i * 3 + 2] = (Math.random() * 2 - 1) * 10;

        const hue = Math.random();
        if (hue < 0.33) particleColor.set(0xffaaff);
        else if (hue < 0.66) particleColor.set(0xcc99ff);
        else particleColor.set(0xffddaa);
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;

        sizes[i] = Math.random() * 0.1 + 0.05;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1, vertexColors: true, blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false, sizeAttenuation: true,
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

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
          steps: 1, depth: 0.1 * scale, bevelEnabled: true, bevelThickness: 0.02 * scale,
          bevelSize: 0.02 * scale, bevelOffset: 0, bevelSegments: 1,
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
      }

      const heartMaterial = new THREE.MeshStandardMaterial({
        color: 0xffc0cb, transparent: true, opacity: 0.7,
        roughness: 0.3, metalness: 0.1, emissive: 0xffc0cb,
        emissiveIntensity: 0.3, side: THREE.DoubleSide
      });

      const numHearts = 15;
      for (let i = 0; i < numHearts; i++) {
        const heart = new THREE.Mesh(createHeartShape(0.1 + Math.random() * 0.1), heartMaterial);
        heart.position.set(
          (Math.random() * 2 - 1) * 5, (Math.random() * 2 - 1) * 5, (Math.random() * 2 - 1) * 5
        );
        heart.rotation.set(
          Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI
        );
        heart.userData.speed = Math.random() * 0.002 + 0.001;
        heart.userData.rotationSpeed = Math.random() * 0.01 + 0.005;
        hearts.push(heart);
        scene.add(heart);
      }

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        rose.rotation.y += 0.003;
        rose.rotation.x = Math.sin(Date.now() * 0.0003) * 0.05;

        const positions = particles.geometry.attributes.position.array;
        const sizes = particles.geometry.attributes.size.array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += 0.005;
          if (positions[i * 3 + 1] > 5) {
            positions[i * 3 + 1] = -5;
          }
          sizes[i] = (Math.sin(Date.now() * 0.005 + i) * 0.02 + 0.08) * (Math.random() * 0.5 + 0.5);
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;

        hearts.forEach(heart => {
          heart.position.y += heart.userData.speed;
          heart.rotation.x += heart.userData.rotationSpeed;
          heart.rotation.y += heart.userData.rotationSpeed / 2;
          heart.rotation.z += heart.userData.rotationSpeed / 3;

          if (heart.position.y > 5) {
            heart.position.y = -5;
            heart.position.x = (Math.random() * 2 - 1) * 5;
            heart.position.z = (Math.random() * 2 - 1) * 5;
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (mountRef.current) {
          camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        // Dispose of Three.js resources
        scene.traverse((object) => {
          if (object.isMesh || object.isPoints) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
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

  }, [mountRef]); // Rerun effect if mountRef changes (though it shouldn't for a static ref)
};

export default useThreeScene;