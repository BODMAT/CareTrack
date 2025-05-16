import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../apis/firebase";
import { Care, CareDTO } from "../../architecture/Care";
import { useAuth } from "../useAuth";
import { useState } from "react";
import type { Status } from "../../architecture/types";

interface AdminCareGroup {
    user: { id: string;[key: string]: any };
    cares: Care[];
}

export const useAdminCares = () => {
    const { user } = useAuth();

    return useQuery<AdminCareGroup[]>({
        queryKey: ["cares", "admin"],
        enabled: !!user,
        queryFn: async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const allGroups: AdminCareGroup[] = [];

                for (const userDoc of usersSnapshot.docs) {
                    const uid = userDoc.id;

                    try {
                        const caresSnapshot = await getDocs(collection(db, "users", uid, "cares"));

                        if (!caresSnapshot.empty) {
                            const cares = await Promise.all(
                                caresSnapshot.docs.map(async (doc) => {
                                    const data = doc.data();
                                    const dto = new CareDTO(data.ownersSurname, data.date, data.assignments, data.id);
                                    return await Care.fromDTO(dto, uid);
                                })
                            );

                            allGroups.push({
                                user: { id: uid, ...userDoc.data() },
                                cares,
                            });
                        }
                    } catch (err) {
                        console.error(`Помилка при завантаженні cares для користувача ${uid}:`, err);
                    }
                }

                return allGroups;
            } catch (err) {
                console.error("Помилка при завантаженні користувачів:", err);
                throw err;
            }
        },
    });
};

export const useDeleteAdminCare = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const deleteCare = useMutation({
        mutationFn: async ({ uid, id }: { uid: string; id: string }) => {
            const ref = doc(db, "users", uid, "cares", id);
            await deleteDoc(ref);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["cares", "admin"] });
        },
        onError: (err) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting care:", err);
        },
    });

    return { deleteCare, status };
};
