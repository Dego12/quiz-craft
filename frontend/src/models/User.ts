import { Quiz } from "./Quiz";

export interface User {
    id: number,
    name: string,
    email: string,
    password: string,
    accessToken: string,
    quizzes?: Array<Quiz> | null 
}