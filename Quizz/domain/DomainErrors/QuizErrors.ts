export class QuizNotFoundError extends Error {
    constructor() {
        super(`Quiz not found or you don't have permission to access it.`);
    }
}

export class InvalidStatusError extends Error {
    constructor(status: string) {
        super(`Status '${status}' is not invalid.`);
    }
}