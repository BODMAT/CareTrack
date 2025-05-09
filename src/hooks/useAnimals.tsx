import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IAnimal } from "../arcitecture/main";
import { useAuth } from "./useAuth";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../apis/firebase";

// Для отримання тварин користувача
export const useUserAnimals = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["animals", user?.uid],
        enabled: !!user,
        queryFn: async () => {
            console.log("Fetching user animals...");
            const snapshot = await getDocs(collection(db, "users", user!.uid, "animals"));
            const animals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IAnimal & { id: string }));
            console.log("Fetched animals:", animals);
            return animals;
        }
    });
};

// Додавання нової тварини
export const useAddAnimal = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (newAnimal: IAnimal) => {
            console.log("Adding new animal:", newAnimal);
            const ref = collection(db, "users", user!.uid, "animals");
            const docRef = await addDoc(ref, newAnimal);
            console.log("New animal added with ID:", docRef.id);
            return docRef;
        },
        onSuccess: () => {
            console.log("Animal added successfully, invalidating query...");
            queryClient.invalidateQueries({ queryKey: ["animals", user?.uid] });
        },
        onError: (error) => {
            console.error("Error adding animal:", error);
        }
    });
};

// Видалення тварини
export const useDeleteAnimal = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (id: string) => {
            console.log("Deleting animal with ID:", id);
            const ref = doc(db, "users", user!.uid, "animals", id);
            await deleteDoc(ref);
            console.log("Animal deleted with ID:", id);
        },
        onSuccess: () => {
            console.log("Animal deleted successfully, invalidating query...");
            queryClient.invalidateQueries({ queryKey: ["animals", user?.uid] });
        },
        onError: (error) => {
            console.error("Error deleting animal:", error);
        }
    });
};

// Оновлення інформації про тварину
export const useUpdateAnimal = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<IAnimal> }) => {
            console.log("Updating animal with ID:", id, "Data:", data);
            const ref = doc(db, "users", user!.uid, "animals", id);
            await updateDoc(ref, data);
            console.log("Animal updated with ID:", id);
        },
        onSuccess: () => {
            console.log("Animal updated successfully, invalidating query...");
            queryClient.invalidateQueries({ queryKey: ["animals", user?.uid] });
        },
        onError: (error) => {
            console.error("Error updating animal:", error);
        }
    });
};
