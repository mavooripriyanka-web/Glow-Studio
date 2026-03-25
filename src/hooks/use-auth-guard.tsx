"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/firebase/provider"
import { AuthGuardModal } from "@/components/ui/auth-guard-modal"

export function useAuthGuard() {
    const { user, isUserLoading } = useUser()
    const router = useRouter()
    const [showAuthModal, setShowAuthModal] = useState(false)

    // Auto-close modal if user becomes authenticated
    useEffect(() => {
        if (user) {
            setShowAuthModal(false);
        }
    }, [user]);

    const handleAuthAction = (action: () => void) => {
        console.log("handleAuthAction triggered", { isUserLoading, user: !!user });

        // If user is logged in, execute action immediately
        if (user) {
            console.log("User logged in, executing action");
            action();
            return;
        }

        // If user is not logged in (or loading), show modal
        // We don't block on loading anymore to prevent "nothing happening"
        console.log("User not logged in (or loading), showing modal");
        setShowAuthModal(true);
    }

    const handleConfirm = () => {
        setShowAuthModal(false)
        router.push("/signup")
    }

    const AuthGuardComponent = (
        <AuthGuardModal
            open={showAuthModal}
            onOpenChange={setShowAuthModal}
            onConfirm={handleConfirm}
        />
    )

    return {
        handleAuthAction,
        AuthGuardComponent,
    }
}
