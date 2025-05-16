import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../apis/firebase";
import { useAuth } from "../useAuth";
import { Assignment, AssignmentDTO } from "../../architecture/Assignment";
import type { Status } from "../../architecture/types";
import { useState } from "react";

interface AdminAssignmentGroup {
    user: { id: string;[key: string]: any };
    assignments: Assignment[];
}

export const useAdminAssignments = () => {
    const { user } = useAuth();

    return useQuery<AdminAssignmentGroup[]>({
        queryKey: ["assignments", "admin"],
        enabled: !!user && user.role === "admin",
        queryFn: async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const result: AdminAssignmentGroup[] = [];

                for (const userDoc of usersSnapshot.docs) {
                    const userData = userDoc.data();
                    const uid = userDoc.id;

                    const assignmentsSnapshot = await getDocs(collection(db, "users", uid, "assignments"));

                    const assignments = await Promise.all(assignmentsSnapshot.docs.map(async (docSnap) => {
                        const data = docSnap.data();
                        const dto = new AssignmentDTO(data.id, data.animal, data.work, data.price);
                        return Assignment.fromDTO(dto, uid);
                    }));

                    if (assignments.length > 0) {
                        result.push({
                            user: { id: uid, ...userData },
                            assignments,
                        });
                    }
                }

                return result;
            } catch (error) {
                console.error("Error fetching admin assignments:", error);
                throw error;
            }
        },
    });
};

export const useDeleteAdminAssignment = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<Status>(null);

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const deleteAssignment = useMutation({
        mutationFn: async ({ uid, id }: { uid: string; id: string }) => {
            if (user?.role !== "admin") throw new Error("Not authorized");
            const ref = doc(db, "users", uid, "assignments", id);
            await deleteDoc(ref);
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["assignments", "admin"] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting assignment (admin):", error);
        }
    });

    return { deleteAssignment, status };
};
