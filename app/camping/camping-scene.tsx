'use client'

import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Text, Environment, useTexture, Sky, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'

// Realistic Ground with detailed textures
function RealisticGround() {
  const groundRef = useRef<THREE.Mesh>(null)
  
  // Create a more detailed ground with grass texture effect
  useFrame((state) => {
    if (groundRef.current && groundRef.current.material instanceof THREE.MeshPhysicalMaterial) {
      // Subtle wind effect on grass
      const time = state.clock.getElapsedTime()
      if (groundRef.current.material.normalScale) {
        groundRef.current.material.normalScale.set(
          Math.sin(time * 0.5) * 0.1 + 0.3,
          Math.cos(time * 0.3) * 0.1 + 0.3
        )
      }
    }
  })

  return (
    <>
      {/* Main ground */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[50, 50, 256, 256]} />
        <meshPhysicalMaterial 
          color="#2d4a1e"
          roughness={0.9}
          metalness={0.1}
          normalScale={new THREE.Vector2(0.3, 0.3)}
        />
      </mesh>
      
      {/* Dirt patches */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh 
          key={i} 
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]} 
          position={[
            (Math.random() - 0.5) * 30,
            -0.05,
            (Math.random() - 0.5) * 30
          ]} 
          receiveShadow
        >
          <circleGeometry args={[Math.random() * 2 + 1, 16]} />
          <meshLambertMaterial color="#4a3429" />
        </mesh>
      ))}
      
      {/* Small rocks scattered around */}
      {Array.from({ length: 30 }, (_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 0.1,
            (Math.random() - 0.5) * 40
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
          castShadow
        >
          <dodecahedronGeometry args={[Math.random() * 0.1 + 0.05]} />
          <meshLambertMaterial color="#555555" />
        </mesh>
      ))}
    </>
  )
}

