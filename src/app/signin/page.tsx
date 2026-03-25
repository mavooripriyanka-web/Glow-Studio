"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { AuthHelper } from "@/lib/auth-helper";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { initializeFirebase } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

function SignInContent() {
    const [view, setView] = useState<'login' | 'forgot_password'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Forgot Password States
    const [resetStep, setResetStep] = useState(1); // 1: Email + New Password (Request), 2: Confirm (from email link)
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [resetSuccess, setResetSuccess] = useState(false);
    const [oobCode, setOobCode] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('oobCode');
        if (code) {
            setOobCode(code);
            setView('forgot_password');
            setResetStep(2); // Go directly to confirmation step logic

            // Check if we have a saved password to auto-reset
            const savedPassword = localStorage.getItem('temp_reset_password');
            if (savedPassword) {
                // Auto-trigger reset
                AuthHelper.confirmPasswordReset(code, savedPassword).then((res) => {
                    localStorage.removeItem('temp_reset_password'); // Clean up
                    if (res.success) {
                        setResetSuccess(true);
                    } else {
                        setError(res.message || "Failed to reset password automatically. Please try again.");
                        // If auto-fail, show the form to manually enter
                    }
                });
            }
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            console.log("[DEBUG] Login attempt started");

            // Try user login
            const result = await AuthHelper.loginUser(email, password);

            if (result.success && result.user) {
                console.log("[DEBUG] Login successful");
                // Determine redirect based on role (if any)
                // @ts-ignore
                const userRole = result.user.role;

                const redirectUrl = userRole === 'admin' ? "/admin/dashboard" : "/dashboard";

                // Wait for Firebase auth state to update by listening to onAuthStateChanged
                // This ensures the dashboard doesn't redirect back to signin
                const { auth } = initializeFirebase();

                const authStatePromise = new Promise<void>((resolve) => {
                    const unsubscribe = onAuthStateChanged(auth, (user) => {
                        if (user) {
                            unsubscribe();
                            resolve();
                        }
                    });

                    // Timeout after 3 seconds as fallback
                    setTimeout(() => {
                        unsubscribe();
                        resolve();
                    }, 3000);
                });

                await authStatePromise;

                // Perform redirect
                window.location.href = redirectUrl;

                // Keep loading state true during redirect
            } else {
                setError(result.message || "Invalid credentials. Please try again.");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("[DEBUG] Login error caught:", err);
            setError("An unexpected error occurred during login.");
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (resetStep === 1) {
            // Step 1: Request Reset (Email + New Password upfront)
            if (!resetEmail) {
                setError("Please enter your email.");
                return;
            }
            if (!newPassword || !confirmNewPassword) {
                setError("Please enter and confirm your new password.");
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setError("Passwords do not match.");
                return;
            }

            // Save password temporarily for auto-reset on return
            localStorage.setItem('temp_reset_password', newPassword);

            const result = await AuthHelper.resetPassword(resetEmail);
            if (result.success) {
                setResetSuccess(true); // Show "Check your email" message
            } else {
                setError(result.message || "Failed to send reset email.");
            }

        } else if (resetStep === 2) {
            // Step 2: Manual Reset (Fallback if no local storage or different device)
            if (!newPassword || !confirmNewPassword) {
                setError("Please enter and confirm your new password.");
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setError("Passwords do not match.");
                return;
            }

            if (!oobCode) {
                setError("Invalid reset link. Please request a new one.");
                return;
            }

            const result = await AuthHelper.confirmPasswordReset(oobCode, newPassword);
            if (result.success) {
                setResetSuccess(true);
                // Step 3 logic handled by rendering success UI
            } else {
                setError(result.message || "Failed to reset password.");
            }
        }
    };

    return (
        <section className="py-20 bg-stone-50 min-h-screen flex items-center justify-center">
            <div className="container px-4">
                <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-light uppercase tracking-widest font-serif mb-2 text-foreground">
                            {view === 'login' ? 'Sign In' : 'Reset Password'}
                        </h2>
                        <p className="text-stone-500 text-sm">
                            {view === 'login'
                                ? 'Welcome back to Lune Advanced Skincare'
                                : 'Recover your account access'}
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100 mb-4">
                            {error}
                            {(error.includes("Invalid credentials") || error.includes("Invalid email or password")) && (
                                <p className="mt-2 text-xs text-stone-600">
                                    Did you book a service as a guest? <button onClick={() => setView('forgot_password')} className="underline font-semibold hover:text-primary">Reset your password</button> to claim your account.
                                </p>
                            )}
                        </div>
                    )}

                    {view === 'login' ? (
                        /* LOGIN FORM */
                        <>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <GoogleAuthButton text="Sign in with Google" />
                                <div className="relative flex items-center justify-center my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-stone-200"></span>
                                    </div>
                                    <div className="relative bg-white px-4 text-xs text-stone-400 uppercase tracking-widest">
                                        Or continue with email
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="bg-stone-50 border-stone-200"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider">Password</label>
                                    <Input
                                        id="password"
                                        type="password"
                                        className="bg-stone-50 border-stone-200"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90 rounded-[4px] mt-4"
                                >
                                    {isLoading ? "Signing In..." : "Sign In"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-stone-500">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-primary hover:underline">
                                    Sign Up
                                </Link>
                            </div>
                            <div className="mt-2 text-center text-sm">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setView('forgot_password');
                                        setError("");
                                        setResetStep(1);
                                        setResetSuccess(false);
                                    }}
                                    className="text-stone-400 hover:text-primary transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </>
                    ) : (
                        /* FORGOT PASSWORD FORM */
                        <>
                            {!resetSuccess ? (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    {resetStep === 1 ? (
                                        // Step 1: Consolidated Form
                                        <>
                                            <div className="space-y-2">
                                                <label htmlFor="resetEmail" className="text-xs font-medium uppercase tracking-wider">Enter your Registered Email</label>
                                                <Input
                                                    id="resetEmail"
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    className="bg-stone-50 border-stone-200"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="newPassword" className="text-xs font-medium uppercase tracking-wider">New Password</label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    className="bg-stone-50 border-stone-200"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="confirmNewPassword" className="text-xs font-medium uppercase tracking-wider">Confirm New Password</label>
                                                <Input
                                                    id="confirmNewPassword"
                                                    type="password"
                                                    className="bg-stone-50 border-stone-200"
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90 rounded-[4px] mt-4">
                                                Reset Password
                                            </Button>
                                        </>
                                    ) : (
                                        // Step 2: Fallback Manual Entry (only if auto-reset failed or cross-device)
                                        <>
                                            <p className="text-center text-sm text-stone-600 mb-4">
                                                Please enter your new password to complete the reset.
                                            </p>
                                            <div className="space-y-2">
                                                <label htmlFor="newPassword" className="text-xs font-medium uppercase tracking-wider">New Password</label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    className="bg-stone-50 border-stone-200"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="confirmNewPassword" className="text-xs font-medium uppercase tracking-wider">Confirm New Password</label>
                                                <Input
                                                    id="confirmNewPassword"
                                                    type="password"
                                                    className="bg-stone-50 border-stone-200"
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90 rounded-[4px] mt-4">
                                                Confirm New Password
                                            </Button>
                                        </>
                                    )}

                                    <div className="mt-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setView('login');
                                                setError("");
                                            }}
                                            className="text-xs text-stone-400 hover:text-stone-600 uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // SUCCESS STATE
                                <div className="text-center py-6">
                                    {resetStep === 1 ? (
                                        // Message after requesting the link
                                        <>
                                            <div className="text-blue-600 mb-4 text-xl">✓ Link Sent</div>
                                            <p className="text-stone-500 text-sm mb-6">
                                                We've sent a confirmation link to <strong>{resetEmail}</strong>.
                                                <br />
                                                Click the link in your email to automatically finalize your new password.
                                            </p>
                                        </>
                                    ) : (
                                        // Message after successful reset (step 3)
                                        <>
                                            <div className="text-green-600 mb-4 text-xl">✓ Password Reset Successfully</div>
                                            <p className="text-stone-500 text-sm mb-6">You can now sign in with your new password.</p>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setView('login');
                                                    setResetSuccess(false);
                                                    setError("");
                                                    // Clear temp password if any
                                                    localStorage.removeItem('temp_reset_password');
                                                }}
                                                className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90 rounded-[4px]"
                                            >
                                                Back to Sign In
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <section className="py-20 bg-stone-50 min-h-screen flex items-center justify-center">
                <div className="container px-4">
                    <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm w-full">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
            </section>
        }>
            <SignInContent />
        </Suspense>
    );
}
