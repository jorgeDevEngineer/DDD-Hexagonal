import { QuizRepository } from '../../domain/Repository/QuizRepository';
import { QuizId, QuizState } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import {QuizNotFoundError, InvalidStatusError} from '../../domain/DomainErrors/QuizErrors'

export class StatusQuizUpdate {
    constructor(private quizRepository: QuizRepository) { }

    async run(id: string, ownerId: string, newStatus: QuizState): Promise<void> {
        const quizId = QuizId.of(id);
        const ownerUserId = UserId.of(ownerId);

        const quiz = await this.quizRepository.findById(quizId, ownerUserId);
        if (!quiz) {
            throw new QuizNotFoundError();
        }

        switch (newStatus) {
            case QuizState.PUBLISHED:
                quiz.publish();
                break;
            case QuizState.ARCHIVED:
                quiz.archive();
                break;
            default:
                // Lanzar un error si se intenta una transición no soportada, como volver a DRAFT.
                throw new InvalidStatusError(newStatus);
        }

        // 3. Persistir el estado actualizado del agregado.
        await this.quizRepository.update(quiz);
    }
}