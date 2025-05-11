import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { db } from "../apis/firebase";
import { useState } from "react";
import type { Status } from "../arcitecture/types";
import { Care, CareDTO, type ICare } from "../arcitecture/Care";

export const useUserCares = () => {
    const { user } = useAuth();

    return useQuery<Care[]>({
        queryKey: ["cares", user?.uid],
        enabled: !!user,
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, "users", user!.uid, "cares"));
            return snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                const careDto = new CareDTO(data.ownersSurname, data.date, data.assignments);
                return Care.fromDTO(careDto);
            });
        },
    });
};

export const useAddCare = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const addCare = useMutation({
        mutationFn: async (care: Care) => {
            const ref = collection(db, "users", user!.uid, "cares");
            const plain = care.toPlain();
            return await addDoc(ref, plain);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (err) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error adding care:", err);
        },
    });

    return { addCare, status };
};

interface ICarePlain {
    [key: string]: any;
}


export const useUpdateCare = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const updateCare = useMutation({
        mutationFn: async ({
            id,
            updatedCare,
        }: {
            id: string;
            updatedCare: Care;
        }) => {
            const ref = doc(db, "users", user!.uid, "cares", id);
            const plain: ICarePlain = updatedCare.toPlain();  // Приводимо до типу, який підтримує індексування
            await updateDoc(ref, plain);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (err) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error updating care:", err);
        },
    });

    return { updateCare, status };
};


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
        onError: (err) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting care:", err);
        },
    });

    return { deleteCare, status };
};
