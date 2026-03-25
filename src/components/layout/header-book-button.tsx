"use client"

import { Button } from "@/components/ui/button"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useLanguage } from "@/context/language-context"
import { useRouter } from "next/navigation"

interface HeaderBookButtonProps {
    className?: string
    variant?: "default" | "outline" | "ghost"
}

export function HeaderBookButton({ className, variant = "default" }: HeaderBookButtonProps) {
    const { t } = useLanguage()
    const router = useRouter()
    const { handleAuthAction, AuthGuardComponent } = useAuthGuard()

    const handleClick = () => {
        handleAuthAction(() => {
            router.push("/contact#book")
        })
    }

    return (
        <>
            {AuthGuardComponent}
            <Button
                variant={variant}
                className={className}
                onClick={handleClick}
            >
                {t("nav.bookAppointment")}
            </Button>
        </>
    )
}
