import { QuizRepository, PaginationOptions, PaginatedResult } from '../domain/Repository/QuizRepository';
import { Pool } from 'pg';
import { QuestionId, QuestionText, QuestionType, AnswerOption, AnswerOptionsList, QuestionDuration } from '../domain/ValueObjects/QuestionVO';
import { QuizId, QuizTitle, QuizDescription, QuizState} from '../domain/ValueObjects/QuizVO'
import { Quiz } from '../domain/quiz';
import { Question } from '../domain/Entities/Question';
import { UserId } from '../domain/ValueObjects/UserVO';

export class PostgresQuizRepository implements QuizRepository {
    client: Pool;

    constructor(databaseURL: string) {
        this.client = new Pool({
            connectionString: databaseURL
        })
    }

    async generateQuizId(): Promise<QuizId> {
        return Promise.resolve(QuizId.of(crypto.randomUUID()));
    }

    async generateQuestionId(): Promise<QuestionId> {
        return Promise.resolve(QuestionId.of(crypto.randomUUID()));
    }

    async create(quiz: Quiz): Promise<void> {
        const snapshot = quiz.getSnapshot();
        const client = await this.client.connect();
        try {
            await client.query('BEGIN');

            const insertQuizText = `
                INSERT INTO quizzes(id, title, description, owner_id, state, created_at)
                VALUES($1, $2, $3, $4, $5, $6)
            `;
            await client.query(insertQuizText, [
                snapshot.id,
                snapshot.title,
                snapshot.description,
                snapshot.ownerId,
                snapshot.state,
                snapshot.createdAt,
            ]);

            const insertQuestionText = `
                INSERT INTO questions(id, quiz_id, text, type, options, duration_seconds, base_points)
                VALUES($1, $2, $3, $4, $5::jsonb, $6, $7)
            `;

            for (const q of snapshot.questions) {
                const options = q.options.values.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect }));
                await client.query(insertQuestionText, [
                    q.id.value,
                    snapshot.id,
                    q.text.value,
                    q.type,
                    JSON.stringify(options),
                    q.duration.seconds,
                    q.basePoints,
                ]);
            }

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    // Update quiz row and replace questions (simple approach: delete existing questions and re-insert)
    async update(quiz: Quiz): Promise<void> {
        const snapshot = quiz.getSnapshot();
        const client = await this.client.connect();
        try {
            await client.query('BEGIN');

            const updateQuizText = `
                UPDATE quizzes SET title=$2, description=$3, state=$4
                WHERE id=$1 AND owner_id=$5
            `;
            await client.query(updateQuizText, [snapshot.id, snapshot.title, snapshot.description, snapshot.state, snapshot.ownerId]);

            await client.query('DELETE FROM questions WHERE quiz_id = $1', [snapshot.id]);

            const insertQuestionText = `
                INSERT INTO questions(id, quiz_id, text, type, options, duration_seconds, base_points)
                VALUES($1, $2, $3, $4, $5::jsonb, $6, $7)
            `;

            for (const q of snapshot.questions) {
                const options = q.options.values.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect }));
                await client.query(insertQuestionText, [
                    q.id.value,
                    snapshot.id,
                    q.text.value,
                    q.type,
                    JSON.stringify(options),
                    q.duration.seconds,
                    q.basePoints,
                ]);
            }

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    // Find quiz by id and owner, reconstruct domain objects
    async findById(id: QuizId, ownerId: UserId): Promise<Quiz | null> {
        const quizRes = await this.client.query('SELECT * FROM quizzes WHERE id = $1 AND owner_id = $2', [id.value, ownerId.value]);
        if (quizRes.rowCount === 0) return null;
        const row = quizRes.rows[0];

        const questionsRes = await this.client.query('SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id', [id.value]);

        // Build domain Quiz using factory and add questions
        const quizId = QuizId.of(row.id);
        const title = QuizTitle.of(row.title);
        const description = QuizDescription.of(row.description || '');
        const owner = UserId.of(row.owner_id);

        const quiz = Quiz.create(quizId, title, description, owner);

        for (const qrow of questionsRes.rows) {
            const qId = QuestionId.of(qrow.id);
            const qText = QuestionText.of(qrow.text);
            const qType = qrow.type as QuestionType;
            const optionsRaw = qrow.options ? JSON.parse(qrow.options) : [];
            const options = optionsRaw.map((o: any) => new AnswerOption(o.text, o.isCorrect));
            const optionsList = AnswerOptionsList.of(options, qType);
            const duration = QuestionDuration.ofSeconds(qrow.duration_seconds);

            const question = Question.create(qId, qText, qType, optionsList, duration);
            quiz.addQuestion(question);
        }

        return quiz;
    }

    // Paginated find by owner
    async findByOwner(ownerId: UserId, pagination: PaginationOptions, state?: QuizState): Promise<PaginatedResult<Quiz>> {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;

        let countQuery = 'SELECT COUNT(*) FROM quizzes WHERE owner_id = $1';
        let dataQuery = `SELECT * FROM quizzes WHERE owner_id = $1`;
        const params: any[] = [ownerId.value];

        if (state) {
            countQuery += ' AND state = $2';
            dataQuery += ' AND state = $2';
            params.push(state);
        }

        dataQuery += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const totalRes = await this.client.query(countQuery, [ownerId.value, state].filter(Boolean));
        const total = parseInt(totalRes.rows[0].count, 10);

        const rowsRes = await this.client.query(dataQuery, params);

        const data: Quiz[] = [];
        for (const row of rowsRes.rows) {
            const quizId = QuizId.of(row.id);
            const title = QuizTitle.of(row.title);
            const description = QuizDescription.of(row.description || '');
            const owner = UserId.of(row.owner_id);
            const quiz = Quiz.create(quizId, title, description, owner);

            const questionsRes = await this.client.query('SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id', [row.id]);
            for (const qrow of questionsRes.rows) {
                const qId = QuestionId.of(qrow.id);
                const qText = QuestionText.of(qrow.text);
                const qType = qrow.type as QuestionType;
                const optionsRaw = qrow.options ? JSON.parse(qrow.options) : [];
                const options = optionsRaw.map((o: any) => new AnswerOption(o.text, o.isCorrect));
                const optionsList = AnswerOptionsList.of(options, qType);
                const duration = QuestionDuration.ofSeconds(qrow.duration_seconds);
                const question = Question.create(qId, qText, qType, optionsList, duration);
                quiz.addQuestion(question);
            }

            data.push(quiz);
        }

        return {
            data,
            total,
            page,
            limit,
        };
    }

    // Delete quiz and its questions
    async delete(id: QuizId, ownerId: UserId): Promise<void> {
        const client = await this.client.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM questions WHERE quiz_id = $1', [id.value]);
            await client.query('DELETE FROM quizzes WHERE id = $1 AND owner_id = $2', [id.value, ownerId.value]);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}