// Ultra-realistic animated campfire
function RealisticCampfire() {
  const fireRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)
  const smokeRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (fireRef.current) {
      // Complex fire animation
      fireRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.userData.isFlame) {
          const baseY = child.userData.baseY || 0.5
          const flickerIntensity = 0.15
          const waveOffset = index * 0.8
          
          child.position.y = baseY + 
            Math.sin(time * 4 + waveOffset) * flickerIntensity +
            Math.sin(time * 6 + waveOffset * 1.5) * flickerIntensity * 0.5
          
          child.scale.setScalar(
            0.8 + Math.sin(time * 5 + waveOffset) * 0.3 +
            Math.cos(time * 7 + waveOffset * 0.7) * 0.1
          )
          
          // Color variation for realistic fire
          const material = child.material as THREE.MeshBasicMaterial
          const hue = 0.1 - index * 0.015 + Math.sin(time * 3) * 0.02
          material.color.setHSL(hue, 1, 0.6 + Math.sin(time * 4) * 0.2)
        }
      })
    }
    
    // Animated smoke
    if (smokeRef.current) {
      smokeRef.current.rotation.y += delta * 0.2
      smokeRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += delta * 0.5
          child.scale.addScalar(delta * 0.1)
          const material = child.material as THREE.MeshBasicMaterial
          material.opacity -= delta * 0.1
          
          if (child.position.y > 5 || material.opacity <= 0) {
            child.position.y = 1
            child.scale.setScalar(0.1)
            material.opacity = 0.3
          }
        }
      })
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Detailed fire pit base */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.2, 16]} />
        <meshLambertMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Charred logs arrangement */}
      <group ref={fireRef}>
        <mesh position={[0.3, -0.1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 1.5, 12]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-0.2, -0.08, 0.3]} rotation={[0, Math.PI / 3, -Math.PI / 8]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, 1.2, 12]} />
          <meshLambertMaterial color="#2a1a0f" />
        </mesh>
        <mesh position={[0.1, -0.05, -0.4]} rotation={[0, -Math.PI / 4, Math.PI / 12]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 1.3, 12]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        
        {/* Realistic fire flames */}
        {Array.from({ length: 15 }, (_, i) => {
          const angle = (i / 15) * Math.PI * 2
          const radius = 0.1 + Math.random() * 0.2
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * radius,
                0.3 + i * 0.08,
                Math.sin(angle) * radius
              ]}
              userData={{ isFlame: true, baseY: 0.3 + i * 0.08 }}
            >
              <coneGeometry args={[0.08 + i * 0.01, 0.3 + i * 0.02, 6]} />
              <meshBasicMaterial 
                color={new THREE.Color().setHSL(0.1 - i * 0.008, 1, 0.7)}
                transparent 
                opacity={0.9 - i * 0.05}
              />
            </mesh>
          )
        })}
        
        {/* Inner bright flame core */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh 
            key={`core-${i}`}
            position={[
              Math.sin(i) * 0.05,
              0.4 + i * 0.06,
              Math.cos(i) * 0.05
            ]}
            userData={{ isFlame: true, baseY: 0.4 + i * 0.06 }}
          >
            <sphereGeometry args={[0.03 + i * 0.005, 8, 6]} />
            <meshBasicMaterial 
              color={new THREE.Color().setHSL(0.15, 1, 0.9)}
              transparent 
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Smoke particles */}
      <group ref={smokeRef}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh 
            key={i}
            position={[
              (Math.random() - 0.5) * 0.3,
              1 + i * 0.2,
              (Math.random() - 0.5) * 0.3
            ]}
          >
            <sphereGeometry args={[0.1 + Math.random() * 0.05, 8, 8]} />
            <meshBasicMaterial 
              color="#666666"
              transparent 
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>
      
      {/* Realistic lighting */}
      <pointLight 
        position={[0, 0.5, 0]} 
        color="#ff4500" 
        intensity={3} 
        distance={12}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight 
        position={[0, 0.3, 0]} 
        color="#ffaa44" 
        intensity={2} 
        distance={8}
      />
      <pointLight 
        position={[0, 0.8, 0]} 
        color="#ff6600" 
        intensity={1.5} 
        distance={6}
      />
      
      {/* Sparks/embers */}
      <Sparkles 
        count={50}
        scale={[2, 3, 2]}
        size={2}
        speed={0.4}
        color="#ff6600"
        opacity={0.6}
      />
    </group>
  )
}

