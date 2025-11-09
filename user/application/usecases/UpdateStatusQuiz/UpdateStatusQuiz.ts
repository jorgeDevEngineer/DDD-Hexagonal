import { QuizRepository } from '../../../domain/interfaces/QuizRepository';
import { QuizId, QuizState } from '../../../domain/valueObjects/QuizVO';
import { UserId } from '../../../domain/valueObjects/UserVO';

export class QuizNotFoundError extends Error {
    constructor() {
        super(`Quiz not found or you don't have permission to access it.`);
    }
}

export class InvalidStatusTransitionError extends Error {
    constructor(status: string) {
        super(`Status '${status}' is not invalid.`);
    }
}

export class QuizStatusUpdater {
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
                throw new InvalidStatusTransitionError(newStatus);
        }

        // 3. Persistir el estado actualizado del agregado.
        await this.quizRepository.update(quiz);
    }
}