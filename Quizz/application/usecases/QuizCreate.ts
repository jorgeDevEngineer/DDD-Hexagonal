import { QuizRepository } from '../../domain/Repository/QuizRepository';
import { QuizDescription, QuizTitle } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import { Quiz } from '../../domain/quiz';

export class QuizCreate {
    constructor(private quizRepository: QuizRepository) { }

    async run(title: string, description: string, ownerId: string): Promise<string> {
        const quizId = await this.quizRepository.generateQuizId();
        const quizTitle = QuizTitle.of(title);
        const quizDescription = QuizDescription.of(description);
        const ownerUserId = UserId.of(ownerId);

        const quiz = Quiz.create(quizId, ownerUserId, quizTitle, quizDescription);

        await this.quizRepository.create(quiz);

        return quiz.id.value;
    }
}