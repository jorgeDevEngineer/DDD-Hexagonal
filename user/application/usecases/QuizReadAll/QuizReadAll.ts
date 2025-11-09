import { QuizRepository, PaginationOptions, PaginatedResult } from '../../../domain/interfaces/QuizRepository';
import { QuizState } from '../../../domain/valueObjects/QuizVO';
import { UserId } from '../../../domain/valueObjects/UserVO';
import { QuizSnapshot } from '../../../domain/quiz';

// Interfaz para los datos de entrada del caso de uso, para mayor claridad.
export interface QuizSearchCriteria {
    ownerId: string;
    pagination: PaginationOptions;
    state?: QuizState;
}

export class QuizSearcher {
    constructor(private quizRepository: QuizRepository) { }

        async run(criteria: QuizSearchCriteria): Promise<PaginatedResult<QuizSnapshot>> {
        
        const ownerUserId = UserId.of(criteria.ownerId);

        const paginatedQuizzes = await this.quizRepository.findAll(
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