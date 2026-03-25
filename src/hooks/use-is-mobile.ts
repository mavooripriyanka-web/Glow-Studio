"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect if the user is on a mobile device
 * Useful for conditionally disabling heavy animations on mobile
 * 
 * @param breakpoint - Width in pixels to consider as mobile (default: 768)
 * @returns boolean - true if viewport width is less than breakpoint
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Initial check
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint)
        }

        // Check on mount
        checkMobile()

        // Check on resize
        window.addEventListener("resize", checkMobile)

        // Cleanup
        return () => window.removeEventListener("resize", checkMobile)
    }, [breakpoint])

    return isMobile
}
