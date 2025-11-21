import { Answer } from "./Answer";

export interface Question {
  id: string;
  text: string;
  timer: number;
  answers?: Array<Answer> | null;
}