// Highly detailed realistic person
function RealisticPerson({ position, rotation, color, name }: { 
  position: [number, number, number], 
  rotation: [number, number, number], 
  color: string,
  name: string 
}) {
  const personRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (personRef.current) {
      // Subtle breathing animation
      const breathe = Math.sin(state.clock.getElapsedTime() * 2) * 0.02 + 1
      personRef.current.scale.y = breathe
    }
  })

  return (
    <group ref={personRef} position={position} rotation={rotation}>
      {/* Detailed body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.9, 16]} />
        <meshPhysicalMaterial 
          color={color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Realistic head with facial features */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshPhysicalMaterial 
          color="#ffdbac"
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.55, -0.02]} castShadow>
        <sphereGeometry args={[0.17, 12, 12]} />
        <meshLambertMaterial color="#4a2c17" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.05, 1.48, 0.14]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.05, 1.48, 0.14]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.43, 0.15]}>
        <coneGeometry args={[0.015, 0.04, 6]} />
        <meshLambertMaterial color="#ffdbac" />
      </mesh>
      
      {/* Detailed arms with joints */}
      <group>
        {/* Left arm */}
        <mesh position={[-0.28, 1.1, 0]} rotation={[0, 0, Math.PI / 5]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.4, 12]} />
          <meshPhysicalMaterial color="#ffdbac" roughness={0.7} />
        </mesh>
        <mesh position={[-0.42, 0.85, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.35, 12]} />
          <meshPhysicalMaterial color="#ffdbac" roughness={0.7} />
        </mesh>
        
        {/* Right arm holding marshmallow */}
        <mesh position={[0.28, 1.1, 0]} rotation={[0, 0, -Math.PI / 5]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.4, 12]} />
          <meshPhysicalMaterial color="#ffdbac" roughness={0.7} />
        </mesh>
        <mesh position={[0.42, 0.85, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.35, 12]} />
          <meshPhysicalMaterial color="#ffdbac" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Detailed legs */}
      <group>
        <mesh position={[-0.12, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.6, 12]} />
          <meshPhysicalMaterial color="#2c2c54" roughness={0.9} />
        </mesh>
        <mesh position={[0.12, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.6, 12]} />
          <meshPhysicalMaterial color="#2c2c54" roughness={0.9} />
        </mesh>
        
        {/* Shoes */}
        <mesh position={[-0.12, -0.05, 0.08]} castShadow>
          <boxGeometry args={[0.16, 0.08, 0.25]} />
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0.12, -0.05, 0.08]} castShadow>
          <boxGeometry args={[0.16, 0.08, 0.25]} />
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Highly detailed marshmallow setup */}
      <group position={[0.5, 1.25, 0]} rotation={[0, 0, -Math.PI / 6]}>
        {/* Wooden stick with texture */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.012, 0.8, 8]} />
          <meshPhysicalMaterial 
            color="#8B4513"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Realistic marshmallow */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.08, 12]} />
          <meshPhysicalMaterial 
            color="#fff8dc"
            roughness={0.3}
            metalness={0.0}
            clearcoat={0.1}
          />
        </mesh>
        
        {/* Slightly toasted edges */}
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.058, 0.048, 0.02, 12]} />
          <meshBasicMaterial color="#deb887" transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* Name tag floating above */}
      <Html position={[0, 2, 0]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
          {name}
        </div>
      </Html>
    </group>
  )
}

// Ultra-realistic trees with detailed bark and leaves
function RealisticTrees() {
  const trees: { position: [number, number, number], scale: number, type: 'pine' | 'oak' }[] = [
    { position: [-8, 0, -4], scale: 1.3, type: 'pine' },
    { position: [6, 0, -5], scale: 1.1, type: 'oak' },
    { position: [-5, 0, -8], scale: 1.5, type: 'pine' },
    { position: [8, 0, -3], scale: 1.2, type: 'pine' },
    { position: [-10, 0, 3], scale: 1.4, type: 'oak' },
    { position: [5, 0, 8], scale: 1.0, type: 'pine' },
    { position: [-3, 0, 10], scale: 1.2, type: 'oak' },
  ]

  return (
    <>
      {trees.map((tree, index) => (
        <group key={index} position={tree.position} scale={tree.scale}>
          {tree.type === 'pine' ? (
            <>
              {/* Detailed pine trunk with bark texture */}
              <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.35, 2.4, 16]} />
                <meshPhysicalMaterial 
                  color="#4a2c17"
                  roughness={0.95}
                  metalness={0.05}
                  normalScale={new THREE.Vector2(0.5, 0.5)}
                />
              </mesh>
              
              {/* Multiple pine needle layers */}
              {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} position={[0, 2.8 - i * 0.3, 0]} castShadow>
                  <coneGeometry args={[1.4 - i * 0.15, 1.2, 12]} />
                  <meshPhysicalMaterial 
                    color={new THREE.Color().setHSL(0.25, 0.6, 0.2 + i * 0.02)}
                    roughness={0.8}
                  />
                </mesh>
              ))}
              
              {/* Pine branches */}
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2
                const height = 1.5 + i * 0.2
                return (
                  <mesh 
                    key={`branch-${i}`}
                    position={[
                      Math.cos(angle) * 0.2,
                      height,
                      Math.sin(angle) * 0.2
                    ]}
                    rotation={[0, angle, Math.PI / 6]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.02, 0.04, 0.6, 6]} />
                    <meshLambertMaterial color="#4a2c17" />
                  </mesh>
                )
              })}
            </>
          ) : (
            <>
              {/* Oak tree trunk */}
              <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 3, 16]} />
                <meshPhysicalMaterial 
                  color="#6b4423"
                  roughness={0.9}
                  metalness={0.1}
                />
              </mesh>
              
              {/* Oak crown - multiple spherical clusters */}
              {Array.from({ length: 5 }, (_, i) => (
                <mesh 
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 2,
                    3.5 + (Math.random() - 0.5),
                    (Math.random() - 0.5) * 2
                  ]}
                  castShadow
                >
                  <sphereGeometry args={[0.8 + Math.random() * 0.4, 12, 12]} />
                  <meshPhysicalMaterial 
                    color="#2d5a2d"
                    roughness={0.8}
                  />
                </mesh>
              ))}
              
              {/* Oak branches */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i / 12) * Math.PI * 2
                const height = 2.5 + Math.random() * 0.8
                const length = 0.8 + Math.random() * 0.4
                return (
                  <mesh 
                    key={`oak-branch-${i}`}
                    position={[
                      Math.cos(angle) * 0.25,
                      height,
                      Math.sin(angle) * 0.25
                    ]}
                    rotation={[0, angle, Math.PI / 8 + Math.random() * 0.2]}
                    castShadow
                  >
                    <cylinderGeometry args={[0.03, 0.06, length, 6]} />
                    <meshLambertMaterial color="#4a2c17" />
                  </mesh>
                )
              })}
            </>
          )}
        </group>
      ))}
    </>
  )
}

