export class Token {
    constructor(value, type) {
        this.type = type;
        this.value = value;
    }
}
export const TokenType = {
    // Literals
    Number: "Number",
    Identifier: "Identifier",
    // Keywords
    Set: "Set",
    Const: "Const",
    // Grouping operators
    Equals: "Equals",
    Semicolon: "Semicolon",
    OpenParen: "OpenParen",
    CloseParen: "CloseParen",
    BinaryOperator: "BinaryOperator",
    // EOF
    EOF: "EOF"
}
const KEYWORDS = {
    "set": TokenType.Set,
    "const": TokenType.Const
}

function isAlpha(src) {
    return src.toUpperCase() != src.toLowerCase();
}
function isInt(src) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}
function isSkippable(str) {
    return str === ' ' || str === '\t' || str === '\n';
}

export function tokenize (sourceCode) {
    const tokens = [];
    const src = sourceCode.split('');

    while(src.length > 0) {
        if (src[0] === '(') {
            tokens.push(new Token(src.shift(), TokenType.OpenParen));
        } else if (src[0] === ')') {
            tokens.push(new Token(src.shift(), TokenType.CloseParen));
        } else if (src[0] === '+' || src[0] === '-' || src[0] === '*' || src[0] === '/' || src[0] === '%') {
            tokens.push(new Token(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] === '=') {
            tokens.push(new Token(src.shift(), TokenType.Equals));
        } else if (src[0] === ';') {
            tokens.push(new Token(src.shift(), TokenType.Semicolon));
        } else {
            // Build a number token
            if (isInt(src[0])) {
                let num = '';
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }
                tokens.push(new Token(num, TokenType.Number));
            } else if (isAlpha(src[0])) {
                let ident = "";
                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }

                const reserved = KEYWORDS[ident];
                if (reserved === undefined) {
                    tokens.push(new Token(ident, TokenType.Identifier));
                } else {
                    tokens.push(new Token(ident, reserved));
                }
            } else if (isSkippable(src[0])) {
                src.shift();
            } else {
                throw new Error(`Unexpected character: ${src[0]}`);
            }
        }
    }

    tokens.push(new Token('EndOfFile', TokenType.EOF));
    return tokens;
}