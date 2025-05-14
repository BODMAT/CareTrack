import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useAuth } from './useAuth';
import { Assignment, AssignmentDTO, type IAssignment } from '../architecture/Assignment';
import { db } from '../apis/firebase';
import { useState } from 'react';
import type { Status } from '../architecture/types';

export const useUserAssignments = () => {
    const { user } = useAuth();

    return useQuery<Assignment[]>({
        queryKey: ["assignments", user?.uid],
        enabled: !!user,
        queryFn: async () => {
            if (!user?.uid) {
                throw new Error("User ID is missing");
            }

            const snapshot = await getDocs(collection(db, "users", user.uid, "assignments"));
            const assignments: Assignment[] = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    const dto = new AssignmentDTO(id, data.animal, data.work, data.price);
                    const result = await Assignment.fromDTO(dto, user.uid);
                    console.log("assignments: ", result);
                    return result;
                })
            );
            return assignments;
        },
    });
};

export const useAddAssignment = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const addAssignment = useMutation({
        mutationFn: async (newAssignment: Assignment) => {
            const ref = collection(db, "users", user!.uid, "assignments");
            const docRef = await addDoc(ref, newAssignment.toPlain());
            return docRef;
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.uid] });
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error adding assignment:", error);
        }
    });

    return { addAssignment, status };
};

export const useUpdateAssignment = () => {
    const [status, setStatus] = useState<Status>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clearStatusAfterDelay = () => {
        setTimeout(() => setStatus(null), 3000);
    };

    const updateAssignment = useMutation({
        mutationFn: async ({
            id,
            updatedAssignment,
        }: {
            id: string;
            updatedAssignment: Assignment;
        }) => {
            const assignment = new Assignment(
                updatedAssignment.animal,
                updatedAssignment.work,
                updatedAssignment.price,
                id
            );
            const ref = doc(db, "users", user!.uid, "assignments", id);
            const plain: IAssignment = assignment.toPlain();
            await updateDoc(ref, { ...plain });
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.uid] });
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error updating assignment:", error);
        },
    });

    return { updateAssignment, status };
};


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
            queryClient.invalidateQueries({ queryKey: ["cares", user?.uid] });
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting assignment:", error);
        }
    });

    return { deleteAssignment, status };
};

// export const useAssignmentById = (id: string | null) => {
//     const { user } = useAuth();

//     return useQuery<Assignment | null>({
//         queryKey: ["assignment", user?.uid, id],
//         enabled: !!user && !!id,
//         queryFn: async () => {
//             if (!user?.uid || !id) return null;
//             return findAssignmentById(user.uid, id);
//         }
//     });
// };