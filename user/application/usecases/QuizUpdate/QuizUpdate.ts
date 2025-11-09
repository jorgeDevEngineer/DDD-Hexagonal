import { QuizRepository } from '../../../domain/interfaces/QuizRepository';
import { QuizDescription, QuizId, QuizTitle } from '../../../domain/valueObjects/QuizVO';
import { UserId } from '../../../domain/valueObjects/UserVO';

export class QuizNotFoundError extends Error {
    constructor() {
        super(`Quiz not found or you don't have permission to access it.`);
    }
}

export class QuizUpdater {
    constructor(private quizRepository: QuizRepository) { }

    async run(id: string, ownerId: string, newTitle: string, newDescription: string): Promise<void> {
        const quizId = QuizId.of(id);
        const ownerUserId = UserId.of(ownerId);
        const title = QuizTitle.of(newTitle);
        const description = QuizDescription.of(newDescription);

        const quiz = await this.quizRepository.findById(quizId, ownerUserId);

        if (!quiz) {
            throw new QuizNotFoundError();
        }

        quiz.updateInfo(title, description);

        await this.quizRepository.update(quiz);
    }
}