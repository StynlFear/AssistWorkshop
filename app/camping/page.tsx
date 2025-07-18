'use client'

import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Sky, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log('Three.js Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center text-white">
          <div className="text-center p-8">
            <h2 className="text-2xl mb-4">🏕️ Camping Scene</h2>
            <p className="mb-4">There was an issue loading the 3D scene.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white"
            >
              Reload Scene
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Stable Ground component
function StableGround() {
  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshLambertMaterial color="#2d4a1e" />
      </mesh>
      
      {/* Dirt patches */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh 
          key={i} 
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]} 
          position={[
            (Math.random() - 0.5) * 20,
            -0.05,
            (Math.random() - 0.5) * 20
          ]} 
          receiveShadow
        >
          <circleGeometry args={[Math.random() * 1.5 + 0.5, 12]} />
          <meshLambertMaterial color="#4a3429" />
        </mesh>
      ))}
      
      {/* Small rocks */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 25,
            0,
            (Math.random() - 0.5) * 25
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
          castShadow
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshLambertMaterial color="#555555" />
        </mesh>
      ))}
    </>
  )
}

// Stable animated campfire
function StableCampfire() {
  const fireRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(prev => prev + delta)
    
    if (fireRef.current) {
      // Simple fire animation
      fireRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.userData.isFlame) {
          const baseY = child.userData.baseY || 0.5
          child.position.y = baseY + Math.sin(time * 3 + index) * 0.1
          child.scale.setScalar(0.9 + Math.sin(time * 4 + index) * 0.2)
        }
      })
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Fire pit base */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[0.7, 0.8, 0.2, 12]} />
        <meshLambertMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Logs */}
      <group ref={fireRef}>
        <mesh position={[0.3, -0.1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.07, 0.1, 1.2, 8]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-0.2, -0.08, 0.2]} rotation={[0, Math.PI / 3, -Math.PI / 8]} castShadow>
          <cylinderGeometry args={[0.06, 0.09, 1, 8]} />
          <meshLambertMaterial color="#2a1a0f" />
        </mesh>
        
        {/* Fire flames */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * 0.15,
                0.3 + i * 0.1,
                Math.sin(angle) * 0.15
              ]}
              userData={{ isFlame: true, baseY: 0.3 + i * 0.1 }}
            >
              <coneGeometry args={[0.08, 0.4, 6]} />
              <meshBasicMaterial 
                color={new THREE.Color().setHSL(0.1 - i * 0.01, 1, 0.6)}
                transparent 
                opacity={0.8 - i * 0.07}
              />
            </mesh>
          )
        })}
      </group>
      
      {/* Lighting */}
      <pointLight 
        position={[0, 0.5, 0]} 
        color="#ff4500" 
        intensity={2} 
        distance={10}
        castShadow
      />
      <pointLight 
        position={[0, 0.3, 0]} 
        color="#ffaa44" 
        intensity={1.5} 
        distance={6}
      />
      
      {/* Sparks */}
      <Sparkles 
        count={20}
        scale={[1.5, 2, 1.5]}
        size={1}
        speed={0.3}
        color="#ff6600"
        opacity={0.8}
      />
    </group>
  )
}

// Stable realistic person
function StablePerson({ position, rotation, color, name }: { 
  position: [number, number, number], 
  rotation: [number, number, number], 
  color: string,
  name: string 
}) {
  const personRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (personRef.current) {
      // Gentle breathing animation
      const breathe = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.015 + 1
      personRef.current.scale.y = breathe
    }
  })

  return (
    <group ref={personRef} position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 12]} />
        <meshLambertMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshLambertMaterial color="#ffdbac" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.5, -0.02]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshLambertMaterial color="#4a2c17" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.04, 1.43, 0.13]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.04, 1.43, 0.13]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.25, 1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.4, 8]} />
        <meshLambertMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.25, 1, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.4, 8]} />
        <meshLambertMaterial color="#ffdbac" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.5, 8]} />
        <meshLambertMaterial color="#2c2c54" />
      </mesh>
      <mesh position={[0.1, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.5, 8]} />
        <meshLambertMaterial color="#2c2c54" />
      </mesh>
      
      {/* Marshmallow stick */}
      <group position={[0.4, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.01, 0.7, 6]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        
        {/* Marshmallow */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.06, 8]} />
          <meshLambertMaterial color="#fff8dc" />
        </mesh>
      </group>
      
      {/* Name tag */}
      <Html position={[0, 1.8, 0]} center>
        <div className="bg-black/60 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
          {name}
        </div>
      </Html>
    </group>
  )
}

