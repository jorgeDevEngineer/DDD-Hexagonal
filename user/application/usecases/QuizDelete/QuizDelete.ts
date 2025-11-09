import { QuizRepository } from '../../../domain/interfaces/QuizRepository';
import { QuizId } from '../../../domain/valueObjects/QuizVO';
import { UserId } from '../../../domain/valueObjects/UserVO';

// Es buena práctica tener errores específicos para los casos de uso.
export class QuizNotFoundError extends Error {
    constructor() {
        super(`Quiz not found or you don't have permission to access it.`);
    }
}

export class QuizDelete {
    constructor(private quizRepository: QuizRepository) { }

    async run(id: string, ownerId: string): Promise<void> {
        const quizId = QuizId.of(id);
        const ownerUserId = UserId.of(ownerId);

        const quiz = await this.quizRepository.findById(quizId, ownerUserId);
        if (!quiz) {
            throw new QuizNotFoundError();
        }

        await this.quizRepository.delete(quizId, ownerUserId);
    }
}