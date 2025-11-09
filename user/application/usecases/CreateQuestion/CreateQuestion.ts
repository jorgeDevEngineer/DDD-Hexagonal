import { QuizRepository } from '../../../domain/interfaces/QuizRepository';
import { QuizId } from '../../../domain/valueObjects/QuizVO';
import { UserId } from '../../../domain/valueObjects/UserVO';
import { Question } from '../../../domain/entities/Question';
import { 
    QuestionId,
    QuestionText, 
    QuestionType, 
    AnswerOption, 
    AnswerOptionsList, 
    QuestionDuration 
} from '../../../domain/valueObjects/QuestionVO';

export class QuizNotFoundError extends Error {
    constructor() {
        super(`Quiz not found or you don't have permission to access it.`);
    }
}

// Interfaz para los datos de entrada de la pregunta
export interface QuestionData {
    text: string;
    type: QuestionType;
    durationSeconds: number;
    options: { text: string; isCorrect: boolean }[];
}

export class QuizQuestionAdder {
    constructor(private quizRepository: QuizRepository) { }

    async run(quizIdStr: string, ownerIdStr: string, questionData: QuestionData): Promise<void> {
        const quizId = QuizId.of(quizIdStr);
        const ownerId = UserId.of(ownerIdStr);

        const quiz = await this.quizRepository.findById(quizId, ownerId);
        if (!quiz) {
            throw new QuizNotFoundError();
        }

        const newQuestionId = await this.quizRepository.generateQuestionId();
        const questionText = QuestionText.of(questionData.text);
        const questionDuration = QuestionDuration.ofSeconds(questionData.durationSeconds);
        const answerOptions = questionData.options.map(
            opt => new AnswerOption(opt.text, opt.isCorrect)
        );
        const answerOptionsList = AnswerOptionsList.of(answerOptions, questionData.type);

        const newQuestion = Question.create(
            newQuestionId,
            questionText, // Se pasa el objeto completo, no questionText.value
            questionData.type,
            answerOptionsList, // Se pasa el objeto AnswerOptionsList
            questionDuration
        );
    
        quiz.addQuestion(newQuestion);

        await this.quizRepository.update(quiz);
    }
}