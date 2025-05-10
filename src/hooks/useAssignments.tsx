import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { db } from "../apis/firebase";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import type { IAssignment } from "../arcitecture/main";
import type { Status } from "../arcitecture/types";

// Отримання завдань
export const useUserAssignments = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["assignments", user?.uid],
        enabled: !!user,
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, "users", user!.uid, "assignments"));
            const assignments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as (IAssignment & { id: string })[];
            return assignments;
        },
    });
};

// Додавання завдання
export const useAddAssignment = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const addAssignment = useMutation({
        mutationFn: async (assignment: IAssignment) => {
            const ref = collection(db, "users", user!.uid, "assignments");
            const docRef = await addDoc(ref, assignment);
            return docRef;
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error adding assignment:", error);
        },
    });

    return { addAssignment, status };
};

// Видалення завдання
export const useDeleteAssignment = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const deleteAssignment = useMutation({
        mutationFn: async (id: string) => {
            const ref = doc(db, "users", user!.uid, "assignments", id);
            await deleteDoc(ref);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting assignment:", error);
        },
    });

    return { deleteAssignment, status };
};

// Оновлення завдання
export const useUpdateAssignment = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<IAssignment> }) => {
            const ref = doc(db, "users", user!.uid, "assignments", id);
            await updateDoc(ref, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.uid] });
        },
        onError: (error) => {
            console.error("Error updating assignment:", error);
        },
    });
};
