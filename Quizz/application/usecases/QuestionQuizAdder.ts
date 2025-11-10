import { QuizRepository } from '../../domain/Repository/QuizRepository';
import { QuizId } from '../../domain/ValueObjects/QuizVO';
import { UserId } from '../../domain/ValueObjects/UserVO';
import { Question } from '../../domain/Entities/Question';
import { 
    QuestionId,
    QuestionText, 
    QuestionType, 
    AnswerOption, 
    AnswerOptionsList, 
    QuestionDuration 
} from '../../domain/ValueObjects/QuestionVO';
import {QuizNotFoundError} from '../../domain/DomainErrors/QuizErrors'
// Interfaz para los datos de entrada de la pregunta
export interface QuestionData {
    text: string;
    type: QuestionType;
    durationSeconds: number;
    options: { text: string; isCorrect: boolean }[];
}

export class QuestionQuizAdder {
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

        //Intanciamos
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