"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

interface FloatingSphereProps {
    className?: string
    disableOnMobile?: boolean
}

export function FloatingSphere({ className = "", disableOnMobile = true }: FloatingSphereProps) {
    const mountRef = useRef<HTMLDivElement>(null)
    const frameIdRef = useRef<number>(0)
    const [isMobile, setIsMobile] = useState(false)

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Don't render on mobile if disabled
    if (disableOnMobile && isMobile) {
        return null
    }

    useEffect(() => {
        if (!mountRef.current) return

        // Scene setup
        const scene = new THREE.Scene()

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.z = 5

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        mountRef.current.appendChild(renderer.domElement)

        // Create luxury sphere with subtle material
        const geometry = new THREE.SphereGeometry(1.5, 64, 64)
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xd4af37, // Gold color for luxury feel
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.15,
            wireframe: true,
        })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 1)
        pointLight.position.set(5, 5, 5)
        scene.add(pointLight)

        // Animation
        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate)

            // Subtle rotation for luxury feel
            sphere.rotation.x += 0.002
            sphere.rotation.y += 0.003

            renderer.render(scene, camera)
        }

        animate()

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }

        window.addEventListener("resize", handleResize)

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize)

            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current)
            }

            geometry.dispose()
            material.dispose()
            renderer.dispose()

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <div
            ref={mountRef}
            className={`fixed inset-0 pointer-events-none ${className}`}
            style={{ zIndex: 1 }}
        />
    )
}
