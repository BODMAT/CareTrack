import { createAssignmentID } from "../utils/utils";
import { Animal, type IAnimal } from "./Animal";

export type Work = "годування" | "прибирання приміщення" | "медогляд" | "випас";

export interface IAssignment {
    id: string;
    animal: Animal | string;
    work: Work;
    price: number;
}

export class Assignment implements IAssignment {
    private _id: string;
    private _animal: Animal;
    private _work: Work;
    private _price: number;

    constructor(animal: Animal, work: Work, price: number, id?: string) {
        this._id = id || createAssignmentID(work);
        this._animal = animal;
        this._work = work;
        this._price = price;
    }

    get animal() {
        return this._animal;
    }

    get work() {
        return this._work;
    }

    get price() {
        return this._price;
    }

    get id(): string {
        return this._id;
    }

    //! Допоміжні методи
    toPlain(): IAssignment {
        return {
            id: this._id,
            animal: JSON.stringify(this.animal.toPlain()), // запарсимо JSON-рядок
            work: this._work,
            price: this._price,
        };
    }

    static fromDTO(dto: AssignmentDTO): Assignment {
        const animalPlain = JSON.parse(dto.animal as string) as IAnimal;
        const animal = Animal.fromDTO(animalPlain);
        return new Assignment(animal, dto.work, dto.price, dto.id);
    }
}

export class AssignmentDTO implements IAssignment {
    readonly id: string;
    readonly animal: string; // JSON.stringify(animal.toPlain())
    readonly work: Work;
    readonly price: number;

    constructor(id: string, animal: string, work: Work, price: number) {
        this.id = id;
        this.animal = animal;
        this.work = work;
        this.price = price;
    }
}
