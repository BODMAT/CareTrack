import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { db } from "../apis/firebase";
import { useState } from "react";
import type { Status } from "../architecture/types";
import { Care, CareDTO, type ICare } from "../architecture/Care";

export const useUserCares = () => {
    const { user } = useAuth();

    return useQuery<Care[]>({
        queryKey: ["cares", user?.uid],
        enabled: !!user,
        queryFn: async () => {
            if (!user?.uid) {
                throw new Error("User ID is missing");
            }
            const snapshot = await getDocs(collection(db, "users", user.uid, "cares"));
            const assignments: Care[] = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    const dto = new CareDTO(data.ownersSurname, data.date, data.assignments, id);
                    const result = await Care.fromDTO(dto, user.uid);
                    console.log("cares: ", result);
                    return result
                })
            );
            return assignments;
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
            const care = new Care(
                updatedCare.ownersSurname,
                updatedCare.date,
                updatedCare.assignments,
                id
            );
            const ref = doc(db, "users", user!.uid, "cares", id);
            const plain: ICare = care.toPlain();
            await updateDoc(ref, { ...plain });
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
