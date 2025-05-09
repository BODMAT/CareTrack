import { Animal, Assignment, Care, type Work } from "./main";

export class AnimalDTO {
    petSpecies: string;
    name: string;
    birthYear: number;
    sex: boolean;

    constructor(petSpecies: string, name: string, birthYear: number, sex: boolean) {
        this.petSpecies = petSpecies;
        this.name = name;
        this.birthYear = birthYear;
        this.sex = sex;
    }

    static fromAnimal(animal: Animal): AnimalDTO {
        return new AnimalDTO(animal.petSpecies, animal.name, animal.birthYear, animal.sex);
    }

    toAnimal(): Animal {
        return new Animal(this.petSpecies, this.name, this.birthYear, this.sex);
    }
}

export class AssignmentDTO {
    animal: AnimalDTO;
    work: Work;
    price: number;

    constructor(animal: AnimalDTO, work: Work, price: number) {
        this.animal = animal;
        this.work = work;
        this.price = price;
    }

    static fromAssignment(assignment: Assignment): AssignmentDTO {
        return new AssignmentDTO(AnimalDTO.fromAnimal(assignment.animal), assignment.work, assignment.price);
    }

    toAssignment(): Assignment {
        return new Assignment(this.animal.toAnimal(), this.work, this.price);
    }
}

export class CareDTO {
    ownersSurname: string;
    date: string;
    assignments: AssignmentDTO[];

    constructor(ownersSurname: string, date: string, assignments: AssignmentDTO[]) {
        this.ownersSurname = ownersSurname;
        this.date = date;
        this.assignments = assignments;
    }

    static fromCare(care: Care): CareDTO {
        const formattedDate = care.date.toLocaleDateString();
        const assignmentsDTO = care.assignments.map((assignment) => AssignmentDTO.fromAssignment(assignment));
        return new CareDTO(care.ownersSurname, formattedDate, assignmentsDTO);
    }

    toCare(): Care {
        const date = new Date(this.date);
        const assignments = this.assignments.map((assignmentDTO) => assignmentDTO.toAssignment());
        return new Care(this.ownersSurname, date, assignments);
    }
}
