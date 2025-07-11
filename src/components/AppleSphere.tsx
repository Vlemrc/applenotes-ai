"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import type * as THREE from "three"

function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }

    if (lightRef.current) {
      lightRef.current.position.x = 3 + Math.sin(state.clock.elapsedTime * 0.03) * 0.5
      lightRef.current.position.z = 2 + Math.cos(state.clock.elapsedTime * 0.03) * 0.5
    }
  })

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[3, 4, 2]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.05}
          metalness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
    </>
  )
}

export default function AppleSphere() {
  return (
    <div className="h-[300px] bg-gradient-to-b from-gray-50 to-gray-100">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.2} />

        <pointLight position={[-3, -2, 4]} intensity={0.6} color="#e6f3ff" />
        <pointLight position={[2, -3, -2]} intensity={0.4} color="#fff5e6" />

        <Sphere />

        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
