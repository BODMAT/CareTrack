import { createAnimalID } from "../utils/utils";

export interface IAnimal {
    id: string;
    petSpecies: string;
    name: string;
    birthYear: number;
    sex: boolean;
}

export class Animal implements IAnimal {
    private _id: string;
    private _petSpecies: string;
    private _name: string;
    private _birthYear: number;
    private _sex: boolean;

    constructor(petSpecies: string, name: string, birthYear: number, sex: boolean, id?: string) {
        this._id = id || createAnimalID(petSpecies, name);
        this._petSpecies = petSpecies;
        this._name = name;
        this._birthYear = birthYear;
        this._sex = sex;
    }

    get id(): string {
        return this._id;
    }

    get petSpecies(): string {
        return this._petSpecies;
    }

    get name(): string {
        return this._name;
    }

    get birthYear(): number {
        return this._birthYear;
    }

    get sex(): boolean {
        return this._sex;
    }

    //! Допоміжні методи
    toPlain(): IAnimal { // саме toPlain а не toDTO
        return {
            id: this._id,
            petSpecies: this._petSpecies,
            name: this._name,
            birthYear: this._birthYear,
            sex: this._sex
        };
    }

    static fromDTO(dto: AnimalDTO): Animal {
        const animal = new Animal(dto.petSpecies, dto.name, dto.birthYear, dto.sex, dto.id);
        return animal;
    }
}

export class AnimalDTO implements IAnimal {
    readonly id: string;
    readonly petSpecies: string;
    readonly name: string;
    readonly birthYear: number;
    readonly sex: boolean;

    constructor(
        id: string,
        petSpecies: string,
        name: string,
        birthYear: number,
        sex: boolean
    ) {
        this.id = id;
        this.petSpecies = petSpecies;
        this.name = name;
        this.birthYear = birthYear;
        this.sex = sex;
    }

}
