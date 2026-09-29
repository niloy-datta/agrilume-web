"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitalFieldSceneProps {
  reducedMotion?: boolean;
}

export function OrbitalFieldScene({ reducedMotion = false }: OrbitalFieldSceneProps) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Generate smooth elliptical orbit curve
  const orbitCurve = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,            // ax, aY
      2.6, 1.8,        // xRadius, yRadius
      0, 2 * Math.PI,  // aStartAngle, aEndAngle
      false,           // aClockwise
      0                // aRotation
    );
    const points = curve.getPoints(120);
    return new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );
  }, []);

  // Create Three.js Line object for the orbit ellipse
  const orbitLineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: "#36BFFA",
      transparent: true,
      opacity: 0.4,
    });
    return new THREE.Line(orbitCurve, mat);
  }, [orbitCurve]);

  // Subtle terrain contour rings
  const contourGeometry = useMemo(() => {
    const geo = new THREE.RingGeometry(1.81, 1.82, 64);
    return geo;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Slow continuous globe drift
    if (globeGroupRef.current && !reducedMotion) {
      globeGroupRef.current.rotation.y += delta * 0.04;
      // Gentle pointer parallax
      globeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        globeGroupRef.current.rotation.x,
        -state.pointer.y * 0.15,
        0.05
      );
      globeGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        globeGroupRef.current.rotation.z,
        state.pointer.x * 0.15,
        0.05
      );
    }

    // 2. Satellite orbital translation
    if (satelliteRef.current && !reducedMotion) {
      const angle = time * 0.25;
      const x = Math.cos(angle) * 2.6;
      const z = Math.sin(angle) * 1.8;
      satelliteRef.current.position.set(x, 0, z);
    }

    // 3. Ground field beacon pulse
    if (beaconRef.current && !reducedMotion) {
      const pulse = 1 + Math.sin(time * 3.5) * 0.35;
      beaconRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <>
      {/* Subtle Space Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.4} color="#70D4FF" />
      <pointLight position={[-4, -2, -4]} intensity={0.4} color="#D7A86E" />

      {/* Main Celestial Globe Group */}
      <group ref={globeGroupRef} position={[0.2, -0.1, 0]}>
        
        {/* 1. Deep Space Oceanic Planetary Sphere */}
        <mesh>
          <sphereGeometry args={[1.8, 64, 64]} />
          <meshStandardMaterial
            color="#081424"
            roughness={0.7}
            metalness={0.15}
          />
        </mesh>

        {/* 2. Atmospheric Cyan Rim Glow (Inverted Backface Fresnel) */}
        <mesh>
          <sphereGeometry args={[1.86, 48, 48]} />
          <meshBasicMaterial
            color="#36BFFA"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
          />
        </mesh>

        {/* 3. Subtle Agricultural Biosphere Belt (Agri Green Patches) */}
        <mesh rotation={[0.4, 0.6, 0]}>
          <sphereGeometry args={[1.808, 32, 32, 0, Math.PI * 0.8, Math.PI * 0.25, Math.PI * 0.35]} />
          <meshBasicMaterial
            color="#59D98E"
            transparent
            opacity={0.22}
            wireframe={false}
          />
        </mesh>

        {/* 4. Warm Soil Arid Transition Zone */}
        <mesh rotation={[-0.2, 1.2, 0]}>
          <sphereGeometry args={[1.806, 32, 32, 0, Math.PI * 0.6, Math.PI * 0.45, Math.PI * 0.25]} />
          <meshBasicMaterial
            color="#D7A86E"
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* 5. Precision Topographical Latitudinal Contour Arcs */}
        <group rotation={[0.3, 0.2, 0]}>
          <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={contourGeometry} />
            <meshBasicMaterial color="#36BFFA" transparent opacity={0.15} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.805, 1.815, 64]} />
            <meshBasicMaterial color="#36BFFA" transparent opacity={0.25} />
          </mesh>
          <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={contourGeometry} />
            <meshBasicMaterial color="#36BFFA" transparent opacity={0.15} />
          </mesh>
        </group>

        {/* 6. Active Field Ground Beacon (Rajshahi Field Coordinate Anchor) */}
        <group position={[0.75, 0.95, 1.25]}>
          {/* Base beacon dot */}
          <mesh>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#59D98E" />
          </mesh>
          {/* Pulsing beacon radar ring */}
          <mesh ref={beaconRef} rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[0.07, 0.11, 32]} />
            <meshBasicMaterial color="#59D98E" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Tilted Orbital Path & Traveling Satellite Group */}
      <group ref={orbitGroupRef} rotation={[0.45, 0.35, -0.3]}>
        {/* Orbital Ellipse Trace */}
        <primitive object={orbitLineObject} />

        {/* Orbiting Observation Satellite Node */}
        <group ref={satelliteRef} position={[2.6, 0, 0]}>
          {/* Central payload bus */}
          <mesh>
            <boxGeometry args={[0.09, 0.09, 0.09]} />
            <meshStandardMaterial color="#F8FAFC" emissive="#36BFFA" emissiveIntensity={0.6} />
          </mesh>
          {/* Solar array wings */}
          <mesh position={[-0.14, 0, 0]}>
            <boxGeometry args={[0.12, 0.015, 0.06]} />
            <meshBasicMaterial color="#36BFFA" />
          </mesh>
          <mesh position={[0.14, 0, 0]}>
            <boxGeometry args={[0.12, 0.015, 0.06]} />
            <meshBasicMaterial color="#36BFFA" />
          </mesh>
          {/* Subtly glowing communication link */}
          <pointLight intensity={0.5} distance={1.2} color="#36BFFA" />
        </group>
      </group>
    </>
  );
}
