import { findAssignmentById } from "../apis/findById";
import { createCareID } from "../utils/utils";
import { Assignment } from "./Assignment";

export interface ICare {
    id: string;
    ownersSurname: string;
    date: Date | string; // NativeClass | string in DB
    assignments: (Assignment | string)[]; // Array of Assignment or string ids

    // methods for native
    addOrder?: (assignment: Assignment) => void;
    toShortString?: () => string;
}

export class Care implements ICare {
    private _id: string
    private _ownersSurname: string;
    private _date: Date | string;
    private _assignments: Assignment[];

    constructor(ownersSurname: string, date: Date | string, assignments: Assignment[], id?: string) {
        this._id = id || createCareID(ownersSurname);
        this._ownersSurname = ownersSurname;
        this._date = date;
        this._assignments = assignments;
    }

    get id(): string {
        return this._id;
    }

    get ownersSurname(): string {
        return this._ownersSurname;
    }

    get date(): Date | string {
        return this._date;
    }

    get assignments(): (Assignment)[] {
        return this._assignments;
    }

    addOrder(assignment: Assignment) {
        this._assignments.push(assignment);
    }

    toShortString(): string {
        const assignmentCount = this._assignments.length;
        return `${this._ownersSurname}, завдань: ${assignmentCount}`;
    }

    //! Допоміжні методи
    static async fromDTO(dto: CareDTO, userId: string): Promise<Care> {
        const assignments = await Promise.all(
            dto.assignments.map((assignmentId) =>
                findAssignmentById(userId, assignmentId)
            )
        );

        return new Care(dto.ownersSurname, dto.date, assignments, dto.id);
    }

    toPlain(): ICare {
        return {
            id: this._id,
            ownersSurname: this._ownersSurname,
            date: this._date,
            assignments: this._assignments.map((a: Assignment) =>
                a.id
            ),
        };
    }
}

export class CareDTO implements ICare {
    readonly id: string
    readonly ownersSurname: string;
    readonly date: string;
    readonly assignments: string[];

    constructor(ownersSurname: string, date: string, assignments: string[], id: string) {
        this.id = id;
        this.ownersSurname = ownersSurname;
        this.date = date;
        this.assignments = assignments;
    }
}
