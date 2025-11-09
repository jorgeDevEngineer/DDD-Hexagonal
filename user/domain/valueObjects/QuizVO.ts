import { Question } from "../entities/Question";

export class QuizId {
    
    private static readonly UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    private constructor(public readonly value: string) {
        if (!value) throw new Error("QuizId cannot be empty.");
        if (!QuizId.UUID_REGEX.test(value)) {
            throw new Error("QuizId must be a valid UUID.");
        }
    }

    public static of(value: string): QuizId {
        return new QuizId(value);
    }
}

export class QuizTitle {
    private constructor(public readonly value: string) {
        if (!value) {
            throw new Error("The title cannot be empty.");
        }
        if (value.length < 3 || value.length > 100) {
            throw new Error("The title must be between 3 and 100 characters.");
        }
    }

    public static of(value: string): QuizTitle {
        return new QuizTitle(value ? value.trim() : '');
    }
}

export class QuizDescription {

    private constructor(public readonly value: string) {
        if (value && value.length > 500) {
            throw new Error("Quiz description cannot exceed 500 characters.");
        }
        this.value = value;
    }

    public static of(value: string): QuizDescription {
        return new QuizDescription(value ? value.trim() : '');
    }
}

export class QuizDateValue {
    private readonly value: Date;

    private constructor(date: Date) {
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date value provided for QuizDateValue.");
        }
        this.value = date;
    }

    public static createNow(): QuizDateValue {
        return new QuizDateValue(new Date()); 
    }

    public toDate(): Date {
        return new Date(this.value.getTime());
    }

    public get date(): Date {
        return this.toDate();
    }
}

export class QuestionList {
    private constructor(public readonly values: Question[]) {}

    public static of(questions: Question[]): QuestionList {
        if (questions.length > 20) {
            throw new Error("A quiz cannot have more than 20 questions.");
        }
        return new QuestionList(questions);
    }
}

//Enums
export enum QuizState {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

