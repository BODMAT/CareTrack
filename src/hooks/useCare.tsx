import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../apis/firebase";
import type { Assignment, ICare } from "../arcitecture/main";
import { useState } from "react";
import type { Status } from "../arcitecture/types";

// Отримання доглядів
export const useUserCares = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["cares", user?.uid],
        enabled: !!user,
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, "users", user!.uid, "cares"));
            const cares = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as (ICare & { id: string })[];
            return cares;
        },
    });
};

// Додавання догляду
export const useAddCare = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const addCare = useMutation({
        mutationFn: async (care: ICare) => {
            const ref = collection(db, "users", user!.uid, "cares");
            const docRef = await addDoc(ref, care);
            return docRef;
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error adding care:", error);
        },
    });

    return { addCare, status };
};

// Видалення догляду
export const useDeleteCare = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const deleteCare = useMutation({
        mutationFn: async (id: string) => {
            const ref = doc(db, "users", user!.uid, "cares", id);
            await deleteDoc(ref);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting care:", error);
        },
    });

    return { deleteCare, status };
};

// Оновлення догляду
export const useUpdateCare = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<ICare> }) => {
            const ref = doc(db, "users", user!.uid, "cares", id);
            await updateDoc(ref, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (error) => {
            console.error("Error updating care:", error);
        },
    });
};

// Додавання завдання до догляду
export const useAddAssignmentToCare = () => {
    const { user } = useAuth();

    const addAssignment = async (careId: string, assignment: Assignment) => {
        const ref = doc(db, "users", user!.uid, "cares", careId);
        const careDoc = await getDoc(ref);
        const currentCareData = careDoc.data() as ICare;

        const updatedAssignments = [...currentCareData.assignments, assignment];

        await updateDoc(ref, { assignments: updatedAssignments });
    };

    return { addAssignment };
};