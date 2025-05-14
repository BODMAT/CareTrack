import { doc, getDoc } from "firebase/firestore";
import { Animal, AnimalDTO } from "../architecture/Animal";
import { db } from "./firebase";
import { Assignment, AssignmentDTO } from "../architecture/Assignment";
import { Care, CareDTO } from "../architecture/Care";

export const findAnimal = async (userId: string, animalId: string): Promise<Animal> => {
    const ref = doc(db, "users", userId, "animals", animalId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
        return Animal.fromDTO(new AnimalDTO(Date.now().toString(), "Тварину видалено", "Тварина можливо була примусово видалена з іншого місця", 0, true));
    } else {
        const data = snapshot.data();
        return Animal.fromDTO(new AnimalDTO(animalId, data.petSpecies, data.name, data.birthYear, data.sex));
    }
};

export const findAssignmentById = async (userId: string, assignmentId: string): Promise<Assignment> => {
    const ref = doc(db, "users", userId, "assignments", assignmentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        return new Assignment(
            await findAnimal(userId, Date.now().toString()),
            "випас",
            0,
            Date.now().toString()
        );
    } else {
        const data = snap.data();
        const dto = new AssignmentDTO(assignmentId, data.animal, data.work, data.price);
        return Assignment.fromDTO(dto, userId);
    }
};

export const findCareById = async (userId: string, careId: string): Promise<Care> => {
    const ref = doc(db, "users", userId, "cares", careId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        return new Care(
            "Видалене імя",
            new Date(),
            [await findAssignmentById(userId, Date.now().toString())],
        );
    } else {
        const data = snap.data();
        const dto = new CareDTO("Видалене імя", data.date, data.assignments, careId);
        return Care.fromDTO(dto, userId);
    }
}