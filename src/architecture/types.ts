import type { IAnimal } from "./Animal";
import type { Assignment } from "./Assignment";

export type Work = "годування" | "прибирання приміщення" | "медогляд" | "випас";
export type Status = "success" | "error" | null;
export type AnimalFormValues = Omit<IAnimal, 'sex'> & { sex: 'male' | 'female' };

export interface ISelectAssignment extends Assignment {
    value: string;
    label: string;
    index: number;
}
