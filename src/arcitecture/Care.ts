import { Assignment, AssignmentDTO, type IAssignment } from "./Assignment";

export interface ICare {
    ownersSurname: string;
    date: Date | string[]; // NativeClass | DTO
    assignments: (Assignment | string)[]; // Array of Assignment or string (DTO)

    // methods for native
    addOrder?: (assignment: Assignment) => void;
    toShortString?: () => string;
}

export class Care implements ICare {
    private _ownersSurname: string;
    private _date: Date | string[];
    private _assignments: (Assignment | string)[];

    constructor(ownersSurname: string, date: Date | string[], assignments: (Assignment | string)[]) {
        this._ownersSurname = ownersSurname;
        this._date = date;
        this._assignments = assignments;
    }

    get ownersSurname(): string {
        return this._ownersSurname;
    }

    get date(): Date | string[] {
        return this._date;
    }

    get assignments(): (Assignment | string)[] {
        return this._assignments;
    }

    addOrder(assignment: Assignment) {
        this._assignments.push(assignment);
    }

    toShortString(): string {
        const assignmentCount = this._assignments.length;
        return `${this._ownersSurname}, завдань: ${assignmentCount}`;
    }

    getAssignments(): Assignment[] {
        return this._assignments.map((assignment) =>
            typeof assignment === "string" ? Assignment.fromDTO(JSON.parse(assignment)) : assignment
        );
    }

    //! Допоміжні методи
    static fromDTO(dto: CareDTO): Care {
        const assignments = dto.assignments.map((assignmentStr) => {
            const parsed = JSON.parse(assignmentStr) as IAssignment;
            const dto = new AssignmentDTO(
                parsed.id,
                parsed.animal as string,
                parsed.work,
                parsed.price
            );
            return Assignment.fromDTO(dto);
        });

        return new Care(dto.ownersSurname, dto.date, assignments);
    }

    toPlain(): ICare {
        return {
            ownersSurname: this._ownersSurname,
            date: Array.isArray(this._date) ? this._date : [this._date.toISOString()],
            assignments: this._assignments.map((a) =>
                typeof a === "string" ? a : JSON.stringify(a.toPlain())
            ),
        };
    }
}

export class CareDTO implements ICare {
    readonly ownersSurname: string;
    readonly date: string[]; // Масив рядків для кількох дат
    readonly assignments: string[]; // Масив серіалізованих рядків (DTO) для завдань

    constructor(ownersSurname: string, date: string[], assignments: string[]) {
        this.ownersSurname = ownersSurname;
        this.date = date;
        this.assignments = assignments;
    }

    static fromCare(care: Care): CareDTO {
        return new CareDTO(
            care.ownersSurname,
            Array.isArray(care.date) ? care.date : [care.date.toISOString()],
            care.getAssignments().map((a) => JSON.stringify(a.toPlain()))
        );
    }
}
