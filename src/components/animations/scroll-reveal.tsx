"use client"

import { useEffect, useRef, ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

interface ScrollRevealProps {
    children: ReactNode
    direction?: "up" | "down" | "left" | "right" | "fade"
    delay?: number
    duration?: number
    className?: string
}

export function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 1,
    className = ""
}: ScrollRevealProps) {
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!elementRef.current) return

        const element = elementRef.current

        // Initial state based on direction
        const initialState: gsap.TweenVars = {
            opacity: 0,
        }

        switch (direction) {
            case "up":
                initialState.y = 50
                break
            case "down":
                initialState.y = -50
                break
            case "left":
                initialState.x = 50
                break
            case "right":
                initialState.x = -50
                break
            case "fade":
                // Only opacity animation
                break
        }

        // Set initial state
        gsap.set(element, initialState)

        // Animate on scroll
        const animation = gsap.to(element, {
            opacity: 1,
            x: 0,
            y: 0,
            duration,
            delay,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        })

        // Cleanup
        return () => {
            animation.kill()
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === element) {
                    trigger.kill()
                }
            })
        }
    }, [direction, delay, duration])

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    )
}
