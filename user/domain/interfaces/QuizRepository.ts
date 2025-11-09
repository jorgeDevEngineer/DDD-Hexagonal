import { Quiz } from '../quiz';
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
    /**
     * Genera un nuevo y único QuizId.
     * La responsabilidad de crear un ID único recae en la infraestructura.
     * @returns Una Promesa que se resuelve con un nuevo QuizId.
     */
    generateId(): Promise<QuizId>;

    /**
     * Persiste un nuevo agregado Quiz.
     * @param quiz El nuevo agregado Quiz a crear.
     * @returns Una Promesa que se resuelve cuando la operación se completa.
     */
    create(quiz: Quiz): Promise<void>;

    /**
     * Actualiza un agregado Quiz existente.
     * @param quiz El agregado Quiz con su estado modificado.
     * @returns Una Promesa que se resuelve cuando la operación se completa.
     */
    update(quiz: Quiz): Promise<void>;

    /**
     * Busca quizzes de un usuario específico por su estado.
     * @param ownerId El UserId del propietario de los quizzes.
     * @param state El estado del quiz a buscar.
     * @param pagination Opciones de paginación.
     * @returns Una Promesa que se resuelve con un resultado paginado de quizzes.
     */
    findByOwnerAndState(ownerId: UserId, state: QuizState, pagination: PaginationOptions): Promise<PaginatedResult<Quiz>>;

    /**
     * Busca quizzes por su estado (ej: 'DRAFT', 'PUBLISHED').
     * Incluye paginación para manejar grandes volúmenes de datos.
     * @param state El estado del quiz a buscar.
     * @param pagination Opciones de paginación.
     * @returns Una Promesa que se resuelve con un resultado paginado de quizzes.
     */
    findByState(state: QuizState, pagination: PaginationOptions): Promise<PaginatedResult<Quiz>>;

    /**
     * Elimina un agregado Quiz del repositorio.
     * @param id El QuizId del quiz a eliminar.
     * @returns Una Promesa que se resuelve cuando la operación se completa.
     */
    delete(id: QuizId): Promise<void>;

    // Se elimina findAll() en favor de consultas más específicas y paginadas.
    // findAll(): Promise<Quiz[]>;
}