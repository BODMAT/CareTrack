import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IAnimal } from "../arcitecture/main";
import { useAuth } from "./useAuth";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../apis/firebase";
import type { Status } from "../arcitecture/types";
import { useState } from "react";

// Для отримання тварин користувача
export const useUserAnimals = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["animals", user?.uid],
        enabled: !!user,
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, "users", user!.uid, "animals"));
            const animals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IAnimal & { id: string }));
            return animals;
        }
    });
};

// Додавання нової тварини
export const useAddAnimal = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const addAnimal = useMutation({
        mutationFn: async (newAnimal: IAnimal) => {
            const ref = collection(db, "users", user!.uid, "animals");
            const docRef = await addDoc(ref, newAnimal);
            return docRef;
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["animals", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error adding animal:", error);
        }
    });

    return { addAnimal, status };
};


// Видалення тварини
export const useDeleteAnimal = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const deleteAnimal = useMutation({
        mutationFn: async (id: string) => {
            const ref = doc(db, "users", user!.uid, "animals", id);
            await deleteDoc(ref);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["animals", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting animal:", error);
        }
    });

    return { deleteAnimal, status }
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
