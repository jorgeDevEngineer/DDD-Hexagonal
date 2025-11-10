export class QuizNotFoundError extends Error {
    constructor() {
        super(`Quiz not found or you don't have permission to access it.`);
    }
}