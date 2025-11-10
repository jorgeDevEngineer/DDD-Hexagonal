import { QuizRepository } from '../../domain/Repository/QuizRepository';
import { QuizId } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import { QuizSnapshot } from '../../domain/quiz';
import {QuizNotFoundError} from '../../domain/DomainErrors/QuizErrors'

export class QuizReadById {
    constructor(private quizRepository: QuizRepository) { }

    async run(id: string, ownerId: string): Promise<QuizSnapshot> {
        // 1. Traducir los strings de entrada a Value Objects para validación
        const quizId = QuizId.of(id);
        const ownerUserId = UserId.of(ownerId);

        // 2. Usar el repositorio para buscar el agregado
        const quiz = await this.quizRepository.findById(quizId, ownerUserId);

        // 3. Si no se encuentra el quiz, lanzar un error específico
        if (!quiz) {
            throw new QuizNotFoundError();
        }

        // 4. Devolver el DTO (Snapshot), no el objeto de dominio completo
        return quiz.getSnapshot();
    }
}