// Stable trees
function StableTrees() {
  const trees: { position: [number, number, number], scale: number }[] = [
    { position: [-6, 0, -3], scale: 1.2 },
    { position: [5, 0, -4], scale: 1.0 },
    { position: [-4, 0, -6], scale: 1.3 },
    { position: [7, 0, -2], scale: 1.1 },
    { position: [-8, 0, 2], scale: 1.2 },
    { position: [4, 0, 6], scale: 0.9 },
  ]

  return (
    <>
      {trees.map((tree, index) => (
        <group key={index} position={tree.position} scale={tree.scale}>
          {/* Trunk */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2.4, 12]} />
            <meshLambertMaterial color="#4a2c17" />
          </mesh>
          
          {/* Pine layers */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[1.2, 1.5, 8]} />
            <meshLambertMaterial color="#1a4d1a" />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <coneGeometry args={[1, 1.2, 8]} />
            <meshLambertMaterial color="#2d5a2d" />
          </mesh>
          <mesh position={[0, 3.8, 0]} castShadow>
            <coneGeometry args={[0.8, 1, 8]} />
            <meshLambertMaterial color="#1a4d1a" />
          </mesh>
        </group>
      ))}
    </>
  )
}

// Simple tent
function SimpleTent() {
  return (
    <group position={[-3.5, 0, 2.5]}>
      {/* Tent body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[1, 1.2, 6]} />
        <meshLambertMaterial color="#cc5500" />
      </mesh>
      
      {/* Tent entrance */}
      <mesh position={[0.8, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[0.6, 0.6]} />
        <meshLambertMaterial color="#994400" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Tent stakes */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * 1.1,
              0.05,
              Math.sin(angle) * 1.1
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
            <meshLambertMaterial color="#333" />
          </mesh>
        )
      })}
    </group>
  )
}

// Simple night sky
function SimpleNightSky() {
  const starsRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0003
    }
  })

  return (
    <>
      {/* Sky with proper night colors */}
      <Sky 
        distance={300000}
        sunPosition={[0, -0.5, 0]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      {/* Stars */}
      <group ref={starsRef}>
        {Array.from({ length: 150 }, (_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 80,
              Math.random() * 30 + 15,
              (Math.random() - 0.5) * 80
            ]}
          >
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      
      {/* Moon */}
      <mesh position={[25, 20, -15]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#f5f5dc" />
      </mesh>
    </>
  )
}

// Main stable scene
function StableScene() {
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    // Ensure scene loads properly
    const timer = setTimeout(() => setSceneReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!sceneReady) {
    return (
      <Html center>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Loading scene...</p>
        </div>
      </Html>
    )
  }

  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.2} color="#1a1a2e" />
      <directionalLight
        position={[20, 20, -10]}
        color="#b8c6db"
        intensity={0.3}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      <SimpleNightSky />
      <StableGround />
      <StableCampfire />
      <StableTrees />
      <SimpleTent />
      
      {/* People around the campfire */}
      <StablePerson 
        position={[1.6, 0, 1.3]} 
        rotation={[0, -Math.PI / 3, 0]} 
        color="#4169E1"
        name="Alex"
      />
      <StablePerson 
        position={[-1.3, 0, 1.6]} 
        rotation={[0, Math.PI / 4, 0]} 
        color="#DC143C"
        name="Sarah"
      />
      <StablePerson 
        position={[1.1, 0, -1.9]} 
        rotation={[0, Math.PI * 0.75, 0]} 
        color="#228B22"
        name="Mike"
      />
      <StablePerson 
        position={[-1.9, 0, -1.1]} 
        rotation={[0, Math.PI / 2.2, 0]} 
        color="#FF8C00"
        name="Emma"
      />
      
      {/* Title */}
      <Text
        position={[0, 5, -6]}
        fontSize={1.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        🏕️ Camping Night Scene
      </Text>
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={20}
        minDistance={3}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

export default function StableCampingPage() {
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setIsClient(true)
    } catch (err) {
      setError('Failed to initialize 3D scene')
    }
  }, [])

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl mb-4">🏕️ Camping Scene</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
          <h2 className="text-xl font-bold mb-2">🏕️ Setting up camp...</h2>
          <p className="text-sm opacity-80">Loading 3D camping scene</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-black relative">
        {/* UI overlay */}
        <div className="absolute top-4 left-4 z-10 text-white">
          <h1 className="text-2xl font-bold mb-2 text-orange-400">🏕️ Camping Scene</h1>
          <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm opacity-90 mb-1">🖱️ <strong>Mouse:</strong> Orbit around</p>
            <p className="text-sm opacity-90 mb-1">🔍 <strong>Scroll:</strong> Zoom in/out</p>
            <p className="text-sm opacity-90">🎯 <strong>Drag:</strong> Pan the view</p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 z-10 text-white">
          <div className="bg-black/50 p-2 rounded backdrop-blur-sm">
            <p className="text-xs opacity-70">3D Scene Active ✨</p>
          </div>
        </div>
        
        <Suspense 
          fallback={
            <div className="w-full h-screen bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-4">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-lg font-semibold mb-2">🔥 Rendering scene...</h2>
                <p className="text-sm opacity-80">Almost ready!</p>
              </div>
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [6, 3, 6], fov: 60 }}
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: "high-performance"
            }}
            onCreated={(state) => {
              state.gl.setClearColor('#000022')
              state.gl.shadowMap.enabled = true
              state.gl.shadowMap.type = THREE.PCFShadowMap
            }}
            dpr={[1, 1.5]}
            onError={(error) => {
              console.error('Canvas error:', error)
              setError('3D rendering error')
            }}
          >
            <StableScene />
          </Canvas>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
