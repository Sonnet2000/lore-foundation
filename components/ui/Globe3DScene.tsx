"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Globe3DScene — glòb 3D k ap tounen dousman, senbolize enpak
 * global Loré Foundation. Fèt ak wireframe fen + pwen ki reprezante
 * "sit" nan mond lan (Ayiti + rejyon patenè yo mete aksan sou li),
 * plis de bag zòn (òbit) ki pase sou li tankou yon rezo enpak.
 *
 * Tout jewometri a jenere pwosedirèlman — pa gen okenn fichye 3D pou chaje,
 * kidonk li rapid e li pa kraze bild lan.
 */

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F2D272";
const BLUE = "#0F98FF";
const BLUE_LIGHT = "#5AC8FF";

// Kèk pwen jewografik apwoksimatif (lat, lon) — Ayiti nan sant lan,
// ak yon seri pwen atravè mond lan pou reprezante rezo/enpak global.
const IMPACT_POINTS: [number, number, number][] = [
  [18.9712, -72.2852, 1.15], // Port-au-Prince — pi gwo pwen
  [19.7592, -72.2007, 0.8], // Cap-Haïtien
  [18.5944, -72.3074, 0.65], // Jacmel
  [40.7128, -74.006, 0.55], // New York
  [25.7617, -80.1918, 0.55], // Miami
  [45.5019, -73.5674, 0.5], // Montréal
  [48.8566, 2.3522, 0.45], // Paris
  [-33.4489, -70.6693, 0.4], // Santiago
  [6.5244, 3.3792, 0.4], // Lagos
  [14.6928, -17.4467, 0.4], // Dakar
];

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function Globe({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);

  const radius = 1.9;

  // Pwen enpak yo, konvèti an pozisyon 3D
  const points = useMemo(
    () => IMPACT_POINTS.map(([lat, lon, size]) => ({ pos: latLonToVec3(lat, lon, radius + 0.01), size })),
    [radius]
  );

  // Jewometri wireframe globe la — icosahedron subdivize pou yon style "low-poly" elegant
  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(radius, 3), [radius]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.09;
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.06;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * -0.045;
  });

  return (
    <group rotation={[0.25, 0.6, 0.15]}>
      <group ref={groupRef}>
        {/* Kò glòb la — sfè vitre trè fen, ba opasite */}
        <mesh>
          <sphereGeometry args={[radius - 0.02, 48, 48]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.045} />
        </mesh>

        {/* Wireframe low-poly — bay yon fini "kristal", pwofesyonèl */}
        <mesh geometry={wireGeo}>
          <meshBasicMaterial color={BLUE_LIGHT} wireframe transparent opacity={0.22} />
        </mesh>

        {/* Liy latitid/longitid — bay sansasyon yon vrè glòb jewografik */}
        {Array.from({ length: 6 }).map((_, i) => {
          const y = (i / 5 - 0.5) * radius * 1.7;
          const r = Math.sqrt(Math.max(radius * radius - y * y, 0.0001));
          return (
            <mesh key={`lat-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[r - 0.004, r, 80]} />
              <meshBasicMaterial color={GOLD} transparent opacity={0.16} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`lon-${i}`} rotation={[0, (i / 8) * Math.PI, 0]}>
            <torusGeometry args={[radius, 0.0035, 8, 96]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.14} />
          </mesh>
        ))}

        {/* Pwen enpak — vil kote Loré Foundation gen prezans oswa patenarya */}
        {points.map((p, i) => (
          <mesh key={i} position={p.pos}>
            <sphereGeometry args={[0.028 * p.size, 12, 12]} />
            <meshBasicMaterial color={i === 0 ? GOLD_LIGHT : GOLD} />
          </mesh>
        ))}

        {/* Ti glow dous sou chak pwen prensipal */}
        <mesh position={points[0].pos}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={GOLD_LIGHT} transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Bag òbit #1 — enkline, reprezante rezo/pòtefèy global */}
      <group ref={ring1Ref} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[radius + 0.55, 0.006, 8, 128]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Bag òbit #2 — lòt enklinasyon, kwaze premye a */}
      <group ref={ring2Ref} rotation={[-Math.PI / 3.2, -0.5, 0]}>
        <mesh>
          <torusGeometry args={[radius + 0.85, 0.005, 8, 128]} />
          <meshBasicMaterial color={BLUE_LIGHT} transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Starfield() {
  const positions = useMemo(() => {
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={BLUE_LIGHT} size={0.02} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function Globe3DScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Starfield />
      <Globe reducedMotion={reducedMotion} />
    </Canvas>
  );
}