// Realistic tent with detailed materials
function RealisticTent() {
  return (
    <group position={[-4, 0, 3]}>
      {/* Tent base */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.04, 16]} />
        <meshPhysicalMaterial color="#2a4d3a" roughness={0.9} />
      </mesh>
      
      {/* Main tent body with realistic fabric */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[1.1, 1.4, 6]} />
        <meshPhysicalMaterial 
          color="#cc5500"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Tent entrance */}
      <mesh position={[0.9, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[0.7, 0.8]} />
        <meshPhysicalMaterial 
          color="#994400"
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Tent stakes */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * 1.3,
              0.1,
              Math.sin(angle) * 1.3
            ]}
            rotation={[0, 0, Math.PI / 12]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
            <meshLambertMaterial color="#333" />
          </mesh>
        )
      })}
      
      {/* Tent ropes */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh 
            key={`rope-${i}`}
            position={[
              Math.cos(angle) * 0.7,
              0.8,
              Math.sin(angle) * 0.7
            ]}
            rotation={[0, angle, Math.PI / 6]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.6, 4]} />
            <meshBasicMaterial color="#8B4513" />
          </mesh>
        )
      })}
      
      {/* Camping gear */}
      <mesh position={[1.5, 0.15, 0.5]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 12]} />
        <meshPhysicalMaterial color="#1a4d1a" roughness={0.8} />
      </mesh>
      
      {/* Backpack */}
      <mesh position={[-1.2, 0.25, 0.8]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshPhysicalMaterial color="#8B0000" roughness={0.7} />
      </mesh>
    </group>
  )
}

// Enhanced night sky with realistic stars
function RealisticNightSky() {
  const starsRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002
    }
  })

  return (
    <>
      {/* Sky gradient */}
      <Sky 
        distance={450000}
        sunPosition={[0, -1, 0]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      {/* Realistic stars with varying brightness */}
      <group ref={starsRef}>
        {Array.from({ length: 300 }, (_, i) => {
          const size = Math.random() * 0.03 + 0.01
          const brightness = Math.random()
          return (
            <mesh 
              key={i} 
              position={[
                (Math.random() - 0.5) * 100,
                Math.random() * 40 + 20,
                (Math.random() - 0.5) * 100
              ]}
            >
              <sphereGeometry args={[size, 6, 6]} />
              <meshBasicMaterial 
                color={new THREE.Color().setHSL(0.15, 0.2, brightness)}
                transparent
                opacity={brightness}
              />
            </mesh>
          )
        })}
      </group>
      
      {/* Moon */}
      <mesh position={[30, 25, -20]}>
        <sphereGeometry args={[2, 20, 20]} />
        <meshBasicMaterial 
          color="#f5f5dc"
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Moonlight */}
      <directionalLight
        position={[30, 25, -20]}
        color="#b8c6db"
        intensity={0.3}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  )
}

