import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
} from "firebase/firestore";
import { db } from "../../apis/firebase";
import type { Status } from "../../architecture/types";
import { useState } from "react";
import { Animal, AnimalDTO } from "../../architecture/Animal";

export const useAdminAnimals = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["animals", "admin"],
        enabled: !!user && user.role === "admin",
        queryFn: async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                console.log("Users snapshot:", usersSnapshot);

                // Тут ми повертаємо масив об'єктів, де user + animals
                const result: { user: any; animals: Animal[] }[] = [];

                for (const userDoc of usersSnapshot.docs) {
                    const userData = userDoc.data();
                    const uid = userDoc.id;

                    const animalsSnapshot = await getDocs(collection(db, "users", uid, "animals"));
                    const animals = animalsSnapshot.docs.map(docSnap => {
                        const data = docSnap.data();
                        return Animal.fromDTO(
                            new AnimalDTO(data.id, data.petSpecies, data.name, data.birthYear, data.sex)
                        );
                    });

                    if (animals.length > 0) {
                        result.push({
                            user: { id: uid, ...userData }, // повний користувач з uid
                            animals,
                        });
                    }
                }

                return result;
            } catch (error) {
                console.error("Error fetching users or animals:", error);
                throw error;
            }
        },
    });
};

// Видалення тварини по UID (якщо роль — admin)
export const useDeleteAdminAnimal = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => setTimeout(() => setStatus(null), 3000);

    const deleteAnimal = useMutation({
        mutationFn: async ({ uid, id }: { uid: string; id: string }) => {
            if (user?.role !== "admin") throw new Error("Not authorized");
            const ref = doc(db, "users", uid, "animals", id);
            await deleteDoc(ref);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["animals", "admin"] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting animal (admin):", error);
        }
    });

    return { deleteAnimal, status };
};
