import { QuizRepository } from '../../../domain/interfaces/QuizRepository';
import { QuizId } from '../../../domain/valueObjects/QuizVO';
import { UserId } from '../../../domain/valueObjects/UserVO';
import { QuizSnapshot } from '../../../domain/quiz';

// Definimos un error específico para este caso de uso
export class QuizNotFoundError extends Error {
    constructor(id: string) {
        super(`Quiz with id ${id} not found.`);
    }
}

export class QuizFinder {
    constructor(private quizRepository: QuizRepository) { }

    async run(id: string, ownerId: string): Promise<QuizSnapshot> {
        // 1. Traducir los strings de entrada a Value Objects para validación
        const quizId = QuizId.of(id);
        const ownerUserId = UserId.of(ownerId);

        // 2. Usar el repositorio para buscar el agregado
        const quiz = await this.quizRepository.findById(quizId, ownerUserId);

        // 3. Si no se encuentra el quiz, lanzar un error específico
        if (!quiz) {
            throw new QuizNotFoundError(id);
        }

        // 4. Devolver el DTO (Snapshot), no el objeto de dominio completo
        return quiz.getSnapshot();
    }
}