import { initializeFirebase } from "@/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    confirmPasswordReset,
    User
} from "firebase/auth";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";

const USER_SESSION_COOKIE = "user_info";

export interface Appointment {
    id: string;
    treatment: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    userId?: string;
    clientName?: string;
    clientEmail?: string;
    consentSigned?: boolean;
    consentDate?: string;
    consentSignature?: string; // Data URL
    medicalHistory?: any;
    eSignStatus?: 'pending' | 'in_process' | 'successful';
    mobile?: string;
    preferredTreatment?: string;
    comments?: string;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    mobile: string;
    treatment?: string; // Optional if general inquiry
    message?: string;
    status: 'new' | 'contacted' | 'converted' | 'closed';
    createdAt: string;
}

export interface UserData {
    uid?: string; // Firebase UID
    name: string;
    email: string;
    password?: string; // Kept for type compatibility but NOT stored
    joinedDate?: string;
    appointments?: Appointment[]; // Optional, for legacy/compatibility
    isGuest?: boolean;
    role?: string;
}

export const AuthHelper = {
    // Register a new user
    registerUser: async (user: UserData): Promise<{ success: boolean; message?: string; user?: UserData }> => {
        try {
            const { auth, firestore } = initializeFirebase();

            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password || "TempPass123!");
            const firebaseUser = userCredential.user;

            // 2. Update Profile Display Name
            await updateProfile(firebaseUser, {
                displayName: user.name
            });

            // 3. Create User Document in Firestore
            const safeUser: UserData = {
                uid: firebaseUser.uid,
                name: user.name,
                email: user.email,
                joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                isGuest: user.isGuest || false,
                role: 'user' // Default role
            };

            await setDoc(doc(firestore, "users", firebaseUser.uid), safeUser);

            return { success: true, user: safeUser };

        } catch (error: any) {
            let message = "Registration failed.";
            if (error.code === 'auth/email-already-in-use') {
                console.warn("Registration: Email already in use.");
                message = "User with this email already exists.";
            } else if (error.code === 'auth/operation-not-allowed') {
                console.error("Registration: Email/Password auth not enabled in Firebase Console.");
                message = "Sign-up is currently disabled. Please contact support.";
            } else if (error.code === 'auth/weak-password') {
                message = "Password should be at least 6 characters.";
            } else {
                console.error("Registration error:", error);
            }
            return { success: false, message: message };
        }
    },

    // Reset Password
    resetPassword: async (email: string, newPassword?: string): Promise<{ success: boolean; message?: string }> => {
        // Firebase handles password reset via email link primarily for security.
        // If we want to verify the user first, we'd need them to be logged in or use admin SDK.
        // For this flow, we'll use the standard Firebase "Send Password Reset Email".
        // The `newPassword` arg is unused in the standard flow but kept for signature compatibility if we were doing an update.

        try {
            const { auth } = initializeFirebase();
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: "Password reset email sent. Please check your inbox." };
        } catch (error: any) {
            console.error("Reset password error:", error);
            let message = "Failed to send reset email.";
            if (error.code === 'auth/user-not-found') {
                message = "No account found with this email.";
            }
            return { success: false, message: message };
        }
    },

    // Confirm Password Reset with Code
    confirmPasswordReset: async (oobCode: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const { auth } = initializeFirebase();
            await confirmPasswordReset(auth, oobCode, newPassword);
            return { success: true, message: "Password has been reset successfully." };
        } catch (error: any) {
            console.error("Confirm password reset error:", error);
            let message = "Failed to reset password.";
            if (error.code === 'auth/expired-action-code') {
                message = "The password reset link has expired.";
            } else if (error.code === 'auth/invalid-action-code') {
                message = "The password reset link is invalid.";
            }
            return { success: false, message: message };
        }
    },

    // Login a user
    loginUser: async (email: string, password: string): Promise<{ success: boolean; user?: UserData; message?: string }> => {
        try {
            console.log("[AUTH-HELPER] loginUser called");
            console.log("[AUTH-HELPER] Email:", email);

            const { auth, firestore } = initializeFirebase();
            console.log("[AUTH-HELPER] Firebase initialized");

            // Special check for demo admin - effectively bypassing firebase for Hardcoded Admin for now
            // If we want to use Firebase for admin too, we should create an account for them.
            if (email.toLowerCase() === "admin@lune.com" && password === "admin") {
                console.log("[AUTH-HELPER] Admin login detected");
                // Hardcoded admin fallback (optional, can be removed if we create a real admin account)
                const adminUser = { name: "Admin", email, role: 'admin' };
                AuthHelper.setCurrentSession(adminUser);
                console.log("[AUTH-HELPER] Admin session set, returning success");
                return { success: true, user: adminUser };
            }

            console.log("[AUTH-HELPER] Attempting Firebase signInWithEmailAndPassword...");
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            console.log("[AUTH-HELPER] Firebase sign-in successful, UID:", firebaseUser.uid);

            // Fetch additional user details from Firestore
            console.log("[AUTH-HELPER] Fetching user document from Firestore...");
            const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
            console.log("[AUTH-HELPER] User document exists:", userDoc.exists());

            const userData = userDoc.exists() ? userDoc.data() as UserData : { name: firebaseUser.displayName || "User", email: firebaseUser.email || "" };
            console.log("[AUTH-HELPER] User data:", userData);

            // Verify if it is admin (stored in Firestore)
            if (userData.role === 'admin') {
                console.log("[AUTH-HELPER] User is admin, setting admin token");
                Cookies.set("admin_token", "valid_token", { expires: 1 });
            } else {
                // Set user token for middleware to allow access to /dashboard
                console.log("[AUTH-HELPER] Setting user_token cookie for middleware");
                Cookies.set("user_token", "valid_session", { expires: 7 });
            }

            console.log("[AUTH-HELPER] Login successful, returning user data");
            return { success: true, user: userData };

        } catch (error: any) {
            console.error("[AUTH-HELPER] Login error occurred:", error);
            console.error("[AUTH-HELPER] Error code:", error.code);
            console.error("[AUTH-HELPER] Error message:", error.message);

            // Suppress console.error for expected auth failures to avoid confusing the user
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                console.warn("[AUTH-HELPER] Login failed (expected):", error.code);
                return { success: false, message: "Invalid email or password." };
            }

            if (error.code === 'auth/operation-not-allowed') {
                console.error("[AUTH-HELPER] Login Error: Email/Password sign-in provider is disabled in Firebase Console.");
                return { success: false, message: "Login is currently disabled. Please contact support." };
            }

            console.error("[AUTH-HELPER] Unexpected login error:", error);
            return { success: false, message: "Invalid email or password." };
        }
    },

    // Login with Google
    loginWithGoogle: async (): Promise<{ success: boolean; user?: UserData; message?: string }> => {
        try {
            const { auth, firestore } = initializeFirebase();
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // Check if user exists in Firestore, if not create them
            const userDocRef = doc(firestore, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            let userData: UserData;

            if (userDoc.exists()) {
                userData = userDoc.data() as UserData;
            } else {
                // Create new user from Google profile
                userData = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || "User",
                    email: firebaseUser.email || "",
                    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    isGuest: false,
                    role: 'user'
                };
                await setDoc(userDocRef, userData);
            }

            AuthHelper.setCurrentSession(userData);
            return { success: true, user: userData };

        } catch (error: any) {
            console.error("Google Login error:", error);
            let message = "Failed to sign in with Google.";
            if (error.code === 'auth/popup-closed-by-user') {
                message = "Sign in was cancelled.";
            }
            return { success: false, message };
        }
    },

    // Add appointment
    addAppointment: async (email: string, appointment: Omit<Appointment, 'id' | 'status'>): Promise<{ success: boolean; message?: string }> => {
        try {
            const { firestore } = initializeFirebase();

            // 1. Find User by Email (to link appointment)
            // Ideally we should use UID, but if booking from landing page we might only have email.
            // If user is not logged in, we might create a "guest" or just store the email.

            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            let userId = null;
            let userName = "";

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                userId = userDoc.id;
                userName = userDoc.data().name;
            }

            const newAppointment = {
                ...appointment,
                status: 'upcoming',
                userId: userId, // Can be null if guest
                clientEmail: email,
                clientName: userName || "Guest", // Fallback
                createdAt: new Date().toISOString(),
                // Ensure consent data is passed through if present
                consentSigned: appointment.consentSigned || false,
                consentSignature: appointment.consentSignature || null,
                medicalHistory: appointment.medicalHistory || null,
                eSignStatus: appointment.eSignStatus || 'pending',
                mobile: appointment.mobile || '',
                preferredTreatment: appointment.preferredTreatment || '',
                comments: appointment.comments || ''
            };

            await addDoc(collection(firestore, "appointments"), newAppointment);

            return { success: true };

        } catch (error) {
            console.error("Add appointment error:", error);
            return { success: false, message: "Failed to book appointment." };
        }
    },

    // Set current active session - Kept for compatibility but reliance should shift to Firebase Auth State
    setCurrentSession: (user: any) => {
        // We still set this for middleware compatibility if any, or simple client-side checks
        Cookies.set(USER_SESSION_COOKIE, JSON.stringify(user), { expires: 7 });
        Cookies.set("user_token", "valid_session", { expires: 7 });
    },

    // Logout
    logout: async () => {
        const { auth } = initializeFirebase();
        await signOut(auth);
        Cookies.remove(USER_SESSION_COOKIE);
        Cookies.remove("user_token");
        Cookies.remove("admin_token");
    },

    // --- Admin Methods ---

    // Get all appointments
    getAllAppointments: async (): Promise<(Appointment & { clientName: string; clientEmail: string })[]> => {
        try {
            const { firestore } = initializeFirebase();
            const querySnapshot = await getDocs(collection(firestore, "appointments"));

            const appointments: any[] = [];
            querySnapshot.forEach((doc) => {
                appointments.push({ id: doc.id, ...doc.data() });
            });

            // Sort by date manually since we fetched all
            return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        } catch (error) {
            console.error("Get all appointments error:", error);
            return [];
        }
    },

    // Update appointment status
    updateAppointmentStatus: async (clientEmail: string, appointmentId: string, status: 'upcoming' | 'completed' | 'cancelled'): Promise<{ success: boolean }> => {
        try {
            const { firestore } = initializeFirebase();

            // We need to find the appointment document. 
            // If appointmentId is the Firestore Doc ID (which it should be now), we can update directly.
            // But if `appointmentId` is the old random string, we might need to query.
            // Let's assume for the new flow it will be Doc ID. 
            // However, for safety during migration, we might want to check.
            // Since we are creating new appointments with `addDoc`, the ID will be the Doc ID.

            const aptRef = doc(firestore, "appointments", appointmentId);
            await updateDoc(aptRef, { status: status });

            return { success: true };

        } catch (error) {
            console.error("Update appointment status error:", error);
            return { success: false };
        }
    },

    // Update appointment E-Sign status
    updateAppointmentESignStatus: async (appointmentId: string, status: 'pending' | 'in_process' | 'successful'): Promise<{ success: boolean }> => {
        try {
            const { firestore } = initializeFirebase();
            const aptRef = doc(firestore, "appointments", appointmentId);
            await updateDoc(aptRef, { eSignStatus: status });
            return { success: true };
        } catch (error) {
            console.error("Update appointment E-Sign status error:", error);
            return { success: false };
        }
    },

    // Delete appointment
    deleteAppointment: async (appointmentId: string): Promise<{ success: boolean }> => {
        try {
            const { firestore } = initializeFirebase();
            const aptRef = doc(firestore, "appointments", appointmentId);
            await deleteDoc(aptRef);
            return { success: true };
        } catch (error) {
            console.error("Delete appointment error:", error);
            return { success: false };
        }
    },

    // Update appointment consent
    updateAppointmentConsent: async (appointmentId: string, signatureData: string, medicalHistory: any): Promise<{ success: boolean }> => {
        try {
            const { firestore } = initializeFirebase();
            const aptRef = doc(firestore, "appointments", appointmentId);

            await updateDoc(aptRef, {
                consentSigned: true,
                consentDate: new Date().toLocaleDateString(),
                consentSignature: signatureData,
                medicalHistory: medicalHistory,
                eSignStatus: 'successful' // Auto-update status when signed
            });

            return { success: true };
        } catch (error) {
            console.error("Update appointment consent error:", error);
            return { success: false };
        }
    },

    // Get Admin Stats
    getStats: async () => {
        try {
            const { firestore } = initializeFirebase();

            // Count users
            const usersSnapshot = await getDocs(collection(firestore, "users"));
            const clientsCount = usersSnapshot.size;

            // Count bookings
            const aptSnapshot = await getDocs(collection(firestore, "appointments"));
            const bookingsCount = aptSnapshot.size;

            // Estimate revenue
            const revenue = bookingsCount * 150;

            return {
                bookings: bookingsCount,
                revenue: revenue,
                clients: clientsCount
            };
        } catch (error) {
            return { bookings: 0, revenue: 0, clients: 0 };
        }
    },

    // --- Leads Methods ---

    // Add a new lead
    addLead: async (lead: Omit<Lead, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; message?: string }> => {
        try {
            const { firestore } = initializeFirebase();
            await addDoc(collection(firestore, "leads"), {
                ...lead,
                status: 'new',
                createdAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error("Add lead error:", error);
            return { success: false, message: "Failed to submit inquiry." };
        }
    },

    // Get all leads
    getAllLeads: async (): Promise<Lead[]> => {
        try {
            const { firestore } = initializeFirebase();
            const querySnapshot = await getDocs(collection(firestore, "leads"));
            const leads: Lead[] = [];
            querySnapshot.forEach((doc) => {
                leads.push({ id: doc.id, ...doc.data() } as Lead);
            });
            // Sort by date (newest first)
            return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (error) {
            console.error("Get all leads error:", error);
            return [];
        }
    },

    // Update lead status
    updateLeadStatus: async (leadId: string, status: 'new' | 'contacted' | 'converted' | 'closed'): Promise<{ success: boolean }> => {
        try {
            const { firestore } = initializeFirebase();
            const leadRef = doc(firestore, "leads", leadId);
            await updateDoc(leadRef, { status: status });
            return { success: true };
        } catch (error) {
            console.error("Update lead status error:", error);
            return { success: false };
        }
    },

    // Subscribe to leads (Real-time updates)
    subscribeToLeads: (callback: (leads: Lead[]) => void): Unsubscribe => {
        const { firestore } = initializeFirebase();
        const q = query(collection(firestore, "leads"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leads: Lead[] = [];
            snapshot.forEach((doc) => {
                leads.push({ id: doc.id, ...doc.data() } as Lead);
            });
            // Sort by date (newest first)
            const sortedLeads = leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            callback(sortedLeads);
        }, (error) => {
            console.error("Subscribe to leads error:", error);
        });

        return unsubscribe;
    }
};
