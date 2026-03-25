"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHelper } from "@/lib/auth-helper";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { useLanguage } from '@/context/language-context';

export default function SignUpPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const { name, email, password, confirmPassword } = formData;

        // Basic Validation
        if (!name || !email || !password || !confirmPassword) {
            setError(t("signUp.errors.fillAll", "Please fill in all fields."));
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError(t("signUp.errors.passwordsDontMatch", "Passwords do not match."));
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t("signUp.errors.passwordLength", "Password must be at least 6 characters."));
            setIsLoading(false);
            return;
        }

        try {
            // Attempt registration
            const result = await AuthHelper.registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                isGuest: false // Explicitly not a guest
            });

            if (!result.success) {
                setError(result.message || "Registration failed.");
                setIsLoading(false);
                return;
            }

            // Registration successful (User is already signed in via Firebase)
            // Set session cookie for compatibility/middleware
            if (result.user) {
                AuthHelper.setCurrentSession(result.user);
            }

            router.push("/dashboard");

        } catch (err) {
            setError("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 bg-stone-50 min-h-screen flex items-center justify-center">
            <div className="container px-4">
                <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-light uppercase tracking-widest font-serif mb-2 text-foreground">
                            {t("signUp.title", "SIGN UP")}
                        </h2>
                        <p className="text-stone-500 text-sm">
                            {t("signUp.subtitle", "Create an account to track your journey")}
                        </p>
                    </div>

                    <GoogleAuthButton text={t("signUp.google", "SIGN UP WITH GOOGLE")} />

                    <div className="relative flex items-center justify-center my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-stone-200"></span>
                        </div>
                        <div className="relative bg-white px-4 text-xs text-stone-400 uppercase tracking-widest">
                            {t("signUp.orContinue", "OR CONTINUE WITH EMAIL")}
                        </div>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-xs font-medium uppercase tracking-wider"
                            >
                                {t("signUp.fullName", "FULL NAME")}
                            </label>
                            <Input
                                id="name"
                                placeholder="Jane Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-xs font-medium uppercase tracking-wider"
                            >
                                {t("signUp.email", "EMAIL")}
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-xs font-medium uppercase tracking-wider"
                            >
                                {t("signUp.password", "PASSWORD")}
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-xs font-medium uppercase tracking-wider"
                            >
                                {t("signUp.confirmPassword", "CONFIRM PASSWORD")}
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-stone-50 border-stone-200"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90 rounded-[4px] mt-4"
                        >
                            {isLoading ? t("signUp.creating", "Creating Account...") : t("signUp.button", "SIGN UP")}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-500">
                        {t("signUp.alreadyHave", "Already have an account?")}{" "}
                        <Link href="/signin" className="text-primary hover:underline">
                            {t("signUp.signIn", "Sign In")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
