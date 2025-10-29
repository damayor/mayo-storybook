import { useControls } from 'leva';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import CursorTrail from '../../../../components/cursor-trail/CursorTrail';

interface Sphere {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  radius: number;
}

export function Pool3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRoom, setShowRoom] = useState(false);

  const gridDivisions = 11;
  const roomPositionZ = -2;
  const { roomSizeX,roomSizeY,roomSizeZ} = {roomSizeX:22, roomSizeY:8, roomSizeZ:20}
  const forceRate = 0.25;
  const damping = 0.99;
  const bounciness = -0.7;
  const blackoutTime = 2.5;

  // const { 
  //   // forceX, 
  //   // forceY, 
  //   // forceZ,
  //   // roomSizeX,roomSizeY,roomSizeZ,
  //   // roomPositionZ,
  //   // gridDivisions,
  //   // forceRate,
  //   // blackoutTime,
  //   // damping,
  //   // bounciness
  // } = useControls({
  //   forceRate: { value: 0.08, min: 0, max: 0.5, step: 0.01 },
  
  //   roomSizeX: { value: 20, min: 5, max: 25, step: 1 },
  //   roomSizeY: { value: 10, min: 5, max: 20, step: 1 },
  //   roomSizeZ: { value: 22, min: 5, max: 30, step: 1 },
  //   roomPositionZ: { value: 0, min: -5, max: 10, step: 1 },
  //   gridDivisions: { value: 10, min: 5, max: 20, step: 1 },
  //   blackoutTime: { value: 2, min: 0.5, max: 5, step: 0.1 },
  //   // damping: { value: 0.99, min: 0.9, max: 1, step: 0.001 },
  //   // bounciness: { value: -0.8, min: -2, max: 0, step: 0.1 },
  // });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4f46e5, 0.5);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    // Variables para apagar/encender luz
    let lightsOn = true;
    let lightTimer = 0;

    // Crear room (cubo invisible)
    const roomGeometry = new THREE.BoxGeometry(roomSizeX,roomSizeY,roomSizeZ, gridDivisions,gridDivisions,gridDivisions);
    const roomMaterial = new THREE.MeshBasicMaterial({
      color: 0xfefefe,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      side: THREE.FrontSide
    });
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    room.position.set(0, 0, roomPositionZ);
    scene.add(room);

    // Crear esferas con física
    const spheres: Sphere[] = [];
    const sphereData = [
      { position: new THREE.Vector3(-3, 0, 0), color: 0xC09B00 },
      { position: new THREE.Vector3(3, 1, -2), color: 0x003893 },
      { position: new THREE.Vector3(0, -2, -1), color: 0xC8102E }
    ];

    sphereData.forEach((data) => {
      const geometry = new THREE.IcosahedronGeometry (1, 2);
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.4,
        metalness: 0.6,
        emissive: data.color,
        emissiveIntensity: 0.1,
        flatShading: true
      }); 
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(data.position);
      scene.add(mesh);

      spheres.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        radius: 1
      });
    });

    // Raycaster para detectar clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      // Convertir coordenadas del mouse
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spheres.map(s => s.mesh));

      if (intersects.length > 0) {
        // Encontramos una esfera!
        const clickedSphere = spheres.find(s => s.mesh === intersects[0].object);
        if (clickedSphere) {
          //Vector aleatorio!
          const forceX = (Math.random()- 0.5) * 0.2
          const forceY = (Math.random()- 0.5) * 0.2
          const forceZ = (Math.random()- 1) * 0.2

          const force = new THREE.Vector3(
            (Math.random()- 0.5) * forceRate,
            (Math.random()- 0.5) * forceRate,
            (Math.random()- 1) * forceRate
          )
          clickedSphere.velocity.add(force);
        }
      }
    };

    // Función para mostrar las paredes cuando hay colisión
    const showWalls = () => {
      setShowRoom(true);
      roomMaterial.opacity = 0.3;
      
      // Apagar luces
      lightsOn = false;
      ambientLight.intensity = 0.1;
      directionalLight.intensity = 0.2;
      pointLight.intensity = 0.1;
      
      scene.background = new THREE.Color(0x000000)
      lightTimer = blackoutTime; 
    };

    // Colisiones entre esferas
    const checkSphereSphereCollision = (s1: Sphere, s2: Sphere) => {
      const distance = s1.mesh.position.distanceTo(s2.mesh.position);
      const minDistance = s1.radius + s2.radius;

      if (distance < minDistance) {
        // Colisión detectada
        const normal = new THREE.Vector3()
          .subVectors(s2.mesh.position, s1.mesh.position)
          .normalize();

        // Intercambiar velocidades (física simplificada)
        const relativeVelocity = new THREE.Vector3()
          .subVectors(s1.velocity, s2.velocity);
        const speed = relativeVelocity.dot(normal);

        if (speed < 0) return; // Ya se están separando

        s1.velocity.sub(normal.clone().multiplyScalar(speed));
        s2.velocity.add(normal.clone().multiplyScalar(speed));

        // Separar esferas para evitar overlap
        const overlap = minDistance - distance;
        const separation = normal.clone().multiplyScalar(overlap / 2);
        s1.mesh.position.sub(separation);
        s2.mesh.position.add(separation);
      }
    };

    // Colisiones con paredes del cuarto
    const checkWallCollision = (sphere: Sphere) => {
      const halfRoomX = roomSizeX / 2;
      const halfRoomY = roomSizeY / 2;
      const halfRoomZ = roomSizeZ / 2;
      let collided = false;

      // X walls
      if (Math.abs(sphere.mesh.position.x) > halfRoomX - sphere.radius) {
        sphere.velocity.x *= bounciness;
        sphere.mesh.position.x = Math.sign(sphere.mesh.position.x) * (halfRoomX - sphere.radius);
        collided = true;
      }

      // Y walls
      if (Math.abs(sphere.mesh.position.y) > halfRoomY - sphere.radius) {
        sphere.velocity.y *= bounciness;
        sphere.mesh.position.y = Math.sign(sphere.mesh.position.y) * (halfRoomY - sphere.radius);
        collided = true;
      }

      // Z walls
      if (Math.abs(sphere.mesh.position.z) > halfRoomZ - sphere.radius) {
        sphere.velocity.z *= bounciness;
        sphere.mesh.position.z = Math.sign(sphere.mesh.position.z) * (halfRoomZ - sphere.radius);
        collided = true;
      }

      if (collided) {
        showWalls();
      }
    };

    // Event listeners
    window.addEventListener('click', handleClick);

    // Animación
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      // Actualizar timer de luces
      if (lightTimer > 0) {
        lightTimer -= deltaTime;
        if (lightTimer <= 0) {
          lightsOn = true;
          ambientLight.intensity = 0.5;
          directionalLight.intensity = 1;
          pointLight.intensity = 0.5;
          roomMaterial.opacity = 0.3;
          scene.background = new THREE.Color('transparent')
          setShowRoom(false);
        }
      }

      // Física de esferas
      spheres.forEach((sphere, index) => {
        // Aplicar velocidad
        sphere.mesh.position.add(sphere.velocity);

        // Rotación solitas cual planetas
        sphere.mesh.rotation.x += 0.001;
        sphere.mesh.rotation.y += 0.001;

        // Fricción/damping
        sphere.velocity.multiplyScalar(damping);

        // Colisiones con paredes
        checkWallCollision(sphere);

        // Colisiones con otras esferas
        for (let i = index + 1; i < spheres.length; i++) {
          checkSphereSphereCollision(sphere, spheres[i]);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
      
      spheres.forEach(sphere => {
        sphere.mesh.geometry.dispose();
        (sphere.mesh.material as THREE.Material).dispose();
      });
      
      roomGeometry.dispose();
      roomMaterial.dispose();
      renderer.dispose();
    };
  }, [ 
    // forceX, forceY, forceZ,roomSizeX,roomSizeY,roomSizeZ,roomPositionZ,
    // gridDivisions,
    // blackoutTime,
    // forceRate,
    // damping,
    // bounciness
  ]);

  return (
    <>
       <canvas 
        ref={canvasRef} 
        className="fixed inset-0 -z-10"
        style={{ 
          background: 'transparent',
          cursor: 'pointer'
        }}
      />

      {/* Cursor trail effect */}
      <CursorTrail />
    </>
  );
}

export default Pool3D;