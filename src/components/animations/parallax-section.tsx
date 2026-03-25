"use client"

import { useEffect, useRef, ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

interface ParallaxSectionProps {
    children: ReactNode
    speed?: number
    className?: string
}

export function ParallaxSection({
    children,
    speed = 0.5,
    className = ""
}: ParallaxSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current) return

        const section = sectionRef.current

        // Create parallax effect
        const animation = gsap.to(section, {
            y: () => window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        })

        // Cleanup
        return () => {
            animation.kill()
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === section) {
                    trigger.kill()
                }
            })
        }
    }, [speed])

    return (
        <div ref={sectionRef} className={className}>
            {children}
        </div>
    )
}
