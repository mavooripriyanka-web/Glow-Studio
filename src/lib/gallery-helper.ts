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

export interface GalleryImage {
    id: string;
    imageUrl: string; // Base64 data URL or external URL
    alt: string;
    order: number;
    createdAt: string;
}

export const GalleryHelper = {
    // Get all gallery images
    getAllGalleryImages: async (): Promise<GalleryImage[]> => {
        try {
            const { firestore } = initializeFirebase();
            const q = query(collection(firestore, "gallery"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);

            const images: GalleryImage[] = [];
            querySnapshot.forEach((doc) => {
                images.push({ id: doc.id, ...doc.data() } as GalleryImage);
            });

            return images;
        } catch (error) {
            console.error("Get all gallery images error:", error);
            return [];
        }
    },

    // Add a new gallery image
    addGalleryImage: async (image: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<{ success: boolean; message?: string; id?: string }> => {
        try {
            const { firestore } = initializeFirebase();

            const newImage = {
                ...image,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(firestore, "gallery"), newImage);

            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Add gallery image error:", error);
            return { success: false, message: "Failed to add gallery image." };
        }
    },

    // Update an existing gallery image
    updateGalleryImage: async (id: string, updates: Partial<Omit<GalleryImage, 'id' | 'createdAt'>>): Promise<{ success: boolean; message?: string }> => {
        try {
            const { firestore } = initializeFirebase();
            const imageRef = doc(firestore, "gallery", id);
            await updateDoc(imageRef, updates);

            return { success: true };
        } catch (error) {
            console.error("Update gallery image error:", error);
            return { success: false, message: "Failed to update gallery image." };
        }
    },

    // Delete a gallery image
    deleteGalleryImage: async (id: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const { firestore } = initializeFirebase();
            const imageRef = doc(firestore, "gallery", id);
            await deleteDoc(imageRef);

            return { success: true };
        } catch (error) {
            console.error("Delete gallery image error:", error);
            return { success: false, message: "Failed to delete gallery image." };
        }
    }
};
