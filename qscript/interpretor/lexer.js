export class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

export const TokenType = {
    Number: "Number",
    Identifier: "Identifier",
    Equals: "Equals",
    OpenParen: "OpenParen",
    CloseParen: "CloseParen",
    BinaryOperator: "BinaryOperator",
    set: "set"
}

export function tokenize (sourceCode) {
    const tokens = [];
    const src = sourceCode.split('');

    while(src.length > 0) {
        

    return tokens;
}