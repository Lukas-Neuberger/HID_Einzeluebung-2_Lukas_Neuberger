import { Course } from "./Course";

export interface Registration {
    id: string;
    name: string;
    birthdate: string,
    course: Course,
    courseId: number,
    registrationDate: string;  // Neues Feld für das Anmeldedatum
    deleting?: boolean;  // Hinzugefügt für die Anzeige des Loading Spinners
  }