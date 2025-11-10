export class UserId {
    private static readonly UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    private constructor(public readonly value: string) {
        if (!value) {
            throw new Error("UserId cannot be empty.");
        }
        if (!UserId.UUID_REGEX.test(value)) {
            throw new Error("UserId must be a valid UUID.");
        }
    }

    /**
     * Crea una instancia de UserId a partir de un string.
     * @param value El valor del ID en formato string.
     * @returns Una nueva instancia de UserId.
     * @throws Error si el valor no es un UUID válido.
     */
    public static of(value: string): UserId {
        return new UserId(value);
    }
}