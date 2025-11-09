export enum QuestionType {
    MULTIPLE_CHOICE = 'multiple_choice',
    TRUE_FALSE = 'true_false',
    SHORT_ANSWER = 'short_answer',
}

export class QuestionId {
    private static readonly UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    private constructor(public readonly value: string) {
        if (!value) throw new Error("QuestionId cannot be empty.");
        if (!QuestionId.UUID_REGEX.test(value)) {
            throw new Error("QuestionId must be a valid UUID.");
        }
    }
    public static of(value: string): QuestionId {
        return new QuestionId(value);
    }
}

export class QuestionText {
    private constructor(public readonly value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error("Question text cannot be empty.");
        }
        if (value.length > 120) {
            throw new Error("Question text cannot exceed 120 characters.");
        }
    }

    public static of(value: string): QuestionText {
        return new QuestionText(value);
    }
}

export class AnswerOption {
    // VO defining a single answer option
    constructor(
        public readonly text: string,
        public readonly isCorrect: boolean,
    ) {
        if (!text || text.trim().length === 0) {
            throw new Error("Option text cannot be empty.");
        }
        if (text.length > 75) {
            throw new Error("Option text cannot exceed 75 characters.");
        }
    }
}

export class AnswerOptionsList {
    private constructor(public readonly values: AnswerOption[]) { }

    public static of(options: AnswerOption[], type: QuestionType): AnswerOptionsList {
        if (!options || options.length < 2) {
            throw new Error("A question must have at least two answer options.");
        }

        const correctAnswers = options.filter(o => o.isCorrect).length;

        switch (type) {
            case QuestionType.MULTIPLE_CHOICE:
                if (options.length < 2 || options.length > 4) {
                    throw new Error("Multiple choice questions must have between 2 and 4 options.");
                }
                if (correctAnswers !== 1) {
                    throw new Error("Multiple choice questions must have exactly one correct answer.");
                }
                break;
            case QuestionType.TRUE_FALSE:
                if (options.length !== 2) {
                    throw new Error("True/False questions must have exactly 2 options.");
                }
                if (correctAnswers !== 1) {
                    throw new Error("True/False questions must have exactly one correct answer.");
                }
                break;
            case QuestionType.SHORT_ANSWER:
                if (correctAnswers === 0) {
                    throw new Error("Short answer questions must have at least one correct answer pattern.");
                }
                break;
            //TODO: Pensar en otro caso de tipo de pregunta
        }
        return new AnswerOptionsList(options);
    }
}


export class QuestionDuration {
    private static readonly MIN_SECONDS = 5;        // mínimo 5 segundos
    private static readonly MAX_SECONDS = 60;     // máximo 1 hora //TODO: verificar reglas de negocio con Kahoot de tiempos minimos y maximos

    private constructor(public readonly seconds: number) {
        if (seconds == null || !Number.isInteger(seconds)) {
            throw new Error("La duración debe ser un número entero de segundos.");
        }
        if (seconds < QuestionDuration.MIN_SECONDS) {
            throw new Error(`La duración debe ser al menos ${QuestionDuration.MIN_SECONDS} segundos.`);
        }
        if (seconds > QuestionDuration.MAX_SECONDS) {
            throw new Error(`La duración no puede exceder ${QuestionDuration.MAX_SECONDS} segundos.`);
        }
    }

    public static ofSeconds(seconds: number): QuestionDuration {
        return new QuestionDuration(seconds);
    }
}