// Main ultra-realistic scene
function UltraRealisticScene() {
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSceneReady(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!sceneReady) return null

  return (
    <>
      {/* Enhanced environmental lighting */}
      <ambientLight intensity={0.15} color="#1a1a2e" />
      
      <RealisticNightSky />
      <RealisticGround />
      <RealisticCampfire />
      <RealisticTrees />
      <RealisticTent />
      
      {/* Ultra-realistic people with names */}
      <RealisticPerson 
        position={[1.8, 0, 1.5]} 
        rotation={[0, -Math.PI / 3, 0]} 
        color="#4169E1"
        name="Alex"
      />
      <RealisticPerson 
        position={[-1.5, 0, 1.8]} 
        rotation={[0, Math.PI / 4, 0]} 
        color="#DC143C"
        name="Sarah"
      />
      <RealisticPerson 
        position={[1.2, 0, -2.1]} 
        rotation={[0, Math.PI * 0.75, 0]} 
        color="#228B22"
        name="Mike"
      />
      <RealisticPerson 
        position={[-2.1, 0, -1.2]} 
        rotation={[0, Math.PI / 2.2, 0]} 
        color="#FF8C00"
        name="Emma"
      />
      
      {/* Enhanced title with glow effect */}
      <Text
        position={[0, 6, -8]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ff6600"
      >
        🏕️ Ultra-Realistic Camping Experience
      </Text>
      
      {/* Advanced camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={25}
        minDistance={2}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      
      {/* Post-processing environment */}
      <Environment preset="night" />
    </>
  )
}

export default function UltraRealisticCampingPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
          </div>
          <h2 className="text-2xl font-bold mb-3">🏕️ Creating Ultra-Realistic Scene...</h2>
          <p className="text-lg opacity-80 mb-2">Loading advanced 3D graphics</p>
          <p className="text-sm opacity-60">This may take a moment for the best experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Enhanced UI overlay */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <h1 className="text-3xl font-bold mb-3 text-orange-400">🏕️ Ultra-Realistic Camping</h1>
        <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm">
          <p className="text-sm opacity-90 mb-1">🖱️ <strong>Mouse:</strong> Orbit around the scene</p>
          <p className="text-sm opacity-90 mb-1">🔍 <strong>Scroll:</strong> Zoom in/out</p>
          <p className="text-sm opacity-90 mb-1">🎯 <strong>Drag:</strong> Pan the view</p>
          <p className="text-xs opacity-70 mt-2">Experience photorealistic 3D camping with dynamic lighting</p>
        </div>
      </div>
      
      {/* Performance info */}
      <div className="absolute top-4 right-4 z-10 text-white">
        <div className="bg-black/50 p-2 rounded backdrop-blur-sm">
          <p className="text-xs opacity-70">Ultra-Realistic Mode</p>
          <p className="text-xs opacity-70">Enhanced Graphics ✨</p>
        </div>
      </div>
      
      <Suspense 
        fallback={
          <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-4">
                <div className="inline-block animate-pulse">
                  <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">🔥 Rendering Ultra-Realistic Scene...</h2>
              <p className="text-sm opacity-80">Preparing photorealistic graphics</p>
            </div>
          </div>
        }
      >
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          camera={{ position: [8, 4, 8], fov: 55 }}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8
          }}
          onCreated={(state) => {
            state.gl.setClearColor('#000011')
            state.gl.shadowMap.enabled = true
            state.gl.shadowMap.type = THREE.PCFSoftShadowMap
          }}
          dpr={[1, 2]}
        >
          <UltraRealisticScene />
        </Canvas>
      </Suspense>
    </div>
  )
}
