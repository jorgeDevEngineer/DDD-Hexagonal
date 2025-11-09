import { 
    QuestionId, 
    QuestionType, 
    AnswerOption, 
    QuestionDuration, 
    QuestionText, 
    AnswerOptionsList 
} from '../valueObjects/QuestionVO';

export class Question {
    private constructor(
        private readonly _id: QuestionId,
        private _text: QuestionText,
        private _type: QuestionType,
        private _options: AnswerOptionsList,
        private _duration: QuestionDuration,
        private _basePoints: number = 1000 
    ) {}

    // El método de factoría ahora exige los Value Objects correctos.
    public static create(
        id: QuestionId,
        text: QuestionText,
        type: QuestionType,
        options: AnswerOptionsList,
        duration: QuestionDuration
    ): Question {
        // La validación de las opciones ahora está completamente delegada al VO AnswerOptionsList.
        // Ya no es necesaria una llamada a this.validateOptions() aquí.
        return new Question(id, text, type, options, duration);
    }

    // Getters para acceder al estado (devuelven los VOs o sus valores primitivos según sea necesario)
    public get id(): QuestionId { return this._id; }
    public get text(): QuestionText { return this._text; }
    public get type(): QuestionType { return this._type; }
    public get options(): AnswerOptionsList { return this._options; } 
    public get duration(): QuestionDuration { return this._duration; }
    public get basePoints(): number { return this._basePoints; }

    // Los métodos de mutación también deben usar los VOs
    public editOptions(newOptions: AnswerOptionsList): void {
        this._options = newOptions;
    }

    public updateText(newText: QuestionText): void {
        this._text = newText;
    }
}