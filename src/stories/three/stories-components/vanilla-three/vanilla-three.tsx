import { useControls } from 'leva';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function VanillaThree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // --- PASO 1: Renderer, Scene, Camera ---
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const geometry = new THREE.ConeGeometry(1.5, 2.5, 4);

    const material = new THREE.MeshPhongMaterial({
      color: 0xff2200,
      shininess: 80,
    });

    const pyramid = new THREE.Mesh(geometry, material);
    scene.add(pyramid);

    //Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 5, 0);
    scene.add(dirLight);

    // Luz de relleno desde abajo para suavizar sombras duras
    const fillLight = new THREE.DirectionalLight(0x4444ff, 0.3);
    fillLight.position.set(-5, -3, -5);
    scene.add(fillLight);

    // --- PASO 5: OrbitControls ---

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;

    // --- PASO 6: Animation loop con rotación automática --
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      // console.log('animID, ', animId)

      pyramid.rotation.y += 0.005; // rotación automática en Y

      controls.update(); // requerido cuando enableDamping = true

      renderer.render(scene, camera);
    }

    animate();

    // renderer.render(scene, camera);

    return () => {
      cancelAnimationFrame(animId); // guarda el id del rAF
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh', display: 'block' }} />;
}

export default VanillaThree;
