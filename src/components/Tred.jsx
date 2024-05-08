import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';

export default function Tred() {
    const canvasRef = useRef(null);
    const [texture, setTexture] = useState(null); // Estado para armazenar a textura carregada

    useEffect(() => {
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1); // Luz ambiente com intensidade máxima
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1); // Luz direcional com intensidade máxima

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true }); // Set alpha to true for transparent background
        renderer.setSize(window.innerWidth, window.innerHeight);

        const loader = new GLTFLoader();

        scene.add(ambientLight);
        scene.add(directionalLight);

        loader.load(
            'cup/scene.gltf',
            (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        if (child.material.map) {
                            child.material.map = texture;
                            child.material.needsUpdate = true;
                        }
                    }
                });
                scene.add(gltf.scene);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading GLTF:', error);
            }
        );

        camera.position.z = 5;

        const controls = new OrbitControls(camera, renderer.domElement);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // Update controls in the animation loop
            renderer.render(scene, camera);
        };

        animate();

    }, [texture]);

    useEffect(() => {
        // Função para carregar a textura quando o componente for montado
        const textureLoader = new TextureLoader();
        textureLoader.load(
            'urso.png',
            (texture) => {
                
                console.log('Texture loaded:', texture);
                setTexture(texture); // Define a textura carregada no estado
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);
            }
        );
    }, []);

    return <canvas ref={canvasRef} style={{ background: '#000' }} />;
}
