import {QuestionQuizAdder} from '../../Quizz/application/usecases/QuestionQuizAdder'
import { QuizCreate } from '../../Quizz/application/usecases/QuizCreate';
import { QuizReadAll } from '../../Quizz/application/usecases/QuizReadAll';
import { QuizReadById } from '../../Quizz/application/usecases/QuizReadById';
import { QuizUpdate } from '../../Quizz/application/usecases/QuizUpdate';
import { StatusQuizUpdate } from '../../Quizz/application/usecases/StatusQuizUpdate';
import { QuestionQuizRemover } from '../../Quizz/application/usecases/QuestionQuizRemover';

//Caso contra memoria local
import {InMemoryQuizRepository} from '../../Quizz/infrastructure/InMemoryQuizRepository';
const repository = new InMemoryQuizRepository();

//Caso de uso contra postgres
// import {PostgresQuizRepository} from '../../Quizz/infrastructure/PostgresQuizRepository';
// const repository = new PostgresQuizRepository('URL Connection'); //TODO: Crear una coneccion real

export const ServiceContainer = {
    quiz: {
        create: new QuizCreate(repository),
        readAll: new QuizReadAll(repository),
        readById: new QuizReadById(repository),
        update: new QuizUpdate(repository),
        updateStatus: new StatusQuizUpdate(repository),
        addQuestion: new QuestionQuizAdder(repository),
        deleteQuestion: new QuestionQuizRemover(repository),
    }
}