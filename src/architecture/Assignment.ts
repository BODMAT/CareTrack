import { findAnimal } from "../apis/findById";
import { createAssignmentID } from "../utils/utils";
import { Animal } from "./Animal";
import type { Work } from "./types";

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
            animal: this.animal.id,
            work: this._work,
            price: this._price,
        };
    }

    static async fromDTO(dto: AssignmentDTO, userId: string): Promise<Assignment> {
        const animal = await findAnimal(userId, dto.animal);
        return new Assignment(animal, dto.work, dto.price, dto.id);
    }
}

export class AssignmentDTO implements IAssignment {
    readonly id: string;
    readonly animal: string; // id of Animal
    readonly work: Work;
    readonly price: number;

    constructor(id: string, animal: string, work: Work, price: number) {
        this.id = id;
        this.animal = animal;
        this.work = work;
        this.price = price;
    }
}
