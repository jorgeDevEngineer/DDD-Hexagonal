import { QuizRepository } from '../../domain/Repository/QuizRepository';
import { QuizId } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import {QuizNotFoundError} from '../../domain/DomainErrors/QuizErrors'

export class QuestionQuizRemover {
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