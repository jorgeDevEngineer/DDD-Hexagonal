import { QuizRepository } from '../../domain/Repository/QuizRepository';
import { QuizId } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import {QuizNotFoundError} from '../../domain/DomainErrors/QuizErrors'

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