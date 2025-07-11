"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface SphereProps {
  step: number
}

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

function Sphere({ step }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const pointLight1Ref = useRef<THREE.PointLight>(null)
  const pointLight2Ref = useRef<THREE.PointLight>(null)

  const targetPosition = useRef({ x: 3, y: 4, z: 2 })
  const currentPosition = useRef({ x: 3, y: 4, z: 2 })


  useEffect(() => {
    switch (step) {
      case 1:
        targetPosition.current = { x: 4, y: 5, z: 3 }
        break
      case 2:
        targetPosition.current = { x: -4, y: 6, z: 5 }
        break
      case 3:
        targetPosition.current = { x: 2, y: 3, z: -4 }
        break
      default:
        targetPosition.current = { x: 4, y: 5, z: 3 }
    }
  }, [step])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }

    if (lightRef.current) {
      currentPosition.current.x = lerp(currentPosition.current.x, targetPosition.current.x, 0.02)
      currentPosition.current.y = lerp(currentPosition.current.y, targetPosition.current.y, 0.02)
      currentPosition.current.z = lerp(currentPosition.current.z, targetPosition.current.z, 0.02)

      const time = state.clock.elapsedTime
      const amplitudeX = 3
      const amplitudeY = 2
      const amplitudeZ = 3

      lightRef.current.position.x = currentPosition.current.x + Math.sin(time * 0.8) * amplitudeX
      lightRef.current.position.y = currentPosition.current.y + Math.sin(time * 0.6) * amplitudeY
      lightRef.current.position.z = currentPosition.current.z + Math.cos(time * 0.7) * amplitudeZ

      const orbitRadius = 2
      const orbitSpeed = 0.3
      lightRef.current.position.x += Math.cos(time * orbitSpeed) * orbitRadius
      lightRef.current.position.z += Math.sin(time * orbitSpeed) * orbitRadius
    }

    if (pointLight1Ref.current && pointLight2Ref.current) {
      const time = state.clock.elapsedTime

      pointLight1Ref.current.position.x = Math.sin(time * 0.5) * 4
      pointLight1Ref.current.position.y = -3 + Math.cos(time * 0.4) * 1
      pointLight1Ref.current.position.z = 5 + Math.sin(time * 0.6) * 2

      pointLight2Ref.current.position.x = 3 + Math.cos(time * 0.7) * 2
      pointLight2Ref.current.position.y = -2 + Math.sin(time * 0.3) * 1
      pointLight2Ref.current.position.z = -3 + Math.cos(time * 0.5) * 2
    }
  })

  return (
    <>
      <directionalLight ref={lightRef} position={[3, 4, 2]} intensity={8.0} color="#ffffff" />

      {step === 1 && (
        <>
          <pointLight ref={pointLight1Ref} position={[-4, -3, 5]} intensity={0.3} color="#e6f3ff" />
          <pointLight ref={pointLight2Ref} position={[3, -2, -3]} intensity={0.3} color="#fff5e6" />
        </>
      )}
      {step === 2 && (
        <>
          <pointLight ref={pointLight1Ref} position={[5, -4, -2]} intensity={0.4} color="#fff5e6" />
          <pointLight ref={pointLight2Ref} position={[-3, -5, 4]} intensity={0.3} color="#e6ffe6" />
        </>
      )}
      {step === 3 && (
        <>
          <pointLight ref={pointLight1Ref} position={[0, -6, 7]} intensity={0.3} color="#f0e6ff" />
          <pointLight ref={pointLight2Ref} position={[-5, -2, -4]} intensity={0.3} color="#ffe6f3" />
        </>
      )}

      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial color="#ffffff" shininess={1000} specular="#ffffff" reflectivity={1} />
      </mesh>
    </>
  )
}

interface AppleSphereProps {
  step: number
}

export default function AppleSphere({ step }: AppleSphereProps) {
  return (
    <div className="h-[400px] bg-white">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={2.0} color="#ffffff" />
        <Sphere step={step} />
      </Canvas>
    </div>
  )
}
