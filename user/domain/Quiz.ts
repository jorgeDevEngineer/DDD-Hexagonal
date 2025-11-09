import { QuizId, QuizTitle, QuizState, QuizDateValue, QuizDescription, QuestionList } from './valueObjects/QuizVO';
import { Question } from './entities/Question';
import { UserId } from './valueObjects/UserVO'; // Asumiendo que tienes un VO para UserId


// Interfaz para el DTO/Snapshot. Define la estructura de datos que se expondrá.
export interface QuizSnapshot {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly state: QuizState;
    readonly ownerId: string;
    readonly createdAt: Date;
    readonly questions: readonly Question[]; // O podrías exponer snapshots de las preguntas también
}

export class Quiz {
    private readonly _id: QuizId;
    private _title: QuizTitle;
    private _description: QuizDescription;
    private _state: QuizState;
    private readonly _ownerId: UserId;
    private readonly _createdAt: QuizDateValue;
    private _questions: QuestionList; // Usar el Value Object

    private constructor(
        id: QuizId,
        title: QuizTitle,
        description: QuizDescription,
        ownerId: UserId,
        questions: QuestionList,
        state: QuizState = QuizState.DRAFT,
        createdAt: QuizDateValue = QuizDateValue.createNow()
    ) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._questions = questions;
        this._ownerId = ownerId;
        this._state = state;
        this._createdAt = createdAt;
    }


    public static create(id: QuizId, title: QuizTitle, description: QuizDescription, ownerId: UserId): Quiz {
        return new Quiz(id, ownerId, title, description, QuestionList.of([]));
    }

    // --- ÚNICO GETTER PÚBLICO PARA DATOS ---
    public getSnapshot(): QuizSnapshot {
        return {
            id: this._id.value,
            ownerId: this._ownerId.value,
            title: this._title.value,
            description: this._description.value,
            state: this._state,
            createdAt: this._createdAt.date,
            questions: this._questions.values,
        };
    }

    // El ID es a menudo la única excepción, ya que es la identidad del agregado.
    public get id(): QuizId { return this._id; }

    // --- MÉTODOS DE COMPORTAMIENTO (LÓGICA DE NEGOCIO) ---
    public addQuestion(question: Question): void {
        if (this._state !== QuizState.DRAFT) {
            throw new Error("Cannot add questions to a quiz that is not in DRAFT state.");
        }
        const updatedQuestions = [...this._questions.values, question];
        this._questions = QuestionList.of(updatedQuestions);
    }

    public removeQuestion(questionId: string): void {
        if (this._state !== QuizState.DRAFT) {
            throw new Error("Cannot remove questions from a quiz that is not in DRAFT state.");
        }
        const updatedQuestions = this._questions.values.filter(q => q.id.value !== questionId);
        this._questions = QuestionList.of(updatedQuestions);
    }

    public publish(): void {
        if (this._questions.values.length === 0) {
            throw new Error("Cannot publish a quiz with no questions.");
        }
        if (this._state !== QuizState.DRAFT) {
            throw new Error("Only a DRAFT quiz can be published.");
        }
        this._state = QuizState.PUBLISHED;
    }

    public archive(): void {
        if (this._state === QuizState.DRAFT) {
            throw new Error("Cannot archive a quiz that has not been published.");
        }
        this._state = QuizState.ARCHIVED;
    }
}