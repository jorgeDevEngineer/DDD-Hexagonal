import { QuizRepository, PaginationOptions, PaginatedResult } from '../../domain/Repository/QuizRepository';
import { QuizState } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import { QuizSnapshot } from '../../domain/quiz';

// Interfaz para los datos de entrada del caso de uso, para mayor claridad.
export interface QuizSearchCriteria {
    ownerId: string;
    pagination: PaginationOptions;
    state?: QuizState;
}

export class QuizReadAll {
    constructor(private quizRepository: QuizRepository) { }

        async run(criteria: QuizSearchCriteria): Promise<PaginatedResult<QuizSnapshot>> {
        
        const ownerUserId = UserId.of(criteria.ownerId);

        const paginatedQuizzes = await this.quizRepository.findByOwner(
            ownerUserId,
            criteria.pagination,
            criteria.state
        );

        const paginatedSnapshots: PaginatedResult<QuizSnapshot> = {
            ...paginatedQuizzes,
            data: paginatedQuizzes.data.map(quiz => quiz.getSnapshot())
        };

        return paginatedSnapshots;
    }
}