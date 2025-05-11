import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useAuth } from './useAuth';
import { Assignment, AssignmentDTO, type IAssignment } from '../arcitecture/Assignment';
import { db } from '../apis/firebase';
import { useState } from 'react';
import type { Status } from '../arcitecture/types';
import { Animal } from '../arcitecture/Animal';

export const useUserAssignments = () => {
    const { user } = useAuth();

    return useQuery<Assignment[]>({
        queryKey: ["assignments", user?.uid],
        enabled: !!user,  // Запит лише якщо користувач автентифікований
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, "users", user!.uid, "assignments"));
            return snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;  // ID залишається як рядок
                return Assignment.fromDTO(new AssignmentDTO(id, data.animal, data.work, data.price)); // Використовуємо fromDTO для перетворення даних у об'єкти Assignment
            });
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
        mutationFn: async (newAssignment: IAssignment) => {
            const animal =
                typeof newAssignment.animal === "string"
                    ? Animal.fromDTO(JSON.parse(newAssignment.animal))
                    : newAssignment.animal;

            const assignment = new Assignment(animal, newAssignment.work, newAssignment.price);
            const ref = collection(db, "users", user!.uid, "assignments");
            const docRef = await addDoc(ref, assignment.toPlain());
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
            updatedAssignment: IAssignment;
        }) => {
            // Гарантуємо, що animal — це об'єкт Animal
            const animal =
                typeof updatedAssignment.animal === "string"
                    ? Animal.fromDTO(JSON.parse(updatedAssignment.animal))
                    : updatedAssignment.animal;

            const assignment = new Assignment(
                animal,
                updatedAssignment.work,
                updatedAssignment.price,
                id
            );

            const ref = doc(db, "users", user!.uid, "assignments", id);

            // через сувору типізацію Firestore SDK
            const plain = assignment.toPlain();
            await updateDoc(ref, { ...plain });
        },
        onSuccess: () => {
            setStatus("success");
            clearStatusAfterDelay();
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.uid] });
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
        },
        onError: (error) => {
            setStatus("error");
            clearStatusAfterDelay();
            console.error("Error deleting assignment:", error);
        }
    });

    return { deleteAssignment, status };
};
