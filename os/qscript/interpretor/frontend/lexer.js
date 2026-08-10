// * TOKEN STUFF

import { QScriptError } from "../runtime/errors.js";

/**
 * Token is a recognized character in language
 *
 * @export
 * @class Token
 * @typedef {Token}
 */
export class Token {
    
    /**
     * Creates an instance of Token.
     *
     * @constructor
     * @param {string} value 
     * @param {TokenType} type 
     * @param {number} line
     * @param {number} column
     */
    constructor(value, type, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}


/**
 * Types of tokens 
*/
export const TokenType = {
    // * Literals
    Number: "Number",
    Identifier: "Identifier",

    // * Keywords
    Set: "Set",
    Const: "Const",

    // * Grouping Operators
    Equals: "Equals",
    Comma: "Comma",
    Colon: "Colon",
    Semicolon: "Semicolon",
    OpenParen: "OpenParen", // (
    CloseParen: "CloseParen", // )
    OpenBrace: "OpenBrace", // [
    CloseBrace: "CloseBrace", // ]
    BinaryOperator: "BinaryOperator",

    // * EOF
    EOF: "EOF"
}

/**
 * words that are key. used to identify keywords in the language
 * @type {Record<string, string>}
 */
const KEYWORDS = {
    set: TokenType.Set,
    const: TokenType.Const
}

// * HELPERS

/**
 * Detects if a character is alphabetical
 *
 * @param {string} src 
 * @returns {boolean} 
 */
function isAlpha(src) {
    return src.toUpperCase() !== src.toLowerCase();
}

/**
 * Detects if a character is numerical
 *
 * @param {string} src 
 * @returns {boolean} 
 */
function isInt(src) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}

/**
 * Detects is the character is not used in language syntax
 *
 * @param {string} str 
 * @returns {boolean} 
 */
function isSkippable(str) {
    return str === ' ' || str === '\t';
}

// * TOKENIZER


/**
 * Main tokenizer function. Converts string into token array
 *
 * @export
 * @param {string} sourceCode 
 * @returns {Token[]} 
 */
export function tokenize (sourceCode) {
    const tokens = [];
    const src = sourceCode.split('');
    
    // Line/Column tracking
    let line = 1;
    let column = 1;

    function createToken(value, type) {
        const token = new Token(value, type, line, column);
        column += value.length;
        return token;
    }

    // Make tokens
    while(src.length > 0) {
        if (src[0] === '(') {
            tokens.push(createToken(src.shift(), TokenType.OpenParen));
        } else if (src[0] === ')') {
            tokens.push(createToken(src.shift(), TokenType.CloseParen));
        } else if (src[0] === '{') {
            tokens.push(createToken(src.shift(), TokenType.OpenBrace));
        } else if (src[0] === '}') {
            tokens.push(createToken(src.shift(), TokenType.CloseBrace));
        }
        else if (src[0] === '+' || src[0] === '-' || src[0] === '*' || src[0] === '/' || src[0] === '%') {     // Binary Operators
            tokens.push(createToken(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] === '=') {
            tokens.push(createToken(src.shift(), TokenType.Equals));
        } else if (src[0] === ';') {
            tokens.push(createToken(src.shift(), TokenType.Semicolon));
        } else if (src[0] === ':') {
            tokens.push(createToken(src.shift(), TokenType.Colon));
        } else if (src[0] === ',') {
            tokens.push(createToken(src.shift(), TokenType.Comma));
        }
        else {
            // Build a number token
            if (isInt(src[0])) {
                let num = '';
                const startLine = line;
                const startColumn = column;
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                    column++;
                }
                tokens.push(new Token(num, TokenType.Number, startLine, startColumn));
            } else if (isAlpha(src[0])) {
                // build an identifier token
                let ident = "";
                const startLine = line;
                const startColumn = column;

                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                    column++;
                }

                // Check of keywords
                const reserved = KEYWORDS[ident];
                if (reserved === undefined) {
                    tokens.push(new Token(ident, TokenType.Identifier, startLine, startColumn));
                } else {
                    tokens.push(new Token(ident, reserved, startLine, startColumn));
                }
            } else if (src[0] === '\n') {
                src.shift();
                line++;
                column = 1;
            } else if (isSkippable(src[0])) {
                src.shift();
                column++;
            } else {
                throw new QScriptError(
                    `Unexpected character: ${src[0]}`,
                    "SyntaxError",
                    line,
                    column
                );
            }
        }
    }
    // eof token
    tokens.push(new Token("EndOfFile", TokenType.EOF, line, column));
    return tokens;
}