import { initializeFirebase } from "@/firebase";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    addDoc
} from "firebase/firestore";

export interface Testimonial {
    id: string;
    name: string;
    text: string;
    rating: number; // 1-5
    order: number;
    createdAt: string;
}

export const TestimonialsHelper = {
    // Get all testimonials
    getAllTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const { firestore } = initializeFirebase();
            const q = query(collection(firestore, "testimonials"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);

            const testimonials: Testimonial[] = [];
            querySnapshot.forEach((doc) => {
                testimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
            });

            return testimonials;
        } catch (error) {
            console.error("Get all testimonials error:", error);
            return [];
        }
    },

    // Add a new testimonial
    addTestimonial: async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<{ success: boolean; message?: string; id?: string }> => {
        try {
            const { firestore } = initializeFirebase();

            const newTestimonial = {
                ...testimonial,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(firestore, "testimonials"), newTestimonial);

            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Add testimonial error:", error);
            return { success: false, message: "Failed to add testimonial." };
        }
    },

    // Update an existing testimonial
    updateTestimonial: async (id: string, updates: Partial<Omit<Testimonial, 'id' | 'createdAt'>>): Promise<{ success: boolean; message?: string }> => {
        try {
            const { firestore } = initializeFirebase();
            const testimonialRef = doc(firestore, "testimonials", id);
            await updateDoc(testimonialRef, updates);

            return { success: true };
        } catch (error) {
            console.error("Update testimonial error:", error);
            return { success: false, message: "Failed to update testimonial." };
        }
    },

    // Delete a testimonial
    deleteTestimonial: async (id: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const { firestore } = initializeFirebase();
            const testimonialRef = doc(firestore, "testimonials", id);
            await deleteDoc(testimonialRef);

            return { success: true };
        } catch (error) {
            console.error("Delete testimonial error:", error);
            return { success: false, message: "Failed to delete testimonial." };
        }
    }
};
