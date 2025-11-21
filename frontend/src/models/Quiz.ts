import { Question } from "./Question"

export interface Quiz {
    id: string,
    title: string,
    description: string,
    numberOfPlays: number,
    readOnly: boolean,
    questions?: Array<Question> | null
}

