import { Quiz } from '../domain/quiz';
import { QuizId, QuizState} from '../domain/ValueObjects/QuizVO';
import { QuestionId } from '../domain/ValueObjects/QuestionVO';
import { UserId } from '../domain/ValueObjects/UserVO';
import { PaginatedResult, PaginationOptions } from '../domain/Repository/QuizRepository';
import { QuizRepository } from '../domain/Repository/QuizRepository';

export class InMemoryQuizRepository implements QuizRepository {
    // Usamos un Map para un acceso rápido por ID. La clave es el string del QuizId.
    private readonly quizzes: Map<string, Quiz> = new Map();

    async generateQuizId(): Promise<QuizId> {
        return Promise.resolve(QuizId.of(crypto.randomUUID()));
    }

    async generateQuestionId(): Promise<QuestionId> {
        return Promise.resolve(QuestionId.of(crypto.randomUUID()));
    }

    async create(quiz: Quiz): Promise<void> {
        this.quizzes.set(quiz.id.value, quiz);
        return Promise.resolve();
    }

    async update(quiz: Quiz): Promise<void> {
        this.quizzes.set(quiz.id.value, quiz);
        return Promise.resolve();
    }

    async findById(id: QuizId, ownerId: UserId): Promise<Quiz | null> {
        const quiz = this.quizzes.get(id.value);
        return Promise.resolve(null);
    }

    async findByOwner(ownerId: UserId, pagination: PaginationOptions, state?: QuizState): Promise<PaginatedResult<Quiz>> {
        // 1. Convertir el mapa a un array para poder filtrar y paginar.
        let allQuizzes = Array.from(this.quizzes.values());

        // 2. Filtrar por propietario.
        let ownerQuizzes = allQuizzes.filter(q => q.getSnapshot().ownerId === ownerId.value);

        // 3. Si se especifica un estado, filtrar también por estado.
        if (state) {
            ownerQuizzes = ownerQuizzes.filter(q => q.getSnapshot().state === state);
        }

        // 4. Aplicar paginación.
        const total = ownerQuizzes.length;
        const { page, limit } = pagination;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const data = ownerQuizzes.slice(startIndex, endIndex);

        const result: PaginatedResult<Quiz> = {
            data,
            total,
            page,
            limit,
        };

        return Promise.resolve(result);
    }

    async delete(id: QuizId, ownerId: UserId): Promise<void> {
        const quiz = this.quizzes.get(id.value);
        if (quiz && quiz.getSnapshot().ownerId === ownerId.value) {
            this.quizzes.delete(id.value);
        }
        return Promise.resolve();
    }
}