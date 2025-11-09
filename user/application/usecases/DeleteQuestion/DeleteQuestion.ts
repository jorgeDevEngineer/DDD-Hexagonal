import { QuizRepository } from '../../../domain/interfaces/QuizRepository';
import { QuizId } from '../../../domain/valueObjects/QuizVO';
import { UserId } from '../../../domain/valueObjects/UserVO';

export class QuizNotFoundError extends Error {
    constructor() {
        super(`Quiz not found or you don't have permission to access it.`);
    }
}

export class QuizQuestionRemover {
    constructor(private quizRepository: QuizRepository) { }

    async run(quizIdStr: string, ownerIdStr: string, questionIdToRemove: string): Promise<void> {
        const quizId = QuizId.of(quizIdStr);
        const ownerId = UserId.of(ownerIdStr);

        const quiz = await this.quizRepository.findById(quizId, ownerId);
        if (!quiz) {
            throw new QuizNotFoundError();
        }

        quiz.removeQuestion(questionIdToRemove);

        await this.quizRepository.update(quiz);
    }
}