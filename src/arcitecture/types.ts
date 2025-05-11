import type { IAnimal } from "./Animal";

export type Status = "success" | "error" | null;
export type AnimalFormValues = Omit<IAnimal, 'sex'> & { sex: 'male' | 'female' };
