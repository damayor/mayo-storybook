import { dispose, type ThreeElement } from '@react-three/fiber';
import type { kMaxLength } from 'buffer';
import { useControls } from 'leva';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CubeEditor = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshRef = useRef<THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>>(null)
  const [isFirstColor, setIsFirstColor] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return ;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio)

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('0xff00ff')

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(0,2,5)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5,10,5);
    scene.add(dirLight);

    const geometry = new THREE.BoxGeometry(3,3);
    const material = new THREE.MeshStandardMaterial({color: 0xff2200})

    const box = new THREE.Mesh(geometry, material);
    meshRef.current = box;
    scene.add(box);


    // - 9 - raycaster, interaccion con el mouse
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
      
    const onClick = (e: MouseEvent) => {

      // convierte coords de pixeles a (-1,1)
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouse.y = ((e.clientY - rect.top)  / rect.height) * -2 + 1

      console.log('mouse v',mouse,mouse.length());

      // Actualiza el rayo desde la cámara en dirección al mouse
      raycaster.setFromCamera(mouse, camera)

      // Chequea intersecciones — puedes pasar un array de objetos
      const intersects = raycaster.intersectObjects([box])

      if (intersects.length > 0) {
        // intersects[0] es el objeto más cercano a la cámara
        console.log('hit!', intersects[0])
        box.material.color.set(0x00ff88)
      }
    }
    
    canvas.addEventListener('click',onClick);


    let animId : number;
    
    function animate() {
      animId = requestAnimationFrame(animate);
      
      box.rotation.y  += 0.02
      
      renderer.render(scene, camera);
    }

    animate();
  
    return () => {
      // animId = requestAnimationFrame
      geometry.dispose()
      material.dispose()
      renderer.dispose()

      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', onClick)

    }
  }, [])
  

  return (
    <>
      <button className='w-50 h-14 p-2 cursor-pointer fixed text-2xl border-2 bg-gray-800' 
        onClick={() => (
          console.log("color setteado"), 
          setIsFirstColor(prev => {
            const nextIsRed = !prev
            if(meshRef.current) {
              meshRef.current.material.color.set(
                nextIsRed ? 0xff2200 : 0x2244ff
              )
            }
        
            return nextIsRed
          })
        )}
      >
        {isFirstColor ? 'set Blue' : 'set Red'}
      </button>

      <canvas ref={canvasRef} style={{width: "100%", height: "100vh"}} />
    </>

  )
}

export default CubeEditor;
