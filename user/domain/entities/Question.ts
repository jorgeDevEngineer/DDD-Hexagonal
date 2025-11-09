import {QuestionId, QuestionType, AnswerOption, QuestionDuration} from '../valueObjects/QuestionVO';

export class Question {
    private constructor(
        private readonly _id: QuestionId,
        private _text: string,
        private _type: QuestionType,
        private _options: AnswerOption[],
        private _duration: QuestionDuration,
        private _basePoints: number = 1000 
    ) {
        this.validateOptions();
    }

    // Static factory method for creation
    public static create(
        id: QuestionId,
        text: string,
        type: QuestionType,
        options: AnswerOption[],
        duration: QuestionDuration
    ): Question {
        return new Question(id, text, type, options, duration);
    }

    // Getters for accessing state
    public get id(): QuestionId { return this._id; }
    public get text(): string { return this._text; }
    public get type(): QuestionType { return this._type; }
    public get options(): AnswerOption[] { return [...this._options]; } 
    public get duration(): QuestionDuration { return this._duration; }
    public get basePoints(): number { return this._basePoints; }

    // Domain invariant validation logic
    private validateOptions(): void {
        const correctCount = this._options.filter(o => o.isCorrect).length;

        if (this._type === QuestionType.MULTIPLE_CHOICE && (this._options.length < 2 || this._options.length > 4)) {
             throw new Error("Multiple Choice requires between 2 and 4 options.");
        }
        
        if (correctCount === 0) {
            throw new Error("Every question must have at least one option marked as correct.");
        }
    }

    // Methods to mutate state (Commands)
    public editOptions(newOptions: AnswerOption[]): void {
        this._options = newOptions;
        this.validateOptions(); // Re-validate the invariant
    }

    public updateText(newText: string): void {
        if (newText.trim().length === 0) throw new Error("Question text cannot be empty.");
        this._text = newText;
    }
}