import { Quiz } from '../quiz';
import { QuestionId } from '../ValueObjects/QuestionVO';
import { QuizId, QuizState } from '../ValueObjects/QuizVO';
import { UserId } from '../ValueObjects/UserVO';

export interface PaginationOptions {
    page: number; 
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface QuizRepository {
    generateQuizId(): Promise<QuizId>; 
    generateQuestionId(): Promise<QuestionId>; 
    create(quiz: Quiz): Promise<void>;
    update(quiz: Quiz): Promise<void>;
    findById(id: QuizId, ownerId: UserId): Promise<Quiz | null>;
    findByOwner(ownerId: UserId, pagination: PaginationOptions, state?: QuizState): Promise<PaginatedResult<Quiz>>;
    delete(id: QuizId, ownerId: UserId): Promise<void>;
}