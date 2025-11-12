import { QuizRepository } from '../domain/port/QuizRepository';
import { QuizId, UserId } from '../domain/valueObject/Quiz';

export class DeleteQuizUseCase {
  constructor(private readonly quizRepository: QuizRepository) {}

  async execute(quizIdStr: string, authorIdStr: string): Promise<void> {
    const quizId = QuizId.of(quizIdStr);
    const userId = UserId.of(authorIdStr);

    // 1. Buscamos el Quiz primero para verificar existencia y permisos
    const quiz = await this.quizRepository.find(quizId);

    if (!quiz) {
      // Si no existe, o lanzamos error o simplemente retornamos (idempotencia).
      // Generalmente mejor lanzar error para informar al frontend.
      throw new Error(`Quiz <${quizIdStr}> not found`);
    }

    // 2. Validar que quien borra es el AUTOR (Regla de Negocio Crítica)
    // Nota: Asumimos que tu Entidad Quiz tiene un getter para authorId
    // Si no tienes el getter público, necesitarás agregarlo: public get authorId(): UserId { return this._authorId; }
    if (quiz.authorId.value !== userId.value) {
        throw new Error("You are not allowed to delete this quiz");
    }

    // 3. Ejecutar el borrado
    await this.quizRepository.delete(quizId);
  }
}