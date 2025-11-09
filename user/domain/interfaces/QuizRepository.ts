import { Quiz } from '../quiz';
import { QuestionId } from '../valueObjects/QuestionVO';
import { QuizId, QuizState } from '../valueObjects/QuizVO';
import { UserId } from '../valueObjects/UserVO';

/**
 * Opciones para la paginación de resultados.
 */
export interface PaginationOptions {
    page: number; // Número de página (ej: 1, 2, 3)
    limit: number; // Número de resultados por página
}

/**
 * Resultado de una consulta paginada.
 */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface QuizRepository {
    generateQuizId(): Promise<QuizId>; // Renombrado para ser explícito
    generateQuestionId(): Promise<QuestionId>; // Nuevo método
    create(quiz: Quiz): Promise<void>;
    update(quiz: Quiz): Promise<void>;
    findById(id: QuizId, ownerId: UserId): Promise<Quiz | null>;
    findAll(ownerId: UserId, pagination: PaginationOptions, state?: QuizState): Promise<PaginatedResult<Quiz>>;
    delete(id: QuizId, ownerId: UserId): Promise<void>;
}