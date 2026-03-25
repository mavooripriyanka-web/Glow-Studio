"use client"

import { Button } from "@/components/ui/button"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useRouter } from "next/navigation"

interface HeroBookButtonProps {
    className?: string
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg" | "icon"
}

export function HeroBookButton({ className, variant = "outline", size = "lg" }: HeroBookButtonProps) {
    const router = useRouter()
    const { handleAuthAction, AuthGuardComponent } = useAuthGuard()

    const handleClick = () => {
        handleAuthAction(() => {
            router.push("#appointment")
        })
    }

    return (
        <>
            {AuthGuardComponent}
            <Button
                variant={variant}
                size={size}
                className={className}
                onClick={handleClick}
            >
                Book an Appointment
            </Button>
        </>
    )
}
