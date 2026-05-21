import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function Leon3D({ mood }: { mood: 'happy' | 'angry' | 'idle' }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/leon.glb');
  const { actions } = useAnimations(animations, group);

  // Śledzenie kursora
  useFrame((state) => {
    if (group.current) {
      group.current.lookAt(state.mouse.x * 2, state.mouse.y * 2, 5);
    }
  });

  return <primitive ref={group} object={scene} scale={1.5} />;
}