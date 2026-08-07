/**
 * Custom qScript error message
 *
 * @export
 * @class QScriptError
 * @typedef {QScriptError}
 * @extends {Error}
 */
export class QScriptError extends Error {
    /**
     * Creates an instance of QScriptError.
     *
     * @constructor
     * @param {string} message 
     * @param {string} type 
     * @param {number} line 
     * @param {number} column 
     */
    constructor(message, type, line, column) {
        super(message);
        this.name = 'QScriptError';
        this.type = type;
        this.line = line;
        this.column = column;
    }
}
export function formatError(error, source) {
    const lines = source.split("\n");
    const lineText = lines[error.line - 1];

    return [
        `[qScript] ${error.type} at ${error.line}:${error.column}`,
        "",
        `${error.line} | ${lineText}`,
        `    ${" ".repeat(error.column - 1)}^`,
        `${error.message}`
    ].join("\n");
}
export function showQscriptError(error, source) {
    console.error(formatError(error, source));
}