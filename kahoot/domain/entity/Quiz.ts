// 1. Quiz (Raíz del Agregado - Entidad)

// Esta es la entidad principal. Orquesta y valida la lógica de negocio general.
// _id: QuizId (Value Object)
// _authorId: UserId (Value Object - ID del agregado User)
// _title: QuizTitle (Value Object)
// _description: QuizDescription (Value Object)
// _visibility: Visibility (Value Object)
// _status: QuizStatus (Value Object - ej: draft, published)
// _coverImage: MediaUrl (Value Object)
// _questions: Question[] (Lista de Entidades)

import {
  QuizId,
  UserId,
  QuizTitle,
  QuizDescription,
  Visibility,
  ThemeId,
  MediaUrl,
} from "../valueObject/Quiz";
import { Question } from "../entity/Question";

export class Quiz {
  private constructor(
    private readonly _id: QuizId,
    private _authorId: UserId,
    private _title: QuizTitle,
    private _description: QuizDescription,
    private _visibility: Visibility,
    private _themeId: ThemeId,
    private _coverImage: MediaUrl,
    private _questions: Question[] = []
  ) {
    // Asignamos la referencia de este quiz (this) a cada una de sus preguntas.
    this._questions.forEach((question) => question._setQuiz(this._id));
  }

  // El método de factoría ahora exige los Value Objects correctos.
  public static create(
    id: QuizId,
    authorId: UserId,
    title: QuizTitle,
    description: QuizDescription,
    visibility: Visibility,
    themeId: ThemeId,
    coverImage: MediaUrl,
    questions: Question[]
  ): Quiz {
    return new Quiz(
      id,
      authorId,
      title,
      description,
      visibility,
      themeId,
      coverImage,
      questions
    );
  }

  public updateMetadata(
    title: QuizTitle,
    description: QuizDescription,
    visibility: Visibility,
    themeId: ThemeId,
    coverImage: MediaUrl
  ): void {
    this._title = title;
    this._description = description;
    this._visibility = visibility;
    this._themeId = themeId;
    this._coverImage = coverImage;
  }

  public replaceQuestions(newQuestions: Question[]): void {
    // Asignamos el ID de este quiz a las nuevas preguntas para mantener la referencia
    newQuestions.forEach((q) => q._setQuiz(this._id));

    // Reemplazamos el array
    this._questions = newQuestions;
  }

  public get authorId(): UserId {
    return this._authorId;
  }

  public get themeId(): ThemeId {
    return this._themeId;
  }
}
