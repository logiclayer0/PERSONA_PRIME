import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATHS = {
  seraphina: '/models/seraphina.glb',
  vladimir: '/models/vladimir.glb',
  aurora: '/models/aurora.glb'
}

function AvatarModel({ tutorId, isSpeaking, targetSize = 2 }) {
  const groupRef = useRef()
  const innerRef = useRef()
  const modelPath = MODEL_PATHS[tutorId] || MODEL_PATHS.seraphina
  const { scene } = useGLTF(modelPath)
  const [normalized, setNormalized] = useState(false)

  const cloned = useMemo(() => {
    if (!scene) return null
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material.envMapIntensity = 1.2
        }
      }
    })
    return clone
  }, [scene])

  useEffect(() => {
    if (!cloned || !innerRef.current || normalized) return

    cloned.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? targetSize / maxDim : 1

    cloned.position.set(
      -center.x * scale,
      -center.y * scale + (size.y * scale) / 2 - targetSize / 2,
      -center.z * scale
    )
    cloned.scale.set(scale, scale, scale)

    innerRef.current.add(cloned)
    setNormalized(true)
  }, [cloned, targetSize, normalized])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (groupRef.current) {
      if (isSpeaking) {
        groupRef.current.position.y = Math.sin(t * 6) * 0.05
        groupRef.current.rotation.y = Math.sin(t * 3) * 0.15
      } else {
        groupRef.current.position.y = Math.sin(t * 1.2) * 0.03
        groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.06
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={innerRef} />
    </group>
  )
}

function CameraRig({ targetSize = 2 }) {
  const { camera } = useThree()

  useEffect(() => {
    const fov = (camera.fov * Math.PI) / 180
    const distance = (targetSize / 2) / Math.tan(fov / 2) * 1.4

    camera.position.set(0, targetSize * 0.15, distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, targetSize])

  return null
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color="#a855f7" wireframe />
    </mesh>
  )
}

export default function Model3DAvatar({ tutorId = 'seraphina', isSpeaking = false, size = 'medium' }) {
  const config = {
    small: { h: 90, w: 60, target: 1.6 },
    medium: { h: 260, w: '100%', target: 2.2 },
    large: { h: 420, w: '100%', target: 2.8 }
  }
  const { h, w, target } = config[size] || config.medium

  return (
    <div style={{ width: w, height: h, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.3, 4], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight intensity={0.9} />
        <hemisphereLight intensity={0.5} groundColor="#1a1a2e" />
        <directionalLight position={[3, 5, 4]} intensity={1.6} castShadow />
        <pointLight position={[-3, 2, -2]} intensity={0.6} color="#a855f7" />
        <pointLight position={[3, -1, 3]} intensity={0.4} color="#c084fc" />

        <Suspense fallback={<Loader />}>
          <AvatarModel tutorId={tutorId} isSpeaking={isSpeaking} targetSize={target} />
          <Environment preset="city" />
        </Suspense>

        <CameraRig targetSize={target} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  )
}