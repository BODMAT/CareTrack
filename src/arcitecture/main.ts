export type Work = "годування" | "прибирання приміщення" | "медогляд" | "випас";

export interface IAnimal {
    petSpecies: string;
    name: string;
    birthYear: number;
    sex: boolean;
}

export class Animal implements IAnimal {
    private _petSpecies: string;
    private _name: string;
    private _birthYear: number;
    private _sex: boolean;

    constructor(petSpecies: string, name: string, birthYear: number, sex: boolean) {
        this._petSpecies = petSpecies;
        this._name = name;
        this._birthYear = birthYear;
        this._sex = sex;
    }

    get petSpecies() {
        return this._petSpecies;
    }

    get name() {
        return this._name;
    }

    get birthYear() {
        return this._birthYear;
    }

    get sex() {
        return this._sex;
    }
}

export interface IAssignment {
    animal: Animal;
    work: Work;
    price: number;
}

export class Assignment implements IAssignment {
    private _animal: Animal;
    private _work: Work;
    private _price: number;

    constructor(animal: Animal, work: Work, price: number) {
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
}

export interface ICare {
    ownersSurname: string;
    date: Date;
    assignments: Array<Assignment>;
    addOrder: (assignment: Assignment) => void;
    toShortString: () => string;
}

export class Care implements ICare {
    private _ownersSurname: string;
    private _date: Date;
    private _assignments: Array<Assignment>;

    constructor(ownersSurname: string, date: Date, assignments: Assignment[] = []) {
        this._ownersSurname = ownersSurname;
        this._date = date;
        this._assignments = assignments;
    }

    get ownersSurname() {
        return this._ownersSurname;
    }
    get date() {
        return this._date;
    }
    get assignments() {
        return this._assignments;
    }

    addOrder(assignment: Assignment): void {
        this._assignments.push(assignment);
    }

    toShortString(): string {
        const totalPrice = this.assignments.reduce((sum, assignment) => sum + assignment.price, 0);
        const formattedDate = this.date.toLocaleDateString();
        return `Date: ${formattedDate}, Total Price: ${totalPrice} грн`;
    }
}