"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthHelper } from "@/lib/auth-helper";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function GoogleAuthButton({ text = "Continue with Google" }: { text?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await AuthHelper.loginWithGoogle();
            if (result.success) {
                router.push("/dashboard");
            } else {
                console.error(result.message);
                // Ideally show a toast here, but for now we log it
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-6 bg-white border-stone-200 hover:bg-stone-50 text-stone-700"
        >
            {isLoading ? (
                <span className="text-sm">Connecting...</span>
            ) : (
                <>
                    <Image
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                    />
                    <span className="text-sm font-medium uppercase tracking-wider">{text}</span>
                </>
            )}
        </Button>
    );
}
