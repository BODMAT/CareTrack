import type { IAnimal } from "./Animal";

export type Work = "годування" | "прибирання приміщення" | "медогляд" | "випас";
export type Status = "success" | "error" | null;
export type AnimalFormValues = Omit<IAnimal, 'sex'> & { sex: 'male' | 'female' };
