import { QuizRepository } from '../../domain/Repository/QuizRepository';
import { QuizDescription, QuizId, QuizTitle } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import {QuizNotFoundError} from '../../domain/DomainErrors/QuizErrors'

export class QuizUpdate {
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